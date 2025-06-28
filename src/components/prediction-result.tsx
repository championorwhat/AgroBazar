"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function PredictionResult({ prediction, onReset }) {
  if (!prediction) return null

  return (
    <Card className="w-full">
      <CardHeader className="bg-green-50">
        <CardTitle className="text-2xl text-green-700">Prediction Results</CardTitle>
        <CardDescription>Based on your input parameters</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Estimated Crop Yield</h3>
            <p className="text-4xl font-bold text-green-600">{prediction.yield} tons/hectare</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 text-gray-700">Optimal Harvest Time</h3>
              <p className="text-lg">{prediction.harvestTime}</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 text-gray-700">Confidence Level</h3>
              <p className="text-lg">{prediction.confidence}%</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3 text-gray-700">Recommendations</h3>
            <ul className="list-disc pl-5 space-y-1">
              {prediction.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          Make Another Prediction
        </Button>
        <Button className="bg-green-500 hover:bg-green-600">Download Report</Button>
      </CardFooter>
    </Card>
  )
}

