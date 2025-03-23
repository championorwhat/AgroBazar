import  { useState } from 'react';
import { Sliders } from 'lucide-react';
import { mockProducts } from '../utils/recommendations';
import ProductCard from '../components/ProductCard';

export default function Marketplace() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'vegetables', 'fruits', 'grains'];
  const products = mockProducts;

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Sliders className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className={`
          md:w-64 bg-white p-4 rounded-lg shadow-lg transform transition-transform duration-300
          ${isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isFilterOpen ? 'fixed md:relative inset-0 z-40 md:z-0' : ''}
        `}>
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  w-full px-4 py-2 rounded-lg text-left capitalize transition-colors
                  ${selectedCategory === category 
                    ? 'bg-green-600 text-white' 
                    : 'hover:bg-gray-100'}
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 