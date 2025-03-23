"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { 
    Button, 
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage, 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue, 
    Input, 
    Card, CardContent, 
    Slider, 
    Tabs, TabsContent, TabsList, TabsTrigger 
} from "./ui";


const formSchema = z.object({
  // Soil parameters
  soilType: z.string().min(1, { message: "Please select a soil type" }),
  soilpH: z.coerce.number().min(0).max(14),
  soilMoisture: z.coerce.number().min(0).max(100),
  soilNitrogen: z.coerce.number().min(0),
  soilPhosphorus: z.coerce.number().min(0),
  soilPotassium: z.coerce.number().min(0),

  // Weather parameters
  temperature: z.coerce.number(),
  humidity: z.coerce.number().min(0).max(100),
  rainfall: z.coerce.number().min(0),
  sunlightHours: z.coerce.number().min(0).max(24),

  // Crop type
  cropType: z.string().min(1, { message: "Please select a crop type" }),
})

type PredictionResult = {
  predictedYield: number
  unit: string
  confidenceScore: number
  recommendations: string[]
}

export default function YieldPredictionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilType: "",
      soilpH: 7,
      soilMoisture: 50,
      soilNitrogen: 0,
      soilPhosphorus: 0,
      soilPotassium: 0,
      temperature: 25,
      humidity: 60,
      rainfall: 0,
      sunlightHours: 8,
      cropType: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/predict-yield", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to get prediction")
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error predicting yield:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Input Parameters</TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>
            Results
          </TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Soil Parameters</h3>

                      <FormField
                        control={form.control}
                        name="soilType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soil Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select soil type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="clay">Clay</SelectItem>
                                <SelectItem value="silt">Silt</SelectItem>
                                <SelectItem value="sand">Sandy</SelectItem>
                                <SelectItem value="loam">Loam</SelectItem>
                                <SelectItem value="clayLoam">Clay Loam</SelectItem>
                                <SelectItem value="siltLoam">Silt Loam</SelectItem>
                                <SelectItem value="sandyLoam">Sandy Loam</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="soilpH"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soil pH (0-14)</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  min={0}
                                  max={14}
                                  step={0.1}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Acidic</span>
                                  <span className="text-sm font-medium">{field.value}</span>
                                  <span className="text-sm text-muted-foreground">Alkaline</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="soilMoisture"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soil Moisture (%)</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Dry</span>
                                  <span className="text-sm font-medium">{field.value}%</span>
                                  <span className="text-sm text-muted-foreground">Wet</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="soilNitrogen"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nitrogen (N) mg/kg</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="soilPhosphorus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phosphorus (P) mg/kg</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="soilPotassium"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Potassium (K) mg/kg</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Weather Parameters</h3>

                      <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Average Temperature (°C)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="humidity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Humidity (%)</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Low</span>
                                  <span className="text-sm font-medium">{field.value}%</span>
                                  <span className="text-sm text-muted-foreground">High</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rainfall"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Rainfall (mm)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sunlightHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Daily Sunlight Hours</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  min={0}
                                  max={24}
                                  step={0.5}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">0h</span>
                                  <span className="text-sm font-medium">{field.value}h</span>
                                  <span className="text-sm text-muted-foreground">24h</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cropType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Crop Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select crop type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="rice">Rice</SelectItem>
                                <SelectItem value="wheat">Wheat</SelectItem>
                                <SelectItem value="maize">Maize</SelectItem>
                                <SelectItem value="potato">Potato</SelectItem>
                                <SelectItem value="tomato">Tomato</SelectItem>
                                <SelectItem value="cotton">Cotton</SelectItem>
                                <SelectItem value="sugarcane">Sugarcane</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-[#25aa47] hover:bg-[#1e8a39]" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      "Predict Yield"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {result && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[#25aa47]">Predicted Yield</h3>
                    <p className="text-4xl font-bold mt-2">
                      {result.predictedYield.toFixed(2)} {result.unit}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Confidence Score: {(result.confidenceScore * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-[#25aa47] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button onClick={() => form.reset()} variant="outline" className="w-full">
                    Start New Prediction
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}