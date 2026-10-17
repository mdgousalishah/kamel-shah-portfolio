import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import { SITE_CONFIG, whatsappHref } from '../data/config';
import { PROJECTS } from '../data/projects';
import './showcase.css';

/**
 * /showcase — an experimental landing page that combines two ideas:
 *   1. "Museum" hero: black stage, B&W cut-out portrait, a glowing ring behind it,
 *      large classical serif type.
 *   2. "Explore" parallax: layered landscape, a huge word behind a silhouette,
 *      fog that clears as you scroll, then a dark gallery of work.
 *
 * Scrolling stays native (no scroll-jacking). Motion is driven by a single
 * CSS custom property (--p, 0→1) per section, updated in requestAnimationFrame.
 * Users who prefer reduced motion get the finished, static composition.
 */

const IMG = {
  hero: '/Photos/showcase/hero-cutout',
  about: '/Photos/showcase/about-cutout',
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Writes scroll progress for `ref` into its `--p` custom property.
 * mode "pass":   0 when the section's top meets the viewport bottom, 1 when its bottom leaves the top.
 * mode "pin":    0 when the section's top reaches the viewport top, 1 when its end does (for sticky scenes).
 */
function useScrollProgress(ref: RefObject<HTMLElement | null>, mode: 'pass' | 'pin', resting = 0.5) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty('--p', String(resting));
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = mode === 'pin' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
      const p = Math.min(1, Math.max(0, raw));
      el.style.setProperty('--p', p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, mode, resting]);
}

/** Adds `.is-in` to `[data-reveal]` children once they enter the viewport. */
function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.classList.add('sc-js');
    const targets = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [root]);
}

/** Tracks which section is in view, for the side rail. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Cutout({ base, alt, className, eager = false }: { base: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <picture className={className}>
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img src={`${base}.png`} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
    </picture>
  );
}

/** Glowing ring drawn as an SVG circle so it can "draw itself" on load. */
function Ring({ className }: { className?: string }) {
  return (
    <svg className={`sc-ring ${className ?? ''}`} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" pathLength={1} />
    </svg>
  );
}

/** Deterministic mountain ridge: broad peaks plus fine rocky jitter, identical on every load. */
function ridgePath(seed: number, base: number, amp: number, peaks = 5) {
  let s = seed;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const summits = Array.from({ length: peaks + 1 }, () => 0.35 + rand() * 0.65);
  const steps = 60;
  let d = 'M0 600';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * peaks;
    const k = Math.floor(t);
    const f = t - k;
    // Triangular profile between summit k and k+1 with a saddle in the middle.
    const a = summits[k];
    const b = summits[Math.min(k + 1, peaks)];
    const saddle = Math.min(a, b) * (0.35 + rand() * 0.15);
    const h = f < 0.5 ? a + (saddle - a) * (f / 0.5) : saddle + (b - saddle) * ((f - 0.5) / 0.5);
    const jitter = (rand() - 0.5) * 0.06;
    d += ` L${((i / steps) * 1000).toFixed(1)} ${(base - amp * (h + jitter)).toFixed(1)}`;
  }
  return `${d} L1000 600 Z`;
}

const SECTIONS = [
  { id: 'sc-portrait', label: 'Portrait' },
  { id: 'sc-profile', label: 'Profile' },
  { id: 'sc-explore', label: 'Explore' },
  { id: 'sc-work', label: 'Work' },
  { id: 'sc-contact', label: 'Contact' },
];

