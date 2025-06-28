import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

# Create synthetic dataset with more realistic values
np.random.seed(42)
n_samples = 1000

# Define crop types and their typical yields
crops = ['Wheat', 'Rice', 'Maize', 'Potato', 'Cotton']
crop_base_yields = {'Wheat': 3000, 'Rice': 4000, 'Maize': 5000, 'Potato': 25000, 'Cotton': 2000}

data = []
for _ in range(n_samples):
    crop = np.random.choice(crops)
    base_yield = crop_base_yields[crop]
    
    # Generate realistic features
    temperature = np.random.uniform(15, 35)
    rainfall = np.random.uniform(500, 2000)
    soil_type = np.random.choice(['Loamy', 'Sandy', 'Clay', 'Silt', 'Peat'])
    
    # Calculate yield with some variations
    yield_value = base_yield * (
        1 + np.random.normal(0, 0.2) +  # Random variation
        (temperature - 25) * 0.02 +      # Temperature effect
        (rainfall - 1000) * 0.0002       # Rainfall effect
    )
    
    data.append({
        'crop_type': crop,
        'temperature': temperature,
        'rainfall': rainfall,
        'soil_type': soil_type,
        'yield': max(0, yield_value)  # Ensure yield is not negative
    })

# Convert to DataFrame
df = pd.DataFrame(data)

# Encode categorical variables
le_crop = LabelEncoder()
le_soil = LabelEncoder()

df['crop_type_encoded'] = le_crop.fit_transform(df['crop_type'])
df['soil_type_encoded'] = le_soil.fit_transform(df['soil_type'])

# Save encoders
joblib.dump(le_crop, 'crop_encoder.pkl')
joblib.dump(le_soil, 'soil_encoder.pkl')

# Prepare features for training
X = df[['temperature', 'rainfall', 'crop_type_encoded', 'soil_type_encoded']]
y = df['yield']

# Train test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'yield_prediction_model.pkl')