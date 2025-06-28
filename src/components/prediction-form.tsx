"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function PredictionForm({ onPredictionComplete }) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("weather")
  const [formData, setFormData] = useState({
    temperature: 25,
    rainfall: 150,
    humidity: 60,
    windSpeed: 10,
    soilType: "",
    soilpH: 7,
    nitrogen: 40,
    phosphorus: 30,
    potassium: 40,
    cropType: "",
    seedQuality: "",
    irrigationMethod: "",
  })

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to get prediction")
      const data = await response.json()
      onPredictionComplete(data)
      toast({ title: "Prediction Complete", description: "Your crop yield prediction is ready." })
    } catch (error) {
      console.error("Error:", error)
      toast({ title: "Error", description: "Failed to get prediction. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const nextTab = () => setActiveTab(activeTab === "weather" ? "soil" : "crop")
  const prevTab = () => setActiveTab(activeTab === "crop" ? "soil" : "weather")

  return (
    <Card className="w-full">
      <CardHeader className="bg-green-50">
        <CardTitle>Enter Prediction Parameters</CardTitle>
        <CardDescription>Fill in the details below to get an accurate yield prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="soil">Soil</TabsTrigger>
              <TabsTrigger value="crop">Crop</TabsTrigger>
            </TabsList>

            <TabsContent value="weather" className="space-y-4">
              {[
                { label: "Temperature (°C)", name: "temperature", min: 0, max: 50 },
                { label: "Rainfall (mm)", name: "rainfall", min: 0, max: 500 },
                { label: "Humidity (%)", name: "humidity", min: 0, max: 100 },
                { label: "Wind Speed (km/h)", name: "windSpeed", min: 0, max: 50 },
              ].map(({ label, name, min, max }) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{label}</Label>
                  <div className="flex items-center space-x-4">
                    <Slider id={name} min={min} max={max} value={[formData[name]]} onValueChange={(value) => handleInputChange(name, value[0])} className="flex-1" />
                    <span className="w-12 text-center">{formData[name]}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            {activeTab !== "weather" && <Button type="button" variant="outline" onClick={prevTab}>Previous</Button>}
            {activeTab !== "crop" ? (
              <Button type="button" className="bg-green-500 hover:bg-green-600" onClick={nextTab}>Next</Button>
            ) : (
              <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</> : "Get Prediction"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
