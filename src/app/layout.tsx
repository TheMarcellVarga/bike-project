import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import PartsAdvisor from "@/components/PartsAdvisor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trail Blazer - Premium Mountain Bikes & Gear",
  description: "Premium mountain bikes and gear for riders who push the limits",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <PartsAdvisor />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
