import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full -mt-8 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-bike.jpg"
            alt="Mountain biker on a trail"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={100}
          />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-8">
            <div className="max-w-3xl">
              <span className="text-[#00FF47] font-bold text-xl uppercase tracking-wider">
                Welcome to the extreme
              </span>
              <h1 className="text-[120px] font-black text-white leading-[0.9] tracking-tight mt-6">
                CONQUER
                <br />
                <span className="text-[#00FF47]">EVERY TRAIL</span>
              </h1>
              <p className="text-2xl text-white font-medium max-w-2xl mt-8">
                Premium mountain bikes and gear for riders who push the limits.
                Experience pure adrenaline with our expert-curated selection.
              </p>
              <div className="mt-12">
                <Link
                  href="/bikes"
                  className="inline-flex items-center bg-[#00FF47] text-black px-12 py-5 font-bold text-xl hover:bg-[#00FF47]/90 transition-colors"
                >
                  SHOP BIKES
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Diagonal Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[120%] border-t-2 border-r-2 border-[#00FF47] transform -skew-y-12" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[120%] h-[120%] border-b-2 border-l-2 border-[#00FF47] transform skew-y-12" />
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
