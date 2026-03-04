from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np

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


class FlowInput(BaseModel):
    features: List[float]
    target : str
    
class AttackInput(BaseModel):
    features: List[float]
    target : str
    noise : int


@app.post("/predict")
def predict(data: FlowInput):

    arr = np.array(data.features).reshape(1, -1)
    target = data.target

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

    return {
        "prediction": (prediction[0]),
        "target": target
    }
    # "Attack" if prediction[0] == 1 else "Benign"


@app.post("/attack")
def attack(data: AttackInput):

    arr = np.array(data.features).reshape(1, -1)
    target = data.target
    noise = data.noise

    scaled = scaler.transform(arr)

    # Simulated adversarial perturbation
    noise = np.random.normal(0, data.noise, scaled.shape)
    attacked = scaled + noise

    k_label = kmeans.predict(attacked)
    g_label = gmm.predict(attacked)

    sfe = np.column_stack((attacked, k_label, g_label))
    pca_data = pca.transform(sfe)

    prediction = model.predict(pca_data)

    return {
        "prediction": (prediction[0]),
        "target": target
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