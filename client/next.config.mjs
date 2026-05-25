/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['fakestoreapi.com', 'localhost', 'cdn.dummyjson.com'],
  },
};

export default nextConfig;
