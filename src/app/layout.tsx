"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientLayout from "@/components/ClientLayout";
import PartsAdvisor from "@/components/PartsAdvisor";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
      >
        <ClientLayout>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <PartsAdvisor />
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
