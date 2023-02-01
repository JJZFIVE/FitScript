from selenium import webdriver
import bs4
import pandas as pd
from selenium.webdriver.chrome.service import Service

# Just some silly variable namings ;)

# Can look for <h3> tags with class_="_eYtD2XCVieq6emjKBH3m" for the Post titles
# or <p> tags for the body

service = Service("/usr/bin/chromedriver")
CSV_FILENAME = "data/randomcomments5.csv"
URL = ""
driver = webdriver.Chrome(service=service)
driver.get(URL)
# Have done:
# https://www.reddit.com/r/RandomThoughts/
# https://www.reddit.com/r/anything/
# https://www.reddit.com/r/Showerthoughts/
# https://www.reddit.com/r/NoStupidQuestions/

# I manually scroll down the page
continuing = input("Continue/Quit (c, q): ")

if continuing == "c":
    reddit_comments = []
    source = driver.page_source
    data = bs4.BeautifulSoup(source, "html.parser")
    comments = data.find_all('div', class_='Post')
    for comment in comments:
        header = comment.find("h3", class_="_eYtD2XCVieq6emjKBH3m")
        for h in header:
            if (h.text):
                reddit_comments.append(h.text)

        paragraph = comment.find_all('p')
        for p in paragraph:
            if (p.text):
                reddit_comments.append(p.text)
        
elif continuing == "q":
    driver.quit()

# Push lists to a csv file
mydict = {"comments": reddit_comments, "label": 0}
dataframe = pd.DataFrame(mydict)
dataframe.to_csv(CSV_FILENAME, index=False)
driver.quit()