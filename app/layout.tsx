import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cirqle",
  description: "Organize and share your applications with Cirqle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-50 text-gray-900">
      <body
        className={`font-sans text-base ${geistSans.variable} ${geistMono.variable} bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
