"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const steps = [
  {
    number: "01",
    title: "Connect your number",
    description: "Port your existing business number or generate a new one in seconds. No hardware required.",
  },
  {
    number: "02",
    title: "Train the AI",
    description: "Upload FAQs, website content, and business rules. Linor learns everything about your company instantly.",
  },
  {
    number: "03",
    title: "Configure actions",
    description: "Connect your CRM, calendar, and helpdesk. Tell Linor when to book meetings and when to escalate.",
  },
  {
    number: "04",
    title: "Go live",
    description: "Flip the switch. Linor starts handling calls, sending you transcripts, and driving revenue immediately.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 relative z-10 bg-black overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-brand-900/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Container>
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="px-3 py-1 inline-block text-xs font-semibold tracking-wide uppercase text-white bg-white/10 border border-white/20 rounded-full mb-6"
            >
              Deployment
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight hero-text-gradient leading-[1.1]">
              Up and running in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500">
                less than 10 minutes.
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-md font-medium">
              We engineered the setup process to be frictionless. No complex workflows. Just provide the knowledge, and we handle the intelligence.
            </p>
            
            <div className="relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[23px] top-4 bottom-8 w-px bg-gradient-to-b from-brand-500 via-white/10 to-transparent" />
              
              <div className="space-y-12">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative pl-16 group"
                  >
                    <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-sm font-semibold text-gray-400 group-hover:text-brand-400 group-hover:border-brand-500/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 z-10 bg-black">
                      {index === 0 && <div className="absolute inset-0 rounded-full border border-brand-500 animate-ping opacity-20" />}
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2 pt-1.5 tracking-tight group-hover:text-brand-300 transition-colors">{step.title}</h3>
                    <p className="text-gray-400 text-base leading-relaxed font-medium">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl lg:max-w-none perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateY: 10, scale: 0.9 }}
              whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 glass-panel p-2 md:p-4 shadow-2xl transform-gpu"
            >
              {/* Mockup UI representation */}
              <div className="w-full h-full rounded-2xl bg-[#050505] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative">
                {/* Header */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-white/[0.02]">
                  <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-red-500/80 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-yellow-500/80 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-green-500/80 transition-colors" />
                </div>
                {/* Body */}
                <div className="flex-1 p-8 flex flex-col gap-6 relative overflow-hidden bg-dot-pattern">
                  {/* Subtle fade overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />

                  <div className="relative z-10 w-1/3 h-8 rounded-lg bg-white/5 border border-white/10 animate-pulse" />
                  <div className="relative z-10 space-y-3 mt-4">
                    <div className="w-full h-4 rounded-md bg-white/5 border border-white/5" />
                    <div className="w-5/6 h-4 rounded-md bg-white/5 border border-white/5" />
                    <div className="w-4/6 h-4 rounded-md bg-white/5 border border-white/5" />
                  </div>
                  
                  <div className="relative z-10 mt-12 flex gap-4 items-end">
                    <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                      <div className="w-6 h-6 rounded-full bg-brand-400 animate-pulse" />
                    </div>
                    <div className="glass-panel border-brand-800/50 rounded-2xl rounded-bl-none p-5 w-3/4">
                      <div className="w-full h-3 rounded bg-white/20 mb-3" />
                      <div className="w-2/3 h-3 rounded bg-white/20" />
                    </div>
                  </div>
                  
                  <div className="relative z-10 mt-6 flex gap-4 flex-row-reverse items-end">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 shrink-0" />
                    <div className="glass-panel border-white/10 rounded-2xl rounded-br-none p-5 w-2/3">
                      <div className="w-full h-3 rounded bg-white/20 mb-3" />
                      <div className="w-1/2 h-3 rounded bg-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
