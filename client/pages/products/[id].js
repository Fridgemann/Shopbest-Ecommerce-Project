import { useRouter } from 'next/router';
import { useEffect, useState} from 'react';

export default function ProductPage() {
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

    if (loading) return <p className='text-center p-8'>Loading...</p>
    if (!product) return <p className='text-center p-8'>Product not found</p>;

    return (
        <div className='p-8 flex bg-black/80 text-white'>
            <img src={product.image} alt={product.title} className='w-auto h-auto mb-4' />
            <div className='flex-col ml-8 items-center justify-center'>
                <h1 className='text-2xl font-bold mb-4'>{product.title}</h1>
                <p className='text-lg mb-4'>${product.price}</p>
                <p className='mb-4'>{product.description}</p>
                <button className='bg-blue-500 text-white px-4 py-2 rounded'>Add to Cart</button>
            </div>
        </div>
    )
}