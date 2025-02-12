import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-screen -mt-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bike.jpg"
            alt="Mountain biker on a trail"
            fill
            className="object-cover brightness-90"
            priority
            sizes="100vw"
            quality={100}
          />
          {/* Dynamic overlay with diagonal cuts */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent" />
          {/* Diagonal accent line */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-1/4 top-1/4 w-1/2 h-[2px] bg-green-500 rotate-45 transform opacity-60" />
          </div>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="mb-4">
                <span className="text-green-500 font-bold text-xl uppercase tracking-wider">Welcome to the extreme</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 text-white leading-none tracking-tight">
                CONQUER<br />
                <span className="text-green-500">EVERY TRAIL</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 font-medium max-w-2xl">
                Premium mountain bikes and gear for riders who push the limits.
                Experience pure adrenaline with our expert-curated selection.
              </p>
              <Link
                href="/bikes"
                className="group inline-flex items-center bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-none skew-x-6 font-bold text-lg transform transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
              >
                SHOP BIKES
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 relative">
        <div className="absolute left-0 top-0 w-1 h-16 bg-green-500" />
        <h2 className="text-4xl md:text-5xl font-black mb-12 pl-6 uppercase">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative h-96 overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              {/* Diagonal accent line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-green-500 transform -rotate-6 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-3 uppercase">
                  {category.name}
                </h3>
                <p className="text-gray-300 text-lg font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-black py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-green-500/30 -rotate-45" />
          <div className="absolute bottom-0 right-1/4 w-1/2 h-[1px] bg-green-500/30 -rotate-45" />
        </div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center text-white uppercase">
            Why Choose Trail Blazer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature) => (
              <div key={feature.title} className="text-center group relative">
                <div className="bg-green-500/10 w-24 h-24 rounded-none rotate-45 flex items-center justify-center mx-auto mb-8 transform group-hover:scale-110 group-hover:bg-green-500/20 transition-all">
                  <div className="-rotate-45">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white uppercase">{feature.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    name: "Mountain Bikes",
    description: "Find your perfect trail companion",
    href: "/bikes",
    image: "/category-bikes.jpg",
  },
  {
    name: "Parts & Components",
    description: "Upgrade your ride",
    href: "/parts",
    image: "/category-parts.jpg",
  },
  {
    name: "Accessories",
    description: "Essential gear for every ride",
    href: "/accessories",
    image: "/category-accessories.jpg",
  },
];

const features = [
  {
    title: "Expert Selection",
    description: "Curated by passionate riders for the best trail experience",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Premium Quality",
    description: "Top brands and products that stand the test of time",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
  {
    title: "Expert Support",
    description: "Dedicated team to help you find the perfect gear",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
  },
];
