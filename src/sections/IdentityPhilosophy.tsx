/**
 * IdentityPhilosophy.tsx
 * Chapter 02: Cinematic Identity & Philosophy Section.
 * Directly follows Scene 05's "LET'S BUILD SOMETHING INTELLIGENT."
 *
 * Implements:
 * 1. Deep near-black opening that builds into a full-screen cinematic chapter.
 * 2. Staggered typography:
 *    - 01 / IDENTITY & PHILOSOPHY mono label
 *    - Growing thin horizontal rule
 *    - IDENTITY (large word) & PHILOSOPHY (second large word) with horizontal clipping
 * 3. Authored Image Reveal:
 *    - Narrow vertical slice expanding horizontally
 *    - Light scan across image
 * 4. 3-Layer Depth Parallax:
 *    - BACK: subtle architectural grid & grain (0.1x)
 *    - MIDDLE: large personal photograph (0.35x)
 *    - FRONT: editorial typography (0.7x)
 *    - UI: credentials & callouts (1x)
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface IdentityPhilosophyProps {
  reducedMotion?: boolean;
}

export default function IdentityPhilosophy({ reducedMotion = false }: IdentityPhilosophyProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll parallax mapping
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const photoY = useTransform(scrollYProgress, [0, 1], ['-18%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full min-h-screen py-24 md:py-36 px-6 lg:px-16 bg-[#08080A] border-t border-white/[0.08] overflow-hidden flex flex-col justify-center scroll-mt-[50px] z-10"
    >
      {/* =====================================================================
          LAYER 1: BACK — SUBTLE ARCHITECTURAL GRID & PARTICLES (0.1x)
          ===================================================================== */}
      <motion.div
        style={{ y: reducedMotion ? 0 : bgY }}
        className="absolute inset-0 pointer-events-none opacity-20"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:5rem_5rem]" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-red-600/10 rounded-full blur-[140px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col">
        {/* =====================================================================
            TOP CHOREOGRAPHY: LABEL + GROWING HORIZONTAL RULE
            ===================================================================== */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center justify-between pb-4">
            <div
              className="flex items-center gap-2.5 transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(-12px)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
                01 / IDENTITY & PHILOSOPHY
              </span>
            </div>

            <div
              className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest transition-all duration-700 delay-100"
              style={{
                opacity: inView ? 1 : 0,
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>KAMEL SHAH · MOHAMMED GOUS ALI SHAH</span>
            </div>
          </div>

          {/* Growing Thin Horizontal Rule */}
          <div className="w-full h-px bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-white/50 to-transparent transition-all duration-1000 ease-out"
              style={{
                width: inView ? '100%' : '0%',
              }}
            />
          </div>
        </div>

        {/* =====================================================================
            MONUMENTAL EDITORIAL WORDS (IDENTITY & PHILOSOPHY)
            ===================================================================== */}
        <div className="mb-12 md:mb-16 space-y-1">
          {/* Word 1: IDENTITY (Masked reveal from left) */}
          <div className="overflow-hidden leading-[0.9]">
            <h2
              className="text-[clamp(2.75rem,8.5vw,7.5rem)] font-black text-white tracking-tighter uppercase font-sans inline-block"
              style={{
                clipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
                WebkitClipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
                transform: inView ? 'translateX(0%)' : 'translateX(-25px)',
                filter: inView ? 'blur(0px)' : 'blur(8px)',
                opacity: inView ? 1 : 0,
                transition: 'clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 200ms, opacity 0.7s ease-out 200ms, filter 0.7s ease-out 200ms',
              }}
            >
              Identity
            </h2>
          </div>

          {/* Word 2: PHILOSOPHY (Masked reveal from right) */}
          <div className="overflow-hidden leading-[0.9]">
            <span
              className="text-[clamp(2.75rem,8.5vw,7.5rem)] font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-600 tracking-tighter uppercase font-sans inline-block"
              style={{
                clipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)',
                WebkitClipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)',
                transform: inView ? 'translateX(0%)' : 'translateX(25px)',
                filter: inView ? 'blur(0px)' : 'blur(8px)',
                opacity: inView ? 1 : 0,
                transition: 'clip-path 0.95s cubic-bezier(0.16, 1, 0.3, 1) 320ms, transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) 320ms, opacity 0.75s ease-out 320ms, filter 0.75s ease-out 320ms',
              }}
            >
              &amp; Philosophy
            </span>
          </div>

          {/* Subtitle Line */}
          <p
            className="text-sm sm:text-lg text-indigo-300 font-mono pt-3 tracking-wide transition-all duration-700 delay-500"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            Bridging engineering discipline with modern full-stack development and emerging AI workflows.
          </p>
        </div>

        {/* =====================================================================
            LAYERS 2 & 3: MIDDLE (PERSONAL PHOTOGRAPH) + FRONT (EDITORIAL TEXT)
            ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pb-14 border-b border-white/[0.08]">
          {/* Middle Layer: Expanding Slice Image Reveal */}
          <motion.div
            style={{ y: reducedMotion ? 0 : photoY }}
            className="lg:col-span-5 relative"
          >
            <div
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-950 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.85)] group"
              style={{
                clipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 48% 0% 48%)',
                WebkitClipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 48% 0% 48%)',
                transform: inView ? 'scale(1) translate3d(0, 0, 0)' : 'scale(1.08) translate3d(0, 15px, 0)',
                filter: inView ? 'blur(0px)' : 'blur(6px)',
                opacity: inView ? 1 : 0,
                transition: 'clip-path 1.1s cubic-bezier(0.16, 1, 0.3, 1) 400ms, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 400ms, opacity 0.7s ease-out 400ms, filter 0.8s ease-out 400ms',
              }}
            >
              <img
                src="/Photos/kamel-shah-bw.png"
                alt="Kamel Shah in high contrast portrait"
                className="w-full h-full object-cover object-top filter grayscale contrast-115 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent opacity-80 pointer-events-none" />

              {/* Horizontal light scan sweep */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  transform: inView ? 'translateX(200%)' : 'translateX(-200%)',
                  transition: 'transform 1.3s ease-in-out 600ms',
                }}
              />

              {/* Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-[11px] font-mono">
                <span className="text-white font-bold">KAMEL SHAH</span>
                <span className="text-indigo-400">ENGINEER · DEVELOPER</span>
              </div>
            </div>
          </motion.div>

          {/* Front Layer: Narrative Typography (0.7x) */}
          <motion.div
            style={{ y: reducedMotion ? 0 : textY }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div
              className="space-y-4 text-neutral-300 leading-relaxed transition-all duration-700 delay-500"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(16px)',
              }}
            >
              <p className="text-lg md:text-xl text-neutral-100 font-normal leading-relaxed">
                Kamel Shah, also known as <span className="text-white font-semibold">Mohammed Gous Ali Shah</span>, is an Electronics &amp; Computer Engineering professional working across full-stack web development, AI, Generative AI, Agentic AI, and technical support.
              </p>
              <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
                I am an Electronics &amp; Computer Engineering student at PES College of Engineering, Aurangabad (Expected 2026), concurrently pursuing an Online MBA in Artificial Intelligence &amp; Machine Learning at Dr. D. Y. Patil Vidyapeeth, Pune (2026–2028). Additionally, I have completed my Bachelor of Arts (B.A.) from Yashwantrao Chavan Maharashtra Open University (Completed 2026).
              </p>
              <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
                To expand my capabilities at the intersection of product design and artificial intelligence, I am enrolled in the Advanced Certificate in UI-UX Design with Agentic AI and GenAI from IIT Madras Pravartak Technologies Foundation (2026–2027), focusing on user-centered design, design thinking, Generative AI, and agentic workflows.
              </p>
              <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
                Alongside software development, I have actively managed IT infrastructure across 5 schools for Kamel Education Society since June 2023—supporting computer workstations, network routing, and institutional platforms like CampusOne. I completed a software engineering simulation with Deloitte / Forage (September 2026) and a developer internship at Bilim Technologies (2025).
              </p>
            </div>
          </motion.div>
        </div>

        {/* =====================================================================
            LAYER 4: UI — DEDICATED PROFILE CARD & EDITORIAL METRICS (1x)
            ===================================================================== */}
        {/* Profile Identity Callout */}
        <div className="my-10 p-6 md:p-8 rounded-2xl bg-[#0F1015] border border-white/[0.08] hover:border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all shadow-lg">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
                Verified Identity Profile
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">
              Kamel Shah = Mohammed Gous Ali Shah
            </h3>
            <p className="text-xs md:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Explore the comprehensive identity page detailing verified credentials, education, certifications, and unified entity representation.
            </p>
          </div>
          <a
            href="/kamel-shah"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
          >
            <span>View Identity Profile</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Three Editorial Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 text-left">
          <div className="flex flex-col gap-2 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-4xl md:text-5xl font-bold text-white font-mono tracking-tight">
              05+
            </div>
            <div className="text-sm font-semibold text-neutral-200">
              Institutional Schools Supported
            </div>
            <p className="text-xs text-neutral-400 font-mono leading-relaxed">
              Administered workstations, network setups &amp; system infrastructure at Kamel Education Society since 2023.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-4xl md:text-5xl font-bold text-white font-mono tracking-tight">
              07+
            </div>
            <div className="text-sm font-semibold text-neutral-200">
              Platforms &amp; Systems Built
            </div>
            <p className="text-xs text-neutral-400 font-mono leading-relaxed">
              From full-stack eCommerce (Decent Apparels) and school ERP (CampusOne) to institutional portals and REST APIs.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-4xl md:text-5xl font-bold text-white font-mono tracking-tight">
              2026
            </div>
            <div className="text-sm font-semibold text-neutral-200">
              Academic &amp; AI Specialization
            </div>
            <p className="text-xs text-neutral-400 font-mono leading-relaxed">
              PES College of Engineering, Dr. D. Y. Patil Vidyapeeth &amp; IIT Madras Pravartak Advanced Certificate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
