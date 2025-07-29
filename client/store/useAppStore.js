import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAppStore = create((set) => ({
  user: null,
  cartCount: 0,
  globalLoading: false, // Add this
  wishlistItems: [],
  wishlistCount: 0,

  setUser: (user) => set({ user }),
  setCartCount: (cartCount) => set({ cartCount }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  setWishlistItems: (items) => set({ wishlistItems: items, wishlistCount: items.length }),

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
  refreshWishlist: async () => {
    try {
      const res = await fetch(`${API_URL}/wishlist`, { credentials: "include" });
      const data = await res.json();
      // If your API returns { items: [...] }
      set({
        wishlistItems: data.items || [],
        wishlistCount: data.items ? data.items.length : 0,
      });
    } catch {
      set({ wishlistItems: [], wishlistCount: 0 });
    }
  },
}));