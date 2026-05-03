"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const testimonials = [
  {
    quote: "Linor AI completely transformed how we handle inbound inquiries. We used to miss 30% of our calls after hours. Now, every lead is captured and qualified instantly.",
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
    quote: "Setup took literally 10 minutes. We uploaded our pricing PDF, and Linor AI started accurately quoting customers on day one. Best ROI of any software we use.",
    author: "Elena Rodriguez",
    role: "CEO, Vertex Logistics",
    avatar: "E",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 relative z-10 bg-black">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Trusted by teams that <br />
            <span className="text-gray-500">prioritize customer experience.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between"
            >
              <div className="mb-8">
                {/* 5 stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-brand-400 fill-brand-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">"{testimonial.quote}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-900/50 border border-brand-500/30 flex items-center justify-center text-brand-300 font-medium">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-medium">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
