import pandas as pd
import requests
from bs4 import BeautifulSoup


# Open the CSV file into a dataframe
df = pd.read_csv('redditcomments.csv')

url = 'https://www.reddit.com/r/Fitness/comments/10bkx20/daily_simple_questions_thread_january_14_2023/'

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

comments = soup.find_all('div', class_='Comment')
for comment in comments:
    paragraph = comment.find_all('p')
    print(len(paragraph), end='\n\n')
    # df.loc[len(df.index)] = [paragraph[0].text, 1]


# # Save the new dataframe to a CSV file
# df.to_csv('redditcomments.csv', index=False)