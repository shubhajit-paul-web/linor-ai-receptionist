"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-black/60 backdrop-blur-md border-white/10 py-3"
          : "bg-transparent py-5"
      )}
    >
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden transition-all group-hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] shadow-[0_0_10px_rgba(147,51,234,0.2)] bg-white/10">
              <img src="/hero.png" alt="Linor AI Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              Linor AI
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">
            How it works
          </Link>
          <Link href="#use-cases" className="text-sm text-gray-300 hover:text-white transition-colors">
            Use Cases
          </Link>
          <Link href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white">
            Log in
          </Button>
          <Button>Get Started</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl">
          <Link 
            href="#features" 
            className="p-2 text-gray-300 hover:text-white transition-colors border-b border-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            className="p-2 text-gray-300 hover:text-white transition-colors border-b border-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it works
          </Link>
          <Link 
            href="#use-cases" 
            className="p-2 text-gray-300 hover:text-white transition-colors border-b border-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Use Cases
          </Link>
          <Link 
            href="#pricing" 
            className="p-2 text-gray-300 hover:text-white transition-colors border-b border-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" className="w-full">Log in</Button>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      )}
    </header>
  );
}
