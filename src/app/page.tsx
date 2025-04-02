import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bike.jpg"
            alt="Mountain biker on a trail"
            fill
            className="object-cover brightness-95 scale-x-[-1]"
            priority
            sizes="100vw"
            quality={100}
          />
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-bl from-black/50 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />
          {/* Animated accent lines */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-1/4 top-1/4 w-1/2 h-[2px] bg-green-500/60 rotate-45 animate-pulse" />
            <div className="absolute -left-1/4 bottom-1/4 w-1/2 h-[2px] bg-green-500/40 -rotate-45 animate-pulse delay-150" />
          </div>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="p-8 rounded-2xl max-w-3xl">
                <div className="mb-4">
                  <span className="text-green-400 font-bold text-xl uppercase tracking-wider">
                    Welcome to the republic
                  </span>
                </div>
                <h1 className="text-7xl md:text-8xl font-black mb-6 text-white leading-none tracking-tight">
                  CONQUER
                  <br />
                  <span className="text-gradient">EVERY TRAIL</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200 font-medium max-w-2xl">
                  Premium mountain bikes and gear for riders who push the limits.
                  Experience pure adrenaline with our expert-curated selection.
                </p>
                <Link
                  href="/bikes"
                  className="group inline-flex items-center bg-green-600/90 hover:bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg transform transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                >
                  SHOP BIKES
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Bento Grid */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="absolute left-0 top-24 w-1 h-16 bg-green-500" />
        <h2 className="text-4xl md:text-5xl font-black mb-12 pl-6 uppercase">
          Featured Categories
        </h2>
        <div className="bento-grid">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className={`group relative overflow-hidden rounded-2xl glass-card transform hover:scale-[1.02] transition-all duration-300 ${
                index === 0 
                  ? 'md:col-span-2 md:row-span-2' 
                  : 'md:col-span-2'
              }`}
              style={{
                height: index === 0 ? '100%' : index === 1 ? '250px' : '250px',
                minHeight: index === 0 ? '520px' : '250px'
              }}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="glass-dark rounded-xl p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-3xl font-bold text-white mb-3 uppercase">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 text-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us - Modern Cards */}
      <section className="bg-black/95 py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-green-500/30 -rotate-45" />
          <div className="absolute bottom-0 right-1/4 w-1/2 h-[1px] bg-green-500/30 -rotate-45" />
        </div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center text-white uppercase">
            Why Choose Trail Blazer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card p-8 rounded-2xl text-center group relative transform hover:scale-105 transition-all duration-300">
                <div className="bg-green-500/20 w-24 h-24 rounded-2xl rotate-45 flex items-center justify-center mx-auto mb-8 transform group-hover:rotate-90 transition-all duration-500">
                  <div className="-rotate-45 group-hover:rotate-[-90deg] transition-all duration-500">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white uppercase">
                  {feature.title}
                </h3>
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
    name: "Mountain Bike",
    description: "Find your aperfect trail companion",
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
