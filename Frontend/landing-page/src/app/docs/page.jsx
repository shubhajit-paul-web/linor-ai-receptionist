"use client";

import { useState } from "react";
import { Book, Terminal, Settings, Key, Menu, X, CheckCircle, Copy, ExternalLink, ArrowRight, Zap, MessageSquare, Calendar, Brain, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Link from "next/link";

const DOC_SECTIONS = [
  { id: "howitworks", label: "How It Works", icon: Zap },
  { id: "quickstart", label: "Quick Start", icon: Book },
  { id: "configuration", label: "Train Your AI", icon: Brain },
  { id: "integration", label: "Embed Widget", icon: Globe },
  { id: "api", label: "Appointments & API", icon: Key },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("howitworks");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Mock Data
  const mockApiKey = "sk_live_linor_7b82f9a3c4e5d61209";
  
  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const widgetCode = `<!-- Linor AI Receptionist Widget -->
<script 
  src="https://cdn.linor.ai/widget.js" 
  data-api-key="${mockApiKey}" 
  defer>
</script>`;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col md:flex-row pt-14">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/[0.06] bg-[#09090b]">
          <span className="text-lg font-bold text-white">Documentation</span>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:sticky top-14 md:top-0 left-0 z-40 h-[calc(100vh-56px)] md:h-screen w-64 border-r border-white/[0.06] bg-[#09090b] p-6 flex flex-col transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <nav className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase text-white/40 mb-3 tracking-wider ml-2">
              Documentation
            </p>
            {DOC_SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveSection(id);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  activeSection === id
                    ? "bg-white/10 text-white border border-brand-600/50"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Icon
                  size={18}
                  className={activeSection === id ? "text-brand-500" : "text-white/40"}
                />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 py-8 md:py-12 px-6 md:px-12 overflow-y-auto">
          {activeSection === "howitworks" && (
            <div className="max-w-4xl animate-fade-in-up">
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">How Linor Works</h1>
                <p className="text-lg text-white/70 leading-relaxed">
                  Linor AI is an intelligent receptionist that handles patient calls and inquiries 24/7. Here's the complete flow from setup to live operations.
                </p>
              </div>

              {/* Main Flow Diagram */}
              <div className="space-y-6 mb-12">
                {/* Step 1 */}
                <div className="relative">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-brand-500/20 border-2 border-brand-500 flex items-center justify-center text-brand-400 font-bold text-xl flex-shrink-0">
                        1
                      </div>
                      <div className="w-0.5 h-24 bg-gradient-to-b from-brand-500 to-transparent mt-2" />
                    </div>
                    <div className="pt-1 flex-1">
                      <h3 className="text-xl font-bold mb-2">Configure Your Clinic</h3>
                      <p className="text-white/70 mb-4">
                        Set up your clinic information: business hours, services, contact details, and upload your logo. This tells the AI who you are and when you're available.
                      </p>
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 space-y-2">
                        <p className="text-sm text-white/60 flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-400" /> Business hours & schedule
                        </p>
                        <p className="text-sm text-white/60 flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-400" /> Services you offer
                        </p>
                        <p className="text-sm text-white/60 flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-400" /> Contact information
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xl flex-shrink-0">
                        2
                      </div>
                      <div className="w-0.5 h-24 bg-gradient-to-b from-emerald-500 to-transparent mt-2" />
                    </div>
                    <div className="pt-1 flex-1">
                      <h3 className="text-xl font-bold mb-2">Train the AI with FAQs</h3>
                      <p className="text-white/70 mb-4">
                        Add your most common patient questions and answers. This is your knowledge base. The smarter your FAQs, the better the AI responds to patients.
                      </p>
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 space-y-2">
                        <p className="text-sm text-white/60 flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-400" /> "How do I schedule an appointment?"
                        </p>
                        <p className="text-sm text-white/60 flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-400" /> "What insurance do you accept?"
                        </p>
                        <p className="text-sm text-white/60 flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-400" /> "What are your cancellation policies?"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 font-bold text-xl flex-shrink-0">
                        3
                      </div>
                      <div className="w-0.5 h-24 bg-gradient-to-b from-blue-500 to-transparent mt-2" />
                    </div>
                    <div className="pt-1 flex-1">
                      <h3 className="text-xl font-bold mb-2">Embed on Your Website</h3>
                      <p className="text-white/70 mb-4">
                        Copy a single line of code and paste it on your website. The chat widget appears in seconds, ready to help visitors 24/7.
                      </p>
                      <div className="bg-black/30 border border-white/[0.08] rounded-lg p-4 font-mono text-xs text-white/80 overflow-x-auto">
                        &lt;script src="cdn.linor.ai/widget.js" data-api-key="..."&gt;&lt;/script&gt;
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-purple-400 font-bold text-xl flex-shrink-0">
                        4
                      </div>
                      <div className="w-0.5 h-24 bg-gradient-to-b from-purple-500 to-transparent mt-2" />
                    </div>
                    <div className="pt-1 flex-1">
                      <h3 className="text-xl font-bold mb-2">Patient Interaction Begins</h3>
                      <p className="text-white/70 mb-4">
                        When a patient visits your site, they see the chat widget. They can ask questions, and the AI responds instantly using your knowledge base.
                      </p>
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4">
                        <div className="text-sm space-y-3">
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-white/70 text-xs">Patient: "Are you open tomorrow?"</p>
                          </div>
                          <div className="bg-brand-500/10 rounded p-2 border border-brand-500/20">
                            <p className="text-white text-xs">AI: "Yes! We're open 9 AM to 5 PM tomorrow."</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-pink-500/20 border-2 border-pink-500 flex items-center justify-center text-pink-400 font-bold text-xl flex-shrink-0">
                        5
                      </div>
                    </div>
                    <div className="pt-1 flex-1">
                      <h3 className="text-xl font-bold mb-2">Booking & Lead Capture</h3>
                      <p className="text-white/70 mb-4">
                        When patients want to book an appointment or need personalized help, the AI collects their info and creates an appointment in your system.
                      </p>
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 space-y-2">
                        <p className="text-sm text-white/60 flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-400" /> Automated appointment booking
                        </p>
                        <p className="text-sm text-white/60 flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-400" /> Lead qualification
                        </p>
                        <p className="text-sm text-white/60 flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-400" /> Instant notifications to your team
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Benefits Box */}
              <div className="bg-gradient-to-br from-brand-500/10 to-brand-500/5 border border-brand-500/30 rounded-lg p-6 md:p-8">
                <h3 className="text-xl font-bold mb-4">Why This Matters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="text-brand-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-white">Never Miss a Lead</p>
                      <p className="text-sm text-white/60">Available 24/7, even outside business hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-white">Instant Responses</p>
                      <p className="text-sm text-white/60">Patients get answers immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-white">Auto-Booking</p>
                      <p className="text-sm text-white/60">Appointments scheduled without human intervention</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-white">Always Learning</p>
                      <p className="text-sm text-white/60">AI improves as you add more FAQs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "quickstart" && (
            <div className="max-w-3xl animate-fade-in-up">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Quick Start</h1>
                <p className="text-lg text-white/70 leading-relaxed">
                  Welcome to the Linor developer documentation. This guide will walk you through
                  setting up your clinic's AI receptionist and embedding it on your website in
                  minutes.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 md:p-8 mb-8 hover:bg-white/[0.05] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-brand-500/10 text-brand-400 p-2 rounded-lg">
                    <Key size={20} />
                  </div>
                  <h3 className="text-xl font-bold">1. Get your API Key</h3>
                </div>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Your API key authenticates the chat widget with your specific clinic's
                  knowledge base. You can find this in your provider dashboard under{" "}
                  <strong className="text-white/90">Settings &gt; API Security</strong>.
                </p>

                <div className="bg-black/20 border border-white/[0.06] rounded-lg p-1">
                  <div className="flex items-center justify-between bg-black/30 border border-white/[0.08] rounded-md px-4 py-3">
                    <span className="font-mono text-sm text-white/80">{mockApiKey}</span>
                    <button
                      onClick={() => handleCopyCode(mockApiKey)}
                      className="flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 py-1.5 px-3 rounded border border-white/[0.1]"
                    >
                      {copied ? (
                        <CheckCircle size={14} className="text-emerald-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.05] transition-colors">
                  <div className="w-12 h-12 bg-brand-500/10 rounded-lg flex items-center justify-center text-brand-400 mb-4 border border-brand-500/20">
                    <Settings size={24} />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Clinic Settings</h4>
                  <p className="text-white/60 leading-relaxed">
                    Set your working hours, contact info, and custom branding for the chat
                    widget to match your website.
                  </p>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.05] transition-colors">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                    <Book size={24} />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Knowledge Base (FAQs)</h4>
                  <p className="text-white/60 leading-relaxed">
                    Add common questions. The AI ingests these rules to answer patient queries
                    instantly and accurately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "configuration" && (
            <div className="max-w-3xl animate-fade-in-up">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Train Your AI
                </h1>
                <p className="text-lg text-white/70 leading-relaxed">
                  The quality of your AI receptionist depends on how well you train it. Here's how to build a knowledge base that makes your AI smarter.
                </p>
              </div>

              <div className="space-y-6">
                {/* FAQ Training */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 md:p-8 hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 flex-shrink-0">
                      <Brain size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Build Your Knowledge Base</h3>
                      <p className="text-sm text-white/60">FAQs are the foundation. The more comprehensive your answers, the better the AI responds.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
                      <p className="text-sm font-semibold text-white mb-2">Good FAQ Example:</p>
                      <div className="space-y-2">
                        <p className="text-xs text-white/70"><span className="font-semibold">Q:</span> What are your office hours?</p>
                        <p className="text-xs text-white/70"><span className="font-semibold">A:</span> We're open Monday-Friday, 9 AM to 6 PM, and Saturday 10 AM to 3 PM. We're closed Sundays and major holidays.</p>
                      </div>
                    </div>
                    <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
                      <p className="text-sm font-semibold text-white mb-2">Another Example:</p>
                      <div className="space-y-2">
                        <p className="text-xs text-white/70"><span className="font-semibold">Q:</span> How do I reschedule my appointment?</p>
                        <p className="text-xs text-white/70"><span className="font-semibold">A:</span> You can reschedule up to 24 hours before your appointment by calling us at (555) 123-4567 or replying to your confirmation email.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Best Practices */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-4">Best Practices</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="font-semibold text-white text-sm">Be Specific & Clear</p>
                        <p className="text-xs text-white/60">Avoid vague answers. Include specific details, times, policies, and contact info.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="font-semibold text-white text-sm">Cover Common Questions</p>
                        <p className="text-xs text-white/60">Start with your top 10 patient questions. Add more as you learn what people ask.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="font-semibold text-white text-sm">Update Regularly</p>
                        <p className="text-xs text-white/60">As policies change or new questions arise, update your FAQs to keep the AI accurate.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="font-semibold text-white text-sm">Include Contact Options</p>
                        <p className="text-xs text-white/60">For complex issues, the AI knows when to direct patients to call or email you.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Topics to Cover */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-4">Topics to Cover</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Appointment Related</p>
                      <ul className="text-xs text-white/60 space-y-1">
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />How to book</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />Rescheduling policy</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />Cancellation rules</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Business Information</p>
                      <ul className="text-xs text-white/60 space-y-1">
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />Hours & location</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />Insurance accepted</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />Payment methods</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Services</p>
                      <ul className="text-xs text-white/60 space-y-1">
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />What you offer</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />Service descriptions</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />Preparation needed</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Emergency Info</p>
                      <ul className="text-xs text-white/60 space-y-1">
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />Emergency contacts</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />After-hours support</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-brand-400" />When to seek help</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "integration" && (
            <div className="max-w-3xl animate-fade-in-up">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Embed on Your Website
                </h1>
                <p className="text-lg text-white/70 leading-relaxed">
                  Ready to go live? Add the chat widget to your website with a single line of code. It takes less than 2 minutes.
                </p>
              </div>

              {/* Step by step */}
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">1</div>
                    <h3 className="text-lg font-bold">Get Your API Key</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                    Your API key uniquely identifies your clinic. You'll find it in the provider dashboard.
                  </p>
                  <div className="bg-black/20 border border-white/[0.06] rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <code className="font-mono text-xs text-white/80">sk_live_linor_7b82f9a3c4e5d61209</code>
                      <button
                        onClick={() => handleCopyCode(mockApiKey)}
                        className="text-xs font-medium text-white/60 hover:text-white transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                    <h3 className="text-lg font-bold">Copy the Widget Code</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                    Paste this single line before the closing &lt;/body&gt; tag on your website.
                  </p>
                  <div className="bg-[#0d0d0d] rounded-xl overflow-hidden border border-white/[0.08]">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/[0.06]">
                      <span className="text-xs text-white/40 font-mono">HTML</span>
                      <button
                        onClick={() => handleCopyCode(widgetCode)}
                        className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
                      >
                        {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm text-white/80 font-mono">
                      <code>{widgetCode}</code>
                    </pre>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">3</div>
                    <h3 className="text-lg font-bold">Deploy & Test</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                    Add the code to your website. Within seconds, the chat widget appears. Test it to make sure it's working.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
                      <p className="text-xs text-white/60 mb-2">✓ Check desktop view</p>
                      <p className="text-xs text-white/60">Widget appears in bottom-right corner</p>
                    </div>
                    <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
                      <p className="text-xs text-white/60 mb-2">✓ Check mobile view</p>
                      <p className="text-xs text-white/60">Widget works on all screen sizes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-8 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-5">
                <p className="text-sm text-emerald-200">
                  ✓ <span className="font-semibold">Live in seconds!</span> No page refresh needed. The widget loads asynchronously and doesn't affect your site's performance.
                </p>
              </div>
            </div>
          )}

          {activeSection === "api" && (
            <div className="max-w-3xl animate-fade-in-up">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Appointments & API
                </h1>
                <p className="text-lg text-white/70 leading-relaxed">
                  Learn how appointments are created and how to access them via API for integration with your systems.
                </p>
              </div>

              <div className="space-y-6">
                {/* Appointment Flow */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6">How Appointments Work</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500 flex items-center justify-center text-brand-400 font-bold text-sm flex-shrink-0">1</div>
                      <div>
                        <p className="font-semibold text-white mb-1">Patient Requests Appointment</p>
                        <p className="text-sm text-white/60">Customer asks for a booking through the chat widget</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">2</div>
                      <div>
                        <p className="font-semibold text-white mb-1">AI Confirms Details</p>
                        <p className="text-sm text-white/60">AI asks for name, phone, date, time, and service needed</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">3</div>
                      <div>
                        <p className="font-semibold text-white mb-1">Appointment Created</p>
                        <p className="text-sm text-white/60">Booking stored in your system with status "pending"</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-400 font-bold text-sm flex-shrink-0">4</div>
                      <div>
                        <p className="font-semibold text-white mb-1">You Review & Confirm</p>
                        <p className="text-sm text-white/60">Team reviews the booking in the provider dashboard and confirms</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500 flex items-center justify-center text-pink-400 font-bold text-sm flex-shrink-0">5</div>
                      <div>
                        <p className="font-semibold text-white mb-1">Patient Notified</p>
                        <p className="text-sm text-white/60">Customer gets confirmation via SMS or email</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Reference */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-4">REST API Reference</h3>
                  
                  <div className="space-y-4">
                    {/* Base URL */}
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">Base URL</p>
                      <div className="bg-black/20 border border-white/[0.06] rounded-lg p-3">
                        <code className="font-mono text-xs text-white/80">https://api.linor.ai/v1</code>
                      </div>
                    </div>

                    {/* Authentication */}
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">Authentication</p>
                      <p className="text-xs text-white/60 mb-2">Include your API key in the Authorization header:</p>
                      <div className="bg-black/20 border border-white/[0.06] rounded-lg p-3">
                        <code className="font-mono text-xs text-white/80">Authorization: Bearer sk_live_linor_7b82f9a3c4e5d61209</code>
                      </div>
                    </div>

                    {/* Key Endpoints */}
                    <div>
                      <p className="text-sm font-semibold text-white mb-3">Key Endpoints</p>
                      <div className="space-y-3">
                        <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
                          <p className="text-xs font-mono text-brand-400 mb-1">GET /appointments</p>
                          <p className="text-xs text-white/60">Fetch all appointments for your clinic</p>
                        </div>
                        <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
                          <p className="text-xs font-mono text-brand-400 mb-1">GET /appointments/{"{id}"}</p>
                          <p className="text-xs text-white/60">Get details of a specific appointment</p>
                        </div>
                        <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
                          <p className="text-xs font-mono text-brand-400 mb-1">POST /appointments/{"{id}"}/confirm</p>
                          <p className="text-xs text-white/60">Confirm a pending appointment</p>
                        </div>
                        <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
                          <p className="text-xs font-mono text-brand-400 mb-1">POST /appointments/{"{id}"}/cancel</p>
                          <p className="text-xs text-white/60">Cancel an appointment</p>
                        </div>
                      </div>
                    </div>

                    {/* Response Example */}
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">Example Response</p>
                      <div className="bg-[#0d0d0d] rounded-lg overflow-hidden border border-white/[0.08]">
                        <pre className="p-4 overflow-x-auto text-xs text-white/70 font-mono">
                          <code>{`{
  "id": "apt_123456",
  "patient": "John Smith",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "service": "General Checkup",
  "date": "2026-05-15",
  "time": "2:30 PM",
  "status": "pending",
  "bookedAt": "2026-05-04T10:30:00Z"
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integration Tips */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 md:p-8">
                  <h3 className="text-lg font-bold mb-4">Integration Tips</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="font-semibold text-white text-sm">Sync with Your Calendar</p>
                        <p className="text-xs text-white/60">Use the API to pull new appointments into your existing calendar system</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="font-semibold text-white text-sm">Webhooks Available</p>
                        <p className="text-xs text-white/60">Get real-time notifications when new appointments are created</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="font-semibold text-white text-sm">Export Data</p>
                        <p className="text-xs text-white/60">Download appointment data for reporting and analysis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />

      {/* Animation styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
          }
        `,
      }} />
    </>
  );
}
  