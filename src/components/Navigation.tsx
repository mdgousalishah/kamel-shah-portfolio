import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '../data/config';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = SITE_CONFIG.navLinks.filter(
  (link) => link.href !== '#home' && link.href !== '#contact'
);

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const ids = SITE_CONFIG.navLinks.map((link) => link.href.replace('#', ''));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -60% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Mobile drawer: lock scroll, trap focus, close on Escape, restore focus.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    drawerRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus();

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyboard);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyboard);
      menuButtonRef.current?.focus();
    };
  }, [isOpen]);

  // Close the drawer if the viewport grows to desktop width.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mq.matches && setIsOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
          scrolled || isOpen
            ? 'bg-ivory/92 backdrop-blur-md border-line'
            : 'bg-ivory border-transparent'
        }`}
      >
        <div className="wrap flex h-[var(--nav-height)] items-center justify-between gap-6">
          {/* Brand */}
          <a href="#home" className="flex items-center gap-3 shrink-0" aria-label="Kamel Shah — back to top">
            <img
              src={SITE_CONFIG.logo}
              alt=""
              width={320}
              height={127}
              className="h-6 w-auto"
            />
            <span className="text-[0.8125rem] font-semibold tracking-[0.2em] text-ink">
              KAMEL SHAH
            </span>
          </a>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative py-1 text-[0.8125rem] transition-colors duration-200 ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-ink transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="#contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Contact
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[var(--nav-height)] z-[45] overflow-y-auto bg-ivory lg:hidden"
          >
            <div
              className="wrap flex min-h-full flex-col justify-between pt-6"
              style={{ paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))' }}
            >
              <nav aria-label="Mobile" className="flex flex-col">
                {SITE_CONFIG.navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.03 * i, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline justify-between border-b border-line py-3.5 font-serif text-[1.65rem] leading-tight text-ink"
                  >
                    <span>{link.label}</span>
                    <span className="font-sans text-xs text-muted">0{i + 1}</span>
                  </motion.a>
                ))}
              </nav>

              <div className="mt-10 grid gap-3">
                <a href="#contact" onClick={closeMenu} className="btn btn-primary w-full">
                  Contact Me
                </a>
                <a href={SITE_CONFIG.resume} download onClick={closeMenu} className="btn btn-quiet w-full">
                  Download Resume
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
