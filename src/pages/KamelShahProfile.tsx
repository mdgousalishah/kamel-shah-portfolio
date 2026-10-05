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
  CheckCircle2, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  X,
  Eye,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface ProfileProps {
  onNavigateHome?: () => void;
}

export default function KamelShahProfile({ onNavigateHome }: ProfileProps) {
  const [activeCert, setActiveCert] = useState<Certification | null>(null);

  useEffect(() => {
    // Scroll to top upon mounting profile
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Set page title and meta for identity route
    const originalTitle = document.title;
    document.title = "Kamel Shah (Mohammed Gous Ali Shah) | Full-Stack Developer & Agentic AI";

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

  return (
    <div className="relative w-full min-h-screen bg-[#08080A] text-[#F3F4F6] font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Background Ambient Grid Layer */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-15">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#08080A]/90 backdrop-blur-xl border-b border-white/[0.08] py-4 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a
            href="/"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </a>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10 p-0.5 bg-white/5 flex items-center justify-center">
              <img
                src="/Photos/My Logo.png"
                alt="Kamel Shah Logo"
                className="h-full w-auto object-contain filter invert opacity-90"
              />
            </div>
            <span className="text-xs font-bold tracking-wider text-white uppercase font-mono hidden sm:inline">
              Kamel Shah
            </span>
          </div>
        </div>
      </header>

      {/* Main Profile Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-12 md:py-20 flex flex-col gap-16 md:gap-24">
        
        {/* HERO / IDENTITY CARD */}
        <section className="relative w-full rounded-3xl bg-[#0F1015] border border-white/[0.1] p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Professional Portrait */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <div className="relative w-56 sm:w-64 md:w-72 aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0A0A0E]">
                <img
                  src="/Photos/Me.jpg"
                  alt="Kamel Shah (Mohammed Gous Ali Shah) - Professional Portrait"
                  className="w-full h-full object-cover [object-position:50%_15%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/90 via-transparent to-transparent opacity-75" />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white font-semibold">Kamel Shah</span>
                  <span className="text-neutral-400">Verified Entity</span>
                </div>
              </div>
            </div>

            {/* Right: Identity Header & Introduction */}
            <div className="lg:col-span-8 flex flex-col justify-center space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono font-medium tracking-wider text-neutral-300 uppercase">
                    AVAILABLE FOR OPPORTUNITIES
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                  <MapPin size={13} className="text-neutral-500" />
                  <span>Parbhani, Maharashtra, India</span>
                </div>
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight">
                  Kamel Shah
                </h1>
                <div className="text-base sm:text-lg font-mono text-neutral-400 tracking-wide mt-1">
                  Full Legal Name: <span className="text-neutral-200 font-semibold">Mohammed Gous Ali Shah</span>
                </div>
              </div>

              <div className="text-lg md:text-xl font-bold text-indigo-300 tracking-tight">
                Full-Stack Developer · Agentic AI Developer · IT & Technical Support
              </div>

              <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Electronics & Computer Engineering Professional
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-neutral-300 leading-relaxed space-y-2">
                <p>
                  <strong>Kamel Shah</strong>, also known as <strong>Mohammed Gous Ali Shah</strong>, is an Electronics & Computer Engineering professional working across full-stack web development, AI, Generative AI, Agentic AI and technical support.
                </p>
                <p className="text-xs text-neutral-400 font-mono">
                  Also known professionally as Mohammed Gous Ali Shah.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  View Featured Work
                </a>
                <a
                  href={SITE_CONFIG.resume}
                  download
                  className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Download Resume</span>
                  <Download size={14} />
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="px-6 py-3 rounded-full bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all"
                >
                  <Mail size={14} />
                  <span>Email Directly</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CAREER & ROLES */}
        <section className="w-full">
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08] mb-8">
            <Briefcase size={18} className="text-indigo-400" />
            <h2 className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
              01 / CURRENT ROLE & PROFESSIONAL EXPERIENCE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kamel Education Society */}
            <article className="p-7 rounded-2xl bg-[#0F1015] border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                    CURRENT ROLE
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    June 2023 — Present
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  IT Support Specialist
                </h3>
                <h4 className="text-sm font-mono text-neutral-300 mb-4">
                  Kamel Education Society • Parbhani, Maharashtra
                </h4>
                <ul className="space-y-2 text-xs md:text-sm text-neutral-400 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span>Administered institutional IT infrastructure across 5 schools, maintaining 10–20 workstation computers, network routing, printers, and peripherals.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span>Resolved hardware, operating systems, and Wi-Fi/LAN connectivity for 100+ students and 10+ faculty members.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span>Managed institutional records and supported operations of the CampusOne ERP system.</span>
                  </li>
                </ul>
              </div>
            </article>

            {/* Bilim Technology */}
            <article className="p-7 rounded-2xl bg-[#0F1015] border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                    INTERNSHIP
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    September 2025 — November 2025
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Developer Intern
                </h3>
                <h4 className="text-sm font-mono text-neutral-300 mb-4">
                  Bilim Technologies • Remote
                </h4>
                <ul className="space-y-2 text-xs md:text-sm text-neutral-400 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span>Engineered responsive, accessible modular frontend components using HTML5, CSS3, JavaScript, and Bootstrap.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span>Gained practical codebase exposure to PHP, Laravel, and MySQL database schemas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span>Integrated REST API endpoints to bind dynamic server data to client-side views.</span>
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        {/* SECTION: FORMAL EDUCATION */}
        <section className="w-full">
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08] mb-8">
            <GraduationCap size={18} className="text-indigo-400" />
            <h2 className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
              02 / FORMAL EDUCATION & ADVANCED STUDY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PES College of Engineering */}
            <article className="p-6 rounded-2xl bg-[#0F1015] border border-white/[0.08]">
              <span className="text-xs font-mono text-indigo-400 uppercase font-bold block mb-1">
                2022 — 2026 (Expected 2026)
              </span>
              <h3 className="text-lg font-bold text-white mb-1">
                Bachelor of Technology (B.Tech)
              </h3>
              <p className="text-sm font-semibold text-neutral-300 mb-2">
                PES College of Engineering, Aurangabad
              </p>
              <p className="text-xs font-mono text-indigo-300/80 mb-3">
                Field: Electronics & Computer Engineering
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Core engineering study covering computing architecture, embedded systems, software engineering, algorithms, and digital circuits.
              </p>
            </article>

            {/* Dr. D. Y. Patil Vidyapeeth */}
            <article className="p-6 rounded-2xl bg-[#0F1015] border border-white/[0.08]">
              <span className="text-xs font-mono text-indigo-400 uppercase font-bold block mb-1">
                2026 — 2028 (In Progress)
              </span>
              <h3 className="text-lg font-bold text-white mb-1">
                Online MBA in AI & Machine Learning
              </h3>
              <p className="text-sm font-semibold text-neutral-300 mb-2">
                Dr. D. Y. Patil Vidyapeeth, Pune
              </p>
              <p className="text-xs font-mono text-indigo-300/80 mb-3">
                Field: Artificial Intelligence & Machine Learning
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Postgraduate study focusing on machine learning foundations, predictive analytics, enterprise AI systems, and technology leadership.
              </p>
            </article>

            {/* YCMOU */}
            <article className="p-6 rounded-2xl bg-[#0F1015] border border-white/[0.08]">
              <span className="text-xs font-mono text-indigo-400 uppercase font-bold block mb-1">
                Completed 2026
              </span>
              <h3 className="text-lg font-bold text-white mb-1">
                Bachelor of Arts (B.A.)
              </h3>
              <p className="text-sm font-semibold text-neutral-300 mb-2">
                Yashwantrao Chavan Maharashtra Open University
              </p>
              <p className="text-xs font-mono text-indigo-300/80 mb-3">
                Field: Humanities & Social Sciences
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Undergraduate degree providing a strong foundation in communication, organizational behavior, and analytical thinking.
              </p>
            </article>

            {/* IIT Madras Pravartak */}
            <article className="p-6 rounded-2xl bg-[#0F1015] border border-indigo-500/20 bg-indigo-950/[0.08]">
              <span className="text-xs font-mono text-indigo-300 uppercase font-bold block mb-1">
                2026 — 2027 (In Progress)
              </span>
              <h3 className="text-lg font-bold text-white mb-1">
                Advanced Certificate in UI-UX Design with Agentic AI & GenAI
              </h3>
              <p className="text-sm font-semibold text-neutral-300 mb-2">
                IIT Madras Pravartak Technologies Foundation
              </p>
              <p className="text-xs font-mono text-indigo-300/80 mb-3">
                Specialization: UI/UX, Design Thinking, Generative AI & Agentic Workflows
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Advanced professional program exploring user-centered product design, modern UI methodologies, Generative AI integration, and agentic workflows.
              </p>
            </article>
          </div>
        </section>

        {/* SECTION: CERTIFICATIONS & CREDENTIALS (INCLUDING DELOITTE) */}
        <section className="w-full">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-8">
            <div className="flex items-center gap-3">
              <Award size={18} className="text-indigo-400" />
              <h2 className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
                03 / VERIFIED CERTIFICATIONS & SIMULATIONS
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
              {CERTIFICATIONS.length} CREDENTIALS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CERTIFICATIONS.map((cert) => (
              <article
                key={cert.id}
                onClick={() => cert.image && setActiveCert(cert)}
                className={`p-6 rounded-2xl bg-[#0F1015] border border-white/[0.08] flex flex-col justify-between transition-all ${
                  cert.image ? 'cursor-pointer hover:border-white/25' : ''
                }`}
              >
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

                  <h3 className="text-base font-bold text-white mb-1">
                    {cert.title}
                  </h3>

                  {cert.type && (
                    <p className="text-xs font-mono text-indigo-300/80 mb-1">
                      {cert.type}
                    </p>
                  )}

                  <p className="text-xs font-mono text-neutral-400 uppercase tracking-wide mb-3">
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

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-mono text-[11px]">
                    {cert.certificateFile ? 'Verified PDF Asset' : 'Verified Record'}
                  </span>
                  {cert.image && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCert(cert);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>View Certificate</span>
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION: SELECTED PROJECTS */}
        <section id="projects" className="w-full">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-8">
            <div className="flex items-center gap-3">
              <Code2 size={18} className="text-indigo-400" />
              <h2 className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
                04 / SELECTED SOFTWARE PROJECTS
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
              {PROJECTS.length} SYSTEMS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((proj) => (
              <article key={proj.id} className="p-6 rounded-2xl bg-[#0F1015] border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-neutral-500">
                      #{proj.number}
                    </span>
                    <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                      {proj.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {proj.title}
                  </h3>

                  <div className="text-xs text-neutral-300 leading-relaxed mb-4 space-y-1.5">
                    {Array.isArray(proj.description) ? (
                      proj.description.slice(0, 2).map((d, i) => (
                        <p key={i}>• {d}</p>
                      ))
                    ) : (
                      <p>{proj.description}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.02] text-neutral-300 border border-white/[0.05]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Github size={13} />
                      <span>Repository</span>
                    </a>
                  )}
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-white flex items-center gap-1 font-semibold transition-colors ml-auto"
                    >
                      <span>Live Site</span>
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION: ENTITY CONNECTIONS & SOCIAL PROFILES */}
        <section className="w-full rounded-2xl bg-[#0F1015] border border-white/[0.08] p-8 md:p-10">
          <div className="max-w-3xl">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold block mb-2">
              05 / VERIFIED ENTITY CONNECTIONS
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Consistently verified across public developer platforms.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed mb-8">
              All references consistently authenticate the same individual: <strong className="text-white">Kamel Shah</strong> (Mohammed Gous Ali Shah).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={SITE_CONFIG.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <Linkedin size={20} className="text-indigo-400" />
                  <div>
                    <div className="text-xs font-mono text-neutral-400 uppercase">LinkedIn</div>
                    <div className="text-sm font-semibold text-white">mohammed-gous-ali-shah</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
              </a>

              <a
                href={SITE_CONFIG.socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <Github size={20} className="text-indigo-400" />
                  <div>
                    <div className="text-xs font-mono text-neutral-400 uppercase">GitHub</div>
                    <div className="text-sm font-semibold text-white">mdgousalishah</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
              </a>

              <a
                href={SITE_CONFIG.socials.x}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <Twitter size={20} className="text-indigo-400" />
                  <div>
                    <div className="text-xs font-mono text-neutral-400 uppercase">X (Twitter)</div>
                    <div className="text-sm font-semibold text-white">@Kamelshah07</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
              </a>

              <a
                href={SITE_CONFIG.socials.website}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-indigo-400" />
                  <div>
                    <div className="text-xs font-mono text-neutral-400 uppercase">Official Website</div>
                    <div className="text-sm font-semibold text-white">kamelshah.ai.studio</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </section>

        {/* BOTTOM RETURN BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-white/[0.08]">
          <a
            href="/"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer shadow-lg"
          >
            <ArrowLeft size={16} />
            <span>Return to Main Portfolio</span>
          </a>

          <div className="text-xs font-mono text-neutral-500 text-center sm:text-right">
            &copy; {new Date().getFullYear()} Kamel Shah (Mohammed Gous Ali Shah). All rights reserved.
          </div>
        </div>

      </main>

      {/* LIGHTBOX MODAL (Full Certificate, Contained, ESC/Backdrop Close) */}
      <AnimatePresence>
        {activeCert && activeCert.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            {/* Accessible Close Button */}
            <button
              onClick={() => setActiveCert(null)}
              className="absolute top-5 right-5 md:top-8 md:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all z-20 cursor-pointer"
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
              className="relative max-w-4xl max-h-[85vh] w-full bg-[#0F1015] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="relative flex-grow flex items-center justify-center p-4 md:p-6 bg-[#08080A]/95 overflow-auto">
                <img
                  src={activeCert.image}
                  alt={activeCert.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-xl"
                />
              </div>

              <div className="p-4 md:p-5 bg-[#0F1015] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {activeCert.title}
                  </h4>
                  <p className="text-xs font-mono text-neutral-400">
                    {activeCert.issuer} • {activeCert.date}
                    {activeCert.type ? ` • ${activeCert.type}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
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
    </div>
  );
}
