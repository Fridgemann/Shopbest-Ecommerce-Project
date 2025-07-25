import "@/styles/globals.css";
import CartButton from "@/lib/cartButton";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ToastContainer } from "@/components/ui/toast";

export default function App({ Component, pageProps }) {
  const { user, cartCount, refreshUser, refreshCartCount } = useAppStore();

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) refreshCartCount();
  }, [user]);

  return (
    <>
      <Component {...pageProps} />
      {user && <CartButton cartCount={cartCount} />}
      <ToastContainer />
    </>
  );
}
