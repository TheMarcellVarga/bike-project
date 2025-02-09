'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Slider, Search, Filter } from 'lucide-react'

const bikes = [
  {
    id: 1,
    name: 'Trail Master Pro',
    price: 2499.99,
    category: 'Trail',
    image: '/products/bike-1.jpg',
    description: 'Advanced trail bike with full suspension and modern geometry',
    specs: {
      frame: 'Carbon Fiber',
      suspension: '150mm Travel',
      groupset: 'SRAM GX Eagle',
    }
  },
  {
    id: 2,
    name: 'Enduro Beast',
    price: 3299.99,
    category: 'Enduro',
    image: '/products/bike-2.jpg',
    description: 'Built for aggressive riding and technical descents',
    specs: {
      frame: 'Aluminum Alloy',
      suspension: '170mm Travel',
      groupset: 'Shimano XT',
    }
  },
  {
    id: 3,
    name: 'XC Rocket',
    price: 1899.99,
    category: 'Cross Country',
    image: '/products/bike-3.jpg',
    description: 'Lightweight and fast for cross-country racing and trails',
    specs: {
      frame: 'Carbon Fiber',
      suspension: '100mm Travel',
      groupset: 'SRAM NX',
    }
  },
  {
    id: 4,
    name: 'Downhill Demon',
    price: 4499.99,
    category: 'Downhill',
    image: '/products/bike-4.jpg',
    description: 'Professional grade downhill bike for extreme terrain',
    specs: {
      frame: 'Carbon Fiber',
      suspension: '200mm Travel',
      groupset: 'Shimano Saint',
    }
  },
]

const categories = ['All', 'Trail', 'Enduro', 'Cross Country', 'Downhill']
const priceRanges = ['All', '$0-$2000', '$2000-$3000', '$3000-$4000', '$4000+']

export default function BikesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredBikes = bikes.filter(bike => {
    const matchesCategory = selectedCategory === 'All' || bike.category === selectedCategory
    const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bike.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesPrice = true
    if (selectedPriceRange !== 'All') {
      const price = bike.price
      if (selectedPriceRange === '$0-$2000') matchesPrice = price <= 2000
      else if (selectedPriceRange === '$2000-$3000') matchesPrice = price > 2000 && price <= 3000
      else if (selectedPriceRange === '$3000-$4000') matchesPrice = price > 3000 && price <= 4000
      else if (selectedPriceRange === '$4000+') matchesPrice = price > 4000
    }

    return matchesCategory && matchesSearch && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Mountain Bikes</h1>
          <p className="text-lg text-green-100">Find your perfect ride for any trail</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search bikes..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
          <div className={`md:w-64 space-y-6 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
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
              {filteredBikes.map((bike) => (
                <div
                  key={bike.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-64">
                    <Image
                      src={bike.image}
                      alt={bike.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{bike.name}</h3>
                      <span className="text-lg font-semibold text-green-600">
                        ${bike.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{bike.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Frame</span>
                        <span className="font-medium">{bike.specs.frame}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Suspension</span>
                        <span className="font-medium">{bike.specs.suspension}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Groupset</span>
                        <span className="font-medium">{bike.specs.groupset}</span>
                      </div>
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
  )
} 