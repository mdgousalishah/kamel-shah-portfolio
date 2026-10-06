/**
 * SceneTypography.tsx
 * DOM Typography and interactive UI layer pinned inside the sticky viewport stage.
 *
 * Implements:
 * 1. Opening Title Sequence Choreography (Hero):
 *    - 0ms: Eyebrow badge
 *    - 120ms: KAMEL clip reveal from LEFT
 *    - 220ms: SHAH clip reveal from RIGHT
 *    - 400ms: Moniker ("Also known as Mohammed Gous Ali Shah") with subtle blur + opacity
 *    - 520ms: Engineering title ("Electronics & Computer Engineer")
 *    - 650ms: Role line (Full-Stack · Agentic AI · IT Support) sequentially
 *    - 800ms: Description paragraph
 *    - 980ms: Authored GlassAiButton CTA buttons (VIEW MY WORK, CONNECT ON LINKEDIN, RESUME)
 *    - 1150ms: Bottom capability micro-tags
 * 2. Scene 02 Agentic AI Activation:
 *    - Line-by-line editorial headline reveal
 *    - Progressive scroll-linked capability activation (Autonomous Agents -> RAG -> LLM)
 *    - Live Cognitive Loop Pipeline (Input -> Reasoning -> Retrieval -> Tool Execution -> Output)
 *    - GlassAiButton CTA
 * 3. Scene 03 Full-Stack Architecture:
 *    - Resilient Production Stacks
 *    - GlassAiButton CTA
 * 4. Scene 04 3D Orbital Project Solar System Selector:
 *    - Real 3D solar system orbit visible in full WebGL depth
 *    - Floating cinematic HUD panel (non-blocking) with real project screenshots, tech tags, and GlassAiButtons
 *    - Compact orbital node selector tabs for quick access
 * 5. Scene 05 Closing Collaboration Nexus ("LET'S BUILD SOMETHING INTELLIGENT."):
 *    - Me.jpg visibly integrated inside circular background portal with soft vignette, dark edge, indigo rim, depth parallax, and blur/scale reveal
 *    - All 4 action buttons powered by authored GlassAiButton visual language
 */

import React, { useState, useEffect } from 'react';
import { SceneTimelineState } from './SceneController';
import HoloIdentityCard from './HoloIdentityCard';
import GlassActionButton from './GlassActionButton';
import { CERTIFICATIONS } from '../../data/certifications';
import { PROJECTS } from '../../data/projects';
import {
  ArrowRight,
  Download,
  Linkedin,
  Sparkles,
  Terminal,
  Cpu,
  Database,
  ExternalLink,
  Github,
  Workflow,
  Search,
  Bot
} from 'lucide-react';

interface SceneTypographyProps {
  timelineState: SceneTimelineState;
  onNavigateToSection?: (selector: string) => void;
  reducedMotion?: boolean;
}

const LINKEDIN_URL = "https://www.linkedin.com/in/mohammed-gous-ali-shah-mohammed-mushtaque-ahmed-988657214";

