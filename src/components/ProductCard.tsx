import { type Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const items = useCartStore((state) => state.items);

  const cartItem = items.find((item) => item.id === product.id);
  const cartQuantity = cartItem?.cartQuantity || 0;

  const handleAdd = () => {
    if (cartQuantity === 0) {
      addItem(product, 1);
    } else {
      updateQuantity(product.id, cartQuantity + 1);
    }
  };

  const handleSubtract = () => {
    if (cartQuantity > 1) {
      updateQuantity(product.id, cartQuantity - 1);
    } else {
      updateQuantity(product.id, 0);
    }
  };

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

          {cartQuantity === 0 ? (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
              onClick={handleAdd}
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSubtract}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="font-medium">{cartQuantity}</span>
              <button
                onClick={handleAdd}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

