"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter } from "lucide-react";

const accessories = [
  {
    id: 1,
    name: "Pro Trail Helmet",
    price: 179.99,
    category: "Protection",
    subCategory: "Helmets",
    image: "/products/accessory-1.jpg",
    description:
      "Advanced protection with MIPS technology and optimal ventilation",
    specs: {
      weight: "380g",
      certification: "CE/CPSC",
      ventilation: "20 vents",
    },
  },
  {
    id: 2,
    name: "Trail Rider Pack",
    price: 129.99,
    category: "Storage",
    subCategory: "Backpacks",
    image: "/products/accessory-2.jpg",
    description: "Hydration-compatible pack with tool storage and armor carry",
    specs: {
      capacity: "20L",
      waterproof: "Yes",
      hydration: "3L Compatible",
    },
  },
  {
    id: 3,
    name: "MTB Tech Jersey",
    price: 69.99,
    category: "Clothing",
    subCategory: "Jerseys",
    image: "/products/accessory-1.jpg",
    description:
      "Moisture-wicking fabric with UV protection and ventilated design",
    specs: {
      material: "Polyester Blend",
      fit: "Athletic",
      protection: "UPF 50+",
    },
  },
  {
    id: 4,
    name: "Pro Tool Kit",
    price: 149.99,
    category: "Maintenance",
    subCategory: "Tools",
    image: "/products/accessory-2.jpg",
    description: "Complete toolkit for trail-side repairs and maintenance",
    specs: {
      pieces: "23 tools",
      case: "Hard Shell",
      weight: "1.2 kg",
    },
  },
];

const categories = [
  "All",
  "Protection",
  "Storage",
  "Clothing",
  "Maintenance",
  "Electronics",
];
const priceRanges = ["All", "$0-$50", "$50-$100", "$100-$150", "$150+"];
const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Name: A-Z",
];

export default function AccessoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAccessories = accessories
    .filter((accessory) => {
      const matchesCategory =
        selectedCategory === "All" || accessory.category === selectedCategory;
      const matchesSearch =
        accessory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        accessory.description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesPrice = true;
      if (selectedPriceRange !== "All") {
        const price = accessory.price;
        if (selectedPriceRange === "$0-$50") matchesPrice = price <= 50;
        else if (selectedPriceRange === "$50-$100")
          matchesPrice = price > 50 && price <= 100;
        else if (selectedPriceRange === "$100-$150")
          matchesPrice = price > 100 && price <= 150;
        else if (selectedPriceRange === "$150+") matchesPrice = price > 150;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Gear & Accessories</h1>
          <p className="text-lg text-green-100">
            Essential equipment for your mountain biking adventures
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search accessories..."
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
              {filteredAccessories.map((accessory) => (
                <div
                  key={accessory.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={accessory.image}
                      alt={accessory.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{accessory.name}</h3>
                        <p className="text-sm text-gray-500">
                          {accessory.subCategory}
                        </p>
                      </div>
                      <span className="text-lg font-semibold text-green-600">
                        ${accessory.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {accessory.description}
                    </p>
                    <div className="space-y-2">
                      {Object.entries(accessory.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-500 capitalize">
                            {key}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
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
