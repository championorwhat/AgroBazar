import  { create } from 'zustand';
import { type Product } from '../types';

interface CartItem extends Product {
  cartQuantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, quantity) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, cartQuantity: item.cartQuantity + quantity }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { ...product, cartQuantity: quantity }],
      };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, cartQuantity: quantity } : item
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  get total() {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.cartQuantity,
      0
    );
  },
}));
 