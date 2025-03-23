import FeedbackForm from "../components/feedback-form"
import FeedbackDisplay from "../components/feedback-display"

export default function FeedbackPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-12">We Value Your Feedback</h1>
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <FeedbackForm />
        </div>
        <div>
          <FeedbackDisplay />
        </div>
      </div>
    </div>
  )
}

