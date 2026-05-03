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
  title: "Linor AI | The Intelligent Receptionist Platform",
  description: "Never miss a lead again. Linor AI is the smart, always-available receptionist that handles calls, schedules appointments, and qualifies leads.",
  keywords: ["AI Receptionist", "Virtual Assistant", "Call Handling", "Lead Qualification", "Linor AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth bg-black text-white antialiased selection:bg-brand-500 selection:text-white`}
    >
      <body className="flex min-h-screen flex-col font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
