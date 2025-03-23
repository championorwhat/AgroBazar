import { ShoppingCart, Sun, Home, Heart, Store, User, MessageCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="bg-green-600 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 hover:text-green-200 transition-colors">
              <Store className="h-8 w-8" />
              <span className="text-xl font-bold">AgroBazzar</span>
            </Link>
          </div>

          {/* ✅ Navbar Items */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-green-200 transition-colors flex items-center space-x-1">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link to="/marketplace" className="hover:text-green-200 transition-colors flex items-center space-x-1">
              <Store className="h-5 w-5" />
              <span>Market</span>
            </Link>

            <Link to="/favorites" className="hover:text-green-200 transition-colors flex items-center space-x-1">
              <Heart className="h-5 w-5" />
              <span>Favorites</span>
            </Link>

            <Link to="/weather" className="hover:text-green-200 transition-colors">
              <Sun className="h-5 w-5" />
            </Link>

            {/* ✅ Community Chat as a Link */}
            <Link to="/community" className="hover:text-green-200 transition-colors flex items-center space-x-1">
              <MessageCircle className="h-5 w-5" />
              <span>Community</span>
            </Link>

            {/* ✅ User Feedback Page */}
            <Link to="/feedback" className="hover:text-yellow-300 transition-colors flex items-center space-x-1">
              <Star className="h-5 w-5" />
              <span>Feedback</span>
            </Link>

            <Link to="/cart" className="hover:text-green-200 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>

            {user ? (
              <Link to="/profile" className="hover:text-green-200 transition-colors flex items-center space-x-1">
                <User className="h-5 w-5" />
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link to="/auth" className="hover:text-green-200 transition-colors">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
