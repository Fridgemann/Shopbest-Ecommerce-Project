import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAppStore = create((set) => ({
  user: null,
  cartCount: 0,
  setUser: (user) => set({ user }),
  setCartCount: (cartCount) => set({ cartCount }),
  refreshUser: async () => {
    try {
      const res = await fetch(`${API_URL}/me`, { credentials: "include" });
      const data = await res.json();
      set({ user: data && data.userId ? data : null });
    } catch {
      set({ user: null });
    }
  },
  refreshCartCount: async () => {
    try {
      const res = await fetch(`${API_URL}/cart`, { credentials: "include" });
      const data = await res.json();
      set({ cartCount: data.items ? data.items.length : 0 });
    } catch {
      set({ cartCount: 0 });
    }
  },
}));