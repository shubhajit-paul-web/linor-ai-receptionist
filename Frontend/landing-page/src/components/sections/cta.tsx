"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-32 relative z-10 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-[3rem] overflow-hidden glass-panel border border-white/10 px-6 py-24 text-center shadow-2xl"
        >
          {/* Top border beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-500/80 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[2px] bg-brand-400 blur-[2px]" />
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-white/20"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight hero-text-gradient leading-[1.1]">
              Ready to automate <br className="hidden sm:block" /> your front desk?
            </h2>
            <p className="text-xl text-gray-400 mb-10 font-medium max-w-xl">
              Join forward-thinking businesses that trust Linor to handle calls, capture leads, and grow revenue 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Button size="lg" className="w-full sm:w-auto rounded-full bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] h-14 px-10 font-semibold text-lg group">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full font-semibold bg-white/5 border-white/10 text-white hover:bg-white/10 h-14 px-10 glass-panel-hover transition-all text-lg">
                Talk to Sales
              </Button>
            </div>
            
            <p className="mt-8 text-sm text-gray-500 font-medium">
              14-day free trial. No credit card required.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
