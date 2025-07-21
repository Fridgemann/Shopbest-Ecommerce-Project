import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSlugFromCategoryName } from '@/lib/categoryMap';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetch('http://localhost:5000/api/products') // change to your backend URL if deployed
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Failed to fetch products:', err));
    }, []);

    const categories = ['all', ...new Set(products.map(p => p.category))];
    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory)

    return (
        <>
            <div className="min-h-screen bg-black text-white p-8">
                <Link href={'/'}><h1 className="text-3xl font-bold mb-6 text-blue-400">Shop<span className='text-purple-500'>Best</span>.co</h1></Link>
                <div className="flex gap-4 mb-6 flex-wrap">
                    {categories.map(cat => (
                        <Link
                            href={`/categories/${getSlugFromCategoryName(cat)}`}
                            key={cat}
                            className={`px-4 py-2 rounded ${selectedCategory === cat
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/10 hover:bg-white/20'
                                }`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <Link
                            href={`/products/${product.id}`}
                            key={product.id}
                            className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
                        >
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-48 object-contain mb-2"
                            />
                            <p className="text-white text-sm font-semibold">{product.title}</p>
                            <p className="text-blue-400">${product.price}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

