import  { type Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">
          {product.quantity} {product.unit} available
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">
            ₹{product.price}/{product.unit}
          </span>
          <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
 