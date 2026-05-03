"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-grid-hero min-h-screen flex flex-col items-center bg-black">
      {/* Background radial gradient to fade out grid */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/80 to-black pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, black 80%)' }} />

      <Container className="relative z-10 w-full flex-1 flex flex-col items-center">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-8 shadow-sm hover:border-brand-500/30 transition-all cursor-pointer group"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-brand-400 font-semibold">NEW</span>
            <span>Voice receptionist is in private beta</span>
            <ArrowRight size={14} className="text-gray-500 ml-1 group-hover:text-white transition-colors" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[80px] font-semibold tracking-tight text-white mb-6 leading-[1.1] relative linear-text-gradient"
          >
            The front desk that <br />
            <span className="relative inline-block text-brand-400 text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">
              never
              <svg className="absolute w-full h-4 -bottom-1 left-0 text-brand-500/50" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M5 15Q50 5 100 10T195 15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span> sleeps.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl leading-relaxed"
          >
            Linor is an AI receptionist that books appointments, answers patients, and handles calls — 24/7 — so your staff can focus on the people in the room.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            <Button size="lg" className="w-full sm:w-auto rounded-full bg-brand-600 hover:bg-brand-500 text-white border border-brand-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)] group transition-all">
              Get early access
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full font-medium bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Sparkles className="mr-2 w-4 h-4 text-brand-400" />
              See how it works
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 font-medium"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              HIPAA-conscious
            </div>
            <div className="flex items-center gap-2">
              No credit card
            </div>
            <div className="flex items-center gap-2">
              5-min setup
            </div>
          </motion.div>

          {/* Widget Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 w-full max-w-2xl mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-brand-400 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden text-left relative z-20 ring-1 ring-white/5">
              <div className="p-4 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-inner shadow-brand-400/50">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                      <line x1="8" y1="16" x2="8" y2="16" />
                      <line x1="16" y1="16" x2="16" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Linor Receptionist</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                      Online - replies in ~1.2s
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-bold tracking-widest text-brand-500/50 uppercase px-2 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
                  Live Demo
                </div>
              </div>
              <div className="p-6 bg-white/[0.01] h-48 flex flex-col gap-4 relative overflow-hidden">
                <div className="flex justify-start">
                  <div className="bg-white/10 text-gray-200 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%] border border-white/5">
                    Hi there! I'm Linor. How can I help you today?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-brand-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg shadow-brand-500/20">
                    I need to book a consultation.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white/10 text-gray-200 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%] border border-white/5">
                    <div className="flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-10" />
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
