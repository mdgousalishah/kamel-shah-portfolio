import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Maximize2 } from 'lucide-react';
import { CERTIFICATIONS, type Certification } from '../data/certifications';
import Reveal from '../components/Reveal';
import { Headline } from '../components/Motion';
import Depth from '../components/Depth';

/** Lightweight thumbnail copy; the original file is still used in the lightbox. */
const thumbFor = (image: string) => {
  const name = image.split('/').pop()?.replace(/\.[^.]+$/, '');
  return name ? `/Photos/optimized/certificates/${name}.webp` : image;
};

function CertThumb({ cert }: { cert: Certification }) {
  const [src, setSrc] = useState(() => thumbFor(cert.image!));
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => src !== cert.image && setSrc(cert.image!)}
      className="h-full w-full object-contain"
    />
  );
}

export default function Certifications() {
  const [activeCert, setActiveCert] = useState<Certification | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const certificates = CERTIFICATIONS.filter((c) => Boolean(c.image));

  const open = (cert: Certification, el: HTMLElement) => {
    triggerRef.current = el;
    setActiveCert(cert);
  };

  useEffect(() => {
    if (!activeCert) return;

    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCert(null);
      if (e.key === 'Tab' && dialogRef.current) {
        // Keep focus inside the dialog.
        const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button'));
        if (items.length === 0) return;
        const idx = items.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        const next = e.shiftKey ? (idx <= 0 ? items.length - 1 : idx - 1) : (idx + 1) % items.length;
        items[next].focus();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      triggerRef.current?.focus();
    };
  }, [activeCert]);

  return (
    <section id="certifications" aria-labelledby="certifications-title" className="section">
      <div className="wrap">
        <header className="section-head">
          <span className="section-index">07</span>
          <span className="eyebrow">Certificates</span>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <Headline id="certifications-title" className="h-section" wrapperClassName="lg:col-span-7">Certifications &amp; training.</Headline>
          <Reveal from="right" className="lg:col-span-5" delay={0.06}>
            <p className="body-muted max-w-[30rem] lg:ml-auto">
              Coursework, job simulations, and programmes across cloud, software development, AI, and SEO.
              Select any certificate to view it in full.
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <Reveal as="li" from="zoom" blur={false} key={cert.id} delay={(i % 3) * 0.08}>
              <button
                type="button"
                onClick={(e) => open(cert, e.currentTarget)}
                aria-label={`View certificate: ${cert.title}, ${cert.issuer}`}
                className="group block w-full text-left"
              >
                <Depth strength={5} tilt tiltStrength={4}>
                <div className="frame zoom-on-hover relative aspect-[4/3] bg-paper p-3">
                  <CertThumb cert={cert} />
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <Maximize2 size={14} />
                  </span>
                </div>
                </Depth>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="eyebrow truncate">{cert.category || 'Certificate'}</span>
                  {cert.date && <span className="shrink-0 text-xs text-muted">{cert.date}</span>}
                </div>
                <h3 className="mt-2 font-serif text-[1.2rem] leading-snug text-ink transition-colors group-hover:text-ink-soft">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeCert && activeCert.image && (
          <motion.div
            key="cert-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-[#1C1C1B]/85 p-3 backdrop-blur-sm sm:p-6"
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cert-dialog-title"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-[min(90vw,1100px)] flex-col overflow-hidden rounded-md border border-line bg-ivory shadow-2xl"
            >
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-4 py-3 sm:px-6 sm:py-4">
                <div className="min-w-0">
                  <h4 id="cert-dialog-title" className="truncate font-serif text-lg leading-snug text-ink sm:text-xl">
                    {activeCert.title}
                  </h4>
                  <p className="truncate text-xs text-muted sm:text-sm">
                    {activeCert.issuer}
                    {activeCert.date ? ` · ${activeCert.date}` : ''}
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setActiveCert(null)}
                  aria-label="Close certificate preview"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex min-h-0 flex-1 items-center justify-center bg-sand p-3 sm:p-5">
                <img
                  src={activeCert.image}
                  alt={activeCert.recipient ? `${activeCert.title} awarded to ${activeCert.recipient}` : activeCert.title}
                  className="block h-auto max-h-[calc(85vh-9rem)] w-auto max-w-full object-contain"
                />
              </div>

              {activeCert.certificateFile && (
                <div className="flex shrink-0 items-center justify-end border-t border-line px-4 py-3 sm:px-6">
                  <a
                    href={encodeURI(activeCert.certificateFile)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-line text-sm font-medium"
                  >
                    Open original document
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
