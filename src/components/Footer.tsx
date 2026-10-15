import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG, SOCIAL_LINKS } from '../data/config';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night text-[#D9D5CC]">
      <div className="wrap pt-16 pb-10 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <a href="#home" className="inline-flex items-center gap-3" aria-label="Kamel Shah — back to top">
              <img src={SITE_CONFIG.logo} alt="" width={1021} height={448} className="h-8 w-auto" />
              <span className="text-sm font-semibold tracking-[0.2em] text-[#F3F0E8]">KAMEL SHAH</span>
            </a>
            <p className="mt-6 max-w-[26rem] font-serif text-xl leading-snug text-[#F3F0E8]">
              {SITE_CONFIG.fullName}
            </p>
            <p className="mt-2 text-sm text-[#A8A39A]">{SITE_CONFIG.descriptor}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="eyebrow !text-[#A8A39A]">Sections</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SITE_CONFIG.navLinks
                .filter((l) => l.href !== '#home')
                .map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[#D9D5CC] transition-colors hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow !text-[#A8A39A]">Elsewhere</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#D9D5CC] transition-colors hover:text-white"
                  >
                    {s.label}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={SITE_CONFIG.socials.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#D9D5CC] transition-colors hover:text-white"
                >
                  Live portfolio
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href={SITE_CONFIG.resume} download className="inline-flex items-center gap-1 text-[#D9D5CC] transition-colors hover:text-white">
                  Resume (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-4 border-t border-white/10 pt-6 text-xs text-[#A8A39A] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[#A8A39A]">&copy; {year} Kamel Shah. All rights reserved.</p>
          <a href="#home" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            Back to top
            <ArrowUp size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
