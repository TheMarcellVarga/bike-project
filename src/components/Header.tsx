"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { items } = useCartStore();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`sticky top-0 inset-x-0 z-50 transition-all duration-500 shadow-transparent ${
        isScrolled
          ? "glass-dark backdrop-blur-xl bg-black/10"
          : "bg-gradient-to-b from-black/70 via-black/30 to-transparent backdrop-blur-none"
      }`}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-white hover:text-green-400 transition-colors relative group"
          >
            Trail Blazer
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {["Bikes", "Parts", "Accessories", "About"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="relative group text-white hover:text-white/90 transition-colors"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/cart" className="relative group">
              <div className="p-2 rounded-xl hover:glass-dark transition-all duration-300">
                <ShoppingCart className="h-6 w-6 text-white group-hover:text-green-400 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-white group"
                >
                  <div className="p-2 rounded-xl hover:glass-dark transition-all duration-300 flex items-center space-x-2">
                    <User className="h-6 w-6 group-hover:text-green-400 transition-colors" />
                    <span className="group-hover:text-green-400 transition-colors">
                      {user?.name}
                    </span>
                  </div>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-2xl backdrop-blur-xl">
                    <div className="py-2 px-1.5 space-y-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 mx-1 rounded-lg hover:bg-green-400/20 transition-colors text-sm text-white hover:text-green-400"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 mx-1 rounded-lg hover:bg-green-400/20 transition-colors text-sm text-white hover:text-green-400"
                      >
                        Orders
                      </Link>
                      <div className="block mr-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 mx-1 rounded-lg hover:bg-green-400/20 transition-colors text-sm text-white hover:text-green-400"
                        >
                          <span className="w-fit">Sign out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 rounded-xl text-white hover:glass-dark transition-all duration-300 hover:text-green-400"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:glass-dark transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 glass-dark rounded-xl mt-2 backdrop-blur-xl">
            <nav className="flex flex-col space-y-2 p-2">
              {["Bikes", "Parts", "Accessories", "About"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-white hover:text-green-400 transition-colors"
                >
                  {item}
                </Link>
              ))}
              <Link
                href="/cart"
                className="text-white hover:text-green-400 transition-colors flex items-center gap-2"
              >
                Cart
                {itemCount > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2 mx-1 rounded-lg hover:bg-green-400/20 transition-colors text-white hover:text-green-400"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="px-4 py-2 mx-1 rounded-lg hover:bg-green-400/20 transition-colors text-white hover:text-green-400"
                  >
                    Orders
                  </Link>
                  <div className="flex items-center justify-between px-4 py-2 mx-1 rounded-lg hover:bg-green-400/20 transition-colors">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-white hover:text-green-400 w-full"
                    >
                      <LogOut className="h-5 w-5 ml-1" />
                      <span className="mr-2">Sign out</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 mx-1 rounded-lg hover:bg-green-400/20 transition-colors text-white hover:text-green-400"
                >
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
