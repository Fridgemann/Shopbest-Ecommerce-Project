import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Checkout</h1>
      <form className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Full Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Your Name"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Shipping Address</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="123 Main St, City, Country"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Card Number</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Expiry</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">CVC</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="123"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition cursor-pointer"
        >
          Place Order
        </button>
      </form>
      <div className="text-center mt-6">
        <Link href="/cart" className="text-blue-500 hover:underline">
          Back to Cart
        </Link>
      </div>
    </main>
  );
}