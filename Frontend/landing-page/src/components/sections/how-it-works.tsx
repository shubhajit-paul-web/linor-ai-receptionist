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
    title: "Customize the knowledge base",
    description: "Upload FAQs, website content, and business rules. Linor AI learns everything about your company instantly.",
  },
  {
    number: "03",
    title: "Configure actions",
    description: "Connect your CRM, calendar, and helpdesk. Tell Linor AI when to book meetings and when to escalate.",
  },
  {
    number: "04",
    title: "Go live",
    description: "Flip the switch. Linor AI starts handling calls, sending you transcripts, and driving revenue immediately.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative z-10 bg-black overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-brand-900/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <Container>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Up and running in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">
                less than 10 minutes.
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-md">
              We engineered the setup process to be as frictionless as possible. No coding, no complex workflows. Just provide the knowledge, and we handle the intelligence.
            </p>
            
            <div className="relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[23px] top-4 bottom-8 w-px bg-white/10" />
              
              <div className="space-y-10">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative pl-16"
                  >
                    <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-sm font-medium text-brand-400 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 pt-2 tracking-tight">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm p-4 md:p-8"
            >
              {/* Mockup UI representation */}
              <div className="w-full h-full rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                {/* Body */}
                <div className="flex-1 p-6 flex flex-col gap-4">
                  <div className="w-1/3 h-6 rounded-md bg-white/10 animate-pulse" />
                  <div className="space-y-2 mt-4">
                    <div className="w-full h-4 rounded-md bg-white/5" />
                    <div className="w-5/6 h-4 rounded-md bg-white/5" />
                    <div className="w-4/6 h-4 rounded-md bg-white/5" />
                  </div>
                  
                  <div className="mt-8 flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center shrink-0">
                      <div className="w-6 h-6 rounded-full bg-brand-500/50 animate-ping" />
                    </div>
                    <div className="bg-brand-900/30 border border-brand-800/50 rounded-2xl rounded-tl-none p-4 w-3/4">
                      <div className="w-full h-3 rounded bg-white/20 mb-2" />
                      <div className="w-2/3 h-3 rounded bg-white/20" />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 shrink-0" />
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tr-none p-4 w-2/3">
                      <div className="w-full h-3 rounded bg-white/20 mb-2" />
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
