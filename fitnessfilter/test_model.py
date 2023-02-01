import joblib
import sys

# MAKE SURE YOUR VENV IS ACTIVATED

# Use the loaded model to make predictions
clf = joblib.load('fitnessfilter/trained_model.pkl')
# input = "When is the rainbow over?"
input = sys.argv[1]

prediction = clf.predict([input])
print(prediction) # Print in this scenario pipes back to Node