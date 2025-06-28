import { useState } from "react";
import { fetchPrediction, FormDataType } from "./fetchPrediction";

const PredictionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    temperature: 0,
    rainfall: 0,
    humidity: 0,
    windSpeed: 0,
    soilpH: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? Number(value) : 0, // Ensure numeric conversion
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchPrediction(formData);
      if (result === null) throw new Error("Invalid prediction result");
      setPrediction(result);
    } catch (err) {
      setError("Prediction failed. Please check inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md w-96 mx-auto">
      <h2 className="text-xl font-bold mb-4">Yield Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type="number"
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={formData[key as keyof FormDataType]}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Predicting..." : "Predict Yield"}
        </button>
      </form>
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {prediction !== null && (
        <h3 className="text-lg font-semibold mt-4">Predicted Yield: {prediction}</h3>
      )}
    </div>
  );
};

export default PredictionForm;
