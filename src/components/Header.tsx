"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 inset-x-0 bg-green-800 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight hover:text-green-300"
          >
            Trail Blazer
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/bikes" className="hover:text-green-300">
              Bikes
            </Link>
            <Link href="/parts" className="hover:text-green-300">
              Parts
            </Link>
            <Link href="/accessories" className="hover:text-green-300">
              Accessories
            </Link>
            <Link href="/about" className="hover:text-green-300">
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="hover:text-green-300">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link href="/login" className="hover:text-green-300">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/bikes" className="hover:text-green-300">
                Bikes
              </Link>
              <Link href="/parts" className="hover:text-green-300">
                Parts
              </Link>
              <Link href="/accessories" className="hover:text-green-300">
                Accessories
              </Link>
              <Link href="/about" className="hover:text-green-300">
                About
              </Link>
              <Link href="/cart" className="hover:text-green-300">
                Cart
              </Link>
              <Link href="/login" className="hover:text-green-300">
                Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
