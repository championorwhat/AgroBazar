import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ProductForm from "./pages/ProductForm";
import Cart from "./pages/Cart";
import Chatbot from "./components/Chatbot";
import Marketplace from "./pages/Marketplace";
import Favorites from "./pages/Favorites";
import Weather from "./pages/Weather";
import Chat from "./components/ChatF";
import Predict from "./components/Predict";
import StaticFeedbackForm from "./components/feedback-form";// FeedbackDisplay"; // ✅ Imported FeedbackDisplay

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/list-product" element={<ProductForm />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/community" element={<Chat />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/feedback" element={<StaticFeedbackForm />} /> {/* ✅ Added Feedback Page */}
          </Routes>
        </main>
        <Chatbot /> {/* ✅ Chatbot is always rendered */}
      </div>
    </Router>
  );
}

export default App;
