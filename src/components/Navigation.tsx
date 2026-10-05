import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '../data/config';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const sections = SITE_CONFIG.navLinks
      .filter((link) => link.href.startsWith('#'))
      .map((link) => link.href.replace('#', ''));
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none ${
          scrolled
            ? 'py-2.5 bg-[#08080A]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-xl'
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between pointer-events-auto">
          {/* Logo & Identity */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10 p-0.5 bg-white/5 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/Photos/My Logo.png"
                alt="Logo"
                className="h-full w-auto object-contain filter invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-white uppercase font-mono">
                {SITE_CONFIG.alias}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </a>

          {/* Desktop Nav - Minimal Floating Pill */}
          <nav className="hidden xl:flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/[0.08] rounded-full px-3 py-1 shadow-sm">
            {SITE_CONFIG.navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors duration-200 rounded-full ${
                    isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white/10 border border-white/15 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-white/10"
            >
              <span>Let's Connect</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Mobile Toggle Button (Clear & Obvious) */}
          <button
            className="lg:hidden relative z-50 text-white p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/15 focus:outline-none transition-colors cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#08080A]/95 backdrop-blur-2xl flex flex-col justify-between p-6 pt-24 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-4">
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10 p-1 bg-white/5 flex items-center justify-center">
                  <img src="/Photos/My Logo.png" alt="Logo" className="h-full w-auto object-contain filter invert" />
                </div>
                <div>
                  <span className="text-sm font-bold tracking-wider text-white uppercase font-mono block">
                    {SITE_CONFIG.primaryName}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {SITE_CONFIG.fullName}
                  </span>
                </div>
              </div>

              {SITE_CONFIG.navLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="py-2 text-base font-semibold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center justify-between border-b border-white/[0.04]"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={14} className="text-neutral-500" />
                </motion.a>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10">
              <a
                href={SITE_CONFIG.resume}
                download
                onClick={closeMenu}
                className="w-full py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider text-center block mb-3"
              >
                Download Resume
              </a>
              <div className="text-center text-[11px] font-mono text-neutral-500">
                &copy; {new Date().getFullYear()} {SITE_CONFIG.alias}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
