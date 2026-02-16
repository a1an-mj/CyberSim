import pandas as pd
import numpy as np


df1 = pd.read_csv("data/cic/Monday-WorkingHours.pcap_ISCX.csv")
df2 = pd.read_csv("data/cic/Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv")

data = pd.concat([df1, df2], ignore_index=True)

print("Initial shape:", data.shape)


data = data.sample(frac=1, random_state=42)
print("After sampling:", data.shape)


data.columns = data.columns.str.strip()

data.replace([np.inf, -np.inf], np.nan, inplace=True)
data.dropna(inplace=True)

print("After cleaning:", data.shape)




#ivde splitting to 0 and 1 
data["Label"] = data["Label"].apply(
    lambda x: 0 if x == "BENIGN" else 1
)

print(data["Label"].value_counts())


X = data.drop("Label", axis=1)
y = data["Label"]

X = X.select_dtypes(include=[np.number])

print("Feature shape:", X.shape)



from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)



from imblearn.under_sampling import RandomUnderSampler

rus = RandomUnderSampler(random_state=42)
X_res, y_res = rus.fit_resample(X_scaled, y)

print("After undersampling:")
print(pd.Series(y_res).value_counts())



from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
import numpy as np

kmeans = KMeans(n_clusters=3, random_state=42)
k_labels = kmeans.fit_predict(X_res)

gmm = GaussianMixture(n_components=3, random_state=42)
g_labels = gmm.fit_predict(X_res)

X_sfe = np.column_stack((X_res, k_labels, g_labels))


from sklearn.decomposition import PCA

pca = PCA(n_components=10)
X_pca = pca.fit_transform(X_sfe)

print("After PCA:", X_pca.shape)


from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(
    X_pca, y_res, test_size=0.2, random_state=42
)



model = RandomForestClassifier(n_estimators=100, n_jobs=-1)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))

import joblib


joblib.dump(scaler, "scaler.pkl")      
joblib.dump(kmeans, "kmeans.pkl")     
joblib.dump(gmm, "gmm.pkl")            
joblib.dump(pca, "pca.pkl")            


joblib.dump(X_train, "X_train.pkl")
joblib.dump(y_train, "y_train.pkl")
joblib.dump(X_test, "X_test.pkl")
joblib.dump(y_test, "y_test.pkl")


joblib.dump(model, "cic_model.pkl")

print("\n✅ All models saved successfully!")





print("Before undersampling:", X_scaled.shape)
print("After undersampling:", X_res.shape)