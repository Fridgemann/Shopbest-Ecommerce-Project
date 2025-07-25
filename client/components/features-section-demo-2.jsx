import { cn } from "@/lib/utils";
import {
  IconTruckDelivery,
  IconCreditCard,
  IconCurrencyDollar,
  IconShieldCheck,
  IconHeart,
  IconHeadset,
  IconGift,
  IconStar,
} from "@tabler/icons-react";

export default function FeaturesSectionDemo() {
  const features = [
    {
      title: "Fast & Free Delivery",
      description:
        "Enjoy free shipping on all orders with lightning-fast delivery to your door.",
      icon: <IconTruckDelivery />,
    },
    {
      title: "Secure Payments",
      description:
        "Your transactions are protected with industry-leading encryption and security.",
      icon: <IconCreditCard />,
    },
    {
      title: "Best Price Guarantee",
      description:
        "We offer the most competitive prices and exclusive deals every day.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Buyer Protection",
      description:
        "Shop with confidence—easy returns and full refunds if you're not satisfied.",
      icon: <IconShieldCheck />,
    },
    {
      title: "Curated Gift Ideas",
      description:
        "Find the perfect gift for every occasion with our handpicked selections.",
      icon: <IconGift />,
    },
    {
      title: "24/7 Customer Support",
      description: "Our support team is always here to help you, day or night.",
      icon: <IconHeadset />,
    },
    {
      title: "Wishlist & Favorites",
      description:
        "Save your favorite products and shop later with your personal wishlist.",
      icon: <IconHeart />,
    },
    {
      title: "Top Rated Products",
      description:
        "Shop the most loved and highly rated products by our customers.",
      icon: <IconStar />,
    },
  ];
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto bg-black rounded-lg border border-blue-700"
    >
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-blue-700",
        (index === 0 || index === 4) && "lg:border-l border-blue-700",
        index < 4 && "lg:border-b border-blue-700"
      )}>
      {index < 4 && (
        <div
          className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div
          className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-blue-900/30 to-transparent pointer-events-none" />
      )}
      <div
        className="mb-4 relative z-10 px-10 text-blue-400 text-3xl"
      >
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div
          className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-blue-700 group-hover/feature:bg-purple-500 transition-all duration-200 origin-center" />
        <span
          className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white"
        >
          {title}
        </span>
      </div>
      <p
        className="text-sm text-gray-300 max-w-xs relative z-10 px-10"
      >
        {description}
      </p>
    </div>
  );
};
