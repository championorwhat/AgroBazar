import { create } from 'zustand';
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
  total: 0,

  addItem: (product, quantity) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...product, cartQuantity: quantity }];
      }

      return {
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.price * item.cartQuantity,
          0
        ),
      };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== productId);
      return {
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.price * item.cartQuantity,
          0
        ),
      };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === productId ? { ...item, cartQuantity: quantity } : item
      );
      return {
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.price * item.cartQuantity,
          0
        ),
      };
    });
  },

  clearCart: () => {
    set({ items: [], total: 0 });
  },
}));
