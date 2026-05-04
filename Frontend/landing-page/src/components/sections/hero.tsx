"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-grid-hero min-h-screen flex flex-col items-center bg-black">
      {/* Background radial gradient to fade out grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center 30%, transparent 0%, black 80%)' }} />
      
      {/* Top subtle glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <Container className="relative z-10 w-full flex-1 flex flex-col items-center">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto w-full">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:border-brand-500/50 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden backdrop-blur-md"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/50 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            </div>
            <span className="flex items-center gap-2">
              <span className="text-white">Linor Voice is live</span>
              <span className="text-gray-500 hidden sm:inline">· Read the announcement</span>
            </span>
            <ArrowRight size={14} className="text-gray-400 ml-1 group-hover:text-white transition-colors group-hover:translate-x-0.5" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-[3.5rem] md:text-7xl lg:text-[88px] font-bold tracking-tight text-white mb-6 leading-[1.05] relative hero-text-gradient"
          >
            The front desk that <br className="hidden md:block" />
            <span className="relative inline-block px-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500">
                never sleeps.
              </span>
              <svg className="absolute w-full h-5 -bottom-2 left-0 text-brand-500/40 z-0" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M5 15Q50 5 100 10T195 15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed font-medium"
          >
            Linor is an AI receptionist that books appointments, answers patients, and handles calls — 24/7 — so your staff can focus on the people in the room.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-10"
          >
            <Button size="lg" className="w-full sm:w-auto rounded-full bg-white text-black hover:bg-gray-200 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] group transition-all h-12 px-8 font-semibold text-base">
              Get early access
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full font-semibold bg-white/5 border-white/10 text-white hover:bg-white/10 h-12 px-8 glass-panel-hover transition-all text-base">
              <Play className="mr-2 w-4 h-4 text-brand-400 fill-brand-400/20" />
              See how it works
            </Button>
          </motion.div>

          {/* Micro trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              HIPAA-conscious
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              No credit card required
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              5-min setup
            </div>
          </motion.div>

          {/* High-end Widget Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 w-full max-w-3xl mx-auto relative group [perspective:1000px]"
          >
            {/* Glow effect behind mockup */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600/30 via-brand-400/20 to-brand-600/30 rounded-[32px] blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
            
            <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-left relative z-20 ring-1 ring-white/5 animate-float transform-gpu" style={{ animationDuration: '8s' }}>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              
              <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-inner shadow-white/20 border border-brand-400/50">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Linor Assistant</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse" />
                      Active · Replies instantly
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
              </div>
              
              <div className="p-6 bg-black/40 h-64 flex flex-col gap-5 relative overflow-hidden backdrop-blur-md">
                <div className="flex justify-start">
                  <div className="glass-panel text-gray-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-lg">
                    Hi there! I'm Linor. I can help you book an appointment or answer any questions about our services.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-white text-black font-medium text-sm px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg">
                    I need to schedule a consultation for next Tuesday.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="glass-panel text-gray-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-lg border-brand-500/20 bg-brand-500/5">
                    <div className="flex gap-1.5 items-center h-5">
                      <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
                
                {/* Fade out bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
