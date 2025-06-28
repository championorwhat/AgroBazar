from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

# Check if model exists, if not, create it
if not os.path.exists("yield_prediction_model.pkl"):
    import train_model

# Load the model
model = joblib.load("yield_prediction_model.pkl")

@app.route("/")
def home():
    return jsonify({"message": "Yield Prediction API is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        
        # Validate input keys
        required_keys = ["temperature", "rainfall", "soil_type", "crop_type"]
        for key in required_keys:
            if key not in data:
                return jsonify({"error": f"Missing key: {key}"}), 400
        
        # Convert inputs to appropriate types
        temperature = float(data["temperature"])
        rainfall = float(data["rainfall"])
        soil_type_map = {"Loamy": 0, "Sandy": 1, "Clay": 2, "Silt": 3, "Peat": 4}
        soil_type = soil_type_map.get(data["soil_type"], 0)

        # Input validation
        if temperature < -20 or temperature > 50:
            return jsonify({"error": "Temperature must be between -20°C and 50°C"}), 400
        if rainfall < 0 or rainfall > 5000:
            return jsonify({"error": "Rainfall must be between 0mm and 5000mm"}), 400

        # Make prediction
        features = np.array([[temperature, rainfall, soil_type]])
        prediction = model.predict(features)

        return jsonify({
            "yield_prediction": float(prediction[0]),
            "unit": "kg/hectare"
        })

    except ValueError as e:
        return jsonify({"error": "Invalid input type. Ensure all values are numbers."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
