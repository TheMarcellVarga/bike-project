"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import PartsAdvisor from '@/components/PartsAdvisor';

const parts = [
  {
    id: 1,
    name: "Fox 36 Factory Fork",
    price: 999.99,
    category: "Suspension",
    subCategory: "Forks",
    image: "/products/parts-1.jpg",
    description: "High-performance trail fork with GRIP2 damper",
    specs: {
      travel: "160mm",
      weight: "1.9 kg",
      axle: "15x110mm",
    },
  },
  {
    id: 2,
    name: "SRAM XX1 Eagle Drivetrain",
    price: 799.99,
    category: "Drivetrain",
    subCategory: "Groupsets",
    image: "/products/parts-2.jpg",
    description: "Premium 12-speed drivetrain system",
    specs: {
      speeds: "12-speed",
      weight: "1.5 kg",
      material: "Carbon/Alloy",
    },
  },
  {
    id: 3,
    name: "RockShox Super Deluxe Ultimate",
    price: 599.99,
    category: "Suspension",
    subCategory: "Rear Shocks",
    image: "/products/parts-1.jpg",
    description: "Advanced rear shock for trail and enduro",
    specs: {
      travel: "210x55mm",
      weight: "0.4 kg",
      damping: "Hydraulic",
    },
  },
  {
    id: 4,
    name: "Shimano XTR M9100 Brakes",
    price: 449.99,
    category: "Brakes",
    subCategory: "Disc Brakes",
    image: "/products/parts-2.jpg",
    description: "Race-proven hydraulic disc brakes",
    specs: {
      type: "Hydraulic",
      weight: "0.4 kg",
      rotor: "180mm",
    },
  },
];

const categories = [
  "All",
  "Suspension",
  "Drivetrain",
  "Brakes",
  "Wheels",
  "Cockpit",
];
const priceRanges = ["All", "$0-$250", "$250-$500", "$500-$750", "$750+"];
const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Name: A-Z",
];

export default function PartsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { addItem } = useCartStore();

  const filteredParts = parts
    .filter((part) => {
      const matchesCategory =
        selectedCategory === "All" || part.category === selectedCategory;
      const matchesSearch =
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesPrice = true;
      if (selectedPriceRange !== "All") {
        const price = part.price;
        if (selectedPriceRange === "$0-$250") matchesPrice = price <= 250;
        else if (selectedPriceRange === "$250-$500")
          matchesPrice = price > 250 && price <= 500;
        else if (selectedPriceRange === "$500-$750")
          matchesPrice = price > 500 && price <= 750;
        else if (selectedPriceRange === "$750+") matchesPrice = price > 750;
      }

      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Price: Low to High":
          return a.price - b.price;
        case "Price: High to Low":
          return b.price - a.price;
        case "Name: A-Z":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PartsAdvisor />
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search parts..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div
            className={`md:w-64 space-y-6 ${
              isFilterOpen ? "block" : "hidden md:block"
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="text-green-600 focus:ring-green-500"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === range}
                      onChange={() => setSelectedPriceRange(range)}
                      className="text-green-600 focus:ring-green-500"
                    />
                    {range}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredParts.map((part) => (
                <div
                  key={part.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={part.image}
                      alt={part.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{part.name}</h3>
                        <p className="text-sm text-gray-500">
                          {part.subCategory}
                        </p>
                      </div>
                      <span className="text-lg font-semibold text-green-600">
                        ${part.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{part.description}</p>
                    <div className="space-y-2">
                      {Object.entries(part.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-500 capitalize">
                            {key}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => addItem({
                        id: part.id.toString(),
                        name: part.name,
                        price: part.price,
                        image: part.image
                      })}
                      className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
