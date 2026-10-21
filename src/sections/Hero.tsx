import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { SITE_CONFIG } from '../data/config';
import { PROJECTS } from '../data/projects';
import PortraitReveal from '../components/PortraitReveal';

const FACTS = [
  { label: 'Focus', value: 'Full-stack web development' },
  { label: 'Education', value: 'B.Tech ECE · MBA in AI & ML' },
  { label: 'Based in', value: 'Parbhani, Maharashtra, India' }
];

const NAME_WORDS = ['Mohammed', 'Gous', 'Ali Shah'];
const building = PROJECTS.find((p) => /in development/i.test(p.category));
const ALT_PORTRAIT = '/Photos/optimized/hero-portrait-bw.webp';

/**
 * Pinned hero sequence (desktop only), modelled on landonorris.com:
 * the hero stays put for one screen of scrolling while the portrait glides to the
 * centre, shrinks and turns greyscale, the page goes dark, two marquee rows slide in
 * behind it and a scribble is drawn over it — then the page carries on.
 */
const PIN_QUERY = '(min-width: 1024px) and (min-height: 600px)';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** Cycles through the roles from SITE_CONFIG; static for reduced motion. */
function RoleRotator() {
  const roles = SITE_CONFIG.roles;
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || roles.length < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % roles.length), 2600);
    return () => window.clearInterval(id);
  }, [reduce, roles.length]);

  return (
    <span className="relative inline-flex h-[1.4em] overflow-hidden align-bottom">
      <span className="sr-only">{roles.join(', ')}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={roles[i]}
          aria-hidden="true"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block whitespace-nowrap text-ink"
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Topographic contour lines (generated once) ──────────────────────────── */

function contourPaths(cx: number, cy: number, rings: number, seed: number) {
  const paths: string[] = [];
  for (let k = 1; k <= rings; k++) {
    const base = 26 * k;
    let d = '';
    for (let a = 0; a <= 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      const r = base * (1 + 0.14 * Math.sin(3 * t + seed + k * 0.35) + 0.07 * Math.sin(5 * t - k * 0.6 + seed));
      const x = cx + r * Math.cos(t) * 1.25;
      const y = cy + r * Math.sin(t);
      d += `${a === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    paths.push(`${d}Z`);
  }
  return paths;
}

const CONTOURS = [...contourPaths(260, 200, 9, 0.4), ...contourPaths(980, 560, 11, 2.1)];

function Contours({ className = '', style }: { className?: string; style?: React.ComponentProps<typeof motion.svg>['style'] }) {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={style}
    >
      <g fill="none" strokeWidth="1">
        {CONTOURS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </motion.svg>
  );
}

/* ── Marquee rows + scribble ─────────────────────────────────────────────── */

const ROW_TOP = `${SITE_CONFIG.roles.join(' — ')} — `;
const ROW_BOTTOM = 'KAMEL SHAH · MOHAMMED GOUS ALI SHAH · ';

function MarqueeRows({ x1, x2 }: { x1: MotionValue<string>; x2: MotionValue<string> }) {
  return (
    <div aria-hidden="true" className="hero-marquee pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none">
      <motion.p className="hero-marquee__row hero-marquee__row--serif" style={{ x: x1 }}>
        {ROW_TOP.repeat(4)}
      </motion.p>
      <motion.p className="hero-marquee__row hero-marquee__row--sans" style={{ x: x2 }}>
        {ROW_BOTTOM.repeat(5)}
      </motion.p>
    </div>
  );
}

const SCRIBBLE =
  'M18 168 C 60 70, 92 30, 116 58 S 96 176, 70 160 S 128 52, 168 40 S 176 150, 150 166 S 214 66, 250 52 S 276 120, 236 150 S 300 110, 334 40';

function Scribble({ length }: { length: MotionValue<number> }) {
  // Round line caps would show as dots at length 0, so stay hidden until drawing starts.
  const visible = useTransform(length, [0, 0.015], [0, 1]);
  return (
    <svg aria-hidden="true" viewBox="0 0 350 200" className="hero-scribble pointer-events-none">
      <motion.path
        d={SCRIBBLE}
        fill="none"
        stroke="#E8622C"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: length, opacity: visible }}
      />
    </svg>
  );
}

/* ── Shared hero content ─────────────────────────────────────────────────── */

function HeroText() {
  return (
    <>
      <p className="eyebrow rise flex items-center gap-2">
        <span>Kamel Shah ·</span>
        <RoleRotator />
      </p>

      <h1 id="hero-title" className="hero-title display mt-6 text-ink">
        {NAME_WORDS.map((word, i) => (
          <Fragment key={word}>
            {i > 0 && ' '}
            <span className="hero-word" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
              {word}
            </span>
          </Fragment>
        ))}
      </h1>

      <p className="rise d-2 mt-6 flex flex-col xs:flex-row xs:flex-wrap text-[0.9375rem] font-medium tracking-[0.01em] text-ink">
        {SITE_CONFIG.descriptor.split(' · ').map((part, i) => (
          <span key={part} className="whitespace-nowrap">
            {i > 0 && <span aria-hidden="true" className="mx-2 hidden text-muted xs:inline">·</span>}
            {part}
          </span>
        ))}
      </p>

      <p className="lead rise d-3 mt-5 max-w-[34rem]">
        I build practical web experiences, full-stack applications, and digital solutions with a
        focus on clarity, usability, and reliable engineering.
      </p>

      <div className="rise d-4 mt-9 flex flex-wrap items-center gap-3">
        <a href="#projects" className="btn btn-primary">
          View Selected Work
          <ArrowDown size={15} aria-hidden="true" />
        </a>
        <a href={SITE_CONFIG.resume} download className="btn btn-outline">
          Download Resume
          <Download size={15} aria-hidden="true" />
        </a>
        <a href="#contact" className="link-line ml-1 py-3 text-sm font-medium">
          Contact Me
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

function Portrait({ pinned }: { pinned: boolean }) {
  return (
    <div className={`frame unveil aspect-[4/5] ${pinned ? 'hero-portrait--pinned' : ''}`}>
      <PortraitReveal
        alt={ALT_PORTRAIT}
        altLabel="black-and-white studio portrait of Mohammed Gous Ali Shah"
        focal={{ x: 0.5, y: 0.27 }}
        anchor={{ x: 0.45, y: 0.24 }}
        className="h-full w-full"
      >
        <picture>
          <source
            srcSet={`${SITE_CONFIG.images.heroWebpSmall} 600w, ${SITE_CONFIG.images.heroWebp} 1000w`}
            sizes="(min-width: 1024px) 36vw, (min-width: 640px) 28rem, 92vw"
            type="image/webp"
          />
          <img
            src={SITE_CONFIG.images.hero}
            alt="Portrait of Mohammed Gous Ali Shah in a navy blazer and white shirt, photographed outdoors"
            width={1000}
            height={1250}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[50%_25%]"
          />
        </picture>
      </PortraitReveal>
    </div>
  );
}

function BuildingChip() {
  if (!building) return null;
  return (
    <div className="hero-chip-layer hero-chip-layer--bl">
      <a href="#projects" className="hero-chip hero-chip--bl rise d-5 group">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-muted">Currently building</span>
        <span className="font-medium text-ink">{building.title}</span>
        <ArrowUpRight size={13} aria-hidden="true" className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function FactStrip() {
  return (
    <div className="wrap">
      <dl className="rise d-5 grid grid-cols-1 border-t border-line sm:grid-cols-3">
        {FACTS.map((fact, i) => (
          <div
            key={fact.label}
            className={`py-5 sm:pr-6 ${i > 0 ? 'border-t border-line sm:border-t-0 sm:border-l sm:pl-6' : ''}`}
          >
            <dt className="eyebrow">{fact.label}</dt>
            <dd className="mt-2 font-serif text-lg leading-snug text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ── Desktop: pinned sequence ────────────────────────────────────────────── */

function PinnedHero() {
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const [flip, setFlip] = useState({ dx: 0, dy: 0, s: 0.45 });

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.35 });

  // Where the portrait has to travel to sit, smaller, in the centre of the stage.
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const fig = figureRef.current;
      if (!stage || !fig) return;
      let x = 0;
      let y = 0;
      let el: HTMLElement | null = fig;
      while (el && el !== stage) {
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      const w = fig.offsetWidth;
      const h = fig.offsetHeight;
      const targetW = Math.min(stage.offsetWidth * 0.17, 260);
      setFlip({
        dx: stage.offsetWidth / 2 - (x + w / 2),
        dy: stage.offsetHeight / 2 - (y + h / 2),
        s: targetW / w,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  const textOpacity = useTransform(p, [0, 0.28], [1, 0]);
  const textY = useTransform(p, [0, 0.3], [0, -48]);
  const night = useTransform(p, [0.12, 0.5], [0, 1]);
  const lightLines = useTransform(p, [0, 0.4], [1, 0]);
  const marqueeOpacity = useTransform(p, [0.22, 0.5], [0, 1]);
  const x1 = useTransform(p, [0, 1], ['4%', '-28%']);
  const x2 = useTransform(p, [0, 1], ['-30%', '2%']);
  const figX = useTransform(p, [0.04, 0.72], [0, flip.dx]);
  const figY = useTransform(p, [0.04, 0.72], [0, flip.dy]);
  const figScale = useTransform(p, [0.04, 0.72], [1, flip.s]);
  const gray = useTransform(p, [0.2, 0.7], ['grayscale(0)', 'grayscale(1)']);
  const captionOpacity = useTransform(p, [0, 0.15], [1, 0]);
  const scribble = useTransform(p, [0.5, 0.96], [0, 1]);

  return (
    <div ref={pinRef} id="home" className="hero-pin relative">
      <section ref={stageRef} aria-labelledby="hero-title" className="hero-stage">
        {/* Light page lines, then the dark backdrop the portrait shrinks onto */}
        <Contours className="hero-contours" style={{ opacity: lightLines }} />
        <motion.div aria-hidden="true" className="hero-night" style={{ opacity: night }}>
          <Contours className="hero-contours hero-contours--night" />
        </motion.div>

        <motion.div style={{ opacity: marqueeOpacity }}>
          <MarqueeRows x1={x1} x2={x2} />
        </motion.div>

        <div className="wrap relative flex h-full items-center">
          <div className="grid w-full grid-cols-12 items-center gap-16">
            <motion.div className="col-span-7 min-w-0" style={{ opacity: textOpacity, y: textY }}>
              <HeroText />
            </motion.div>

            <motion.figure
              ref={figureRef}
              className="hero-figure relative isolate col-span-5 justify-self-center"
              style={{ x: figX, y: figY, scale: figScale, zIndex: 2 }}
            >
              <motion.span aria-hidden="true" className="hero-glow" style={{ opacity: captionOpacity }} />
              {/* Greyscale only on the photo, so the scribble keeps its colour. */}
              <motion.div style={{ filter: gray }}>
                <Portrait pinned />
              </motion.div>
              <motion.div style={{ opacity: captionOpacity }}>
                <BuildingChip />
                <figcaption className="rise d-5 mt-3 flex items-center justify-between text-xs text-muted">
                  <span>Mohammed Gous Ali Shah</span>
                  <span className="font-serif italic">Kamel Shah</span>
                </figcaption>
              </motion.div>
              <Scribble length={scribble} />
            </motion.figure>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Phones / tablets / reduced motion: normal flow + marquee band ───────── */

function MarqueeBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-30%', '0%']);
  const scribble = useTransform(scrollYProgress, [0.2, 0.6], [reduce ? 1 : 0, 1]);

  return (
    <div ref={ref} aria-hidden="true" className="hero-band">
      <Contours className="hero-contours hero-contours--night" />
      <MarqueeRows x1={x1} x2={x2} />
      <div className="hero-band__card">
        <img src={ALT_PORTRAIT} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_27%] grayscale" />
        <Scribble length={scribble} />
      </div>
    </div>
  );
}

function FlowHero() {
  return (
    <>
      <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden">
        <Contours className="hero-contours" />
        <div className="wrap relative pt-10 pb-12 sm:pt-14 md:pt-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="min-w-0 lg:col-span-7">
              <HeroText />
            </div>
            <figure className="hero-figure relative isolate mx-auto w-full max-w-[26rem] sm:max-w-[28rem] lg:col-span-5 lg:max-w-none">
              <span aria-hidden="true" className="hero-glow" />
              <Portrait pinned={false} />
              <BuildingChip />
              <figcaption className="rise d-5 mt-3 flex items-center justify-between text-xs text-muted">
                <span>Mohammed Gous Ali Shah</span>
                <span className="font-serif italic">Kamel Shah</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <MarqueeBand />
    </>
  );
}

export default function Hero() {
  const wide = useMediaQuery(PIN_QUERY);
  const reduce = useReducedMotion();
  const pinned = wide && !reduce;

  return (
    <>
      {pinned ? <PinnedHero /> : <FlowHero />}
      <div className={pinned ? 'pt-10 pb-6' : 'pt-4 pb-6'}>
        <FactStrip />
      </div>
    </>
  );
}
