"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "Linor completely transformed how we handle inbound inquiries. We used to miss 30% of our calls after hours. Now, every lead is captured and qualified instantly.",
    author: "Sarah Jenkins",
    role: "Operations Director, Horizon Real Estate",
    avatar: "S",
  },
  {
    quote: "The natural language processing is incredible. Our clients genuinely think they are speaking to a human receptionist. It's increased our booking rate by 45%.",
    author: "Dr. Marcus Chen",
    role: "Founder, Apex Dental Group",
    avatar: "M",
  },
  {
    quote: "Setup took literally 10 minutes. We uploaded our pricing PDF, and Linor started accurately quoting customers on day one. Best ROI of any software we use.",
    author: "Elena Rodriguez",
    role: "CEO, Vertex Logistics",
    avatar: "E",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 relative z-10 bg-black overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight hero-text-gradient"
          >
            Trusted by teams that <br />
            <span className="text-gray-500">prioritize experience.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel rounded-3xl p-8 flex flex-col justify-between group glass-panel-hover transition-all duration-500 relative overflow-hidden"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 mb-8">
                {/* 5 stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.svg 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + (index * 0.1) + (i * 0.05) }}
                      className="w-5 h-5 text-brand-400 fill-brand-400" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed font-medium">"{testimonial.quote}"</p>
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-800 to-brand-950 border border-brand-500/30 flex items-center justify-center text-white font-semibold shadow-inner">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold tracking-tight">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500 font-medium">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
