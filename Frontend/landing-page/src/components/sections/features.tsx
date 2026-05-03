"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Calendar, MessageSquare, Clock, Zap, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: <Clock className="w-6 h-6 text-brand-400" />,
    title: "24/7 Availability",
    description: "Your business never sleeps. Linor AI handles inquiries around the clock, ensuring no opportunity is missed regardless of the timezone.",
  },
  {
    icon: <Calendar className="w-6 h-6 text-brand-400" />,
    title: "Smart Scheduling",
    description: "Seamlessly integrates with your calendar to book, reschedule, or cancel appointments without any human intervention.",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-brand-400" />,
    title: "Natural Conversations",
    description: "Powered by advanced LLMs, Linor AI understands context, nuance, and intent, providing a human-like experience.",
  },
  {
    icon: <Zap className="w-6 h-6 text-brand-400" />,
    title: "Instant Lead Qualification",
    description: "Automatically asks qualifying questions to categorize leads and route high-value prospects to your sales team.",
  },
  {
    icon: <Shield className="w-6 h-6 text-brand-400" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption and strict data privacy protocols ensure your customers' information is always protected.",
  },
  {
    icon: <Headphones className="w-6 h-6 text-brand-400" />,
    title: "Seamless Handoff",
    description: "When complex issues arise, Linor AI smoothly transfers the context and call to a human agent.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative z-10 bg-black">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Everything you need to scale <br className="hidden md:block" />
            <span className="text-gray-500">your customer experience.</span>
          </h2>
          <p className="text-lg text-gray-400">
            Designed for forward-thinking teams. Built with precision. Linor AI replaces rigid IVR systems with fluid, intelligent conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
            >
              <div className="mb-5 p-3 rounded-xl bg-white/5 inline-block border border-white/10 group-hover:border-brand-500/30 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
