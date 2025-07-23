import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

export default function CartButton({ cartCount = 0 }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const hideOn = ["/cart", "/checkout"];
  if (hideOn.includes(router.pathname)) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-8 right-8 z-50 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all cursor-pointer flex items-center justify-center"
        style={{
          minWidth: hovered ? 160 : 56,
          transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.16 16h9.68c.82 0 1.54-.5 1.84-1.25l3.02-7.05A1 1 0 0 0 21 6H6.21l-.94-2.36A1 1 0 0 0 4.34 2H2v2h1.34l3.6 9.59-1.35 2.44C4.52 16.37 5.48 18 7.16 18zm12.24-8l-2.76 6.44a1 1 0 0 1-.92.56H7.16l1.1-2h7.45a1 1 0 0 0 .92-.63l2.77-6.37z"
          />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2 py-0.5">
            {cartCount}
          </span>
        )}
        <span
          className={`whitespace-nowrap overflow-hidden inline-block transition-all duration-300
    ${hovered ? "ml-3" : "ml-0"}
  `}
          style={{
            opacity: hovered ? 1 : 0,
            maxWidth: hovered ? 120 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-16px)",
            transition:
              "opacity 0.35s cubic-bezier(.4,0,.2,1), max-width 0.45s cubic-bezier(.4,0,.2,1), transform 0.45s cubic-bezier(.4,0,.2,1), margin 0.3s cubic-bezier(.4,0,.2,1)",
          }}
        >
          Go to cart
        </span>
      </div>
    </Link>
  );
}