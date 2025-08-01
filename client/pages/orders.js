import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const { refreshUser, setGlobalLoading } = useAppStore();

  useEffect(() => {
    setGlobalLoading(true);
    async function fetchOrders() {
      const res = await fetch(`${API_URL}/orders`, { credentials: "include" });
      const data = await res.json();
      setOrders(data);
      await refreshUser();
      setGlobalLoading(false);
    }
    fetchOrders().catch(() => {
      setOrders([]);
      setGlobalLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black py-12 px-2 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center drop-shadow-lg tracking-tight">
          Order History
        </h1>
        {orders.length === 0 ? (
          <div className="bg-white/10 border border-blue-700 rounded-2xl p-10 text-center text-blue-200 shadow-2xl backdrop-blur-md">
            <p className="text-lg font-medium">No orders yet.</p>
            <Link
              href="/products"
              className="mt-8 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition text-lg"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <ul className="space-y-10">
            {orders.map((order) => (
              <li
                key={order._id}
                className="relative border border-blue-800 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 transition hover:shadow-blue-900/60"
              >
                <div className="absolute -top-5 left-8 bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-1 rounded-full text-xs font-bold text-white shadow-lg border border-blue-900 select-none">
                  {new Date(order.createdAt).toLocaleDateString()} &middot;{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <ul>
                  {order.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center gap-4 mb-4 bg-black/40 rounded-xl p-3 hover:bg-blue-950/60 transition"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-lg shadow-lg bg-white/10 border border-blue-900 hover:scale-105 transition-transform duration-200"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-white text-base">{item.name}</div>
                        {item.size && (
                          <div className="text-xs text-blue-300">Size: {item.size}</div>
                        )}
                      </div>
                      <span className="font-medium text-blue-200">x{item.quantity}</span>
                      <span className="font-semibold text-blue-300">${item.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="font-bold mt-6 text-right text-xl text-blue-300">
                  Total: ${order.total}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}