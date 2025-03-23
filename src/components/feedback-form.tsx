"use client"

import type React from "react"

import { useState } from "react";
import { Star } from "lucide-react";
import { Button, Textarea, Input, Label, RadioGroup, RadioGroupItem, Card, CardContent } from "./ui";


interface FeedbackItem {
  id: number
  name: string
  rating: number
  feedbackType: string
  comment: string
  createdAt: string
}

export default function StaticFeedbackForm() {
  // Form state
  const [name, setName] = useState<string>("")
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [feedbackType, setFeedbackType] = useState<string>("general")
  const [comment, setComment] = useState<string>("")

  // Feedback list state
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([])

  // Form validation state
  const [errors, setErrors] = useState<{
    name?: string
    rating?: string
    comment?: string
  }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: {
      name?: string
      rating?: string
      comment?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (rating === 0) {
      newErrors.rating = "Please select a rating"
    }

    if (!comment.trim()) {
      newErrors.comment = "Please provide your feedback"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear any previous errors
    setErrors({})

    // Create new feedback item
    const newFeedback: FeedbackItem = {
      id: Date.now(),
      name,
      rating,
      feedbackType,
      comment,
      createdAt: new Date().toISOString(),
    }

    // Add to feedback list
    setFeedbackList((prev) => [newFeedback, ...prev])

    // Reset form
    setName("")
    setRating(0)
    setFeedbackType("general")
    setComment("")
  }

  const getFeedbackTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      general: "General",
      product: "Product Quality",
      delivery: "Delivery",
      website: "Website Experience",
      suggestion: "Suggestion",
    }
    return types[type] || type
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-8">KisanMart Feedback</h1>

      {/* Feedback Form */}
      <div className="w-full max-w-3xl mx-auto mb-12 p-6 bg-white rounded-lg shadow-md border border-green-100">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Share Your Feedback</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-green-700">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={`border-green-200 focus:border-green-500 focus:ring-green-500 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-green-700 block mb-2">How would you rate your experience?</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                  <span className="sr-only">{star} stars</span>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Select rating"}
              </span>
            </div>
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-green-700 block mb-2">Feedback Type</Label>
            <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general">General</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="product" id="product" />
                <Label htmlFor="product">Product Quality</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery">Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="website" id="website" />
                <Label htmlFor="website">Website Experience</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">Suggestion</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-green-700">
              Your Feedback
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Please share your thoughts, suggestions, or concerns..."
              className={`min-h-[120px] border-green-200 focus:border-green-500 focus:ring-green-500 ${errors.comment ? "border-red-500" : ""}`}
            />
            {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto">
            Submit Feedback
          </Button>
        </form>
      </div>

      {/* Feedback Display */}
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Customer Feedback</h2>

        {feedbackList.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md border border-green-100">
            No feedback submitted yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="space-y-4">
            {feedbackList.map((feedback) => (
              <Card key={feedback.id} className="border-green-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{feedback.name}</h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(feedback.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {getFeedbackTypeLabel(feedback.feedbackType)}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600">{feedback.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

