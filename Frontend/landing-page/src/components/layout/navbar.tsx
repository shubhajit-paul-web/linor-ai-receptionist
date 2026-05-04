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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isScrolled ? "pt-4" : "pt-6"
      )}
    >
      <Container className="flex justify-center">
        <div 
          className={cn(
            "flex items-center justify-between w-full max-w-5xl transition-all duration-500 rounded-full",
            isScrolled 
              ? "px-6 py-3 glass-panel shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
              : "px-2 py-2 bg-transparent"
          )}
        >
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden transition-all bg-white/5 border border-white/10 group-hover:border-brand-500/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <div className="w-4 h-4 rounded-tl-full rounded-bl-full rounded-br-full border-[3px] border-white group-hover:border-brand-300 transition-colors" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-400 transition-all duration-300">
                Linor.
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#product" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Product
            </Link>
            <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              How it works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="#signin" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Button className="rounded-full bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] h-9 px-5 text-sm font-semibold">
              Get early access
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 glass-panel rounded-2xl p-4 flex flex-col gap-2 shadow-2xl animate-fade-in-up origin-top">
          <Link 
            href="#product" 
            className="p-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Product
          </Link>
          <Link 
            href="#features" 
            className="p-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            className="p-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it works
          </Link>
          <Link 
            href="#pricing" 
            className="p-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <div className="h-px bg-white/10 my-2" />
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10 rounded-xl h-11">Sign in</Button>
            <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-xl h-11 font-semibold">Get early access</Button>
          </div>
        </div>
      )}
    </header>
  );
}
