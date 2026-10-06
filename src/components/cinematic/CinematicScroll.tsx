/**
 * CinematicScroll.tsx
 * Pinned sticky visual stage and scroll timeline manager.
 * Interpolates scroll position with exponential damping for smooth 60/120fps motion.
 */

import { lazy, Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { computeSceneTimeline, SceneTimelineState, SCENE_DEFINITIONS } from './SceneController';
import SceneTypography from './SceneTypography';

const ScrollSceneStage = lazy(() => import('./ScrollSceneStage'));

interface CinematicScrollProps {
  onNavigateToSection?: (selector: string) => void;
}

export default function CinematicScroll({ onNavigateToSection }: CinematicScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

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

  useEffect(() => {
    let timeoutId = 0;
    let idleId = 0;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(() => setSceneReady(true), { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(() => setSceneReady(true), 350);
    }
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (idleId) idleWindow.cancelIdleCallback?.(idleId);
    };
  }, []);

  // Interpolate only while scrolling so the scene does not keep an idle RAF loop alive.
  useEffect(() => {
    let animId = 0;
    let lastTime = performance.now();
    const damping = reducedMotion ? 1000 : 6.8;

    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const factor = reducedMotion ? 1 : 1 - Math.exp(-delta * damping);
      const nextProgress = current + (target - current) * factor;

      if (Math.abs(nextProgress - target) > 0.0001) {
        currentProgressRef.current = nextProgress;
        setTimelineState(computeSceneTimeline(nextProgress));
        animId = requestAnimationFrame(tick);
      } else {
        currentProgressRef.current = target;
        setTimelineState(computeSceneTimeline(target));
        animId = 0;
      }
    };

    const updateTarget = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const totalScrollable = container.offsetHeight - window.innerHeight;
      targetProgressRef.current = totalScrollable <= 0
        ? 0
        : Math.max(0, Math.min(1, (window.scrollY - containerTop) / totalScrollable));

      if (!animId) {
        lastTime = performance.now();
        animId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget);
    updateTarget();

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      if (animId) cancelAnimationFrame(animId);
    };
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
      className="relative w-full h-[460vh] bg-[#08080A] touch-pan-y"
    >
      {/* Pinned Sticky Visual Stage (100svh) */}
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden bg-[#08080A] flex flex-col justify-center touch-pan-y">
        {/* 1. WebGL Canvas & Organic Torn Shader Transition */}
        {sceneReady ? (
          <Suspense fallback={<div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(49,46,129,0.2),transparent_65%)]" />}>
            <ScrollSceneStage timelineState={timelineState} reducedMotion={reducedMotion} />
          </Suspense>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(49,46,129,0.2),transparent_65%)]" />
        )}

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
