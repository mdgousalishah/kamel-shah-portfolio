import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CERTIFICATIONS, Certification } from '../data/certifications';
import { X, Award, ExternalLink, Eye, ZoomIn, ZoomOut } from 'lucide-react';

export default function Certifications() {
  const [activeCert, setActiveCert] = useState<Certification | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCert(null);
        setIsZoomed(false);
      }
    };

    if (activeCert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsZoomed(false);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeCert]);

  return (
    <section id="certifications" className="relative w-full py-20 md:py-28 px-4 sm:px-6 lg:px-12 bg-[#08080A] border-t border-white/[0.06] scroll-mt-[50px] z-10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Editorial Section Label */}
        <div className="flex items-center justify-between pb-8 border-b border-white/[0.08] mb-12 md:mb-16">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
              07 / CREDENTIALS & CERTIFIED LEARNING
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline">
            {CERTIFICATIONS.length} CREDENTIALS & SPECIALIZATIONS
          </span>
        </div>

        {/* Monumental Headline */}
        <h2 className="text-[clamp(2.25rem,4.5vw,4.25rem)] font-bold text-white leading-[1.08] tracking-tight max-w-4xl mb-6">
          Verified certifications & coursework.
        </h2>
        <p className="text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed mb-16">
          Official credentials spanning Cloud Computing & Microsoft Azure (Microsoft & LinkedIn), National Youth Leadership (Ministry of Youth Affairs & Sports), Software Engineering (Deloitte / Forage), UI/UX with Agentic AI (IIT Madras Pravartak), Generative AI workflows, and Technical SEO.
        </p>

        {/* Modern Certificate Gallery (Zero Excess Gap, Preserved Aspect Ratios) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CERTIFICATIONS.map((cert, index) => {
            const altText = cert.recipient
              ? `${cert.type || 'Certificate'} for ${cert.title} awarded to ${cert.recipient}`
              : `${cert.title} - ${cert.issuer}`;

            return (
              <motion.article
                key={cert.id}
                data-cert-id={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                onClick={() => cert.image && setActiveCert(cert)}
                className={`warm-panel group flex flex-col justify-between rounded-2xl border overflow-hidden transition-all duration-300 ${
                  cert.image
                    ? 'cursor-pointer hover:border-white/25 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)]'
                    : 'hover:border-indigo-500/30'
                }`}
              >
                {/* Thumbnail Image Preview */}
                {cert.image ? (
                  <div className="relative w-full aspect-[16/11] bg-[#14151D] overflow-hidden border-b border-white/[0.06]">
                    <img
                      src={cert.image}
                      alt={altText}
                      className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1015] via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                    
                    {/* Hover Overlay Button */}
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye size={13} />
                      <span>View Certificate</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[16/7] bg-indigo-500/[0.04] border-b border-white/[0.06] p-5 flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Award size={16} />
                    </div>
                    <span className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider font-semibold">
                      {cert.date?.includes('In Progress') ? 'In Progress • Certificate' : 'Professional Record'}
                    </span>
                  </div>
                )}

                {/* Card Meta */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                        {cert.category || 'CERTIFIED'}
                      </span>
                      {cert.date && (
                        <time dateTime={cert.datetime || cert.date} className="text-xs font-mono text-neutral-500">
                          {cert.date}
                        </time>
                      )}
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-white mb-1 leading-snug group-hover:text-indigo-200 transition-colors">
                      {cert.title}
                    </h3>

                    {cert.type && (
                      <p className="text-xs font-mono text-indigo-300/90 mb-1">
                        {cert.type}
                      </p>
                    )}

                    <p className="text-xs font-mono text-neutral-400 uppercase tracking-wide mb-4">
                      {cert.issuer}
                    </p>

                    {cert.skills && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {cert.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.02] text-neutral-300 border border-white/[0.05]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {cert.image && (
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="text-neutral-500 font-mono text-[11px]">
                        {cert.certificateFile ? 'Verified PDF Asset' : 'Official Document'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCert(cert);
                        }}
                        className="inline-flex items-center gap-1.5 min-h-[44px] py-1 font-semibold text-indigo-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <span>View Certificate</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* LIGHTBOX MODAL (Full Certificate, Contained, ESC/Backdrop Close, Zoom Support) */}
      <AnimatePresence>
        {activeCert && activeCert.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-[999] bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8"
          >
            {/* Accessible Close Button */}
            <button
              onClick={() => setActiveCert(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all z-20 cursor-pointer"
              aria-label="Close Certificate Preview"
            >
              <X size={22} />
            </button>

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full bg-[#0F1015] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Image Container with Aspect Ratio Preservation */}
              <div className="relative flex-grow flex items-center justify-center p-3 sm:p-6 bg-[#08080A]/95 overflow-auto">
                <img
                  src={activeCert.image}
                  alt={
                    activeCert.recipient 
                      ? `${activeCert.type || 'Certificate'} for ${activeCert.title} awarded to ${activeCert.recipient}`
                      : `${activeCert.title} - ${activeCert.issuer}`
                  }
                  className={`w-auto max-w-full rounded-lg shadow-2xl transition-transform duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'max-h-[72vh] object-contain cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-5 bg-[#0F1015] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="max-w-xl">
                  <h4 className="text-base font-bold text-white leading-tight">
                    {activeCert.title}
                  </h4>
                  <p className="text-xs font-mono text-neutral-400 mt-0.5">
                    {activeCert.issuer}
                    {activeCert.date ? ` • ${activeCert.date}` : ''}
                    {activeCert.type ? ` • ${activeCert.type}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="px-3 py-2 rounded-full bg-white/[0.08] hover:bg-white/15 text-neutral-200 text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isZoomed ? <ZoomOut size={13} /> : <ZoomIn size={13} />}
                    <span>{isZoomed ? 'Reset' : 'Zoom'}</span>
                  </button>

                  {activeCert.certificateFile && (
                    <a
                      href={activeCert.certificateFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open PDF</span>
                      <ExternalLink size={12} />
                    </a>
                  )}

                  <button
                    onClick={() => setActiveCert(null)}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
