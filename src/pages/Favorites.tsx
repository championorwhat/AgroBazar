import  { useState } from 'react';
import { Heart } from 'lucide-react';
import { mockProducts } from '../utils/recommendations';
import ProductCard from '../components/ProductCard';

export default function Favorites() {
  // Mock favorites - in real app, this would come from a store
  const [favorites] = useState(mockProducts.slice(0, 2));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <Heart className="h-8 w-8 text-red-500" />
        <h1 className="text-3xl font-bold">Your Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No favorites yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(product => (
            <div 
              key={product.id}
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 