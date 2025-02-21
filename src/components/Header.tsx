"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { items } = useCartStore();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      clearAuth();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
            <Link href="/cart" className="hover:text-green-300 relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 hover:text-green-300"
                >
                  <User className="h-6 w-6" />
                  <span>{user?.name}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hover:text-green-300">
                Login
              </Link>
            )}
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
              <Link href="/cart" className="hover:text-green-300 flex items-center gap-2">
                Cart
                {itemCount > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="hover:text-green-300">
                    Profile
                  </Link>
                  <Link href="/orders" className="hover:text-green-300">
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-left hover:text-green-300"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/login" className="hover:text-green-300">
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
