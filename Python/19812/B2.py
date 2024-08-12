import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import ast

# Read the CSV file
df = pd.read_csv('email_report.csv', parse_dates=['Date'])

# Convert the 'Info' column from string to dictionary
df['Info'] = df['Info'].apply(ast.literal_eval)

# Extract hour from the Date column
df['Hour'] = df['Date'].dt.hour

# Visualizations
plt.figure(figsize=(15, 20))

# 1. Email Categories Distribution
plt.subplot(3, 2, 1)
df['Category'].value_counts().plot(kind='pie', autopct='%1.1f%%')
plt.title('Distribution of Email Categories')

# 2. Emails per Hour
plt.subplot(3, 2, 2)
df['Hour'].value_counts().sort_index().plot(kind='bar')
plt.title('Number of Emails Received per Hour')
plt.xlabel('Hour of Day')
plt.ylabel('Number of Emails')

# 3. Top 5 Senders
plt.subplot(3, 2, 3)
df['From'].value_counts().head().plot(kind='barh')
plt.title('Top 5 Email Senders')
plt.xlabel('Number of Emails')

# 4. Word Cloud of Subject Lines
from wordcloud import WordCloud
plt.subplot(3, 2, 4)
wordcloud = WordCloud(width=800, height=400, background_color='white').generate(' '.join(df['Subject']))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis('off')
plt.title('Word Cloud of Email Subjects')

# 5. Timeline of Emails
plt.subplot(3, 2, 5)
df.set_index('Date')['Category'].resample('D').count().plot()
plt.title('Timeline of Emails Received')
plt.xlabel('Date')
plt.ylabel('Number of Emails')

# 6. Info Extraction Success Rate
plt.subplot(3, 2, 6)
info_success = df['Info'].apply(lambda x: any(v is not None for v in x.values())).mean()
plt.pie([info_success, 1-info_success], labels=['Successful', 'Unsuccessful'], autopct='%1.1f%%')
plt.title('Information Extraction Success Rate')

plt.tight_layout()
plt.savefig('email_analysis.png')
plt.close()

# Generate a summary report
report = f"""
Email Analysis Report

1. Total Emails Processed: {len(df)}
2. Email Categories:
{df['Category'].value_counts().to_string()}

3. Top 5 Senders:
{df['From'].value_counts().head().to_string()}

4. Most Active Hour: {df['Hour'].value_counts().index[0]}

5. Information Extraction Success Rate: {info_success:.2%}

6. Date Range: {df['Date'].min().date()} to {df['Date'].max().date()}

7. Most Common Subject Words:
{pd.Series(' '.join(df['Subject']).lower().split()).value_counts().head().to_string()}
"""

print(report)

# Save the report to a text file
with open('email_analysis_report.txt', 'w') as f:
    f.write(report)

print("Analysis complete. Check 'email_analysis.png' for visualizations and 'email_analysis_report.txt' for the summary report.")