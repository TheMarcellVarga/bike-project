"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import PartsAdvisor from "@/components/PartsAdvisor";
import StoreInitializer from "@/components/StoreInitializer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Trail Blazer - Premium Mountain Bikes & Gear</title>
        <meta name="description" content="Premium mountain bikes and gear for riders who push the limits" />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
      >
        <StoreInitializer />
        
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
