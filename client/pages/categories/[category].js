import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCategoryNameFromSlug } from '@/lib/categoryMap'

export default function CategoryPage() {
    const { query } = useRouter()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const slug = query.category;
        if (!slug) return;

        const categoryName = getCategoryNameFromSlug(slug);
        if (!categoryName) {
            setProducts([]);
            setLoading(false);
            return;
        }
        const fetchCategoryProducts = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products') // update if needed
                const data = await res.json()
                const filtered = data.filter(
                    p => p.category.toLowerCase() === categoryName.toLowerCase()
                )
                setProducts(filtered)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchCategoryProducts()
    }, [query.category])

    if (loading) return <div className="text-white p-10">Loading...</div>

    // Get the category name from slug for display
    const slug = query.category;
    const categoryName = getCategoryNameFromSlug(slug);

    return (
        <div className="min-h-screen bg-black text-white px-6 py-10">
            <nav className="mb-6 text-sm text-gray-400">
                <Link href="/"><span className="hover:underline cursor-pointer">Home</span></Link> /
                <Link href="/products"><span className="hover:underline cursor-pointer ml-1">Products</span></Link> /
                <span className="text-blue-400 ml-1">{categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : 'Category'}</span>
            </nav>
            <h1 className="text-3xl font-bold mb-6 capitalize text-blue-400">
                Category: {categoryName}
            </h1>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map(product => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
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
            )}
        </div>
    )
}
