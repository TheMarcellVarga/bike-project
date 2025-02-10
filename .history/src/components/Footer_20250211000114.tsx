import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Trail Blazer</h3>
            <p className="text-sm">
              Your premier destination for mountain bikes and accessories.
              Quality gear for every trail adventure.
            </p>
          </div>

          <div>
            <h4 className="text-white text-md font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/bikes" className="hover:text-green-400">
                  Bikes
                </Link>
              </li>
              <li>
                <Link href="/parts" className="hover:text-green-400">
                  Parts
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="hover:text-green-400">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-400">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-md font-semibold mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-green-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-green-400">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-green-400">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-green-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-md font-semibold mb-4">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-400">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-400">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-400">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} Trail Blazer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
