'use client';

import { useState } from 'react';
import { Book, Terminal, Settings, Key, Menu, X, CheckCircle, Copy } from 'lucide-react';

const DOC_SECTIONS = [
  { id: 'quickstart', label: 'Quick Start', icon: Book },
  { id: 'configuration', label: 'Clinic Configuration', icon: Settings },
  { id: 'integration', label: 'Widget Integration', icon: Terminal },
  { id: 'api', label: 'REST API Reference', icon: Key },
];

export default function DocsShowcase() {
  const [activeSection, setActiveSection] = useState('quickstart');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Mock Data for the showcase
  const mockApiKey = 'sk_live_linor_7b82f9a3c4e5d61209';
  
  // Simple copy function for the static showcase
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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">L</div>
           <span className="text-lg font-bold text-gray-900">Linor Docs</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-gray-900">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-gray-200 bg-gray-50 p-6 flex flex-col transition-transform duration-300 ease-in-out \${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="hidden md:flex items-center gap-2.5 mb-10 mt-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">L</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Docs</span>
        </div>

        <nav className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider ml-2">Getting Started</p>
          {DOC_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveSection(id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left \${
                activeSection === id 
                  ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
              }`}
            >
              <Icon size={18} className={activeSection === id ? "text-blue-600" : "text-gray-500"} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto p-6 md:p-12 lg:p-16 overflow-y-auto w-full">
        
        {activeSection === 'quickstart' && (
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Quick Start</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">
              Welcome to the Linor developer documentation. This guide will walk you through setting up your clinic's AI receptionist and embedding it on your website in minutes.
            </p>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 mb-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                  <Key size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">1. Get your API Key</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your API key authenticates the chat widget with your specific clinic's knowledge base. You can find this in your provider dashboard under <strong className="text-gray-800 font-semibold">Settings &gt; API Security</strong>.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-1">
                <div className="flex items-center justify-between bg-white border border-gray-100 rounded-md px-4 py-3 shadow-sm">
                  <span className="font-mono text-sm text-gray-800">{mockApiKey}</span>
                  <button 
                    onClick={() => handleCopyCode(mockApiKey)}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 py-1.5 px-3 rounded border border-gray-200"
                  >
                    {copied ? <CheckCircle size={14} className="text-green-600" /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'configuration' && (
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Clinic Configuration</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">Before embedding the widget, you need to teach the AI how to handle your patients.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
                  <Settings size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Clinic Settings</h4>
                <p className="text-gray-600 leading-relaxed">Set your working hours, contact info, and custom branding for the chat widget to match your website.</p>
              </div>
              
              <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 border border-green-100">
                  <Book size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Knowledge Base (FAQs)</h4>
                <p className="text-gray-600 leading-relaxed">Add common questions. The AI ingests these rules to answer patient queries instantly and accurately.</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'integration' && (
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Widget Integration</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">Embed the Linor AI receptionist into any website by pasting the following script tag into your HTML <code>&lt;head&gt;</code>.</p>
            
            <div className="bg-[#0d1117] rounded-xl overflow-hidden shadow-lg border border-gray-800 mb-8">
              <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-400 font-mono ml-2">HTML</span>
                </div>
                <button 
                  onClick={() => handleCopyCode(widgetCode)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 py-1 px-2.5 rounded"
                >
                  {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-6 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed">
                <code>{widgetCode}</code>
              </pre>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
              <h4 className="text-blue-800 font-bold mb-1">How it works</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                The script loads asynchronously and won't slow down your website. It uses your unique API key to securely fetch your clinic's specific FAQs, availability, and branding.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">REST API Reference</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">Interact directly with our REST API to build custom interfaces or connect your existing EHR systems.</p>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Authentication</h3>
              <p className="text-gray-600 mb-4">Pass your API key in the <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm">Authorization</code> header for all requests.</p>
              
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 border border-gray-800 shadow-inner">
                Authorization: Bearer {mockApiKey}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-10">Base URL</h3>
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm text-gray-800 border border-gray-200 inline-block mb-8">
              https://api.linor.ai/v1
            </div>
          </div>
        )}

      </main>

      {/* Simple fade in animation style */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}} />    


      
    </div>
  );
}
  