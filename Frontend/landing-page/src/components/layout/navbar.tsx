"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Customers" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      )}
    >
      <Container className="flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <span className="text-[#09090b] font-bold text-sm leading-none">L</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Linor
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-[13px] font-medium text-white/50 hover:text-white transition-colors rounded-md hover:bg-white/[0.04]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="https://69f8418b2d5c30b7b5a15a35--dulcet-frangollo-f1dfec.netlify.app/"
            className="text-[13px] font-medium text-white/50 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Button size="sm">
            Get started
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1.5 text-white/60 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#09090b] border-t border-white/[0.06] animate-fade-in">
          <Container className="py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 px-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-white/[0.06] my-3" />
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-center">Log in</Button>
              <Button className="w-full justify-center">Get started</Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
