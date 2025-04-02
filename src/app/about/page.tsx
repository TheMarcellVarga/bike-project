"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Trophy, Leaf } from "lucide-react";

const values = [
  {
    icon: <Trophy className="w-8 h-8 text-green-600" />,
    title: "Quality First",
    description:
      "We carefully select and test every product we sell, ensuring only the best makes it to our customers.",
  },
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    title: "Expert Team",
    description:
      "Our staff are passionate riders with years of experience in the mountain biking community.",
  },
  {
    icon: <MapPin className="w-8 h-8 text-green-600" />,
    title: "Trail Tested",
    description:
      "Every bike and component is thoroughly tested on real trails before earning our recommendation.",
  },
  {
    icon: <Leaf className="w-8 h-8 text-green-600" />,
    title: "Sustainability",
    description:
      "We're committed to reducing our environmental impact and promoting sustainable riding practices.",
  },
];

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & Lead Bike Expert",
    image: "/products/bike-1.jpg",
    bio: "Former pro rider with 15 years of experience in bike manufacturing and design.",
  },
  {
    name: "Mike Chen",
    role: "Head of Service",
    image: "/products/bike-2.jpg",
    bio: "Certified bike mechanic with a passion for helping riders get the most out of their equipment.",
  },
  {
    name: "Emma Rodriguez",
    role: "Trail Experience Director",
    image: "/products/bike-3.jpg",
    bio: "Professional trail guide and bike fitting specialist.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden pt-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bike.jpg"
            alt="Mountain biking trail"
            fill
            className="object-cover brightness-[0.4]"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight">Our Story</h1>
          <div className="h-1 w-20 bg-green-500 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Founded by riders, for riders. We're here to help you find the
            perfect gear for your next trail adventure.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      </div>

      {/* Mission & Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
              <div className="md:w-2/5">
                <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/products/bike-1.jpg"
                    alt="Mountain bikers on a trail"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
              <div className="md:w-3/5">
                <h6 className="text-green-600 font-semibold mb-2 uppercase tracking-wide">Our Purpose</h6>
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <div className="h-1 w-16 bg-green-500 mb-6"></div>
                <p className="text-xl text-gray-600 leading-relaxed mb-4">
                  At Trail Blazer, we believe that every rider deserves access to
                  the best mountain biking equipment and expertise. Our mission is
                  to provide premium bikes, parts, and accessories while fostering a
                  community of passionate riders.
                </p>
                <p className="text-lg text-gray-600">
                  From our early beginnings as a garage workshop in 2010 to becoming an award-winning retailer in 2022, 
                  we've been committed to the mountain biking community.
                </p>
              </div>
            </div>
          
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Values</h2>
              <div className="h-1 w-16 bg-green-500 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div 
                  key={value.title} 
                  className="bg-gray-50 rounded-xl shadow-lg p-6"
                >
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">{value.title}</h3>
                  <p className="text-gray-600 text-center text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-800 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Hit the Trails?</h2>
          <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
            Visit our store or browse our collection online to find your perfect ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bikes"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Bikes
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
