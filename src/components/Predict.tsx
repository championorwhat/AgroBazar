import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Input, Label, Select, Button, Card, CardContent } from "./ui";

const cropOptions = ["Wheat", "Rice", "Corn", "Soybean"];
const soilTypes = ["Loamy", "Clay", "Sandy", "Silty"];

export default function YieldPrediction() {
  const [crop, setCrop] = useState("Wheat");
  const [soil, setSoil] = useState("Loamy");
  const [rainfall, setRainfall] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [chartData, setChartData] = useState([]);

  const handlePredict = async () => {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crop, soil, rainfall, temperature })
    });
    
    const data = await response.json();
    setPrediction(data.yield);
    setChartData(data.trend || []);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Yield Prediction</h2>
          
          <Label>Crop Type</Label>
          <Select value={crop} onChange={(e) => setCrop(e.target.value)}>
            {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          <Label>Soil Type</Label>
          <Select value={soil} onChange={(e) => setSoil(e.target.value)}>
            {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>

          <Label>Rainfall (mm)</Label>
          <Input type="number" value={rainfall} onChange={(e) => setRainfall(Number(e.target.value))} />

          <Label>Temperature (°C)</Label>
          <Input type="number" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />

          <Button onClick={handlePredict} className="mt-4">Predict Yield</Button>
        </CardContent>
      </Card>

      {prediction !== null && (
        <Card className="mt-6">
          <CardContent>
            <h3 className="text-lg font-semibold">Predicted Yield: {prediction} tons/ha</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="yield" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