export default function SceneTypography({
  timelineState,
  onNavigateToSection,
  reducedMotion = false,
}: SceneTypographyProps) {
  const { activeSceneIndex, nextSceneIndex, isTransitioning, transitionProgress, sceneProgress } = timelineState;

  // Staggered Hero Title Sequence Mounted State
  const [heroMounted, setHeroMounted] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setHeroMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  // Listen to external project selection events (e.g., from 3D raycaster)
  useEffect(() => {
    const onProjectSelect = (e: Event) => {
      const custom = e as CustomEvent<{ index: number }>;
      if (typeof custom.detail?.index === 'number') {
        setActiveProjectIndex(custom.detail.index);
      }
    };
    window.addEventListener('cinematic:select-project', onProjectSelect);
    return () => window.removeEventListener('cinematic:select-project', onProjectSelect);
  }, []);

  // Broadcast active project index so 3D orbital stage can align
  const handleSelectProject = (index: number) => {
    setActiveProjectIndex(index);
    window.dispatchEvent(new CustomEvent('cinematic:select-project', { detail: { index } }));
  };

  // Generic Scene container visibility style
  // Generic Scene container visibility style
  const getSceneContainerStyle = (index: number): React.CSSProperties => {
    let opacity = 0;
    let pointerEvents: 'auto' | 'none' = 'none';

    if (activeSceneIndex === index) {
      if (index === 4 && timelineState.isTimelineExiting) {
        opacity = Math.max(0, 1 - timelineState.timelineExitProgress * 1.1);
      } else {
        opacity = isTransitioning ? 1 - transitionProgress : 1;
      }
      pointerEvents = (isTransitioning && transitionProgress > 0.4) || (index === 4 && timelineState.timelineExitProgress > 0.5) ? 'none' : 'auto';
    } else if (nextSceneIndex === index && isTransitioning) {
      opacity = transitionProgress;
      pointerEvents = transitionProgress > 0.6 ? 'auto' : 'none';
    }

    return {
      opacity,
      pointerEvents,
      transition: 'opacity 0.15s ease-out',
    };
  };

  const handleNav = (selector: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigateToSection) {
      onNavigateToSection(selector);
    } else {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scene 01 Mixed-Directional Entrance & Exit States
  const isS1Active = activeSceneIndex === 0;
  const s1Exit = isTransitioning && activeSceneIndex === 0 ? transitionProgress : 0;

  // Directional scroll exits:
  const headlineExitX = reducedMotion ? 0 : s1Exit * -45;
  const roleExitX = reducedMotion ? 0 : s1Exit * 40;
  const ctaExitScale = reducedMotion ? 1 : 1 - s1Exit * 0.08;

  // Scene 02 Progressive Activation State (0.0 -> 1.0)
  const isS2Present = activeSceneIndex === 1 || (nextSceneIndex === 1 && isTransitioning);
  const isS2Active = activeSceneIndex === 1;
  const s2Progress = isS2Active ? sceneProgress : (isTransitioning && nextSceneIndex === 1 ? transitionProgress * 0.3 : 0);
  const activeModuleIndex = s2Progress < 0.35 ? 0 : s2Progress < 0.7 ? 1 : 2;

  // Scene 04 Active Project Data
  const currentProject = PROJECTS[activeProjectIndex] || PROJECTS[0];

  // Scene 05 Active State & 5-Stage Staged Photo Reveal
  const isS5Active = activeSceneIndex === 4 || (nextSceneIndex === 4 && isTransitioning);
  const s5RevealProgress = activeSceneIndex === 4
    ? Math.min(1, Math.max(0, sceneProgress * 1.35))
    : isTransitioning && nextSceneIndex === 4
    ? Math.min(1, Math.max(0, transitionProgress * 0.75))
    : 0;

  // Staged Reveal Parameters:
  // 0%: portal barely visible
  // 20%: thin slice of Me.jpg appears
  // 45%: face becomes recognizable
  // 70%: most of portrait visible
  // 100%: full portrait sharp and stable
  const getPortalRevealStyle = (p: number): React.CSSProperties => {
    const t = Math.max(0, Math.min(1, p));
    let clipInset = 50; // percentage from left & right
    let opacity = 0;
    let blur = 14;
    let scale = 1.08;

    if (t <= 0.20) {
      const sub = t / 0.20;
      clipInset = 50 - sub * 8; // 50% -> 42% (thin slice)
      opacity = sub * 0.35;
      blur = 14 - sub * 5; // 14px -> 9px
      scale = 1.08 - sub * 0.02; // 1.08 -> 1.06
    } else if (t <= 0.45) {
      const sub = (t - 0.20) / 0.25;
      clipInset = 42 - sub * 20; // 42% -> 22% (face becomes recognizable)
      opacity = 0.35 + sub * 0.40; // 0.35 -> 0.75
      blur = 9 - sub * 5; // 9px -> 4px
      scale = 1.06 - sub * 0.03; // 1.06 -> 1.03
    } else if (t <= 0.70) {
      const sub = (t - 0.45) / 0.25;
      clipInset = 22 - sub * 16; // 22% -> 6% (most of portrait visible)
      opacity = 0.75 + sub * 0.20; // 0.75 -> 0.95
      blur = 4 - sub * 3; // 4px -> 1px
      scale = 1.03 - sub * 0.02; // 1.03 -> 1.01
    } else {
      const sub = (t - 0.70) / 0.30;
      clipInset = 6 - sub * 6; // 6% -> 0% (full portrait sharp & stable)
      opacity = 0.95 + sub * 0.05; // 1.00
      blur = Math.max(0, 1 - sub * 1); // 0px
      scale = 1.01 - sub * 0.01; // 1.00
    }

    return {
      clipPath: `inset(0% ${clipInset.toFixed(1)}% 0% ${clipInset.toFixed(1)}% round 9999px)`,
      opacity,
      filter: `blur(${blur.toFixed(1)}px)`,
      transform: `scale(${scale.toFixed(3)})`,
      transition: 'clip-path 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out, filter 0.25s ease-out, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden font-sans">
      {/* =====================================================================
          SCENE 01: PERSONAL IDENTITY (TITLE SEQUENCE CHOREOGRAPHY + 3D HOLO CARD)
          ===================================================================== */}
      <div
        style={getSceneContainerStyle(0)}
        className="absolute inset-0 flex flex-col justify-start lg:justify-center items-center px-4 sm:px-8 lg:px-16 pt-[max(4.5rem,calc(env(safe-area-inset-top,0px)+3.8rem))] lg:pt-0 pb-12 lg:pb-0 overflow-y-auto lg:overflow-visible scrollbar-none pointer-events-auto lg:pointer-events-none"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col compact:grid compact:grid-cols-[1.35fr_0.9fr] compact:gap-4 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Column: Hero Editorial Title Sequence */}
          <div className="flex flex-col justify-center compact:col-span-1 lg:col-span-7 text-left w-full">
            {/* 1. Eyebrow Badge (0ms: Fade + Scale) */}
            <div
              style={{
                opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                transform: `scale(${isS1Active && heroMounted ? 1 : 0.94})`,
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out',
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-neutral-300 text-xs font-mono tracking-wider mb-2.5 sm:mb-3 w-fit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PORTFOLIO // 2026 EDITION</span>
            </div>

            {/* 2. Primary Headline with Horizontal Masks */}
            <h1 className="text-[clamp(44px,14vw,76px)] lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-2 font-display">
              {/* KAMEL: Enters from LEFT (120ms) */}
              <span className="block overflow-hidden">
                <span
                  style={{
                    transform: isS1Active && heroMounted
                      ? `translate3d(${headlineExitX}px, 0, 0)`
                      : 'translate3d(-100%, 0, 0)',
                    opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 120ms, opacity 0.6s ease-out 120ms',
                  }}
                  className="inline-block text-white"
                >
                  KAMEL
                </span>
              </span>

              {/* SHAH: Enters from RIGHT (220ms) */}
              <span className="block overflow-hidden">
                <span
                  style={{
                    transform: isS1Active && heroMounted
                      ? `translate3d(${headlineExitX * 0.7}px, 0, 0)`
                      : 'translate3d(100%, 0, 0)',
                    opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                    transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 220ms, opacity 0.6s ease-out 220ms',
                  }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-indigo-400"
                >
                  SHAH
                </span>
              </span>
            </h1>

            {/* 3. Moniker (400ms: Soft Opacity + Blur settle) */}
            <div
              style={{
                opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                filter: isS1Active && heroMounted ? 'blur(0px)' : 'blur(8px)',
                transition: 'opacity 0.6s ease-out 400ms, filter 0.6s ease-out 400ms',
              }}
              className="text-xs sm:text-sm font-mono text-neutral-400 tracking-wide mb-2 sm:mb-3"
            >
              Also known as <span className="text-neutral-200 font-semibold">Mohammed Gous Ali Shah</span>
            </div>

            {/* 4. Engineering Discipline (520ms: Wipe from Bottom) */}
            <div className="overflow-hidden mb-1.5 sm:mb-2">
              <div
                style={{
                  transform: isS1Active && heroMounted
                    ? `translate3d(0, 0, 0)`
                    : 'translate3d(0, 100%, 0)',
                  opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 520ms, opacity 0.5s ease-out 520ms',
                }}
                className="text-base sm:text-2xl font-bold text-white tracking-tight"
              >
                Electronics & Computer Engineer
              </div>
            </div>

            {/* 5. Role Line (650ms: Enters from LEFT) */}
            <div className="overflow-hidden mb-3 sm:mb-4">
              <div
                style={{
                  transform: isS1Active && heroMounted
                    ? `translate3d(${roleExitX}px, 0, 0)`
                    : 'translate3d(-40px, 0, 0)',
                  opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                  transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) 650ms, opacity 0.5s ease-out 650ms',
                }}
                className="text-xs sm:text-base font-mono text-indigo-300 uppercase tracking-wider flex flex-wrap items-center gap-1.5 sm:gap-2"
              >
                <span className="text-neutral-200">Full-Stack</span>
                <span className="text-neutral-500">·</span>
                <span className="text-indigo-400 font-semibold">Agentic AI</span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-200">IT & Tech Support</span>
              </div>
            </div>

            {/* 6. Description Paragraph (800ms: Soft Opacity + Blur settle) */}
            <p
              style={{
                opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                filter: isS1Active && heroMounted ? 'blur(0px)' : 'blur(6px)',
                transition: 'opacity 0.6s ease-out 800ms, filter 0.6s ease-out 800ms',
              }}
              className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed w-full lg:max-w-xl mb-5 sm:mb-6"
            >
              Building intelligent, autonomous web architectures with production-grade engineering, LLM orchestration, structured RAG pipelines, and grounded enterprise IT experience.
            </p>

            {/* 7. CTA Buttons with Authored GlassAiButton Visual System (Desktop / Tablet >= 768px) */}
            <div
              style={{
                opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                transform: `scale(${ctaExitScale}) translate3d(0, ${isS1Active && heroMounted ? 0 : 20}px, 0)`,
                transition: 'transform 0.6s ease-out 980ms, opacity 0.5s ease-out 980ms',
              }}
              className="hidden md:flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2.5 sm:gap-3.5 pointer-events-auto w-full sm:w-auto"
            >
              <GlassActionButton
                href="#projects"
                onClick={(e) => handleNav('#projects', e)}
                variant="vermilion"
                icon={<ArrowRight className="w-4 h-4" />}
                delayNavigation={220}
                className="w-full xs:w-auto justify-center min-h-[44px]"
              >
                VIEW MY WORK
              </GlassActionButton>

              <GlassActionButton
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="linkedin"
                icon={<Linkedin className="w-4 h-4" />}
                delayNavigation={200}
                className="w-full xs:w-auto justify-center min-h-[44px]"
              >
                CONNECT ON LINKEDIN
              </GlassActionButton>

              <GlassActionButton
                href="/Photos/MOHAMMED GOUS ALI SHAH RESUME.pdf"
                download="Mohammed_Gous_Ali_Shah_Resume.pdf"
                variant="default"
                icon={<Download className="w-4 h-4" />}
                delayNavigation={180}
                className="w-full xs:w-auto justify-center min-h-[44px]"
              >
                RESUME
              </GlassActionButton>
            </div>

            {/* 8. Desktop Bottom Capability Micro-Tags (in left column on desktop) */}
            <div
              style={{
                transform: isS1Active && heroMounted
                  ? 'translate3d(0, 0, 0)'
                  : 'translate3d(30px, 0, 0)',
                opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                transition: 'transform 0.6s ease-out 1150ms, opacity 0.5s ease-out 1150ms',
              }}
              className="hidden md:flex flex-wrap items-center gap-3 pt-5 mt-4 border-t border-white/10"
            >
              <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 tracking-wider">01 / FULL-STACK</span>
              <span className="text-neutral-600">·</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 tracking-wider">02 / AGENTIC AI</span>
              <span className="text-neutral-600">·</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 tracking-wider">03 / GENERATIVE AI</span>
            </div>
          </div>

          {/* Right Column: 3D Holographic Identity Card + Mobile CTA Buttons */}
          <div className="flex flex-col compact:col-span-1 lg:col-span-5 justify-center items-center pointer-events-auto w-full my-4 compact:my-0 lg:my-0 origin-center">
            <HoloIdentityCard
              scrollProgress={sceneProgress}
              isTransitioning={isTransitioning && activeSceneIndex === 0}
              transitionProgress={transitionProgress}
              reducedMotion={reducedMotion}
            />

            {/* Mobile CTA Buttons (<= 767px: strictly below Identity Card) */}
            <div
              style={{
                opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                transform: `scale(${ctaExitScale}) translate3d(0, ${isS1Active && heroMounted ? 0 : 20}px, 0)`,
                transition: 'transform 0.6s ease-out 980ms, opacity 0.5s ease-out 980ms',
              }}
              className="flex compact:hidden md:hidden flex-col items-center gap-2.5 mt-6 w-full max-w-[330px] pointer-events-auto"
            >
              <GlassActionButton
                href="#projects"
                onClick={(e) => handleNav('#projects', e)}
                variant="vermilion"
                icon={<ArrowRight className="w-4 h-4" />}
                delayNavigation={220}
                className="w-full justify-center min-h-[44px]"
              >
                VIEW MY WORK
              </GlassActionButton>

              <GlassActionButton
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="linkedin"
                icon={<Linkedin className="w-4 h-4" />}
                delayNavigation={200}
                className="w-full justify-center min-h-[44px]"
              >
                CONNECT ON LINKEDIN
              </GlassActionButton>

              <GlassActionButton
                href="/Photos/MOHAMMED GOUS ALI SHAH RESUME.pdf"
                download="Mohammed_Gous_Ali_Shah_Resume.pdf"
                variant="default"
                icon={<Download className="w-4 h-4" />}
                delayNavigation={180}
                className="w-full justify-center min-h-[44px]"
              >
                RESUME
              </GlassActionButton>
            </div>

            {/* Mobile Bottom Capability Micro-Tags (positioned below CTA buttons on mobile) */}
            <div
              style={{
                opacity: isS1Active && heroMounted ? 1 - s1Exit : 0,
                transition: 'opacity 0.6s ease-out 1150ms',
              }}
              className="flex compact:hidden md:hidden flex-wrap items-center justify-center gap-2 pt-4 mt-3 border-t border-white/10 w-full text-center"
            >
              <span className="text-[10px] font-mono text-neutral-400 tracking-wider">01 / FULL-STACK</span>
              <span className="text-neutral-600">·</span>
              <span className="text-[10px] font-mono text-neutral-400 tracking-wider">02 / AGENTIC AI</span>
              <span className="text-neutral-600">·</span>
              <span className="text-[10px] font-mono text-neutral-400 tracking-wider">03 / GENERATIVE AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SCENE 02: AGENTIC AI & NEURAL SYSTEMS (COGNITIVE ACTIVATION WORKFLOW)
          ===================================================================== */}
      <div
        style={getSceneContainerStyle(1)}
        className="absolute inset-x-4 sm:inset-x-8 lg:inset-x-16 top-1/2 -translate-y-1/2 flex flex-col justify-center max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono tracking-wider mb-2.5 sm:mb-3 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span>SCENE 02 / AGENTIC ARCHITECTURES</span>
        </div>

        {/* Editorial Headline: Revealed Line by Line */}
        <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase mb-2.5 sm:mb-3">
          <span className="block overflow-hidden leading-[1.05]">
            <span
              style={{
                transform: isS2Present ? 'translateY(0%)' : 'translateY(100%)',
                opacity: isS2Present ? 1 : 0,
                transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out',
              }}
              className="inline-block"
            >
              Pioneering Agentic
            </span>
          </span>
          <span className="block overflow-hidden leading-[1.05]">
            <span
              style={{
                transform: isS2Present ? 'translateY(0%)' : 'translateY(100%)',
                opacity: isS2Present ? 1 : 0,
                transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 100ms, opacity 0.55s ease-out 100ms',
              }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400"
            >
              Intelligence
            </span>
          </span>
        </h2>

        <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-3 sm:mb-4 max-w-2xl">
          Architecting multi-agent ecosystems where reasoning models decompose complex intents, retrieve ground truth from vector graphs, and execute precise actions autonomously.
        </p>

        {/* Live Cognitive Loop Pipeline Banner */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md mb-3 sm:mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1.5 sm:mb-2">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Bot className="w-3.5 h-3.5" />
              <span>COGNITIVE LOOP EXECUTION PIPELINE</span>
            </span>
            <span className="text-emerald-400">ACTIVE LOOP</span>
          </div>

          <div className="grid grid-cols-5 gap-1 text-center text-[7.5px] xs:text-[8.5px] sm:text-[9px] font-mono">
            <div className={`p-1 sm:p-1.5 rounded border transition-colors ${s2Progress >= 0.0 ? 'bg-indigo-500/20 border-indigo-500/40 text-white' : 'bg-white/[0.02] border-white/5 text-neutral-500'}`}>
              <span className="xs:hidden">01 IN</span>
              <span className="hidden xs:inline">01 INPUT</span>
            </div>
            <div className={`p-1 sm:p-1.5 rounded border transition-colors ${s2Progress >= 0.2 ? 'bg-indigo-500/20 border-indigo-500/40 text-white' : 'bg-white/[0.02] border-white/5 text-neutral-500'}`}>
              <span className="xs:hidden">02 RS</span>
              <span className="hidden xs:inline">02 REASON</span>
            </div>
            <div className={`p-1 sm:p-1.5 rounded border transition-colors ${s2Progress >= 0.4 ? 'bg-indigo-500/20 border-indigo-500/40 text-white' : 'bg-white/[0.02] border-white/5 text-neutral-500'}`}>
              <span className="xs:hidden">03 RAG</span>
              <span className="hidden xs:inline">03 RETRIEVE</span>
            </div>
            <div className={`p-1 sm:p-1.5 rounded border transition-colors ${s2Progress >= 0.65 ? 'bg-indigo-500/20 border-indigo-500/40 text-white' : 'bg-white/[0.02] border-white/5 text-neutral-500'}`}>
              <span className="xs:hidden">04 TOOL</span>
              <span className="hidden xs:inline">04 TOOL EXEC</span>
            </div>
            <div className={`p-1 sm:p-1.5 rounded border transition-colors ${s2Progress >= 0.85 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/[0.02] border-white/5 text-neutral-500'}`}>
              <span className="xs:hidden">05 OUT</span>
              <span className="hidden xs:inline">05 OUTPUT</span>
            </div>
          </div>
        </div>

        {/* 3 Progressive Capability Clusters (Stacked on Mobile, 3 Cols on Tablet/Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
          {/* Cluster 1: Autonomous Agents */}
          <div className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-500 ${activeModuleIndex === 0 ? 'bg-indigo-500/15 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-white/[0.02] border-white/10 opacity-70'}`}>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <Workflow className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              <span className="text-[9px] font-mono text-indigo-300">STAGE 01</span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 sm:mb-1">01 / Multi-Agent Systems</h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
              Hierarchical planning, tool calling, goal decomposition, and self-correcting reflection loops.
            </p>
          </div>

          {/* Cluster 2: RAG & Vector Retrieval */}
          <div className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-500 ${activeModuleIndex === 1 ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-white/[0.02] border-white/10 opacity-70'}`}>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-[9px] font-mono text-cyan-300">STAGE 02</span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 sm:mb-1">02 / RAG & Vector Search</h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
              Semantic embeddings, hybrid lexical/vector ranking, chunking strategies, and grounded recall.
            </p>
          </div>

          {/* Cluster 3: LLM Orchestration */}
          <div className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-500 ${activeModuleIndex === 2 ? 'bg-rose-500/15 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'bg-white/[0.02] border-white/10 opacity-70'}`}>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
              <span className="text-[9px] font-mono text-rose-300">STAGE 03</span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 sm:mb-1">03 / LLM Integration</h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
              Structured JSON outputs, function-calling schemas, rate limiting, and real-time streaming.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <GlassActionButton
            href="#skills"
            onClick={(e) => handleNav('#skills', e)}
            variant="default"
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center min-h-[44px] text-xs"
          >
            EXPLORE AI & FULL-STACK SYSTEM CAPABILITIES
          </GlassActionButton>
        </div>
      </div>

      {/* =====================================================================
          SCENE 03: FULL-STACK ARCHITECTURE (PRODUCTION WORKSPACE ENVIRONMENT)
          ===================================================================== */}
      <div
        style={getSceneContainerStyle(2)}
        className="absolute inset-x-4 sm:inset-x-8 lg:inset-x-16 top-1/2 -translate-y-1/2 flex flex-col justify-center max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono tracking-wider mb-3 sm:mb-4 w-fit">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCENE 03 / FULL-STACK ARCHITECTURE</span>
        </div>

        <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase mb-3 sm:mb-4">
          Resilient Production Stacks
        </h2>

        <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-4 sm:mb-6 max-w-2xl">
          Bridging modern responsive frontend engineering with high-concurrency microservice backends, structured databases, and clean RESTful API contracts. Grounded in real institutional IT infrastructure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-[10px] sm:text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">01 / FRONTEND</div>
            <div className="text-sm sm:text-base font-bold text-white mb-1">React 19, TypeScript, TailwindCSS</div>
            <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
              Modular UI systems, responsive micro-animations, client routing, and accessibility (WCAG).
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-[10px] sm:text-xs font-mono text-indigo-400 uppercase tracking-widest mb-1">02 / BACKEND & APIS</div>
            <div className="text-sm sm:text-base font-bold text-white mb-1">Node.js, Express, PHP, Laravel, Lumen</div>
            <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
              RESTful APIs, JWT authentication, middleware pipelines, and scalable database abstractions.
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-[10px] sm:text-xs font-mono text-rose-400 uppercase tracking-widest mb-1">03 / DATABASES</div>
            <div className="text-sm sm:text-base font-bold text-white mb-1">MongoDB, MySQL, SQLite, PostgreSQL</div>
            <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
              Relational & document schemas, indexing strategies, ACID guarantees, and ORM query optimization.
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-[10px] sm:text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">04 / INFRASTRUCTURE</div>
            <div className="text-sm sm:text-base font-bold text-white mb-1">Git, GitHub, Firebase, Azure, IT Support</div>
            <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
              Version control workflows, cloud deployments, hardware diagnostics, and IT technical support.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <GlassActionButton
            href="#projects"
            onClick={(e) => handleNav('#projects', e)}
            variant="cyan"
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center min-h-[44px] text-xs"
          >
            VIEW DEPLOYED APPLICATIONS
          </GlassActionButton>
        </div>
      </div>

      {/* =====================================================================
          SCENE 04: REAL 3D SOLAR SYSTEM ORBITAL PROJECT SELECTOR (ALL 7 PROJECTS)
          Centered view leaves 3D WebGL orbit & central core visible;
          Floating cinematic HUD panel provides details without obstruction.
          ===================================================================== */}
      <div
        style={getSceneContainerStyle(3)}
        className="absolute inset-x-3 sm:inset-x-8 lg:inset-x-16 inset-y-4 sm:inset-y-6 flex flex-col justify-between max-w-7xl mx-auto"
      >
        {/* Top Header Strip */}
        <div className="flex items-center justify-between pt-1 sm:pt-2">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] sm:text-xs font-mono tracking-wider w-fit mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              <span>SCENE 04 / 3D ORBITAL PROJECT SELECTOR</span>
            </div>
            <h2 className="text-base sm:text-3xl font-black text-white tracking-tight uppercase">
              Selected Production Applications
            </h2>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-indigo-300 block">
              7 PLATFORMS ORBITING CORE
            </span>
            <span className="text-[9px] font-mono text-neutral-500">
              CLICK OR DRAG ORBIT TO NAVIGATE
            </span>
          </div>
        </div>

        {/* Floating Cinematic Technical HUD Panel (Docked at Bottom, Translucent, Minimal Weight) */}
        <div className="flex flex-col gap-2 pb-1 sm:pb-2 max-w-xl pointer-events-auto">
          <div className="relative p-3 sm:p-4 rounded-xl bg-neutral-950/70 border border-white/10 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.6)] transition-all duration-300">
            {/* Technical Node Header */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest">
                  {currentProject.category}
                </span>
              </div>
              <span className="text-[9px] font-mono text-neutral-400">
                ACTIVE NODE {currentProject.number} // 07
              </span>
            </div>

            {/* Project Title */}
            <h3 className="text-sm sm:text-lg font-black text-white tracking-tight truncate mb-1">
              {currentProject.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-neutral-300/90 leading-relaxed line-clamp-2 mb-2 sm:mb-3">
              {Array.isArray(currentProject.description)
                ? currentProject.description[0]
                : currentProject.description}
            </p>

            {/* Tech Pills & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
              <div className="flex flex-wrap gap-1">
                {currentProject.tech.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/8 text-[8.5px] font-mono text-neutral-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {currentProject.link && <GlassActionButton
                  href={currentProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="vermilion"
                  icon={<ExternalLink className="w-3 h-3" />}
                  className="px-3 py-1.5 text-xs min-h-[38px]"
                >
                  LIVE DEMO
                </GlassActionButton>}

                {currentProject.github && (
                  <GlassActionButton
                    href={currentProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="default"
                    icon={<Github className="w-3 h-3" />}
                    className="px-3 py-1.5 text-xs min-h-[38px]"
                  >
                    SOURCE
                  </GlassActionButton>
                )}
              </div>
            </div>
          </div>

          {/* 7 Orbital Project Selection Tabs - Compact and no overflow on narrow screens */}
          <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-1.5 w-full pointer-events-auto">
            {PROJECTS.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => handleSelectProject(idx)}
                aria-label={`Select Project ${proj.number}: ${proj.title}`}
                className={`flex-1 sm:flex-initial min-w-[32px] sm:min-w-0 h-8 sm:h-auto sm:px-2.5 sm:py-1 rounded-lg text-[9px] font-mono transition-all border flex items-center justify-center gap-1.5 ${
                  activeProjectIndex === idx
                    ? 'bg-rose-500/25 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : 'bg-black/50 border-white/10 text-neutral-400 hover:text-white hover:border-white/25'
                }`}
              >
                <span className={`text-[8.5px] font-bold ${activeProjectIndex === idx ? 'text-white' : 'text-neutral-400'}`}>
                  {proj.number}
                </span>
                <span className="font-semibold hidden sm:inline truncate max-w-[120px]">{proj.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================================
          SCENE 05: COLLABORATION & INITIATIVE (FEATURING CIRCULAR ME.JPG PORTAL)
          ===================================================================== */}
      <div
        style={{
          ...getSceneContainerStyle(4),
          transform: timelineState.isTimelineExiting
            ? `translate3d(0, ${-timelineState.timelineExitProgress * 40}px, 0)`
            : undefined,
        }}
        className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 lg:px-16 overflow-y-auto lg:overflow-visible scrollbar-none py-16 lg:py-0"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Glass Action Buttons */}
          <div className="flex flex-col justify-center lg:col-span-7 text-left w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono tracking-wider mb-2.5 sm:mb-4 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SCENE 05 / INITIATE COLLABORATION</span>
            </div>

            <h2 className="text-[clamp(1.85rem,5.5vw,4.5rem)] font-black text-white tracking-tight leading-[0.96] uppercase mb-2.5 sm:mb-4 font-display">
              LET'S BUILD<br />
              SOMETHING<br />
              INTELLIGENT.
            </h2>

            <div className="mb-4 sm:mb-6 space-y-1">
              <div className="text-lg sm:text-2xl font-bold text-neutral-100">
                Kamel Shah
              </div>
              <div className="text-xs sm:text-sm font-mono text-indigo-300 uppercase tracking-wide">
                Electronics & Computer Engineer · Full-Stack Developer · Agentic AI Developer · IT Support
              </div>
            </div>

            {/* Authored GlassAiButton CTA Cluster */}
            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2.5 sm:gap-3.5 pointer-events-auto w-full sm:w-auto">
              <GlassActionButton
                href="#contact"
                onClick={(e) => handleNav('#contact', e)}
                variant="emerald"
                icon={<ArrowRight className="w-4 h-4" />}
                delayNavigation={220}
                className="w-full xs:w-auto justify-center min-h-[44px]"
              >
                SEND INQUIRY →
              </GlassActionButton>

              <GlassActionButton
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="linkedin"
                icon={<Linkedin className="w-4 h-4" />}
                delayNavigation={200}
                className="w-full xs:w-auto justify-center min-h-[44px]"
              >
                CONNECT ON LINKEDIN →
              </GlassActionButton>

              <GlassActionButton
                href="#projects"
                onClick={(e) => handleNav('#projects', e)}
                variant="default"
                delayNavigation={200}
                className="w-full xs:w-auto justify-center min-h-[44px]"
              >
                VIEW PROJECTS ↓
              </GlassActionButton>

              <GlassActionButton
                href="#certifications"
                onClick={(e) => handleNav('#certifications', e)}
                variant="default"
                icon={<Sparkles className="w-4 h-4" />}
                delayNavigation={200}
                className="w-full xs:w-auto justify-center min-h-[44px]"
              >
                VIEW {CERTIFICATIONS.length} VERIFIED CERTIFICATES ↓
              </GlassActionButton>
            </div>
          </div>

          {/* Right Column: Circular Portal Framing /Photos/Me.jpg with 5-stage progressive reveal */}
          <div className="flex justify-center items-center lg:col-span-5 relative mt-4 lg:mt-0 overflow-hidden">
            {/* Layer 6: Portal Glow (outer soft ambient halo) */}
            <div
              className="absolute -inset-4 sm:-inset-8 rounded-full pointer-events-none transition-opacity duration-700"
              style={{
                opacity: Math.min(1, s5RevealProgress * 1.15),
                background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(224,35,28,0.12) 42%, transparent 70%)',
                filter: 'blur(36px)',
              }}
            />

            {/* Circular Portal Frame with Staged Reveal (clip-path, opacity, scale, blur) */}
            <div
              className="relative w-[220px] xs:w-[250px] sm:w-[280px] lg:w-[380px] aspect-square rounded-full overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(99,102,241,0.2)] mx-auto"
              style={getPortalRevealStyle(s5RevealProgress)}
            >
              {/* Layer 1: Me.jpg with subtle brightness/contrast adjustment */}
              <img
                src="/Photos/Me.jpg"
                alt="Kamel Shah portrait"
                className="w-full h-full object-cover object-top select-none pointer-events-none"
                style={{
                  filter: 'brightness(1.10) contrast(1.06) saturate(1.04)',
                }}
              />

              {/* Layer 2: Subtle radial lighting treatment over face */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 36%, rgba(255,255,255,0.14) 0%, rgba(99,102,241,0.07) 38%, transparent 70%)',
                }}
              />

              {/* Layer 3: Soft radial vignette framing the photograph */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, transparent 58%, rgba(8,10,15,0.48) 80%, rgba(8,10,15,0.94) 100%)',
                }}
              />

              {/* Layer 4: Very subtle film grain/texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 0)`,
                  backgroundSize: '3px 3px',
                }}
              />

              {/* Layer 5: Indigo Rim Ring (inner rim) */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: '1.5px solid rgba(129,140,248,0.55)',
                  boxShadow: 'inset 0 0 22px rgba(99,102,241,0.3), inset 0 0 6px rgba(255,255,255,0.25)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
