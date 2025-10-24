import type { Metadata } from "next";
import "./globals.css";
import "../styles/brand.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SentryProvider from "@/components/SentryProvider";

export const metadata: Metadata = {
  title: "Encore - Premium Men's Fashion Marketplace",
  description: "Buy and sell premium men's fashion. From designer suits to luxury sneakers. Trusted marketplace for menswear enthusiasts.",
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
                    <SentryProvider>
                      <ToastProvider>
                        <CartProvider>
                          <WatchlistProvider>
                            <Navbar />
                            <main className="min-h-screen">{children}</main>
                            <Footer />
                          </WatchlistProvider>
                        </CartProvider>
                      </ToastProvider>
                    </SentryProvider>
                  </ThemeProvider>
                  <Analytics />
                  <SpeedInsights />
                </body>
              </html>
            </ClerkProvider>
  );
}

