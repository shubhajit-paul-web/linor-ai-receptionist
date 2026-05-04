"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Calendar, MessageSquare, Clock, Zap, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Always available",
    description: "Your business never sleeps. Linor handles inquiries 24/7, ensuring no opportunity is missed.",
  },
  {
    icon: MessageSquare,
    title: "Natural conversations",
    description: "Powered by advanced LLMs. Linor understands context, nuance, and intent with human-like accuracy.",
  },
  {
    icon: Calendar,
    title: "Smart scheduling",
    description: "Integrates with your calendar to book, reschedule, or cancel appointments automatically.",
  },
  {
    icon: Zap,
    title: "Lead qualification",
    description: "Automatically asks qualifying questions to categorize and route high-value prospects.",
  },
  {
    icon: Shield,
    title: "Enterprise security",
    description: "Bank-grade encryption and strict data privacy protocols protect your customers' information.",
  },
  {
    icon: Headphones,
    title: "Seamless handoff",
    description: "When complex issues arise, Linor smoothly transfers context and the call to a human agent.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <Container>
        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[13px] font-medium uppercase tracking-wider text-brand-400 mb-4"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-gradient mb-4"
          >
            Engineered for scale.
            <br />
            Designed for humans.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-base text-white/40 max-w-lg"
          >
            Replace rigid IVR menus with fluid, intelligent conversations that feel natural.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden border border-white/[0.06]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-[#09090b] p-8 group hover:bg-white/[0.02] transition-colors duration-300"
              >
                <div className="mb-4 w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-brand-500/10 group-hover:border-brand-500/20 transition-colors duration-300">
                  <Icon className="w-[18px] h-[18px] text-white/40 group-hover:text-brand-400 transition-colors duration-300" />
                </div>
                <h3 className="text-[15px] font-medium text-white/90 mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[13px] text-white/35 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
