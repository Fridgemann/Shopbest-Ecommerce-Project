import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function WishlistPage() {
    const { user, wishlistItems = [], refreshWishlist } = useAppStore();
    const [detailedItems, setDetailedItems] = useState([]);

    useEffect(() => {
        if (user) refreshWishlist();
    }, [user, refreshWishlist]);

    useEffect(() => {
        async function fetchDetails() {
            if (!wishlistItems.length) {
                setDetailedItems([]);
                return;
            }
            const res = await fetch(`${API_URL}/api/products`);
            const products = await res.json();
            // Match wishlist productIds to product details
            const details = wishlistItems.map(item => {
                const product = products.find(p => String(p.id) === String(item.productId));
                return {
                    ...item,
                    title: product?.title || "Product",
                    image: product?.image || "/placeholder.jpg",
                };
            });
            setDetailedItems(details);
        }
        fetchDetails();
    }, [wishlistItems]);

    async function handleRemoveFromWishlist(productId) {
        const res = await fetch(`${API_URL}/wishlist/${productId}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (res.ok) {
            await refreshWishlist();
        }
        else {
            console.error('Failed to remove item from wishlist');
        }
        setDetailedItems(detailedItems.filter(item => item.productId !== productId));
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center py-16 px-4">
            <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg tracking-tight">
                Your <span className="text-purple-400">Wishlist</span>
            </h1>
            {!user ? (
                <div className="text-center py-16">
                    <p className="mb-8 text-lg text-neutral-300">Please login to view your wishlist.</p>
                    <Link href="/login" className="bg-gradient-to-br from-blue-700 to-purple-700 px-8 py-4 rounded-lg font-semibold text-white text-lg shadow transition hover:scale-105">
                        Login
                    </Link>
                </div>
            ) : detailedItems.length === 0 ? (
                <div className="text-center py-16">
                    <p className="mb-8 text-lg text-neutral-300">Your wishlist is empty!</p>
                    <Link href="/products" className="bg-gradient-to-br from-blue-700 to-purple-700 px-8 py-4 rounded-lg font-semibold text-white text-lg shadow transition hover:scale-105">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8 w-full max-w-6xl">
                    {detailedItems.map(item => (
                        <div key={item.productId} className="bg-gray-900 rounded-lg p-6 border border-blue-700 shadow flex flex-col items-center relative">
                            <Link href={`/products/${item.productId}`}>
                                <div className="mb-4 flex items-center justify-center w-full h-32">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-32 h-32 object-contain mb-4 rounded-lg bg-white/5 p-2"
                                        draggable={false}
                                        style={{ WebkitUserSelect: "none", userSelect: "none" }}
                                    />
                                </div>
                                <h3 className="text-white font-semibold mb-2 text-center h-12 flex items-center justify-center w-full text-base break-words line-clamp-2">
                                    {item.title}
                                </h3>
                            </Link>
                            <Link href={`/products/${item.productId}`} className="mt-2 w-full">
                                <button className="mb-2 w-full bg-gradient-to-br from-blue-700 to-purple-700 text-white py-2 rounded-lg font-semibold shadow transition hover:scale-105 cursor-pointer">
                                    View Product
                                </button>
                            </Link>
                            <button onClick={() => handleRemoveFromWishlist(item.productId)} className="mt-2 w-full bg-red-700 text-white py-2 rounded-lg font-semibold shadow transition hover:scale-105 cursor-pointer">
                                Remove from Wishlist
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}