import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine
} from "recharts";

const cropOptions = ["Rice", "Corn", "Tomato", "Potato", "Onion"];
const soilTypes = ["Loamy", "Clay", "Sandy", "Silty"];

// Crop-soil compatibility
const soilCompatibility = {
  Rice: { Loamy: true, Clay: true, Sandy: false, Silty: true },
  Corn: { Loamy: true, Clay: true, Sandy: true, Silty: true },
  Tomato: { Loamy: true, Clay: true, Sandy: true, Silty: true },
  Potato: { Loamy: true, Clay: false, Sandy: true, Silty: true },
  Onion: { Loamy: true, Clay: true, Sandy: false, Silty: true }
};

// Realistic yield data for India (kg/ha)
const yieldReference = {
  Rice: { 
    high: 3500, 
    low: 2200,
    optimal: { temp: [25, 32], rainfall: [100, 200] },
    critical: { 
      temp: { max: 38, min: 15 },
      rainfall: { max: 300, min: 50 } 
    },
    trend: [2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100]
  },
  Corn: { 
    high: 3200, 
    low: 1800,
    optimal: { temp: [21, 30], rainfall: [60, 120] },
    critical: { 
      temp: { max: 36, min: 12 },
      rainfall: { max: 250, min: 30 } 
    },
    trend: [2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700]
  },
  Tomato: { 
    high: 35000, 
    low: 20000,
    optimal: { temp: [18, 28], rainfall: [50, 150] },
    critical: { 
      temp: { max: 35, min: 10 },
      rainfall: { max: 300, min: 20 } 
    },
    trend: [22000, 23000, 24000, 25000, 26000, 28000, 30000, 32000]
  },
  Potato: { 
    high: 28000, 
    low: 18000,
    optimal: { temp: [15, 25], rainfall: [50, 120] },
    critical: { 
      temp: { max: 32, min: 8 },
      rainfall: { max: 250, min: 25 } 
    },
    trend: [19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000]
  },
  Onion: { 
    high: 22000, 
    low: 14000,
    optimal: { temp: [15, 28], rainfall: [30, 100] },
    critical: { 
      temp: { max: 35, min: 8 },
      rainfall: { max: 200, min: 15 } 
    },
    trend: [15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000]
  }
};

const soilImpact = {
  Rice: { Loamy: 1.0, Clay: 0.95, Sandy: 0, Silty: 0.9 },
  Corn: { Loamy: 1.0, Clay: 0.9, Sandy: 0.85, Silty: 0.95 },
  Tomato: { Loamy: 1.0, Clay: 0.9, Sandy: 0.9, Silty: 0.95 },
  Potato: { Loamy: 1.0, Clay: 0, Sandy: 0.95, Silty: 0.9 },
  Onion: { Loamy: 1.0, Clay: 0.9, Sandy: 0, Silty: 0.95 }
};

const cropPrices = {
  Rice: { current: 28 },
  Corn: { current: 20 },
  Tomato: { current: 25 },
  Potato: { current: 12 },
  Onion: { current: 30 }
};

const productionCosts = {
  Rice: 35000,
  Corn: 30000,
  Tomato: 60000,
  Potato: 50000,
  Onion: 55000
};

