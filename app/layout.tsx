import type { Metadata } from "next";
import "./globals.css";
import "../styles/brand.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: "SAPS - Men's Premium Accessories Resale",
  description: "Discover premium men's ties, accessories, and essentials. Buy and sell authenticated luxury items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
            <ClerkProvider
              signInFallbackRedirectUrl="/"
              signUpFallbackRedirectUrl="/"
            >
                     <html lang="en" suppressHydrationWarning>
                       <body className="antialiased bg-ink text-porcelain" suppressHydrationWarning>
                  <ThemeProvider>
                    <CartProvider>
                      <WatchlistProvider>
                        <Navbar />
                        <main className="min-h-screen">{children}</main>
                        <Footer />
                      </WatchlistProvider>
                    </CartProvider>
                  </ThemeProvider>
                </body>
              </html>
            </ClerkProvider>
  );
}

