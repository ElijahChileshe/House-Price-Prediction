from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("/home/elijah/Documents/Msc - CS/Soft Computing/Assignments/house_price_model.pkl")
features = joblib.load("/home/elijah/Documents/Msc - CS/Soft Computing/Assignments/model_features.pkl")

class InputData(BaseModel):
    bedrooms: int
    size: float
    property_type: str
    property_status: str

@app.get("/metadata")
def get_metadata():
    property_types = sorted([col.replace("Property Type_", "") for col in features if col.startswith("Property Type_")])
    property_statuses = sorted([col.replace("Property Status_", "") for col in features if col.startswith("Property Status_")])
    return {
        "property_types": property_types,
        "property_statuses": property_statuses
    }

@app.post("/predict")
def predict(data: InputData):
    input_data = {feat: 0 for feat in features}
    input_data['Bedrooms'] = data.bedrooms
    input_data['Size_m2'] = data.size

    type_key = f"Property Type_{data.property_type}"
    status_key = f"Property Status_{data.property_status}"
    if type_key in input_data:
        input_data[type_key] = 1
    if status_key in input_data:
        input_data[status_key] = 1

    input_df = pd.DataFrame([input_data])
    pred = model.predict(input_df)[0]
    return f"Estimated Price: ZK {pred:,.0f}"
