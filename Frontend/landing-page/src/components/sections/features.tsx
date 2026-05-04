"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Calendar, MessageSquare, Clock, Zap, Shield, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Clock className="w-5 h-5 text-white" />,
    title: "Always Available",
    description: "Your business never sleeps. Linor handles inquiries 24/7, ensuring no opportunity is missed regardless of timezone or holidays.",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-brand-400" />,
    title: "Natural Conversations",
    description: "Powered by advanced LLMs, Linor understands context, nuance, and intent with human-like latency.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    icon: <Calendar className="w-5 h-5 text-brand-400" />,
    title: "Smart Scheduling",
    description: "Seamlessly integrates with your calendar to book, reschedule, or cancel appointments.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    icon: <Zap className="w-5 h-5 text-brand-400" />,
    title: "Instant Qualification",
    description: "Automatically asks qualifying questions to categorize leads and route high-value prospects.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    icon: <Shield className="w-5 h-5 text-brand-400" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption and strict data privacy protocols ensure your customers' information is protected.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    icon: <Headphones className="w-5 h-5 text-white" />,
    title: "Seamless Handoff",
    description: "When complex issues arise, Linor smoothly transfers the context and call to a human agent, preventing frustration.",
    className: "md:col-span-2 md:row-span-1",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 relative z-10 bg-black overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-900/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
      
      <Container>
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3 py-1 text-xs font-semibold tracking-wide uppercase text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-full mb-6"
          >
            Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight hero-text-gradient"
          >
            Engineered for scale. <br className="hidden md:block" />
            Designed for humans.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 font-medium max-w-2xl"
          >
            Replace rigid IVR menus with fluid, intelligent conversations. Linor combines enterprise-grade reliability with state-of-the-art AI.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[220px]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "glass-panel rounded-3xl p-8 flex flex-col justify-between group glass-panel-hover relative overflow-hidden transition-all duration-500",
                feature.className
              )}
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="mb-6 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-500/20 group-hover:border-brand-500/40 transition-colors duration-500 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight group-hover:text-brand-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm font-medium group-hover:text-gray-300 transition-colors duration-300 max-w-[90%]">
                  {feature.description}
                </p>
              </div>
              
              {/* If it's a large card, we can add a decorative element */}
              {feature.className.includes('col-span-2') && (
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-colors duration-500 pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
