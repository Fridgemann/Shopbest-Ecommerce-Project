import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="bg-white/10 border border-blue-700 rounded-2xl p-10 text-center shadow-2xl backdrop-blur-md max-w-lg w-full">
        <h1 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Payment Cancelled
        </h1>
        <p className="text-blue-200 mb-8">
          Your payment was cancelled. No worries, your cart is still waiting for you!
        </p>
        <Link
          href="/cart"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition text-lg"
        >
          Return to Cart
        </Link>
        <div className="mt-4">
          <Link
            href="/products"
            className="text-blue-300 underline hover:text-pink-400 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}