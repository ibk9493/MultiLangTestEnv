import imaplib
import email
from email.header import decode_header

# Configuration
IMAP_SERVER = 'imap.gmail.com'
EMAIL_ACCOUNT = 'ibk9493@gmail.com'
PASSWORD = 'hnwu zbnp apdp hgcj'
# Connect to the server
mail = imaplib.IMAP4_SSL(IMAP_SERVER)
mail.login(EMAIL_ACCOUNT, PASSWORD)
mail.select('inbox')
def categorize_email(subject, from_addr):
    categories = {
        'urgent': ['urgent', 'critical', 'immediate'],
        'invoices': ['invoice', 'payment', 'bill'],
        'support': ['support', 'help', 'query']
    }
    
    subject_lower = subject.lower()
    for category, keywords in categories.items():
        if any(keyword in subject_lower for keyword in keywords) or from_addr in known_senders[category]:
            return category
    return 'general'

# You need to define known_senders dictionary with lists of known email addresses for each category
known_senders = {'urgent': ['ibk9493@gmail.com'], 'invoices': ['ibk9493@gmail.com']}

def extract_info(body):
    # Example: Extract invoice number, date, and amount
    # This is highly dependent on the format of your emails
    import re
    invoice_number = re.search(r'Invoice No: (\w+)', body)
    date = re.search(r'Date: (\d{2}-\d{2}-\d{4})', body)
    amount = re.search(r'Amount: \$([\d.,]+)', body)
    
    return {
        'invoice_number': invoice_number.group(1) if invoice_number else None,
        'date': date.group(1) if date else None,
        'amount': amount.group(1) if amount else None
    }

# Use this function when processing each email

import smtplib
from email.mime.text import MIMEText

def send_response(to_email, subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = EMAIL_ACCOUNT
    msg['To'] = to_email

    with smtplib.SMTP_SSL('smtp.gmail.com', 587) as server:
        server.login(EMAIL_ACCOUNT, PASSWORD)
        server.send_message(msg)

# Example use in your email processing loop
if category == 'support':
    send_response(from_addr, "Support Request Received", "Thank you for your email. We'll get back to you soon.")


import csv
import sqlite3

# For CSV
with open('email_report.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Date", "Category", "From", "Subject", "Info"])

# For SQLite
conn = sqlite3.connect('email_management.db')
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS emails 
                  (date TEXT, category TEXT, from_addr TEXT, subject TEXT, info TEXT)''')
conn.commit()