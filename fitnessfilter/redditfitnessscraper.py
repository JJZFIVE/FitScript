from selenium import webdriver
import bs4
import pandas as pd
from selenium.webdriver.chrome.service import Service

# Just some silly variable namings ;)

service = Service("/usr/bin/chromedriver")
CSV_FILENAME = "data/randomcomments1.csv"
URL = "https://www.reddit.com/r/Fitness/comments/105lhcy/daily_simple_questions_thread_january_07_2023/"
driver = webdriver.Chrome(service=service)
driver.get(URL)
# Have done:
# https://www.reddit.com/r/Fitness/comments/10bkx20/daily_simple_questions_thread_january_14_2023/
#

# I manually scroll down the page
continuing = input("Continue/Quit (c, q): ")

if continuing == "c":
    reddit_comments = []
    source = driver.page_source
    data = bs4.BeautifulSoup(source, "html.parser")
    comments = data.find_all('div', class_='Comment')
    for comment in comments:
        paragraph = comment.find_all('p')
        for p in paragraph:
            reddit_comments.append(p.text)
        
elif continuing == "q":
    driver.quit()

# Push lists to a csv file
mydict = {"comments": reddit_comments, "label": 1}
dataframe = pd.DataFrame(mydict)
dataframe.to_csv(CSV_FILENAME, index=False)
driver.quit()