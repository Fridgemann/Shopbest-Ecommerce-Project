import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Add this import
import Link from "next/link";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // Initialize router

    useEffect(() => {
        async function fetchCartAndProducts() {
            const cartRes = await fetch('http://localhost:5000/cart', {
                credentials: 'include' // include cookies for auth
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

    async function removeFromCart(productId) {
        const res = await fetch(`http://localhost:5000/cart/${productId}`, {
            method: 'DELETE',
            credentials: 'include' // include cookies for auth
        });

        if (res.ok) {
            const data = await res.json();
            setCart(data.items);
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

    if (loading && cart.length === 0) return <p className="text-center mt-10">Loading...</p>;

    return (
        <main className="max-w-2xl mx-auto mt-10 p-4">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

            {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                <ul className="space-y-6">
                    {cartWithDetails.map(item => (
                        <li
                            key={item.productId}
                            className="flex gap-6 items-center border-b pb-4"
                        >
                            <Link href={`/products/${item.productId}`} className="flex items-center gap-4 flex-1 hover:underline">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-24 h-24 object-cover rounded-md shadow"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">{item.title}</h2>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                            </Link>
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                            <button
                                onClick={() => removeFromCart(item.productId)}
                                className="text-red-600 font-medium hover:underline"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <h2 className="text-xl font-bold mt-8 text-right">
                Total: ${total.toFixed(2)}
            </h2>
            <div className="flex justify-end mt-6">
                <button
                    className="mt-2 ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                    onClick={() => router.push('/checkout')} // Go to mock checkout
                >
                    Proceed to Checkout
                </button>
                <button
                    className="mt-2 ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => router.push('/products')} // Go to products page
                >
                    Continue Shopping
                </button>
            </div>

        </main>
    );


}