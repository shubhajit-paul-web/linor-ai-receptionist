"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative z-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/10 px-6 py-20 text-center"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/20 to-transparent opacity-50" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to automate your <br className="hidden sm:block" /> front desk?
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Join thousands of businesses that trust Linor AI to handle their calls, capture leads, and grow their revenue.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Button size="lg" className="w-full sm:w-auto rounded-full bg-brand-600 hover:bg-brand-500 text-white border border-brand-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)] group transition-all">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full font-medium bg-white/5 border-white/10 text-white hover:bg-white/10">
                Talk to Sales
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-gray-500">
              14-day free trial. No credit card required.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
