import "@/styles/globals.css";
import CartButton from "@/lib/cartButton";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppStore } from "@/store/useAppStore";
import LoadingOverlay from "@/components/LoadingOverlay";
import { ToastContainer } from "@/components/ui/toast";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const { user, cartCount, globalLoading, setGlobalLoading, refreshUser, refreshCartCount } = useAppStore();

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) refreshCartCount();
  }, [user]);

  // Show loading on route change
  useEffect(() => {
    const handleStart = () => setGlobalLoading(true);
    const handleStop = () => setGlobalLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router, setGlobalLoading]);

  return (
    <>
      {globalLoading && <LoadingOverlay />}
      <Component {...pageProps} />
      {user && <CartButton cartCount={cartCount} />}
      <ToastContainer />
    </>
  );
}
