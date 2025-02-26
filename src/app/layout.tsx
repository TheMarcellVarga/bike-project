import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Trail Blazer Bikes | Premium Mountain Bikes",
  description: "Your one-stop shop for premium mountain bikes and accessories",
};

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
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
