import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  cartCount: 0,
  setUser: (user) => set({ user }),
  setCartCount: (cartCount) => set({ cartCount }),
  refreshUser: async () => {
    try {
      const res = await fetch("http://localhost:5000/me", { credentials: "include" });
      const data = await res.json();
      set({ user: data && data.userId ? data : null });
    } catch {
      set({ user: null });
    }
  },
  refreshCartCount: async () => {
    try {
      const res = await fetch("http://localhost:5000/cart", { credentials: "include" });
      const data = await res.json();
      set({ cartCount: data.items ? data.items.length : 0 });
    } catch {
      set({ cartCount: 0 });
    }
  },
}));