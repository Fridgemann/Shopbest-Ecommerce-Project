import Link from 'next/link'
import Image from 'next/image'
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


const Login = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/login')}
      className="bg-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition cursor-pointer"
    >
      Login
    </button>
  );
}

const Register = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/register')}
      className="mb-5 bg-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition cursor-pointer"
    >
      Register
    </button>
  );
}


export default function LandingPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products') // change to your backend URL if deployed
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);
  return (
    <div className="bg-black text-white">
      {/* hero section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-b from-gray-900 to-black">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Discover Products You'll Love.
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Quality, Variety, and Fast Delivery — All in One Place.
        </p>
        <Link href="/products" className="mb-5 bg-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
          Shop Now
        </Link>
        <Register />
        <Login />
      </section>

      {/* features */}
      <section className="py-16 px-8 bg-gray-950 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-12">Why Shop With Us?</h2>
        <div className="grid gap-10 md:grid-cols-4 sm:grid-cols-2">
          {[
            { title: 'Wide Variety', emoji: '🛍️' },
            { title: 'Fast Shipping', emoji: '🚚' },
            { title: 'Secure Checkout', emoji: '🔐' },
            { title: '24/7 Support', emoji: '💬' },
          ].map(({ title, emoji }) => (
            <div key={title} className="bg-gray-900 p-6 rounded-lg shadow hover:bg-gray-800 transition">
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* category previews */}
      <section className="py-16 px-8 bg-black">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Browse by Category</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[
            { name: "Men's Clothing", slug: 'men' },
            { name: "Women's Clothing", slug: 'women' },
            { name: 'Electronics', slug: 'electronics' },
            { name: 'Jewelry', slug: 'jewelery' },
          ].map(({ name, slug }) => (
            <Link
              key={slug}
              href={`/categories/${slug}`}
              className="bg-gray-900 hover:bg-gray-800 p-6 rounded-lg text-center transition"
            >
              <p className="text-lg font-semibold">{name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* featured products (plug in backend later) */}
      <section className="py-16 px-8 bg-gray-950">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Featured Products</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {products.map(product => (
            <div key={product.id} className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition">
              <Image
                src={product.image}
                alt={product.title}
                width={200}
                height={200}
                className="w-full h-48 object-contain mb-4"
              ></Image>
              <h3 className="text-white font-semibold mb-2">{product.title}</h3>
              <p className="text-blue-400">${product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="bg-black py-10 px-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} ShopBest.co. All rights reserved.</p>
      </footer>
    </div>
  )
}
