import imaplib
import email
import re
from email.header import decode_header
import csv
import schedule
import time
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def connect_to_email(username, password, imap_server):
    mail = imaplib.IMAP4_SSL(imap_server)
    mail.login(username, password)
    return mail

def categorize_email(subject, sender):
    categories = {
        'urgent': r'urgent|asap|important',
        'invoices': r'invoice|bill|payment',
        'support': r'support|help|assistance'
    }
    
    for category, pattern in categories.items():
        if re.search(pattern, subject, re.I) or re.search(pattern, sender, re.I):
            return category
    return 'general'

def process_emails(mail):
    mail.select('inbox')
    _, search_data = mail.search(None, 'ALL')
    
    for num in search_data[0].split():
        _, data = mail.fetch(num, '(RFC822)')
        raw_email = data[0][1]
        email_message = email.message_from_bytes(raw_email)
        
        subject = decode_header(email_message['subject'])[0][0]
        sender = email_message['from']
        
        category = categorize_email(subject, sender)
        
        # Move email to appropriate folder
        mail.copy(num, category)
        mail.store(num, '+FLAGS', '\\Deleted')
    
    mail.expunge()

def extract_info(email_body):
    invoice_number = re.search(r'Invoice\s*#?\s*(\w+)', email_body)
    date = re.search(r'Date:\s*(\d{2}/\d{2}/\d{4})', email_body)
    amount = re.search(r'Amount:\s*\$?(\d+(?:\.\d{2})?)', email_body)
    
    return {
        'invoice_number': invoice_number.group(1) if invoice_number else None,
        'date': date.group(1) if date else None,
        'amount': amount.group(1) if amount else None
    }

def save_to_csv(data, filename='extracted_data.csv'):
    with open(filename, 'a', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=['invoice_number', 'date', 'amount'])
        writer.writerow(data)

def send_automated_response(to_email, category):
    responses = {
        'support': "Thank you for contacting our support team. We have received your request and will get back to you within 24 hours.",
        'urgent': "We have received your urgent message and will prioritize our response.",
        'invoices': "Thank you for your invoice. Our accounts team will process it within 3-5 business days."
    }
    
    msg = MIMEMultipart()
    msg['From'] = 'ibk9493@gmail.com'
    msg['To'] = to_email
    msg['Subject'] = f"Re: {category.capitalize()} - Automated Response"
    
    body = responses.get(category, "Thank you for your email. We will respond as soon as possible.")
    msg.attach(MIMEText(body, 'plain'))
    
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('ibk9493@gmail.com', 'hnwu zbnp apdp hgcj')
    text = msg.as_string()
    server.sendmail('ibk9493@gmail.com', to_email, text)
    server.quit()

def generate_report(start_date, end_date, filename='email_report.csv'):
    df = pd.read_csv(filename)
    df['date'] = pd.to_datetime(df['date'], format='%d/%m/%Y')
    
    mask = (df['date'] >= start_date) & (df['date'] <= end_date)
    report_data = df.loc[mask]
    
    # Generate summary statistics
    summary = report_data.groupby('category').agg({
        'invoice_number': 'count',
        'amount': 'sum'
    }).rename(columns={'invoice_number': 'count', 'amount': 'total_amount'})
    
    # Create a bar chart of email counts by category
    plt.figure(figsize=(10, 6))
    summary['count'].plot(kind='bar')
    plt.title('Email Counts by Category')
    plt.xlabel('Category')
    plt.ylabel('Count')
    plt.savefig('email_counts.png')
    
    return summary


def main():
    mail = connect_to_email('ibk9493@gmail.com', 'hnwu zbnp apdp hgcj', 'imap.gmail.com')
    process_emails(mail)
    
    # Generate weekly report every Monday at 9 AM
    if datetime.now().weekday() == 0 and datetime.now().hour == 9:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        generate_report(start_date, end_date)

# Run the main function every 10 minutes
schedule.every(10).minutes.do(main)

while True:
    schedule.run_pending()
    time.sleep(1)
