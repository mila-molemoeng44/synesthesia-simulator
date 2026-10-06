import numpy as np
import pandas as pd
from fastapi import FastAPI
import joblib as jb
from scipy.special import softmax
from fastapi.middleware.cors import CORSMiddleware

class LogisticRegression:
    def __init__(self):
        self.weights = None
        self.bias = None
        self.classes = None

    def predict(self, X):
        logits = np.dot(X, self.weights) + self.bias
        probabilities = softmax(logits, axis=1)

        class_indices = np.argmax(probabilities, axis=1)

        return self.classes[class_indices]

model = LogisticRegression()

data = np.load("model.npz")

model.weights = data["weights"]
model.bias = data["bias"]
model.classes = data["classes"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict")
def predict(data: dict):
    X = np.array([[
        data['dominant_frequency_hz'],
        data['amplitude'],
        data['low_band_energy'],
        data['mid_band_energy'],
        data['high_band_energy'],
        data['spectral_centroid_hz'],
        data['spectral_spread_hz'],
        data['timestamp_seconds']

    ]])
    prediction = model.predict(X)
    return {
        "prediction": int(prediction[0])
    }
