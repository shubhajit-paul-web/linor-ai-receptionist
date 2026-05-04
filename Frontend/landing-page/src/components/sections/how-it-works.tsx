"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const steps = [
  {
    number: "01",
    title: "Connect your number",
    description: "Port your existing business number or generate a new one. No hardware required.",
  },
  {
    number: "02",
    title: "Train the AI",
    description: "Upload FAQs, website content, and business rules. Linor learns everything instantly.",
  },
  {
    number: "03",
    title: "Configure actions",
    description: "Connect your CRM, calendar, and helpdesk. Define when to book and when to escalate.",
  },
  {
    number: "04",
    title: "Go live",
    description: "Flip the switch. Linor starts handling calls and driving revenue immediately.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: heading */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[13px] font-medium uppercase tracking-wider text-white/30 mb-4"
            >
              How it works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-gradient mb-4"
            >
              Up and running in
              <br />
              under 10 minutes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-base text-white/40 max-w-md"
            >
              We engineered the setup to be frictionless. Provide the knowledge, and we handle the intelligence.
            </motion.p>
          </div>

          {/* Right: steps */}
          <div className="space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-5 py-6 border-b border-white/[0.06] last:border-b-0 group"
              >
                <span className="text-[13px] font-mono text-white/20 pt-0.5 tabular-nums">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-[15px] font-medium text-white/90 mb-1.5 tracking-tight group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-white/35 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
