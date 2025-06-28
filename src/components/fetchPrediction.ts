export interface FormDataType {
  temperature: number;
  rainfall: number;
  humidity: number;
  windSpeed: number;
  soilpH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export async function fetchPrediction(formData: FormDataType): Promise<number | null> {
  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Failed to fetch prediction");

    const data = await response.json();
    return data.prediction as number;
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return null;
  }
}
