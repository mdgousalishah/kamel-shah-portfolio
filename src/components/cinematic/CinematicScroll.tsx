/**
 * CinematicScroll.tsx
 * Pinned sticky visual stage and scroll timeline manager.
 * Interpolates scroll position with exponential damping for smooth 60/120fps motion.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { computeSceneTimeline, SceneTimelineState, SCENE_DEFINITIONS } from './SceneController';
import ScrollSceneStage from './ScrollSceneStage';
import SceneTypography from './SceneTypography';

interface CinematicScrollProps {
  onNavigateToSection?: (selector: string) => void;
}

export default function CinematicScroll({ onNavigateToSection }: CinematicScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Animation progress state
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [timelineState, setTimelineState] = useState<SceneTimelineState>(() => computeSceneTimeline(0));

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Update target progress on scroll
  useEffect(() => {
    const updateTarget = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const totalScrollable = container.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) {
        targetProgressRef.current = 0;
        return;
      }

      const relativeScroll = window.scrollY - containerTop;
      const p = Math.max(0, Math.min(1, relativeScroll / totalScrollable));
      targetProgressRef.current = p;
    };

    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget);
    updateTarget();

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
    };
  }, []);

  // Smooth interpolation animation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const damping = reducedMotion ? 16 : 6.8;

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;

      // Exponential smoothing formula: current += (target - current) * (1 - exp(-delta * damping))
      const factor = 1 - Math.exp(-delta * damping);
      const nextProgress = current + (target - current) * factor;

      // Only update state if difference is perceptible
      if (Math.abs(nextProgress - current) > 0.0001 || Math.abs(nextProgress - target) > 0.0001) {
        currentProgressRef.current = nextProgress;
        setTimelineState(computeSceneTimeline(nextProgress));
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion]);

  // Jump to scene via timeline progress
  const scrollToScene = useCallback((sceneIndex: number) => {
    const container = containerRef.current;
    if (!container) return;

    const scene = SCENE_DEFINITIONS[sceneIndex];
    if (!scene) return;

    const rect = container.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const totalScrollable = container.offsetHeight - window.innerHeight;
    const targetY = containerTop + scene.start * totalScrollable;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div
      ref={containerRef}
      id="cinematic-timeline"
      className="relative w-full h-[520vh] bg-[#08080A]"
    >
      {/* Pinned Sticky Visual Stage (100svh) */}
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden bg-[#08080A] flex flex-col justify-center">
        {/* 1. WebGL Canvas & Organic Torn Shader Transition */}
        <ScrollSceneStage timelineState={timelineState} reducedMotion={reducedMotion} />

        {/* 2. Interactive DOM Typography Overlay */}
        <SceneTypography
          timelineState={timelineState}
          onNavigateToSection={onNavigateToSection}
        />

        {/* 3. Floating Timeline Navigation Indicator (Top Right) */}
        <div className="absolute top-20 right-6 sm:right-12 z-20 hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-white/10 backdrop-blur-md">
          <span className="text-[11px] font-mono font-medium text-neutral-300">
            {timelineState.activeScene.number} / 05
          </span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
          <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
            {timelineState.activeScene.name}
          </span>
          {timelineState.isTransitioning && (
            <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest animate-pulse">
              · TRANSITIONING
            </span>
          )}
        </div>

        {/* 4. Timeline Progress Bar at bottom of stage */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/[0.04] z-20">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-indigo-500 to-cyan-400 transition-all duration-75"
            style={{ width: `${(timelineState.globalProgress * 100).toFixed(2)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
