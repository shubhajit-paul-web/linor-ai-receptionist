"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 md:py-20 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-gradient mb-4">
              Ready to automate
              <br />
              your front desk?
            </h2>
            <p className="text-base text-white/40 mb-8 max-w-md mx-auto">
              Join forward-thinking businesses that trust Linor to handle calls, capture leads, and grow revenue.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="group">
                Start free trial
                <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button size="lg" variant="outline">
                Talk to sales
              </Button>
            </div>
            <p className="mt-6 text-[13px] text-white/25">
              14-day free trial · No credit card required
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
