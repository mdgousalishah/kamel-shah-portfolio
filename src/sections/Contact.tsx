import { useState } from 'react';
import { motion } from 'motion/react';
import { SITE_CONFIG } from '../data/config';
import { Mail, Phone, MapPin, Send, ArrowUpRight, Github, Linkedin, Twitter, Globe } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields (First Name, Last Name, Email, and Message).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const text = `Hello Kamel,

Name: ${formData.firstName.trim()} ${formData.lastName.trim()}
Email: ${formData.email.trim()}
Phone: ${formData.phone.trim() || 'N/A'}

Message:
${formData.message.trim()}`;

    const encodedText = encodeURIComponent(text);
    const waNumber = SITE_CONFIG.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <section id="contact" className="relative w-full py-20 md:py-28 px-6 lg:px-12 bg-[#08080A] border-t border-white/[0.06] scroll-mt-[50px] z-10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Editorial Section Label */}
        <div className="flex items-center justify-between pb-8 border-b border-white/[0.08] mb-12 md:mb-16">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
              08 / THE FINAL CHAPTER • INQUIRIES
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline">
            DIRECT TRANSMISSION
          </span>
        </div>

        {/* Monumental Headline */}
        <h2 className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-black text-white leading-[1.02] tracking-tight max-w-5xl mb-6 uppercase font-sans">
          Let's work together.
        </h2>
        <p className="text-neutral-400 text-base md:text-xl max-w-2xl leading-relaxed mb-16">
          Open for full-stack software development roles, technical collaborations, and modern web engineering opportunities.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Coordinates & Social Presence */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="group p-5 rounded-2xl bg-[#0F1015] border border-white/[0.06] hover:border-white/25 flex items-start gap-4 transition-all block"
              >
                <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                    Direct Email
                  </div>
                  <div className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors break-all">
                    {SITE_CONFIG.email}
                  </div>
                </div>
              </a>

              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="group p-5 rounded-2xl bg-[#0F1015] border border-white/[0.06] hover:border-white/25 flex items-start gap-4 transition-all block"
              >
                <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                    Phone & WhatsApp
                  </div>
                  <div className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {SITE_CONFIG.phone}
                  </div>
                </div>
              </a>

              <div className="p-5 rounded-2xl bg-[#0F1015] border border-white/[0.06] flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                    Location
                  </div>
                  <div className="text-base font-semibold text-white">
                    {SITE_CONFIG.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Social Channels */}
            <div className="pt-6 border-t border-white/[0.08]">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-4">
                Verified Social Profiles
              </span>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={SITE_CONFIG.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-colors"
                >
                  <Github size={14} /> GitHub
                </a>
                <a
                  href={SITE_CONFIG.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-colors"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
                <a
                  href={SITE_CONFIG.socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-colors"
                >
                  <Twitter size={14} /> X
                </a>
                <a
                  href={SITE_CONFIG.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-colors"
                >
                  <Globe size={14} /> Website
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Transmission Form via WhatsApp */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 p-1 flex items-center justify-center">
                <img src="/Photos/My Logo.png" alt="Logo" className="h-full w-auto object-contain filter invert opacity-90" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                  Direct Message Dispatch
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  Instant connection to Kamel Shah (+91 7588571899)
                </span>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-3xl bg-[#0F1015] border border-white/[0.08] shadow-2xl space-y-5"
            >
              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. John"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your role, project scope, or technical question..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl"
              >
                <span>Dispatch Via WhatsApp</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
