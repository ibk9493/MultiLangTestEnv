import pandas as pd
from ast import literal_eval

# Read the CSV file
df = pd.read_csv('email_report.csv')

# Convert the 'Date' column to datetime
df['Date'] = pd.to_datetime(df['Date'])

# The 'Info' column contains string representation of dictionaries, let's convert them back to dict
df['Info'] = df['Info'].apply(literal_eval)

# Now, let's expand the 'Info' dictionary into separate columns
info_df = pd.DataFrame(df['Info'].tolist(), index=df.index)
df = pd.concat([df, info_df], axis=1)

# Drop the original 'Info' column as it's no longer needed in string form
df.drop(columns=['Info'], inplace=True)

import matplotlib.pyplot as plt

# Group by date and category, then count
email_count = df.groupby([df['Date'].dt.date, 'Category']).size().unstack()

# Plotting
email_count.plot(kind='bar', stacked=True, figsize=(15, 7))
plt.title('Email Volume by Category Over Time')
plt.ylabel('Number of Emails')
plt.xlabel('Date')
plt.legend(title='Category')
plt.show()
import matplotlib.pyplot as plt

# Group by date and category, then count
email_count = df.groupby([df['Date'].dt.date, 'Category']).size().unstack()

# Plotting
email_count.plot(kind='bar', stacked=True, figsize=(15, 7))
plt.title('Email Volume by Category Over Time')
plt.ylabel('Number of Emails')
plt.xlabel('Date')
plt.legend(title='Category')
plt.show()
import plotly.express as px

cat_count = df['Category'].value_counts()
fig = px.pie(names=cat_count.index, values=cat_count.values, title='Distribution of Email Categories')
fig.show()
# Check if 'amount' column exists and contains valid data before converting to float
if 'amount' in df.columns:
    df['amount'] = df['amount'].str.replace(',', '')
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')

    # Drop rows where 'amount' conversion failed
    df.dropna(subset=['amount'], inplace=True)

# Visualize average amount per category if applicable
if 'invoices' in df['Category'].unique():
    invoice_data = df[df['Category'] == 'invoices']
    avg_amount = invoice_data['amount'].mean()
    
    plt.figure(figsize=(10, 5))
    plt.bar(['Invoices'], [avg_amount])
    plt.title('Average Invoice Amount')
    plt.ylabel('Average Amount ($)')
    plt.show()
df['Hour'] = df['Date'].dt.hour

hourly_emails = df.groupby('Hour').size()
plt.figure(figsize=(12, 6))
plt.plot(hourly_emails.index, hourly_emails.values, marker='o')
plt.title('Email Traffic by Hour of Day')
plt.xlabel('Hour of Day')
plt.ylabel('Number of Emails')
plt.show()
