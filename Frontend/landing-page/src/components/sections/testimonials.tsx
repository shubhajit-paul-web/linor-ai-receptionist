"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const testimonials = [
  {
    quote: "Linor completely transformed how we handle inbound inquiries. We used to miss 30% of our calls after hours. Now, every lead is captured instantly.",
    author: "Sarah Jenkins",
    role: "Operations Director",
    company: "Horizon Real Estate",
  },
  {
    quote: "Our clients genuinely think they're speaking to a human. The natural language processing is incredible. It's increased our booking rate by 45%.",
    author: "Dr. Marcus Chen",
    role: "Founder",
    company: "Apex Dental Group",
  },
  {
    quote: "Setup took literally 10 minutes. We uploaded our pricing PDF, and Linor started accurately quoting customers on day one. Best ROI of any tool we use.",
    author: "Elena Rodriguez",
    role: "CEO",
    company: "Vertex Logistics",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <Container>
        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[13px] font-medium uppercase tracking-wider text-white/30 mb-4"
          >
            Customers
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-gradient"
          >
            Trusted by teams that
            <br />
            <span className="text-white/40">prioritize experience</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden border border-white/[0.06]">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-[#09090b] p-8 flex flex-col justify-between"
            >
              <p className="text-[15px] text-white/60 leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[13px] font-medium text-white/50">
                  {t.author[0]}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-white/80">{t.author}</p>
                  <p className="text-[12px] text-white/30">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
