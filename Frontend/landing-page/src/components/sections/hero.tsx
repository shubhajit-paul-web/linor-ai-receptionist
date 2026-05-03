"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-600/30 to-transparent blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-brand-200 mb-8 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-brand-400" />
            <span>Introducing Linor AI 2.0</span>
            <span className="w-px h-3 bg-white/20 mx-1" />
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
              Read announcement <ArrowRight size={12} />
            </a>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
          >
            The intelligent voice <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-brand-600">
              for your business.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl"
          >
            Never miss a lead again. Linor AI is the smart, always-available receptionist that answers calls, schedules appointments, and qualifies leads 24/7.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto group">
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="glass" className="w-full sm:w-auto">
              <PhoneCall className="mr-2 w-4 h-4" />
              Book a Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 text-sm text-gray-500"
          >
            <p className="mb-4">Trusted by innovative teams worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Dummy logos using text for now, could be SVGs */}
              <div className="text-xl font-bold font-serif">ACME Corp</div>
              <div className="text-xl font-black tracking-tighter">GLOBAL</div>
              <div className="text-xl font-medium tracking-widest">NEXUS</div>
              <div className="text-xl font-bold italic">Horizon</div>
              <div className="text-xl font-semibold">Vertex</div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
