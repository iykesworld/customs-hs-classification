"use client"

import { useState } from "react"
// Assuming these UI components are correctly aliased in your Next.js setup (shadcn/ui convention)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, FileText, Shield } from "lucide-react"

// --- API Configuration and Types ---
// Define the base URL for the Flask API (using the environment variable)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Type for the state variable (frontend camelCase)
interface HSCodePrediction {
  code: string // 4-digit HS code
  description: string
  confidence: number // 0-100 integer percentage
}

// Type for the data structure returned by the Python Flask backend (snake_case)
interface BackendPrediction {
    hs_code: string;
    description: string;
    confidence_score: number; // float 0.0 to 1.0
}

interface ApiSuccessResponse {
  status: "success";
  message: string;
  predictions: BackendPrediction[];
}

interface ApiErrorResponse {
  status: "error";
  message: string;
}

const initialPrediction: HSCodePrediction = {
    code: "XXXX",
    description: "Enter a commercial product description and classify to see results...",
    confidence: 0
}

export default function HSCodeClassifier() {
  const [description, setDescription] = useState("")
  const [predictions, setPredictions] = useState<HSCodePrediction[]>([])
  const [isClassifying, setIsClassifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClassify = async () => {
    if (!description.trim()) {
        setError("Please enter a product description before classifying.")
        return
    }

    setIsClassifying(true)
    setError(null)
    setPredictions([]) // Clear previous results

    try {
      const response = await fetch(`${API_URL}/classify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      })

      const data: ApiSuccessResponse | ApiErrorResponse = await response.json()

      if (response.ok && data.status === 'success') {
        const successData = data as ApiSuccessResponse;
        
        // Map and transform the data from Python's format to TypeScript's format
        const mappedPredictions: HSCodePrediction[] = successData.predictions.map(p => ({
          code: p.hs_code,
          description: p.description,
          confidence: Math.round(p.confidence_score * 100), // Convert float 0.0-1.0 to int 0-100
        }))

        setPredictions(mappedPredictions)

      } else {
        // Handle API error response (e.g., OpenAI failed, or bad input validation in Flask)
        const errorMessage = (data as ApiErrorResponse).message || `Classification failed with status ${response.status}.`
        setError(errorMessage)
        setPredictions([initialPrediction]);
      }

    } catch (err) {
      console.error("Network or Fetch Error:", err)
      setError(`Could not connect to the backend API at ${API_URL}. Please ensure the Python server is running.`)
      setPredictions([initialPrediction]);
    } finally {
      setIsClassifying(false)
    }
  }

  // Determine which predictions to display (either real results or the initial placeholder)
  const displayPredictions = predictions.length > 0 ? predictions : (error ? [] : [initialPrediction]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-600/20 dark:bg-blue-300/10 dark:border-blue-300/20">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Customs Classification</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Harmonized System Code Assistant</p>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:flex gap-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            AI Powered
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance text-gray-900 dark:text-gray-50">
              AI HS Code Predictor
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 text-balance max-w-2xl mx-auto">
              Enter your commercial product description below to receive AI-powered HS code classifications with confidence scores.
            </p>
          </div>

          {/* Input Card */}
          <Card className="border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <FileText className="w-5 h-5" />
                Product Description Input
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Paste or type the commercial product description for classification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: Laptop computer with 15.6 inch display, Intel Core i7 processor, 16GB RAM, 512GB SSD storage, Windows 11 operating system..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[180px] resize-none text-base bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-50 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Button
                onClick={handleClassify}
                disabled={!description.trim() || isClassifying}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200 shadow-md hover:shadow-lg"
                size="lg"
              >
                {isClassifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Classify Product
                  </>
                )}
              </Button>
               {/* Error Message Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg dark:bg-red-900 dark:text-red-200 dark:border-red-700">
                    <p className="font-medium">Error:</p>
                    <p>{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {displayPredictions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Classification Results</h3>
                <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
              </div>

              <div className="grid gap-4">
                {displayPredictions.map((prediction, index) => (
                  <Card key={index} className="border-gray-200 dark:border-gray-700 transition-colors shadow-lg hover:shadow-xl bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* HS Code */}
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-3 mb-2 md:mb-0">
                            <Badge
                              variant="outline"
                              className="text-xs font-medium text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                            >
                              Rank #{index + 1}
                            </Badge>
                            <div className="text-4xl md:text-5xl font-bold text-blue-700 dark:text-blue-300 font-mono">
                              {prediction.code}
                            </div>
                          </div>
                        </div>

                        {/* Description and Confidence */}
                        <div className="flex-1 space-y-3">
                          <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">{prediction.description}</p>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-500 dark:text-gray-400">Confidence Score</span>
                              <span className={`font-bold ${prediction.confidence > 80 ? 'text-green-600 dark:text-green-400' : prediction.confidence > 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>{prediction.confidence}%</span>
                            </div>
                            <Progress value={prediction.confidence} className="h-2 bg-gray-200 dark:bg-gray-700" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-900/50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    <span className="font-medium text-gray-800 dark:text-gray-200">Disclaimer:</span> These predictions are AI-generated and should be verified by a customs professional before use in official documentation.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">Built by AZI IKECHUKWU KENNETH for NCS Recruitment Demo • Powered by OpenAI and Flask</p>
        </div>
      </footer>
    </div>
  )
}
