"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Subtle top gradient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)",
        }}
      />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Announcement badge */}
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[13px] text-white/50 mb-8 hover:bg-white/[0.06] hover:text-white/70 transition-colors cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            <span>Linor Voice is now live</span>
            <ArrowRight size={12} className="text-white/30" />
          </motion.a>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] leading-[1.1] text-gradient mb-5"
          >
            The front desk that
            <br />
            never sleeps
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-white/40 leading-relaxed max-w-xl mb-8"
          >
            Linor is an AI receptionist that books appointments, answers
            patients, and handles calls — 24/7 — so your team can focus on what
            matters.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 mb-10"
          >
            <Button size="lg" className="group">
              Get started
              <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Link href="https://69f8418b2d5c30b7b5a15a35--dulcet-frangollo-f1dfec.netlify.app/">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-4 text-[13px] text-white/30"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              HIPAA-conscious
            </div>
            <span className="text-white/10">·</span>
            <span>No credit card required</span>
            <span className="text-white/10">·</span>
            <span>5-min setup</span>
          </motion.div>

          {/* Product mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mt-16 w-full max-w-2xl mx-auto"
          >
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              {/* Window chrome */}
              <div className="px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-3 py-0.5 rounded-md bg-white/[0.04] text-[11px] text-white/20 font-mono">
                    linor.ai/assistant
                  </div>
                </div>
              </div>

              {/* Chat content */}
              <div className="p-6 space-y-4">
                {/* AI message */}
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    <div className="w-6 h-6 rounded-md bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-semibold text-brand-400">
                        L
                      </span>
                    </div>
                    <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg rounded-tl-sm px-3.5 py-2.5 text-[13px] text-white/60 leading-relaxed">
                      Hi there! I can help you book an appointment or answer any
                      questions about our services.
                    </div>
                  </div>
                </div>

                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-white text-[#09090b] text-[13px] font-medium px-3.5 py-2.5 rounded-lg rounded-tr-sm max-w-[85%] leading-relaxed">
                    I need to schedule a consultation for next Tuesday.
                  </div>
                </div>

                {/* AI typing */}
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-semibold text-brand-400">
                        L
                      </span>
                    </div>
                    <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg rounded-tl-sm px-3.5 py-3">
                      <div className="flex gap-1 items-center">
                        <div
                          className="w-1 h-1 bg-white/30 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-1 h-1 bg-white/30 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-1 h-1 bg-white/30 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
