import  { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'farmer' | 'buyer';
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
 