export default function Showcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLElement>(null);
  const exploreRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);

  useScrollProgress(heroRef, 'pass', 0.5);
  useScrollProgress(profileRef, 'pass', 0.5);
  useScrollProgress(exploreRef, 'pin', 0.9);
  useScrollProgress(workRef, 'pass', 0.5);
  useReveal(rootRef);
  const active = useActiveSection(useMemo(() => SECTIONS.map((s) => s.id), []));

  const ridges = useMemo(
    () => ({
      far: ridgePath(7, 470, 190, 6),
      mid: ridgePath(31, 525, 170, 4),
      near: ridgePath(113, 600, 200, 3),
    }),
    []
  );

  // Fonts for this page only (classical serif for the museum half).
  useEffect(() => {
    const id = 'sc-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@400;500;600;800&display=swap';
    document.head.appendChild(link);
    const prevTitle = document.title;
    document.title = 'Kamel Shah — Showcase';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div ref={rootRef} className="sc">
      <a className="skip-link" href="#sc-main">Skip to content</a>

      {/* Top bar */}
      <header className="sc-top">
        <a href="/" className="sc-brand" aria-label="Kamel Shah — main portfolio">
          <img src={SITE_CONFIG.logo} alt="" width={320} height={127} />
          <span>KAMEL SHAH</span>
        </a>
        <nav aria-label="Showcase" className="sc-top-nav">
          <a href="#sc-profile">Profile</a>
          <a href="#sc-work">Work</a>
          <a href="#sc-contact">Contact</a>
          <a href="/" className="sc-top-main">
            Main site <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </nav>
      </header>

      {/* Side rail: real section index */}
      <nav aria-label="Sections" className="sc-rail" data-hidden={active === 'sc-work' || active === 'sc-contact' ? 'true' : 'false'}>
        {SECTIONS.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
            <span className="sc-rail-num">0{i + 1}</span>
            <span className="sc-rail-label">{s.label}</span>
          </a>
        ))}
      </nav>

      <main id="sc-main">
        {/* 01 — Museum hero */}
        <section id="sc-portrait" ref={heroRef} className="sc-hero" aria-labelledby="sc-hero-title">
          <div className="sc-hero-stage">
            <div className="sc-hero-figure">
              <Ring className="sc-hero-ring" />
              <Cutout
                base={IMG.hero}
                eager
                className="sc-hero-portrait"
                alt="Black-and-white portrait of Mohammed Gous Ali Shah, chin resting on his hand"
              />
            </div>

            <h1 id="sc-hero-title" className="sc-hero-title">
              <span className="sc-line" style={{ ['--i' as string]: 0 }}>Mohammed</span>
              <span className="sc-line" style={{ ['--i' as string]: 1 }}>Gous Ali</span>
              <span className="sc-line" style={{ ['--i' as string]: 2 }}>Shah</span>
            </h1>

            <div className="sc-hero-aside">
              <p className="sc-kicker">{SITE_CONFIG.descriptor}</p>
              <p>
                I build practical web experiences, full-stack applications, and digital solutions with a
                focus on clarity, usability, and reliable engineering.
              </p>
            </div>
          </div>
          <a href="#sc-profile" className="sc-scroll-cue">
            <span aria-hidden="true" className="sc-mouse" />
            Scroll
          </a>
        </section>

        {/* 02 — Museum profile (the "Alexandros of Antioch" slide) */}
        <section id="sc-profile" ref={profileRef} className="sc-profile" aria-labelledby="sc-profile-title">
          <h2 id="sc-profile-title" className="sr-only">Profile</h2>
          <dl className="sc-facts">
            <div data-reveal>
              <dt>Mohammed Gous Ali Shah</dt>
              <dd>Also known as Kamel Shah. Software developer focused on full-stack web development.</dd>
            </div>
            <div data-reveal style={{ ['--d' as string]: '120ms' }}>
              <dt>B.Tech · MBA (AI &amp; ML)</dt>
              <dd>
                Electronics &amp; Computer Engineering, PES College of Engineering (DBATU), expected 2026. MBA in
                Artificial Intelligence &amp; Machine Learning, Dr. D. Y. Patil Vidyapeeth, pursuing.
              </dd>
            </div>
            <div data-reveal style={{ ['--d' as string]: '240ms' }}>
              <dt>Parbhani, Maharashtra</dt>
              <dd>
                IT &amp; Technical Support Assistant, Kamel Education Society, since June 2023. Developer Intern,
                Bilim Technologies, September – November 2025.
              </dd>
            </div>
          </dl>
          <div className="sc-profile-figure" aria-hidden="true">
            <Ring className="sc-profile-ring" />
            <Cutout base={IMG.about} alt="" className="sc-profile-portrait" />
          </div>
        </section>

        {/* 03 — Explore parallax */}
        <section id="sc-explore" ref={exploreRef} className="sc-explore" aria-labelledby="sc-explore-title">
          <div className="sc-explore-pin">
            <div className="sc-sky" aria-hidden="true" />
            <svg className="sc-layer sc-ridge-far" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <defs>
                <linearGradient id="sc-far" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0.45" stopColor="#c7a596" />
                  <stop offset="0.8" stopColor="#8e8a92" />
                </linearGradient>
                <linearGradient id="sc-mid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0.5" stopColor="#6b5f63" />
                  <stop offset="0.9" stopColor="#2c2a2f" />
                </linearGradient>
              </defs>
              <path d={ridges.far} />
            </svg>
            <h2 id="sc-explore-title" className="sc-bigword">Build</h2>
            <svg className="sc-layer sc-ridge-mid" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <path d={ridges.mid} />
            </svg>
            <div className="sc-explore-figure" aria-hidden="true">
              <Cutout base={IMG.about} alt="" />
            </div>
            <svg className="sc-layer sc-ridge-near" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <path d={ridges.near} />
            </svg>
            <div className="sc-fog sc-fog-a" aria-hidden="true" />
            <div className="sc-fog sc-fog-b" aria-hidden="true" />
            <div className="sc-cave" aria-hidden="true" />
            <p className="sc-explore-line">
              Every project starts as an idea and ends as something people can use.
            </p>
          </div>
        </section>

        {/* 04 — Work gallery */}
        <section id="sc-work" ref={workRef} className="sc-work" aria-labelledby="sc-work-title">
          <div className="sc-work-head" data-reveal>
            <h2 id="sc-work-title">Selected work, built to be used.</h2>
            <p>
              eCommerce platforms, institutional portals, and utilities — each shown with its real screenshot
              and a link to the live site.
            </p>
          </div>
          <ul className="sc-strip" aria-label="Projects">
            {PROJECTS.map((p, i) => (
              <li key={p.id} className="sc-card" style={{ ['--k' as string]: i % 2 === 0 ? 1 : -1 }}>
                <a
                  href={p.link || p.github || '#sc-work'}
                  target={p.link || p.github ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={`${p.title} — open live site`}
                >
                  <div className="sc-card-img">
                    <picture>
                      {p.imageWebp && <source srcSet={p.imageWebp} type="image/webp" />}
                      <img src={p.image} alt={`Screenshot of ${p.title}`} loading="lazy" decoding="async" />
                    </picture>
                  </div>
                  <div className="sc-card-meta">
                    <span className="sc-card-num">{p.number}</span>
                    <span className="sc-card-title">{p.title}</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </div>
                  <span className="sc-card-cat">{p.category}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="sc-strip-hint" aria-hidden="true">Swipe or scroll sideways →</p>
        </section>

        {/* 05 — Closing */}
        <section id="sc-contact" className="sc-close" aria-labelledby="sc-close-title">
          <div className="sc-close-inner" data-reveal>
            <Ring className="sc-close-ring" />
            <h2 id="sc-close-title">
              Let&rsquo;s build something
              <br />
              <em>useful together.</em>
            </h2>
            <div className="sc-actions">
              <a href="/#contact" className="sc-btn sc-btn-solid">
                Contact me <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="sc-btn">
                WhatsApp <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a href={SITE_CONFIG.resume} download className="sc-btn">
                Resume <Download size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
          <footer className="sc-foot">
            <span>&copy; {new Date().getFullYear()} Kamel Shah</span>
            <a href="/">View the main portfolio <ArrowUpRight size={13} aria-hidden="true" /></a>
          </footer>
        </section>
      </main>
    </div>
  );
}
