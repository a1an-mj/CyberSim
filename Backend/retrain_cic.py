import joblib
import numpy as np
from sklearn.metrics import accuracy_score

model = joblib.load("cic_model.pkl")
X_train = joblib.load("X_train.pkl")
y_train = joblib.load("y_train.pkl")
X_test = joblib.load("X_test.pkl")
y_test = joblib.load("y_test.pkl")


print("Baseline Accuracy:",
      accuracy_score(y_test, model.predict(X_test)))


#cheriya noise addition
noise = np.random.normal(0, 0.5, X_test.shape)

X_adv = X_test + noise
y_adv = y_test.copy()

print("Accuracy under attack:",
      accuracy_score(y_adv, model.predict(X_adv)))


X_combined = np.vstack((X_train, X_adv))
y_combined = np.hstack((y_train, y_adv))

model.fit(X_combined, y_combined)

print("Accuracy after retraining:",
      accuracy_score(y_adv, model.predict(X_adv)))