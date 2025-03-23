import  { useCartStore } from '../store/cartStore';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">
                    ₹{item.price} per {item.unit}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    max={item.quantity}
                    value={item.cartQuantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between text-xl font-semibold">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
            <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 