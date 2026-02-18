import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Benjamin Stevens Digital Studio",
  description: "AI Video Generation Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-marketing-dark text-slate-200 antialiased selection:bg-marketing-accent selection:text-white`}>
        {children}
      </body>
    </html>
  );
}