import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSlugFromCategoryName } from '@/lib/categoryMap';
import { useAppStore } from "@/store/useAppStore";
import { showToast } from "@/components/ui/toast";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RelatedProducts = ({ currentProductId, currentCategory }) => {
    const [related, setRelated] = useState([]);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();

                const filtered = data
                    .filter(p => p.id !== parseInt(currentProductId) && p.category === currentCategory)
                    .slice(0, 4);

                setRelated(filtered);
            } catch (error) {
                console.error('Failed to fetch related products:', error);
            }
        };

        fetchRelated();
    }, [currentProductId, currentCategory]);

    return (
        <div className="relative p-8 bg-gradient-to-b from-gray-900 to-black rounded-2xl mt-12 shadow-lg border border-blue-800">
            <h2 className="text-2xl font-bold mb-8 text-center text-blue-400 tracking-wide relative z-10">
                <span className="relative">
                    You Might Also Like
                </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {related.map(product => (
                    <Link
                        href={`/products/${product.id}`}
                        key={product.id}
                        className="group bg-gray-800/80 border border-blue-900 rounded-xl p-4 flex flex-col items-center transition-all duration-200 relative overflow-hidden hover:shadow-[0_0_32px_8px_rgba(99,102,241,0.25)]"
                    >
                        {/* Even glow overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-700/20 via-purple-700/10 to-blue-700/20 rounded-xl blur-sm" />
                        </div>
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-24 h-24 object-contain mb-3 drop-shadow-lg transition-transform duration-200 group-hover:scale-110"
                        />
                        <p className="text-white font-semibold text-center line-clamp-2">{product.title}</p>
                        <p className="text-blue-400 font-bold mt-2">${product.price}</p>
                        <div className="absolute bottom-2 left-2 right-2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition duration-300" />                    </Link>
                ))}
            </div>
        </div>
    );
};

export default function ProductPage() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

    const { refreshCartCount, setGlobalLoading } = useAppStore();

    useEffect(() => {
        setGlobalLoading(true);
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`)
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product: ', error);
            } finally {
                setLoading(false);
                setGlobalLoading(false);
            }
        }
        fetchProduct();
    }, [id, setGlobalLoading]);

    // Check if product is in wishlist (you may need to fetch user's wishlist here)
    useEffect(() => {
        async function checkWishlist() {
            if (!product) return;
            try {
                const res = await fetch(`${API_URL}/wishlist`, { credentials: "include" });
                const data = await res.json();
                if (data && data.items && data.items.some(item => item.productId === String(product.id))) {
                    setInWishlist(true);
                } else {
                    setInWishlist(false);
                }
            } catch {
                setInWishlist(false);
            }
        }
        checkWishlist();
    }, [product]);

    async function handleAddToCart() {
        setAdding(true);
        const body = {
            productId: product.id,
            quantity,
        };
        if (product.category.toLowerCase().includes('clothing')) {
            body.size = selectedSize;
        }
        const res = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
        });
        setAdding(false);
        if (res.ok) {
            showToast("Added to cart!", "success");
            await refreshCartCount();
        } else {
            showToast("Failed to add to cart", "error");
        }
    }

    async function handleAddToWishlist() {
        setWishlistLoading(true);
        const body = { productId: product.id };
        const res = await fetch(`${API_URL}/wishlist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(body),
        });
        setWishlistLoading(false);
        if (res.ok) {
            showToast("Added to wishlist!", "success");
        } else {
            showToast("Failed to add to wishlist", "error");
        }
    }

    async function handleWishlistToggle() {
        setWishlistLoading(true);
        if (inWishlist) {
            await fetch(`${API_URL}/wishlist/${product.id}`, {
                method: "DELETE",
                credentials: "include"
            });
            setInWishlist(false);
            showToast("Removed from wishlist!", "info");
        } else {
            await fetch(`${API_URL}/wishlist`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: product.id })
            });
            setInWishlist(true);
            showToast("Added to wishlist!", "success");
        }
        setWishlistLoading(false);
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    if (loading) return <p className='text-white text-3xl text-center p-8 bg-gradient-to-b from-gray-900 to-black min-h-screen'>Loading...</p>
    if (!product) return <p className='text-white text-3xl text-center p-8 bg-gradient-to-b from-gray-900 to-black min-h-screen'>Product not found</p>;

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-5xl mx-auto py-10 px-4">
                <nav className="text-sm text-gray-300 mb-4">
                    <Link href='/'><span className="hover:underline cursor-pointer text-white">Home</span></Link> /
                    <Link href='/products'><span className="hover:underline cursor-pointer ml-1 text-white">Products</span></Link> /
                    <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
                        <span className="text-purple-400 ml-1 hover:underline">{capitalize(product.category)}</span>
                    </Link> /
                    <span className="text-blue-400 ml-1">{product.title}</span>
                </nav>

                <div className="gap-10 text-white bg-gray-900 border border-blue-700 rounded-2xl shadow-input p-8 flex flex-col md:flex-row items-center md:items-start justify-evenly">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-72 h-72 md:w-auto md:h-80 object-contain rounded-lg bg-black"
                    />
                    <div className="max-w-xl flex flex-col gap-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-400">{product.title}</h1>
                        <p className="text-xl font-semibold text-purple-400">${product.price}</p>
                        <p className="text-lg leading-relaxed text-gray-200">{product.description}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-500 text-lg font-semibold">Rating:</span>
                            <span className="text-lg">{product.rating.rate} / 5</span>
                            <span className="text-gray-400 text-sm">({product.rating.count} reviews)</span>
                        </div>
                        {product.category.toLowerCase().includes('clothing') && (
                            <div className="mt-4 mb-2">
                                <p className="mb-2 font-semibold text-white">Choose a size:</p>
                                <div className="flex gap-2">
                                    {['S', 'M', 'L', 'XL'].map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-3 py-1 border border-blue-700 rounded transition cursor-pointer
                                                ${selectedSize === size ? 'bg-blue-700 text-white' : 'bg-gray-800 text-blue-200 hover:bg-blue-800 hover:text-white'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-2 mb-4">
                            <label htmlFor="qty" className="text-sm text-gray-300">Qty:</label>
                            <input
                                id="qty"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                className="w-16 p-1 rounded bg-gray-800 border border-blue-700 text-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Heart icon wishlist button */}
                            <button
                                onClick={handleWishlistToggle}
                                disabled={wishlistLoading}
                                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                className={`p-3 rounded-full transition
                                    bg-gray-700 text-gray-300 hover:bg-gray-600
                                    shadow-lg focus:outline-none`}
                            >
                                {inWishlist
                                    ? <FaHeart className="w-6 h-6" style={{ color: "#ef4444" }} />
                                    : <FaRegHeart className="w-6 h-6" style={{ color: "#d1d5db" }} />
                                }
                            </button>
                            <span className="text-sm text-gray-300">
                                {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                            </span>
                        </div>
                        <button
                            className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-blue-700 to-purple-700 font-semibold text-white text-base shadow transition mt-2 cursor-pointer"
                            onClick={handleAddToCart}
                            disabled={adding}
                        >
                            {adding ? "Adding..." : "Add to Cart"}
                            <BottomGradient />
                        </button>
                    </div>
                </div>
            </div>
            <RelatedProducts currentProductId={id} currentCategory={product.category} />
        </div>
    );
}

const BottomGradient = () => (
    <>
        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
        <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
);