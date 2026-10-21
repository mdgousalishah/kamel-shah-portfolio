import { useEffect, useState, type ComponentType } from 'react';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Services from './Services';
import Education from './Education';
import Certifications from './Certifications';
import Contact from './Contact';
import Footer from '../components/Footer';

const SECTIONS: ComponentType[] = [Skills, Experience, Projects, Services, Education, Certifications, Contact];

/** Waits for an idle moment (or a short timeout on browsers without requestIdleCallback). */
const whenIdle = (cb: () => void) => {
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) {
    const id = ric(cb, { timeout: 200 });
    return () => (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 16);
  return () => window.clearTimeout(id);
};

/**
 * Everything below the hero/About, loaded as its own chunk and mounted one section
 * per idle moment — so a slow phone never freezes while the whole page builds at once.
 * Arriving with a hash (e.g. /#contact) mounts everything immediately so the jump works.
 */
export default function BelowFold() {
  const [count, setCount] = useState(() => (window.location.hash.length > 1 ? SECTIONS.length : 1));

  useEffect(() => {
    if (count >= SECTIONS.length) return;
    return whenIdle(() => setCount((c) => Math.min(SECTIONS.length, c + 1)));
  }, [count]);

  const done = count >= SECTIONS.length;
  useEffect(() => {
    if (!done) return;
    // Let the nav start tracking these sections now that they all exist.
    window.dispatchEvent(new Event('ks-sections-ready'));
    const id = window.location.hash.slice(1);
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 68;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - nav, behavior: 'instant' as ScrollBehavior });
      }
    }
  }, [done]);

  // Nav links clicked before everything has mounted: mount the rest right away.
  useEffect(() => {
    if (done) return;
    const onClick = (e: MouseEvent) => {
      const href = (e.target as HTMLElement).closest('a')?.getAttribute('href');
      if (href && href.startsWith('#')) setCount(SECTIONS.length);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [done]);

  return (
    <>
      {SECTIONS.slice(0, count).map((Section, i) => (
        <Section key={i} />
      ))}
    </>
  );
}

export { Footer };
