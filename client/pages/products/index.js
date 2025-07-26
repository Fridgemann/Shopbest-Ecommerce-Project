import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Add this import
import { getSlugFromCategoryName } from '@/lib/categoryMap';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Products() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const router = useRouter();

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Failed to fetch products:', err));
    }, []);

    // Set initial category from query param
    useEffect(() => {
        if (router.isReady) {
            const cat = router.query.category;
            if (cat && cat !== selectedCategory) {
                setSelectedCategory(cat);
            }
        }
    }, [router.isReady, router.query.category]);

    const categories = ['all', ...new Set(products.map(p => p.category))];
    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <Link href={'/'}>
                <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg tracking-tight">
                    Shop<span className='text-purple-400'>Best</span>.co
                </h1>
            </Link>
            <div className="flex gap-3 mb-8 flex-wrap justify-center">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`px-5 py-2 rounded-full font-semibold border-2 transition cursor-pointer shadow-lg
                            ${selectedCategory === cat
                                ? 'bg-gradient-to-br from-blue-700 to-purple-700 text-white border-blue-400 scale-105 ring-2 ring-purple-400'
                                : 'bg-white/10 hover:bg-white/20 text-blue-200 border-blue-900 hover:scale-105'
                            }`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {filteredProducts.map(product => (
                    <Link
                        href={`/products/${product.id}`}
                        key={product.id}
                        className="group"
                    >
                        <div
                            className="bg-gray-900 rounded-2xl p-5 border border-blue-800 hover:border-blue-400 hover:scale-105 transition-all duration-300 shadow flex flex-col items-center"
                            style={{ minHeight: "340px", maxHeight: "340px", minWidth: "0" }}
                        >
                            <div className="w-full flex justify-center">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-45 h-45 object-contain mb-4 rounded-lg bg-white/5 p-2 transition group-hover:scale-105"
                                    draggable={false}
                                    style={{ WebkitUserSelect: "none", userSelect: "none" }}
                                />
                            </div>
                            <h3 className="text-white font-bold mb-2 text-center line-clamp-2 h-12 flex items-center justify-center w-full text-lg group-hover:text-blue-300 transition">
                                {product.title}
                            </h3>
                            <div className="flex-1" />
                            <p className="text-blue-300 font-extrabold mb-2 text-xl drop-shadow">
                                ${product.price}
                            </p>
                            {/* Subtle underline on hover only */}
                            <div className="absolute bottom-2 left-2 right-2 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-60 transition duration-300" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

