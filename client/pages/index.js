import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppStore } from "@/store/useAppStore";
import FeaturesSectionDemo from '../components/features-section-demo-2'; // Ensure this path is correct


const Login = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/login')}
      className="mb-5 bg-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition cursor-pointer"
    >
      Login
    </button>
  );
};

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
};

const Logout = ({ user, setUser }) => {
  const router = useRouter();
  async function handleLogout() {
    try {
      const res = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setUser(null);
        // Refresh the page to update logout state
        router.refresh ? router.refresh() : window.location.reload();
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }
  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition cursor-pointer"
    >
      Logout
    </button>
  );
};


export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [user, setUser] = useState(null);
  const { refreshUser } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/products/featured')
      .then(res => res.json())
      .then(data => {
        // console.log('Featured products:', data); // <-- Check what you get
        setFeaturedProducts(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Failed to fetch featured products:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/me', {
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 401) return null; // Not logged in
        return res.ok ? res.json() : null;
      })
      .then(data => {
        if (data && data.loggedIn) setUser(data);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, []);

  const handleLoginSuccess = async () => {
    await refreshUser();
    router.push("/");
  };

  const handleRegisterSuccess = async () => {
    await refreshUser();
    router.push("/");
  };

  return (
    <div className="bg-black text-white">
      {/* hero section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-b from-gray-900 to-black overflow-hidden">
        {/* Decorative lines for hero styling */}
        <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-800/80 pointer-events-none">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-800/80 pointer-events-none">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-800/80 pointer-events-none">
          <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
        {/* Site Title */}
        <div className="absolute left-0 top-0 px-8 py-6 z-20 flex items-center gap-3">
          <div className="size-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg tracking-tight">
            Shop<span className='text-purple-400'>Best</span>.co
          </h1>
        </div>
        {/* Auth Buttons & Greeting - Top Right */}
        <div className="absolute right-0 top-0 px-8 py-6 z-20 flex items-center gap-4">
          {user ? (
            <>
              <span className="text-xl text-blue-300 font-semibold mr-2">Hello, {user.username}!</span>
              <button
                onClick={() => router.push("/products")}
                className="cursor-pointer bg-gradient-to-br from-blue-700 to-purple-700 px-6 py-3 rounded-lg font-semibold text-white hover:from-blue-800 hover:to-purple-800 transition shadow"
              >
                Shop Now
              </button>
              <Logout user={user} setUser={setUser} />
            </>
          ) : (
            <>
              <Login />
              <Register />
            </>
          )}
        </div>
        {/* Main headline */}
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl md:text-5xl lg:text-7xl font-extrabold text-blue-400 drop-shadow mt-24">
          Your One-Stop E-Commerce Destination
        </h1>
        {/* Subheadline */}
        <p className="relative z-10 mx-auto max-w-2xl py-4 text-center text-lg md:text-2xl font-normal text-neutral-300">
          Shop the latest trends, top brands, and unbeatable deals — all in one place.
        </p>

        {/* featured products section */}
        <section className="py-16 px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-blue-400">Featured Products</h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {featuredProducts.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="bg-gray-900 rounded-lg p-4 border border-blue-700 hover:border-blue-400 hover:scale-105 transition-all duration-300 shadow flex flex-col items-center"
                  style={{ minHeight: "340px", maxHeight: "340px", minWidth: "0" }}>
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={128}
                    height={128}
                    className="w-45 h-45 object-contain mb-4 rounded-lg bg-white/5 p-2 transition group-hover:scale-105"
                    draggable={false}
                    style={{ WebkitUserSelect: "none", userSelect: "none" }}
                  />
                  <h3 className="text-white font-semibold mb-2 text-center line-clamp-2 h-12 flex items-center justify-center w-full">
                    {product.title}
                  </h3>
                  <div className="flex-1" />
                  <p className="text-blue-400 font-bold mb-2">${product.price}</p>
                  <div className="absolute bottom-2 left-2 right-2 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-60 transition duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </section>
        {/* category previews */}
        <section className="py-16 px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-blue-400">Browse by Category</h2>
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
                className="bg-gray-900 hover:bg-gradient-to-br hover:from-blue-700 hover:to-purple-700 p-6 rounded-lg text-center transition border border-blue-700 shadow"
              >
                <p className="text-lg font-semibold text-white">{name}</p>
              </Link>
            ))}
          </div>
        </section>

      </section>

      {/* features */}
      <section className="bg-black py-16 px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-blue-400">
          Why Shop With Us?
        </h2>
        <FeaturesSectionDemo className="mb-10 text-white" />
      </section>





      {/* footer */}
      <footer className="bg-black py-10 px-6 text-center text-gray-500 border-t border-blue-900">
        <p>© {new Date().getFullYear()} ShopBest.co. All rights reserved.</p>
      </footer>
    </div>
  )
}
