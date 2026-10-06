/**
 * HoloIdentityCard.tsx
 * Double-sided 3D Holographic Identity Card with authentic outward-normal orientation,
 * continuous damped rotation (0° -> 25° -> 80° -> 120° -> 155° -> 180°),
 * thin holographic light sweep at 90°, and progressive back photo & text reveals.
 *
 * Front Face (rotationY = 0):
 *   Photo A (Black Suit) + Verified chip + Holographic foil + Parbhani MH badge
 * Back Face (rotationY = 180deg):
 *   100% Upright & readable (no vertical/horizontal mirroring)
 *   New Front-Facing Portrait (/Photos/kamel-shah-front.png) with animated slice reveal (110° -> 180°)
 *   Sequential staggered specialisation & tech stack reveals
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, ShieldCheck, Cpu, Code2, Sparkles } from 'lucide-react';

interface HoloIdentityCardProps {
  scrollProgress: number;
  isTransitioning?: boolean;
  transitionProgress?: number;
  reducedMotion?: boolean;
  className?: string;
}

const SPECIALIZATIONS = [
  { num: '01', name: 'FULL-STACK DEVELOPMENT', dot: 'bg-emerald-400' },
  { num: '02', name: 'AGENTIC AI', dot: 'bg-indigo-400' },
  { num: '03', name: 'GENERATIVE AI', dot: 'bg-purple-400' },
  { num: '04', name: 'RAG / VECTOR SEARCH', dot: 'bg-cyan-400' },
  { num: '05', name: 'CLOUD COMPUTING', dot: 'bg-sky-400' },
  { num: '06', name: 'IT & TECHNICAL SUPPORT', dot: 'bg-rose-400' },
];

export default function HoloIdentityCard({
  scrollProgress,
  isTransitioning = false,
  transitionProgress = 0,
  reducedMotion = false,
  className = '',
}: HoloIdentityCardProps) {
  const cardShellRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0); // 0 to 180 continuous
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMaterialized, setIsMaterialized] = useState(false);

  // Progressive materialization on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMaterialized(true);
    }, 180);
    return () => clearTimeout(timer);
  }, []);

  // Continuous damped rotation loop (critically damped easing)
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      animFrameRef.current = requestAnimationFrame(loop);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const target = targetAngleRef.current;
      const current = currentAngleRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.05) {
        // Damped interpolation: current += (target - current) * (1 - exp(-delta * smoothing))
        const smoothing = reducedMotion ? 20 : 7.5;
        const factor = 1 - Math.exp(-delta * smoothing);
        const next = current + diff * factor;
        currentAngleRef.current = next;
        setCurrentAngle(next);
      } else if (current !== target) {
        currentAngleRef.current = target;
        setCurrentAngle(target);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [reducedMotion]);

  // Toggle card flip
  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev;
      targetAngleRef.current = next ? 180 : 0;
      return next;
    });
  }, []);

  // Keyboard 'F' key listener for flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          toggleFlip();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFlip]);

  // Pointer movement handling for 3D tilt & holographic sheen
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardShellRef.current) return;
    const rect = cardShellRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 2;
    const py = (y / rect.height - 0.5) * 2;

    const maxTilt = 14;
    setTilt({
      rx: -py * maxTilt,
      ry: px * maxTilt,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.6,
    });
  };

  const handlePointerEnter = () => setIsHovered(true);
  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt((prev) => ({
      ...prev,
      rx: 0,
      ry: 0,
      glareOpacity: 0,
    }));
  };

  // Scroll exit animation as Scene 01 transitions into Scene 02
  const scrollRotation = isTransitioning ? transitionProgress * -35 : scrollProgress * -15;
  const scrollScale = isTransitioning ? 1 - transitionProgress * 0.12 : 1;
  const scrollTranslateY = isTransitioning ? transitionProgress * -40 : 0;

  // Composite 3D tilt calculations:
  // When card flips past 90deg, tilt direction along X stays intuitive
  const tiltFactor = Math.cos((currentAngle * Math.PI) / 180);
  const effectiveTiltRy = isHovered ? tilt.ry * tiltFactor : 0;
  const effectiveTiltRx = isHovered ? tilt.rx : 0;

  // Edge highlight intensity: dominant during 70° - 110° region
  const edgeFactor = Math.max(0, 1 - Math.abs(currentAngle - 90) / 24);
  const edgeGlow = edgeFactor * 0.85;

  // Thin holographic light sweep at 90° region
  const sweepProgress = Math.max(0, Math.min(1, (currentAngle - 60) / 60));
  const sweepTranslate = (sweepProgress - 0.5) * 400; // -200% to +200%

  // Back photo reveal progression based on exact degree checkpoints:
  // 110°: starts appearing
  // 125°: narrow vertical slice
  // 140°: mask expands
  // 160°: photo almost fully visible
  // 180°: full photo
  const photoProgress = Math.max(0, Math.min(1, (currentAngle - 110) / 70));
  const photoClipRight = Math.max(0, 100 - photoProgress * 100);
  const photoOpacity = Math.max(0, Math.min(1, photoProgress * 1.25));
  const photoScale = 1.08 - photoProgress * 0.08;
  const photoBlur = (1 - photoProgress) * 8;

  // Back text reveals:
  // Name & title: starts at 120°
  const nameProgress = Math.max(0, Math.min(1, (currentAngle - 120) / 50));
  // Specialization header: starts at 135°
  const specHeaderProgress = Math.max(0, Math.min(1, (currentAngle - 135) / 40));
  // Tech stack: starts at 160°
  const techProgress = Math.max(0, Math.min(1, (currentAngle - 155) / 25));

  // Entrance settlement
  const entranceScale = isMaterialized ? 1 : 0.92;
  const entranceOpacity = isMaterialized ? 1 : 0.35;
  const entranceFilter = isMaterialized ? 'blur(0px)' : 'blur(6px)';

  // Exact face switching at 90° boundary to prevent Chromium preserve-3d / overflow:hidden backface-visibility bug
  const isBackSide = currentAngle >= 90;

  return (
    <div
      className={`holo-identity-card relative select-none w-fit mx-auto ${className}`}
      data-testid="holo-identity-card"
      style={{ perspective: 1200 }}
      role="region"
      aria-label="Kamel Shah Holographic Identity Card"
    >
      {/* 3D Card Shell (CardGroup) */}
      <div
        ref={cardShellRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onDoubleClick={toggleFlip}
        onClick={toggleFlip}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFlip();
          }
        }}
        style={{
          transform: `translate3d(0, ${scrollTranslateY}px, 0) scale(${scrollScale * entranceScale}) rotateX(${effectiveTiltRx}deg) rotateY(${currentAngle + effectiveTiltRy + (reducedMotion ? 0 : scrollRotation)}deg)`,
          transformStyle: 'preserve-3d',
          opacity: entranceOpacity,
          filter: entranceFilter,
          transition: isHovered
            ? 'filter 0.5s ease-out'
            : 'opacity 0.8s ease-out, filter 0.8s ease-out',
        }}
        className="relative w-[min(82vw,330px)] compact:w-[min(37vw,240px)] lg:w-[350px] aspect-[1/1.54] rounded-3xl cursor-pointer shadow-[0_30px_70px_rgba(0,0,0,0.9)] group focus:outline-none focus:ring-2 focus:ring-indigo-400/50 mx-auto"
      >
        {/* ===================================================================
            THIN EMISSIVE RIM (Dominant at 70° - 110° Edge Region)
            =================================================================== */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-150"
          style={{
            transform: 'translateZ(0px)',
            opacity: edgeGlow > 0 ? 1 : 0.25,
            boxShadow: edgeGlow > 0
              ? `0 0 35px rgba(224, 35, 28, ${edgeGlow * 0.75}), 0 0 25px rgba(99, 102, 241, ${edgeGlow})`
              : '0 0 15px rgba(99, 102, 241, 0.25)',
          }}
        />

        {/* Thin Holographic Light Sweep in the 90° Region */}
        {edgeFactor > 0.05 && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none z-40 overflow-hidden"
            style={{ transform: 'translateZ(3px)' }}
          >
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.7) 50%, rgba(224,35,28,0.55) 65%, transparent 85%)',
                transform: `translateX(${sweepTranslate}%)`,
              }}
            />
          </div>
        )}

        {/* ===================================================================
            FRONT FACE: PROFESSIONAL IDENTITY (PHOTO A: BLACK SUIT PHOTOGRAPH)
            Rotation: 0 deg (Normal pointing outward toward viewer)
            =================================================================== */}
        <div
          style={{
            display: isBackSide ? 'none' : 'flex',
            opacity: isBackSide ? 0 : 1,
            pointerEvents: isBackSide ? 'none' : 'auto',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg) translateZ(2px)',
            direction: 'ltr',
            writingMode: 'horizontal-tb',
          }}
          className="absolute inset-0 rounded-3xl overflow-hidden bg-[#0A0B10] border border-white/20 p-2.5 flex flex-col justify-between"
        >
          {/* Holographic Iridescent Foil Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 mix-blend-color-dodge"
            style={{
              opacity: tilt.glareOpacity,
              background: `radial-gradient(circle 280px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 60, 60, 0.5), rgba(99, 102, 241, 0.5) 45%, rgba(56, 189, 248, 0.4) 75%, transparent 100%)`,
            }}
          />

          {/* Micro-Grid Sheen */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_50%,rgba(224,35,28,0.08)_100%)] pointer-events-none z-10" />

          {/* Card Header Strip */}
          <div className="relative z-20 flex items-center justify-between px-3 pt-1.5 pb-1 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-neutral-300 uppercase">
                IDENTITY · ID: 2026
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[9px] font-mono text-indigo-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>VERIFIED</span>
            </div>
          </div>

          {/* Photo Frame (PHOTO A: SUIT PHOTOGRAPH) */}
          <div className="relative z-10 my-2 mx-1 aspect-[4/4.7] rounded-2xl overflow-hidden bg-neutral-950 border border-white/15 shadow-inner">
            <img
              src="/Photos/kamel-shah-suit.png"
              alt="Kamel Shah in professional black suit and white shirt"
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover:brightness-100 group-hover:scale-[1.02] transition-all duration-500"
              loading="eager"
            />
            {/* Vignette Edge */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10]/90 via-transparent to-transparent pointer-events-none" />

            {/* Location Badge */}
            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md border border-white/15 text-[9px] font-mono text-neutral-300 flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>PARBHANI, MH</span>
            </div>
          </div>

          {/* Card Footer Credentials */}
          <div className="relative z-20 px-3 pb-2 pt-1 bg-gradient-to-t from-[#0A0B10] to-transparent">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-base font-black text-white tracking-tight uppercase font-sans">
                Kamel Shah
              </span>
              <span className="text-[9px] font-mono text-neutral-400">
                ECE · 2026
              </span>
            </div>
            <div className="text-[11px] font-semibold text-neutral-200 leading-snug">
              Electronics & Computer Engineer
            </div>
            <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider mt-0.5">
              Full-Stack · Agentic AI · IT & Technical Support
            </div>
          </div>
        </div>

        {/* ===================================================================
            BACK FACE: SPECIALISATION & NEW FRONT-FACING PORTRAIT PANEL
            Rotation: 180 deg (Normal pointing outward toward back)
            100% Upright & Readable (Direction: LTR, Writing-Mode: horizontal-tb)
            =================================================================== */}
        <div
          style={{
            display: isBackSide ? 'flex' : 'none',
            opacity: isBackSide ? 1 : 0,
            pointerEvents: isBackSide ? 'auto' : 'none',
            transform: 'rotateY(180deg) translateZ(2px)',
            direction: 'ltr',
            writingMode: 'horizontal-tb',
          }}
          className="absolute inset-0 rounded-3xl overflow-hidden bg-[#07080C] border border-white/20 p-3 flex flex-col justify-between text-left"
        >
          {/* Holographic Iridescent Foil Overlay for Back */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 mix-blend-color-dodge"
            style={{
              opacity: tilt.glareOpacity,
              background: `radial-gradient(circle 280px at ${100 - tilt.glareX}% ${tilt.glareY}%, rgba(99, 102, 241, 0.5), rgba(224, 35, 28, 0.45) 50%, transparent 100%)`,
            }}
          />

          {/* 1. Header: KAMEL SHAH / SPECIALIZATION */}
          <div
            className="relative z-20 flex items-center justify-between pb-1.5 border-b border-white/10 text-[9px] font-mono"
            style={{
              opacity: nameProgress,
              transform: `translateY(${(1 - nameProgress) * -8}px)`,
            }}
          >
            <div>
              <span className="font-bold text-white tracking-wider block text-[11px]">KAMEL SHAH</span>
              <span className="text-neutral-400 tracking-wide text-[8px]">ELECTRONICS & COMPUTER ENGINEER</span>
            </div>
            <div className="flex items-center gap-1 text-indigo-400">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span className="text-[8px] uppercase tracking-widest">PROFILE 02</span>
            </div>
          </div>

          {/* 2. NEW FRONT-FACING PORTRAIT with slice reveal (110° -> 180°) */}
          <div className="relative z-20 my-1 flex items-center gap-2">
            {/* Portrait Thumbnail with Clip-Path Inset Slice & Light Scan */}
            <div
              className="relative w-[68px] h-[68px] sm:w-[80px] sm:h-[80px] rounded-xl overflow-hidden border border-white/20 shadow-md shrink-0 bg-neutral-950"
              style={{
                clipPath: `inset(0% ${photoClipRight}% 0% 0%)`,
                WebkitClipPath: `inset(0% ${photoClipRight}% 0% 0%)`,
                opacity: photoOpacity,
                transform: `scale(${photoScale})`,
                filter: `blur(${photoBlur}px)`,
              }}
            >
              <img
                src="/Photos/kamel-shah-front.png"
                alt="Kamel Shah professional front-facing portrait"
                className="w-full h-full object-cover object-top filter brightness-100 contrast-105"
                loading="eager"
              />
              {/* Subtle Light Scan across photo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  transform: `translateX(${(photoProgress - 0.5) * 200}%)`,
                  opacity: photoProgress > 0.3 ? 0.7 : 0,
                }}
              />
            </div>

            {/* Title Next to Portrait */}
            <div
              className="flex-1 min-w-0"
              style={{
                opacity: nameProgress,
                transform: `translateX(${(1 - nameProgress) * 12}px)`,
              }}
            >
              <span className="text-[10px] sm:text-[11px] font-bold text-neutral-100 tracking-tight leading-tight block uppercase truncate">
                Electronics & Computer Engineer
              </span>
              <span className="text-[8px] sm:text-[8.5px] font-mono text-indigo-300 block mt-0.5 truncate">
                B.Tech · PES College of Engg.
              </span>
              <span className="text-[7.5px] sm:text-[8px] font-mono text-neutral-400 block truncate">
                Online MBA in AI & ML · DY Patil
              </span>
            </div>
          </div>

          {/* 3. SPECIALIZATION: Compact Two-Column Format for Guaranteed Fit */}
          <div className="relative z-20 space-y-1 my-0.5">
            <div
              className="text-[8.5px] sm:text-[9px] font-mono font-bold text-indigo-300 uppercase tracking-widest pb-0.5 border-b border-white/10 flex items-center justify-between"
              style={{
                opacity: specHeaderProgress,
                transform: `translateY(${(1 - specHeaderProgress) * 6}px)`,
              }}
            >
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-indigo-400" />
                SPECIALIZATION
              </span>
              <span className="text-[8px] text-neutral-400">01–06</span>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-0.5">
              {SPECIALIZATIONS.map((spec, i) => {
                const itemThreshold = 142 + i * 4;
                const itemProgress = Math.max(0, Math.min(1, (currentAngle - itemThreshold) / 18));
                const itemOffset = (1 - itemProgress) * (i % 2 === 0 ? -8 : 8);

                return (
                  <div
                    key={spec.num}
                    className="flex items-center gap-1.5 text-[8px] sm:text-[8.5px] font-mono truncate"
                    style={{
                      opacity: itemProgress,
                      transform: `translateX(${itemOffset}px)`,
                      filter: `blur(${(1 - itemProgress) * 2}px)`,
                    }}
                  >
                    <span className="text-[7.5px] font-mono text-neutral-500 shrink-0">{spec.num}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${spec.dot} shrink-0`} />
                    <span className="font-semibold text-neutral-200 truncate">{spec.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. TECHNOLOGY STACK */}
          <div
            className="relative z-20 pt-1 border-t border-white/10"
            style={{
              opacity: techProgress,
              transform: `translateY(${(1 - techProgress) * 6}px)`,
            }}
          >
            <div className="text-[8px] sm:text-[8.5px] font-mono font-bold text-indigo-300 uppercase tracking-widest mb-0.5 flex items-center gap-1">
              <Code2 className="w-3 h-3 text-cyan-400" />
              <span>TECH STACK:</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8px] sm:text-[8.5px] font-mono text-neutral-300">
              <div className="truncate">React 19 · TypeScript · Node.js</div>
              <div className="truncate">PHP · Laravel · Lumen · Python</div>
              <div className="truncate">MongoDB · MySQL · PostgreSQL</div>
              <div className="truncate">Agentic AI · RAG · REST APIs</div>
            </div>
          </div>

          {/* 5. Footer: 2026 · ENGINEERING / AI */}
          <div
            className="relative z-20 pt-1 border-t border-white/10 flex items-center justify-between text-[7.5px] sm:text-[8px] font-mono text-neutral-400"
            style={{ opacity: techProgress }}
          >
            <span className="text-neutral-300 font-bold">2026 · ENGINEERING / AI</span>
            <span className="text-emerald-400 font-bold">VERIFIED PROFILE</span>
          </div>
        </div>
      </div>

      {/* Floating Interactive Flip Pill Beneath Card (Touch Friendly >= 44px) */}
      <div className="mt-3.5 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={toggleFlip}
          aria-label="Flip holographic identity card"
          data-testid="flip-card-btn"
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-[11px] font-mono text-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-md pointer-events-auto cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-indigo-400 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
          <span>{isFlipped ? 'SHOW FRONT IDENTITY [F]' : 'FLIP FOR SPECIALIZATION [F]'}</span>
        </button>
      </div>
    </div>
  );
}
