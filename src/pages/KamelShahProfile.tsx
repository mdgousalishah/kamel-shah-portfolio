import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SITE_CONFIG } from '../data/config';
import { CERTIFICATIONS, Certification } from '../data/certifications';
import { PROJECTS } from '../data/projects';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Download, 
  ExternalLink, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  X
} from 'lucide-react';

interface ProfileProps {
  onNavigateHome?: () => void;
}

export default function KamelShahProfile({ onNavigateHome }: ProfileProps) {
  const [activeCert, setActiveCert] = useState<Certification | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const originalTitle = document.title;
    document.title = "Kamel Shah (Mohammed Gous Ali Shah) | Profile";

    return () => {
      document.title = originalTitle;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCert(null);
    };

    if (activeCert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeCert]);

  const handleBack = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  const authenticCertificates = CERTIFICATIONS.filter((c) => !!c.image).slice(0, 7);

  return (
    <div className="relative w-full min-h-screen bg-[#F3F0E8] text-[#242424] font-sans selection:bg-[#3A3937]/25 selection:text-[#242424]">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#F3F0E8]/95 backdrop-blur-md border-b border-[#D8D3C9] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a
            href="/"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#77746E] hover:text-[#242424] transition-colors group cursor-pointer"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Portfolio</span>
          </a>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center">
              <img
                src="/Photos/My%20Logo.png"
                alt="Kamel Shah Logo"
                className="h-full w-auto object-contain"
              />
            </div>
            <span className="text-xs font-sans font-bold tracking-widest text-[#242424] uppercase">
              KAMEL SHAH
            </span>
          </div>
        </div>
      </header>

      {/* Main Profile Container */}
      <main id="main-content" tabIndex={-1} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col gap-12 md:gap-16">
        
        {/* HERO / IDENTITY CARD */}
        <section className="editorial-card relative w-full rounded-3xl border border-[#D8D3C9] p-6 sm:p-10 md:p-12 bg-[#ECE8DE] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Portrait */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden border border-[#D8D3C9] bg-[#F3F0E8] shadow-sm">
                <img
                  src="/Photos/Me%201.png"
                  alt="Kamel Shah (Mohammed Gous Ali Shah)"
                  className="w-full h-full object-cover object-[center_18%] filter grayscale contrast-[1.04]"
                />
              </div>
            </div>

            {/* Right: Identity Header */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-sans">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F0E8] border border-[#D8D3C9] text-[#242424] font-medium uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A3937]" />
                  Available for opportunities
                </span>
                <span className="text-[#77746E]">Parbhani, Maharashtra, India</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#242424] tracking-tight">
                  Kamel Shah
                </h1>
                <div className="text-sm font-sans text-[#77746E] mt-1">
                  Full Legal Name: <span className="text-[#242424] font-semibold">Mohammed Gous Ali Shah</span>
                </div>
              </div>

              <div className="text-base sm:text-lg font-serif italic text-[#3A3937]">
                Full-Stack Developer · Agentic AI Developer · IT & Technical Support
              </div>

              <p className="text-sm sm:text-base text-[#77746E] leading-relaxed">
                Electronics & Computer Engineering professional focused on full-stack web development, practical technology solutions, and institutional IT operations.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={SITE_CONFIG.resume}
                  download
                  className="editorial-btn-primary px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-wider font-semibold inline-flex items-center gap-2"
                >
                  <span>Download Resume</span>
                  <Download size={13} />
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="editorial-btn-secondary px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-wider font-medium inline-flex items-center gap-2"
                >
                  <Mail size={13} />
                  <span>Email Directly</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: CAREER & ROLES */}
        <section className="w-full">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#D8D3C9] mb-8">
            <Briefcase size={16} className="text-[#3A3937]" />
            <h2 className="text-xs font-sans text-[#3A3937] uppercase tracking-widest font-bold">
              01 / PROFESSIONAL EXPERIENCE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="editorial-card p-6 rounded-2xl border border-[#D8D3C9] bg-[#F3F0E8]">
              <div className="flex items-center justify-between text-xs font-sans text-[#77746E] mb-2">
                <span className="text-[#3A3937] font-bold uppercase">PRESENT</span>
                <span>June 2023 — Present</span>
              </div>
              <h3 className="text-xl font-serif text-[#242424] mb-0.5">
                IT & Technical Support Assistant
              </h3>
              <div className="text-xs font-sans text-[#77746E] mb-4">
                Kamel Education Society • Parbhani, Maharashtra
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#77746E] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A3937] mt-2 shrink-0" />
                  <span>Administered institutional IT infrastructure across 5 schools, maintaining workstation computers, switches, and peripherals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A3937] mt-2 shrink-0" />
                  <span>Diagnosed hardware, operating systems, and Wi-Fi/LAN connectivity for 100+ students and 10+ faculty members.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A3937] mt-2 shrink-0" />
                  <span>Supported student records and administration platform operations for the CampusOne ERP system.</span>
                </li>
              </ul>
            </article>

            <article className="editorial-card p-6 rounded-2xl border border-[#D8D3C9] bg-[#F3F0E8]">
              <div className="flex items-center justify-between text-xs font-sans text-[#77746E] mb-2">
                <span className="text-[#3A3937] font-bold uppercase">COMPLETED</span>
                <span>Sept 2025 — Nov 2025</span>
              </div>
              <h3 className="text-xl font-serif text-[#242424] mb-0.5">
                Developer Intern
              </h3>
              <div className="text-xs font-sans text-[#77746E] mb-4">
                Bilim Technologies • Remote
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#77746E] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A3937] mt-2 shrink-0" />
                  <span>Engineered responsive, accessible frontend components using HTML5, CSS3, JavaScript, and Bootstrap.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A3937] mt-2 shrink-0" />
                  <span>Gained practical codebase experience connecting UI components to PHP and Laravel backend controllers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A3937] mt-2 shrink-0" />
                  <span>Collaborated with REST API endpoints to bind dynamic data to client views.</span>
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* SECTION: FORMAL EDUCATION */}
        <section className="w-full">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#D8D3C9] mb-8">
            <GraduationCap size={16} className="text-[#3A3937]" />
            <h2 className="text-xs font-sans text-[#3A3937] uppercase tracking-widest font-bold">
              02 / FORMAL EDUCATION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="editorial-card p-6 rounded-2xl border border-[#D8D3C9] bg-[#F3F0E8]">
              <span className="text-xs font-sans text-[#3A3937] font-bold block mb-1">
                Expected 2026
              </span>
              <h3 className="text-lg font-serif text-[#242424] mb-0.5">
                Bachelor of Technology (B.Tech)
              </h3>
              <p className="text-xs font-sans font-medium text-[#77746E] mb-2">
                PES College of Engineering, Aurangabad / DBATU
              </p>
              <p className="text-xs text-[#77746E]">
                Electronics & Computer Engineering. Focus on computing architectures, embedded systems, software engineering, and digital circuits.
              </p>
            </article>

            <article className="editorial-card p-6 rounded-2xl border border-[#D8D3C9] bg-[#F3F0E8]">
              <span className="text-xs font-sans text-[#3A3937] font-bold block mb-1">
                Currently Pursuing
              </span>
              <h3 className="text-lg font-serif text-[#242424] mb-0.5">
                Online MBA in AI & Machine Learning
              </h3>
              <p className="text-xs font-sans font-medium text-[#77746E] mb-2">
                Dr. D. Y. Patil Vidyapeeth, Pune
              </p>
              <p className="text-xs text-[#77746E]">
                Postgraduate study focusing on machine learning foundations, predictive analytics, enterprise AI systems, and technology strategy.
              </p>
            </article>

            <article className="editorial-card p-6 rounded-2xl border border-[#D8D3C9] bg-[#F3F0E8]">
              <span className="text-xs font-sans text-[#3A3937] font-bold block mb-1">
                Completed 2026
              </span>
              <h3 className="text-lg font-serif text-[#242424] mb-0.5">
                Bachelor of Arts (B.A.)
              </h3>
              <p className="text-xs font-sans font-medium text-[#77746E] mb-2">
                Yashwantrao Chavan Maharashtra Open University (YCMOU)
              </p>
              <p className="text-xs text-[#77746E]">
                Humanities & Social Sciences. Provides foundational training in organizational communication, analytical writing, and sociology.
              </p>
            </article>

          </div>
        </section>

        {/* SECTION: CERTIFICATIONS */}
        <section className="w-full">
          <div className="flex items-center justify-between pb-4 border-b border-[#D8D3C9] mb-8">
            <div className="flex items-center gap-2.5">
              <Award size={16} className="text-[#3A3937]" />
              <h2 className="text-xs font-sans text-[#3A3937] uppercase tracking-widest font-bold">
                03 / VERIFIED CERTIFICATIONS
              </h2>
            </div>
            <span className="text-xs font-sans text-[#77746E]">
              {authenticCertificates.length} CREDENTIALS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authenticCertificates.map((cert) => (
              <article
                key={cert.id}
                onClick={() => cert.image && setActiveCert(cert)}
                className="editorial-card p-5 rounded-2xl border border-[#D8D3C9] bg-[#F3F0E8] flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="text-[10px] font-sans text-[#3A3937] uppercase font-bold mb-1">
                    {cert.category || 'CERTIFICATE'}
                  </div>
                  <h3 className="text-base font-serif font-semibold text-[#242424] mb-1 group-hover:text-[#3A3937] transition-colors leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-sans text-[#77746E] mb-3">
                    {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D8D3C9] flex items-center justify-between text-xs font-sans text-[#77746E]">
                  <span>View Document</span>
                  <ExternalLink size={12} className="text-[#242424]" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION: PROJECTS */}
        <section className="w-full">
          <div className="flex items-center justify-between pb-4 border-b border-[#D8D3C9] mb-8">
            <div className="flex items-center gap-2.5">
              <Code2 size={16} className="text-[#3A3937]" />
              <h2 className="text-xs font-sans text-[#3A3937] uppercase tracking-widest font-bold">
                04 / SELECTED WORK
              </h2>
            </div>
            <span className="text-xs font-sans text-[#77746E]">
              {PROJECTS.length} SYSTEMS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((proj) => (
              <article key={proj.id} className="editorial-card p-6 rounded-2xl border border-[#D8D3C9] bg-[#F3F0E8] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-sans text-[#77746E] mb-2">
                    <span className="font-bold text-[#242424]">#{proj.number}</span>
                    <span className="text-[#3A3937] uppercase">{proj.category}</span>
                  </div>

                  <h3 className="text-xl font-serif text-[#242424] mb-2">
                    {proj.title}
                  </h3>

                  <div className="text-xs sm:text-sm text-[#77746E] leading-relaxed mb-4">
                    {Array.isArray(proj.description) ? proj.description[0] : proj.description}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[11px] font-sans bg-[#ECE8DE] text-[#242424] border border-[#D8D3C9]/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D8D3C9] flex items-center justify-between text-xs font-sans">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#77746E] hover:text-[#242424] inline-flex items-center gap-1"
                    >
                      <Github size={12} />
                      <span>Repository</span>
                    </a>
                  )}
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#242424] font-semibold hover:underline inline-flex items-center gap-1 ml-auto"
                    >
                      <span>Live Site</span>
                      <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* BOTTOM RETURN BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#D8D3C9]">
          <a
            href="/"
            onClick={handleBack}
            className="editorial-btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio</span>
          </a>

          <div className="text-xs font-sans text-[#77746E]">
            &copy; {new Date().getFullYear()} Kamel Shah. All rights reserved.
          </div>
        </div>

      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeCert && activeCert.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-[999] bg-[#242424]/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[85vh] w-full bg-[#F3F0E8] border border-[#D8D3C9] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 bg-[#F3F0E8] border-b border-[#D8D3C9] flex items-center justify-between">
                <div>
                  <h4 className="text-base font-serif font-semibold text-[#242424]">
                    {activeCert.title}
                  </h4>
                  <p className="text-xs font-sans text-[#77746E]">
                    {activeCert.issuer}
                  </p>
                </div>
                <button
                  onClick={() => setActiveCert(null)}
                  className="w-9 h-9 rounded-full border border-[#D8D3C9] bg-[#ECE8DE] flex items-center justify-center text-[#242424] hover:bg-[#F3F0E8] transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="relative flex-grow flex items-center justify-center p-4 bg-[#ECE8DE]/50 overflow-auto">
                <img
                  src={activeCert.image}
                  alt={activeCert.title}
                  className="max-w-[90vw] max-h-[65vh] w-auto h-auto object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
