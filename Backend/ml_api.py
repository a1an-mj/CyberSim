from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import pandas as pd
import os
import random

import kagglehub

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load objects
scaler = joblib.load("scaler.pkl")
kmeans = joblib.load("kmeans.pkl")
gmm = joblib.load("gmm.pkl")
pca = joblib.load("pca.pkl")
model = joblib.load("cic_model.pkl")

X_train = joblib.load("X_train.pkl")
y_train = joblib.load("y_train.pkl")


#csv


path = kagglehub.dataset_download("chethuhn/network-intrusion-dataset")
all_files = [f for f in os.listdir(path) if f.endswith(".csv")]

dfs = []
for file in all_files:
    df = pd.read_csv(os.path.join(path, file))
    dfs.append(df)
    

datas = pd.concat(dfs, ignore_index=True)
datas.columns=datas.columns.str.strip()




class FlowInput(BaseModel):
    target : str
    
class AttackInput(BaseModel):
    features: List[float]
    target: str
    noise: float   
class RetrainInput(BaseModel):
    features: List[float]
    label: str   

@app.post("/predict")
def predict(data: FlowInput):
    target = data.target
    print(target)
    #from csv files
    attack_rows=datas[datas["Label"].str.contains(target,case=False)]

    if attack_rows.empty:
        return{"error":"no data available for current type of attack"}

    random_row=attack_rows.sample(n=1)
    # actual_label=random_row["Label"].values[0]
    features=random_row.drop("Label",axis=1)

    arr = np.array(features).reshape(1, -1)    

    # Validate feature count
    if arr.shape[1] != scaler.n_features_in_:
        return {
            "error": f"Expected {scaler.n_features_in_} features, got {arr.shape[1]}"
        }

    # Step 1: Scale
    scaled = scaler.transform(arr)

    # Step 2: Clustering
    k_label = kmeans.predict(scaled)
    g_label = gmm.predict(scaled)

    sfe = np.column_stack((scaled, k_label, g_label))

    # Step 3: PCA
    pca_data = pca.transform(sfe)

    # Step 4: Predict
    prediction = model.predict(pca_data)

    # return {
    #     "features" : arr.flatten().tolist(),
    #     "prediction": (prediction[0]),
    #     "target": target
    # }

    pred_label = prediction[0]

    return {
        "prediction": pred_label,   # ✅ keep as string
        "result": "Attack" if pred_label != "BENIGN" else "Benign",
        "target": target,
        "features":features.values.tolist()
    }
    # "Attack" if prediction[0] == 1 else "Benign"


@app.post("/attack")
def attack(data: AttackInput):

  
    arr = np.array(data.features).reshape(1, -1)

    target = data.target
    noise_level = data.noise


    scaled = scaler.transform(arr)

    noise = np.random.normal(0, noise_level*15, scaled.shape)

    attacked = scaled + noise

    # ✅ Clustering
    k_label = kmeans.predict(attacked)
    g_label = gmm.predict(attacked)

    sfe = np.column_stack((attacked, k_label, g_label))

    # ✅ PCA
    pca_data = pca.transform(sfe)

    # ✅ Prediction
    prediction = model.predict(pca_data)
    pred_label = prediction[0]

    return {
        "prediction": pred_label,
        "result": "Attack" if pred_label != "BENIGN" else "Benign",
        "target": target,
        "attacked_features": attacked.flatten().tolist()
    }


@app.post("/retrain")
def retrain():

    global model

    # Generate adversarial training samples
    noise = np.random.normal(0, 0.3, X_train.shape)
    X_adv = X_train + noise

    X_combined = np.vstack((X_train, X_adv))
    y_combined = np.hstack((y_train, y_train))

    model.fit(X_combined, y_combined)

    joblib.dump(model, "cic_model.pkl")

    return {"status": "Model retrained successfully"}

@app.post("/retrain-single")
def retrain_single(data: RetrainInput):
    global model

    # Convert input
    arr = np.array(data.features).reshape(1, -1)
    label = data.label

    # OPTIONAL: scale + pipeline same as training
    scaled = scaler.transform(arr)

    k_label = kmeans.predict(scaled)
    g_label = gmm.predict(scaled)

    sfe = np.column_stack((scaled, k_label, g_label))
    pca_data = pca.transform(sfe)

    # Combine with existing data
    X_combined = np.vstack((X_train, pca_data))
    y_combined = np.hstack((y_train, [label]))

    # Retrain
    model.fit(X_combined, y_combined)

    joblib.dump(model, "cic_model.pkl")

    return {"status": "Model updated with new sample"}