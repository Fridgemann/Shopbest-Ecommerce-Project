import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { refreshCartCount } = useAppStore();

    useEffect(() => {
        async function fetchCartAndProducts() {
            const cartRes = await fetch('http://localhost:5000/cart', {
                credentials: 'include'
            });
            if (cartRes.ok) {
                const cartData = await cartRes.json();
                setCart(cartData.items);
            } else {
                setCart([]);
            }

            const productsRes = await fetch('http://localhost:5000/api/products');
            if (productsRes.ok) {
                const productsData = await productsRes.json();
                setProducts(productsData);
            } else {
                console.error('Failed to fetch products');
            }

            setLoading(false);
        }
        fetchCartAndProducts();
    }, []);

    async function removeFromCart(productId, size) {
        const res = await fetch(
            `http://localhost:5000/cart/${productId}?size=${encodeURIComponent(size || "")}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        if (res.ok) {
            const data = await res.json();
            setCart(data.items);
            await refreshCartCount();
        }
    }

    const cartWithDetails = cart.map(item => {
        const product = products.find(
            p => String(p.id) === String(item.productId)
        );

        return {
            ...item,
            title: product?.title || 'Unknown Product',
            image: product?.image || '/placeholder.jpg',
            price: product?.price || 0,
        };
    });

    const total = cartWithDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (loading && cart.length === 0) return <p className="text-center mt-10 text-white">Loading...</p>;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-2">
            <main className="w-full max-w-2xl rounded-lg bg-gray-900 p-4 sm:p-8 md:rounded-2xl md:shadow-input border border-blue-700">
                <h1 className="text-2xl font-bold mb-6 text-blue-400 text-center">Your Cart</h1>

                {cart.length === 0 ? (
                    <p className="text-gray-400 text-center">Your cart is empty.</p>
                ) : (
                    <ul className="space-y-6">
                        {cartWithDetails.map(item => (
                            <li
                                key={item.productId + (item.size || "")}
                                className="flex gap-6 items-center border-b border-blue-900 pb-4"
                            >
                                <Link href={`/products/${item.productId}`} className="flex items-center gap-4 flex-1 hover:underline">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-24 h-24 object-cover rounded-md shadow"
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                                        <p className="text-sm text-gray-400">
                                            Quantity: <span className="text-blue-300">{item.quantity}</span>
                                            {item.size && (
                                                <span className="ml-2 text-purple-400">| Size: {item.size}</span>
                                            )}
                                        </p>
                                    </div>
                                </Link>
                                <p className="text-blue-400 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                <button
                                    onClick={() => removeFromCart(item.productId, item.size)}
                                    className="text-red-500 font-medium hover:underline cursor-pointer"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <h2 className="text-xl font-bold mt-8 text-right text-white">
                    Total: <span className="text-blue-400">${total.toFixed(2)}</span>
                </h2>
                <div className="flex justify-end mt-6 gap-2">
                    <button
                        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition cursor-pointer font-semibold"
                        onClick={() => router.push('/products')}
                    >
                        Continue Shopping
                    </button>
                    {cart.length > 0 && (
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer font-semibold"
                            onClick={() => router.push('/checkout')}
                        >
                            Proceed to Checkout
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}