export default function YieldPrediction() {
  const [crop, setCrop] = useState("Rice");
  const [soil, setSoil] = useState("Loamy");
  const [rainfall, setRainfall] = useState(100);
  const [temperature, setTemperature] = useState(28);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [profitability, setProfitability] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ year: number; yield: number }[]>([]);
  const [recommendation, setRecommendation] = useState<string>("");
  const [estimatedProfit, setEstimatedProfit] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<"Low" | "Medium" | "High">("Low");

  const currentYear = new Date().getFullYear();

  const checkExtremeConditions = (crop: string, temp: number, rain: number) => {
    const critical = yieldReference[crop as keyof typeof yieldReference].critical;
    return (
      temp >= critical.temp.max || 
      temp <= critical.temp.min || 
      rain >= critical.rainfall.max || 
      rain <= critical.rainfall.min
    );
  };

  const checkSoilCompatibility = (crop: string, soil: string) => {
    return soilCompatibility[crop as keyof typeof soilCompatibility][soil as keyof typeof soilCompatibility[typeof crop]];
  };

  const calculateClimateFactor = (crop: string, temp: number, rain: number) => {
    const cropData = yieldReference[crop as keyof typeof yieldReference];
    const [tempMin, tempMax] = cropData.optimal.temp;
    const [rainMin, rainMax] = cropData.optimal.rainfall;
    
    let tempFactor = 1;
    let rainFactor = 1;

    if (temp < tempMin) {
      tempFactor = 1 - ((tempMin - temp) * 0.03);
    } else if (temp > tempMax) {
      tempFactor = 1 - ((temp - tempMax) * 0.04);
    }

    if (rain < rainMin) {
      rainFactor = 1 - ((rainMin - rain) * 0.006);
    } else if (rain > rainMax) {
      rainFactor = 1 - ((rain - rainMax) * 0.004);
    }

    return Math.max(0, Math.min(1, tempFactor * rainFactor));
  };

  const generateHistoricalData = (crop: string, currentPrediction: number) => {
    const cropData = yieldReference[crop as keyof typeof yieldReference];
    const baseVariability = crop === "Tomato" || crop === "Onion" ? 0.12 : 0.08;
    
    return Array.from({length: 8}, (_, i) => {
      const year = currentYear - 7 + i;
      const baseYield = cropData.trend[i] * 0.7 + currentPrediction * 0.3;
      const fluctuation = Math.sin(i) * baseVariability;
      const randomEffect = (Math.random() * 0.06) - 0.03;
      const yieldValue = baseYield * (1 + fluctuation + randomEffect);
      
      return {
        year,
        yield: Math.round(Math.max(
          cropData.low * 0.85, 
          Math.min(cropData.high * 1.05, yieldValue)
        ))
      };
    });
  };

  const getYield = () => {
    // Check soil compatibility
    if (!checkSoilCompatibility(crop, soil)) {
      setPrediction(0);
      setEstimatedProfit(-productionCosts[crop as keyof typeof productionCosts]);
      setProfitability("Not Suitable");
      setRecommendation(`❌ ${crop} cannot be grown in ${soil} soil. Change soil or crop.`);
      setChartData([]);
      return;
    }

    // Check extreme conditions
    if (checkExtremeConditions(crop, temperature, rainfall)) {
      setPrediction(0);
      setEstimatedProfit(-productionCosts[crop as keyof typeof productionCosts]);
      setProfitability("Total Loss");
      setRecommendation(`❌ Extreme weather conditions - ${crop} cultivation not possible`);
      setChartData([]);
      return;
    }

    const ref = yieldReference[crop as keyof typeof yieldReference];
    const baseYield = (ref.high + ref.low) / 2;
    const climateFactor = calculateClimateFactor(crop, temperature, rainfall);
    const soilFactor = soilImpact[crop as keyof typeof soilImpact][soil as keyof typeof soilImpact[typeof crop]];
    
    const predictedYield = Math.max(
      ref.low * 0.7,
      Math.round(baseYield * climateFactor * soilFactor)
    );
    
    setPrediction(predictedYield);

    // Calculate profitability
    const price = cropPrices[crop as keyof typeof cropPrices].current;
    const cost = productionCosts[crop as keyof typeof productionCosts];
    const revenue = predictedYield * price;
    const profit = revenue - cost;
    const profitMargin = (profit / cost) * 100;
    
    setEstimatedProfit(profit);

    // Determine profitability and risk
    let profitabilityStatus = "";
    let risk: "Low" | "Medium" | "High" = "Low";

    if (profitMargin > 30) {
      profitabilityStatus = "Highly Profitable";
      risk = "Low";
    } else if (profitMargin > 15) {
      profitabilityStatus = "Moderately Profitable";
      risk = "Medium";
    } else if (profitMargin > 0) {
      profitabilityStatus = "Marginally Profitable";
      risk = "High";
    } else {
      profitabilityStatus = "Loss Making";
      risk = "High";
    }

    setProfitability(profitabilityStatus);
    setRiskLevel(risk);

    // Generate historical data
    const historicalData = generateHistoricalData(crop, predictedYield);
    setChartData(historicalData);

    // Generate recommendations
    let rec = "";
    if (climateFactor >= 0.9) {
      rec = "✅ Excellent growing conditions expected";
    } else if (climateFactor >= 0.7) {
      rec = "⚠️ Good conditions but monitor weather";
    } else if (climateFactor >= 0.5) {
      rec = "⚠️ Challenging conditions - consider alternatives";
    } else {
      rec = "❌ Poor conditions - not recommended";
    }
    
    setRecommendation(rec);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border">
          <p className="font-bold">{label}</p>
          <p>Yield: <strong>{payload[0].value.toLocaleString()} kg/ha</strong></p>
          <p className="text-sm text-gray-600">
            {payload[0].value > yieldReference[crop as keyof typeof yieldReference].high * 0.9 
              ? "Above average yield" 
              : payload[0].value < yieldReference[crop as keyof typeof yieldReference].low * 1.1 
                ? "Below average" 
                : "Normal yield"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold mb-6 text-green-700">🌾 Agricultural Yield Predictor</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Crop Type</label>
            <select 
              value={crop} 
              onChange={(e) => setCrop(e.target.value)} 
              className="w-full border rounded px-3 py-2"
            >
              {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Soil Type</label>
            <select 
              value={soil} 
              onChange={(e) => setSoil(e.target.value)} 
              className="w-full border rounded px-3 py-2"
            >
              {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Rainfall (mm)</label>
            <input 
              type="number" 
              value={rainfall} 
              onChange={(e) => setRainfall(Number(e.target.value))} 
              className="w-full border rounded px-3 py-2" 
              min="0"
              max="500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Temperature (°C)</label>
            <input 
              type="number" 
              value={temperature} 
              onChange={(e) => setTemperature(Number(e.target.value))} 
              className="w-full border rounded px-3 py-2" 
              min="-10"
              max="50"
            />
          </div>
        </div>

        <button 
          onClick={getYield} 
          className="mt-6 px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Calculate Yield
        </button>
      </div>

      {prediction !== null && (
        <div className={`bg-white shadow-lg rounded-lg p-6 ${
          profitability === "Total Loss" || profitability === "Not Suitable" ? "border-2 border-red-500" : ""
        }`}>
          <h3 className="text-2xl font-semibold mb-4">📊 Prediction Results</h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-600">Predicted Yield</p>
              <p className={`text-2xl font-bold ${
                prediction === 0 ? "text-red-600" : "text-blue-600"
              }`}>
                {prediction === 0 ? "0 (No Yield)" : `${prediction.toLocaleString()} kg/ha`}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-600">Estimated Profit</p>
              <p className={`text-2xl font-bold ${
                estimatedProfit && estimatedProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                ₹{(estimatedProfit || 0).toLocaleString()}
              </p>
              <p className="text-sm mt-1">per acre | {profitability}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-600">Risk Level</p>
              <p className={`text-2xl font-bold ${
                riskLevel === "Low" ? "text-green-600" : 
                riskLevel === "Medium" ? "text-yellow-600" : "text-red-600"
              }`}>
                {riskLevel}
              </p>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg mb-6 ${
            profitability === "Total Loss" || profitability === "Not Suitable" ? 
            "bg-red-100 border-l-4 border-red-500" : 
            "bg-blue-50 border-l-4 border-blue-500"
          }`}>
            <p className="font-medium text-gray-800">📌 Recommendation:</p>
            <p className="mt-1 text-gray-800">{recommendation}</p>
          </div>

          {chartData.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">
                {crop} Yield Trend ({currentYear-7} - {currentYear})
              </h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: '#555' }}
                    />
                    <YAxis 
                      tick={{ fill: '#555' }}
                      label={{ 
                        value: 'Yield (kg/ha)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fill: '#555' }
                      }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine 
                      y={yieldReference[crop as keyof typeof yieldReference].high} 
                      label="High" 
                      stroke="#10b981" 
                      strokeDasharray="3 3" 
                    />
                    <ReferenceLine 
                      y={yieldReference[crop as keyof typeof yieldReference].low} 
                      label="Low" 
                      stroke="#ef4444" 
                      strokeDasharray="3 3" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="yield" 
                      stroke="#4f46e5" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#4f46e5' }}
                      activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Showing natural yield fluctuations with 8-12% annual variation
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}