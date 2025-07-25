import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 py-12">
      <div className="w-full max-w-xl bg-gray-900 border border-blue-700 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg text-center mb-8">
          Checkout
        </h1>
        <form className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-blue-300">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border border-blue-700 bg-black/40 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-blue-300">
              Shipping Address
            </label>
            <input
              type="text"
              className="w-full border border-blue-700 bg-black/40 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="123 Main St, City, Country"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-blue-300">
              Card Number
            </label>
            <input
              type="text"
              className="w-full border border-blue-700 bg-black/40 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-2 text-blue-300">
                Expiry
              </label>
              <input
                type="text"
                className="w-full border border-blue-700 bg-black/40 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-2 text-blue-300">CVC</label>
              <input
                type="text"
                className="w-full border border-blue-700 bg-black/40 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="123"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-br from-blue-700 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-blue-800 hover:to-purple-800 transition shadow mt-4"
          >
            Place Order
          </button>
        </form>
        <div className="text-center mt-8">
          <Link
            href="/cart"
            className="text-blue-400 hover:underline font-semibold"
          >
            &larr; Back to Cart
          </Link>
        </div>
      </div>
    </main>
  );
}