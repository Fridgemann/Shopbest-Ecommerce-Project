import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProductPage() {

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${id}`)
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product: ', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) return <p className='text-white text-3xl text-center p-8 bg-gradient-to-b from-gray-900 to-black min-h-screen'>Loading...</p>
    if (!product) return <p className='text-white text-3xl text-center p-8 bg-gradient-to-b from-gray-900 to-black min-h-screen'>Product not found</p>;

    return (
        <div className='min-h-screen p-5 '>
            <nav className="text-sm text-black mb-4">
                {/* keep the format same for linking as 'Home' and it'll be golden */}
                <Link href='/'><span className="hover:underline cursor-pointer">Home</span></Link> /
                <span className="hover:underline cursor-pointer ml-1">Products</span> /
                <span className="text-purple-400 ml-1">{capitalize(product.category)}</span> /
                <span className="text-blue-600 ml-1">{product.title}</span>
            </nav>

            <div className="gap-5 text-black p-8 flex flex-col md:flex-row items-center md:items-start justify-evenly">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-72 h-72 md:w-auto md:h-auto object-contain"
                />
                <div className="max-w-xl flex flex-col gap-4">
                    <h1 className=" text-3xl md:text-4xl font-bold">{product.title}</h1>
                    <p className="text-xl font-semibold">${product.price}</p>
                    <p className="text-lg  leading-relaxed">{product.description}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-500 text-lg font-semibold">Rating:</span>
                        <span className="text-lg">{product.rating.rate} / 5</span>
                        <span className="text-gray-400 text-sm">({product.rating.count} reviews)</span>
                    </div>
                    {/* if product category includes the word 'clothing', show size options */}
                    {product.category.toLowerCase().includes('clothing') && (
                        <div className="mt-4 mb-2">
                            <p className="mb-2 font-semibold">Choose a size:</p>
                            <div className="flex gap-2">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <button
                                        key={size}
                                        className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-800 hover:text-white transition"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center space-x-2 mb-4 gap-2">
                        <label htmlFor="qty" className="text-sm">Qty:</label>
                        <input id="qty" type="number" min="1" defaultValue="1" className="w-16 p-1 rounded bg-white border text-black" />
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 transition-colors px-6 py-3 rounded-lg mt-4 text-white font-medium shadow-md cursor-pointer">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>

    )
}