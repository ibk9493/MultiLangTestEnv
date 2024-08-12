import imaplib
import email
from email.header import decode_header
import re
import csv
import sqlite3
import smtplib
from email.mime.text import MIMEText
from datetime import datetime

# Configuration
IMAP_SERVER = 'imap.gmail.com'
EMAIL_ACCOUNT = 'ibk9493@gmail.com'
APP_SPECIFIC_PASSWORD = 'hnwuzbnpapdphgcj'

# Connect to the server
mail = imaplib.IMAP4_SSL(IMAP_SERVER)
mail.login(EMAIL_ACCOUNT, APP_SPECIFIC_PASSWORD)
mail.select('inbox')

# Known senders dictionary
known_senders = {
    'urgent': ['ibk9493@gmail.com'], 
    'invoices': ['ibk9493@gmail.com'],
    'support': ['ibk9493@gmail.com']
}

def categorize_email(subject, from_addr):
    categories = {
        'urgent': ['urgent', 'critical', 'immediate'],
        'invoices': ['invoice', 'payment', 'bill'],
        'support': ['support', 'help', 'query']
    }
    
    subject_lower = subject.lower()
    for category, keywords in categories.items():
        if any(keyword in subject_lower for keyword in keywords) or from_addr in known_senders.get(category, []):
            return category
    return 'general'

def extract_info(body):
    invoice_number = re.search(r'Invoice No: (\w+)', body)
    date = re.search(r'Date: (\d{2}-\d{2}-\d{4})', body)
    amount = re.search(r'Amount: \$([\d.,]+)', body)
    
    return {
        'invoice_number': invoice_number.group(1) if invoice_number else None,
        'date': date.group(1) if date else None,
        'amount': amount.group(1) if amount else None
    }

def send_response(to_email, subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = EMAIL_ACCOUNT
    msg['To'] = to_email

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(EMAIL_ACCOUNT, APP_SPECIFIC_PASSWORD)
        server.send_message(msg)

# For CSV
with open('email_report.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Date", "Category", "From", "Subject", "Info"])

# For SQLite
def adapt_datetime(ts):
    return ts.isoformat()

sqlite3.register_adapter(datetime, adapt_datetime)

conn = sqlite3.connect('email_management.db')
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS emails 
                  (date TEXT, category TEXT, from_addr TEXT, subject TEXT, info TEXT)''')
conn.commit()

# Process emails
def process_emails():
    _, search_data = mail.search(None, 'ALL')
    for num in search_data[0].split():
        _, data = mail.fetch(num, '(RFC822)')
        raw_email = data[0][1]
        email_message = email.message_from_bytes(raw_email)
        
        subject = decode_header(email_message['subject'])[0][0]
        if isinstance(subject, bytes):
            subject = subject.decode(errors='ignore')
        
        from_addr = email.utils.parseaddr(email_message['from'])[1]
        
        category = categorize_email(subject, from_addr)
        email_body = ""
        
        if email_message.is_multipart():
            for part in email_message.walk():
                if part.get_content_type() == "text/plain":
                    try:
                        email_body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                    except UnicodeDecodeError:
                        email_body = part.get_payload(decode=True).decode('latin1', errors='ignore')
                    break
        else:
            try:
                email_body = email_message.get_payload(decode=True).decode('utf-8', errors='ignore')
            except UnicodeDecodeError:
                email_body = email_message.get_payload(decode=True).decode('latin1', errors='ignore')
        
        info = extract_info(email_body)
        
        # Save to CSV
        with open('email_report.csv', 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([datetime.now(), category, from_addr, subject, str(info)])
        
        # Save to SQLite
        cursor.execute('INSERT INTO emails VALUES (?, ?, ?, ?, ?)', 
                       (datetime.now(), category, from_addr, subject, str(info)))
        conn.commit()
        
        # Send automated response for support emails
        if category == 'support':
            send_response(from_addr, "Support Request Received", "Thank you for your email. We'll get back to you soon.")
        
        # Mark the email as deleted
        mail.store(num, '+FLAGS', '\\Deleted')
    mail.expunge()

process_emails()
