import { Fragment, useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SITE_CONFIG } from '../data/config';
import { PROJECTS } from '../data/projects';
import { CERTIFICATIONS } from '../data/certifications';
import Depth from '../components/Depth';
import { ScrollFade } from '../components/Motion';

const FACTS = [
  { label: 'Focus', value: 'Full-stack web development' },
  { label: 'Education', value: 'B.Tech ECE · MBA in AI & ML' },
  { label: 'Based in', value: 'Parbhani, Maharashtra, India' }
];

const NAME_WORDS = ['Mohammed', 'Gous', 'Ali\u00A0Shah'];
const building = PROJECTS.find((p) => /in development/i.test(p.category));
const certCount = CERTIFICATIONS.filter((c) => Boolean(c.image)).length;

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

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative">
      <div className="wrap pt-10 pb-16 sm:pt-14 md:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Text column */}
          <ScrollFade className="lg:col-span-7 min-w-0">
            <p className="eyebrow rise flex items-center gap-2">
              <span>Kamel Shah ·</span>
              <RoleRotator />
            </p>

            <h1
              id="hero-title"
              className="display mt-6 text-[clamp(2.6rem,calc(1rem+6.2vw),5.5rem)] text-ink"
            >
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
          </ScrollFade>

          {/* Portrait column */}
          <figure className="hero-figure relative isolate lg:col-span-5 mx-auto w-full max-w-[26rem] sm:max-w-[28rem] lg:max-w-none">
            <span aria-hidden="true" className="hero-glow" />
            <Depth strength={6} tilt>
            <div className="frame unveil aspect-[4/5]">
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
                  className="object-cover object-[50%_25%]"
                />
              </picture>
            </div>
            </Depth>

            {/* Floating chips — facts pulled from the project and certificate data */}
            {building && (
              <a href="#projects" className="hero-chip hero-chip--bl rise d-5 group">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-muted">Currently building</span>
                <span className="font-medium text-ink">{building.title}</span>
                <ArrowUpRight size={13} aria-hidden="true" className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
            <div className="hero-chip hero-chip--tr rise d-5" aria-label={`${PROJECTS.length} projects and ${certCount} certificates`}>
              <span><span className="font-serif text-base italic text-ink">{PROJECTS.length}</span> <span className="text-muted">projects</span></span>
              <span aria-hidden="true" className="h-3 w-px bg-line" />
              <span><span className="font-serif text-base italic text-ink">{certCount}</span> <span className="text-muted">certificates</span></span>
            </div>
            <figcaption className="rise d-5 mt-3 flex items-center justify-between text-xs text-muted">
              <span>Mohammed Gous Ali Shah</span>
              <span className="font-serif italic">Kamel Shah</span>
            </figcaption>
          </figure>
        </div>

        {/* Fact strip */}
        <dl className="rise d-5 mt-16 grid grid-cols-1 border-t border-line sm:grid-cols-3 lg:mt-24">
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
    </section>
  );
}
