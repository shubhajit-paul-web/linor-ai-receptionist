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
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto group shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
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
