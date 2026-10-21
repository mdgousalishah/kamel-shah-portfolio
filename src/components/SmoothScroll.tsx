import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth, eased wheel scrolling (Lenis), like landonorris.com.
 * - Desktop mouse/trackpad only: touch devices keep their native scrolling.
 * - Off for people who prefer reduced motion.
 * - Pauses while a dialog locks the page (lightbox, mobile menu) so the page behind stays put.
 * - Scrollable panels (e.g. the chat window) keep scrolling on their own.
 * It still drives the browser's real scroll position, so sticky sections and scroll-linked
 * animations keep working exactly as before.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !fine) return;

    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
      allowNestedScroll: true,
      prevent: (node) => node.closest('[data-lenis-prevent]') !== null,
    });

    // In-page links (#projects etc.) glide too, landing just below the sticky nav.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement).closest('a');
      const hash = link?.getAttribute('href');
      if (!hash || !hash.startsWith('#') || hash.length < 2) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      e.preventDefault();
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 68;
      const y = target.getBoundingClientRect().top + window.scrollY - nav;
      lenis.scrollTo(y);
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onClick);

    const syncLock = () => {
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    };
    const mo = new MutationObserver(syncLock);
    mo.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      document.removeEventListener('click', onClick);
      mo.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
