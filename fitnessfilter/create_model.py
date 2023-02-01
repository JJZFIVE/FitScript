from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
import joblib # Save and load the model
import pandas as pd

# LOAD DATA FROM CSVs
df_random1 = pd.read_csv('data/randomcomments1.csv')
df_random2 = pd.read_csv('data/randomcomments2.csv')
df_random3 = pd.read_csv('data/randomcomments3.csv')
df_random4 = pd.read_csv('data/randomcomments4.csv')
df_workout1 = pd.read_csv('data/redditcomments1.csv')
df_workout2 = pd.read_csv('data/redditcomments2.csv')
df_workout3 = pd.read_csv('data/redditcomments3.csv')
df_workout4 = pd.read_csv('data/redditcomments4.csv')
df_workout5 = pd.read_csv('data/redditcomments5.csv')
df_workout6 = pd.read_csv('data/redditcomments6.csv')

# CONCATENATE DATAFRAMES
df = pd.concat([df_random1, df_random2, df_random3, df_random4, df_workout1, df_workout2, df_workout3, df_workout4, df_workout5, df_workout6], ignore_index=True).fillna("")

print(df.isnull().values.any())
# Define the sentences and their corresponding labels
sentences = df['comments'].values
labels = df['label'].values

#Split the data into training and testing datasets
sentences_train, sentences_test, labels_train, labels_test = train_test_split(sentences, labels, test_size = 0.25, random_state = 43)

# Create a pipeline that includes a TfidfVectorizer and a LogisticRegression classifier
text_clf = Pipeline([('vect', TfidfVectorizer()), ('clf', LogisticRegression())])

# Fit the pipeline to the training data
text_clf.fit(sentences_train, labels_train)

# Test the model on new sentences
predicted_labels = text_clf.predict(sentences_test)

#Check the accuracy of the model
accuracy = accuracy_score(labels_test, predicted_labels)
print("Accuracy: ", accuracy)

# Print the classification report
print(classification_report(labels_test, predicted_labels))


# Save the model
joblib.dump(text_clf, 'trained_model.pkl')