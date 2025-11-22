"use client";

import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketProvider";
import "lineicons/dist/lineicons.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show Header/Footer on auth pages (they have their own layout)
  // Don't show Header/Footer on dashboard pages (they have their own layout)
  const hideHeaderFooter = pathname?.startsWith('/auth') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return (
    <body className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
            {!hideHeaderFooter && <Header />}
            <main style={{ minHeight: hideHeaderFooter ? '100vh' : 'calc(100vh - 72px - 400px)' }}>
              {children}
            </main>
            {!hideHeaderFooter && <Footer />}
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </body>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>CareConnect - Find Trusted Caregivers</title>
        <meta name="description" content="Connect with trusted caregivers for child care, senior care, pet care, and more." />
      </head>
      <RootLayoutContent>{children}</RootLayoutContent>
    </html>
  );
}
