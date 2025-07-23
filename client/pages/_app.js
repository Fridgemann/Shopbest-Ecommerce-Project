import "@/styles/globals.css";
import { useEffect, useState } from "react";
import CartButton from "@/lib/cartButton";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Fetch user info
    fetch("http://localhost:5000/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data && data.userId ? data : null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return setCartCount(0);
    fetch("http://localhost:5000/cart", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setCartCount(data.items ? data.items.length : 0));
  }, [user]);

  return (
    <>
      <Component {...pageProps} />
      {user && <CartButton cartCount={cartCount} />}
    </>
  );
}
