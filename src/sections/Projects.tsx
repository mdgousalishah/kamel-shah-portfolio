import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { PROJECTS, type Project } from '../data/projects';
import { SITE_CONFIG } from '../data/config';
import Reveal from '../components/Reveal';
import { Headline } from '../components/Motion';

/** A GitHub link that is just the profile root is labelled honestly, not as a repository. */
const sourceLabel = (url: string) =>
  url.replace(/\/+$/, '') === SITE_CONFIG.socials.github.replace(/\/+$/, '') ? 'GitHub profile' : 'Source code';

/** How many tech tags a card shows before collapsing the rest into "+N". */
const MAX_TAGS = 6;
/** Each stacked card sits this many px lower than the one before, so earlier cards peek out on top. */
const STACK_STEP = 14;

/**
 * Stacked, pinned cards only on screens large enough to show a whole card at once.
 * Phones, tablets and short laptop windows get a normal vertical list instead.
 */
const STACK_QUERY = '(min-width: 1200px) and (min-height: 760px)';

function useStackLayout() {
  const [stacked, setStacked] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(STACK_QUERY).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(STACK_QUERY);
    const update = () => setStacked(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return stacked;
}

function ProjectImage({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="frame zoom-on-hover aspect-[16/10] w-full">
      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="eyebrow">Screenshot unavailable</span>
          <span className="font-serif text-xl text-ink">{project.title}</span>
        </div>
      ) : (
        <picture>
          {project.imageWebp && <source srcSet={project.imageWebp} type="image/webp" />}
          <img
            src={project.image}
            alt={`Screenshot of the ${project.title} website`}
            width={1586}
            height={992}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="object-contain object-top"
          />
        </picture>
      )}
    </div>
  );
}

function ProjectBody({ project }: { project: Project }) {
  const lines = Array.isArray(project.description) ? project.description : [project.description];
  const [lead, ...rest] = lines;
  const shownTags = project.tech.slice(0, MAX_TAGS);
  const hiddenTags = project.tech.slice(MAX_TAGS);

  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-baseline gap-3">
        <span className="section-index text-sm">{project.number}</span>
        <span className="eyebrow">{project.category}</span>
      </div>

      <h3
        id={`project-${project.id}`}
        className="mt-3 font-serif text-[clamp(1.85rem,3.2vw,2.6rem)] leading-[1.06] tracking-[-0.02em] text-ink"
      >
        {project.title}
      </h3>

      {project.tagline && (
        <p className="mt-2 font-serif text-[1.1rem] italic leading-snug text-ink-soft">{project.tagline}</p>
      )}

      <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">{lead}</p>

      {rest.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {rest.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span
                aria-hidden="true"
                className="mt-[0.2em] grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-full border border-line bg-ivory text-ink"
              >
                <Check size={11} strokeWidth={2.4} />
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
        {shownTags.map((t) => (
          <li key={t} className="tag">
            {t}
          </li>
        ))}
        {hiddenTags.length > 0 && (
          <li className="tag text-muted" title={hiddenTags.join(', ')}>
            +{hiddenTags.length} more
            <span className="sr-only">: {hiddenTags.join(', ')}</span>
          </li>
        )}
      </ul>

      {(project.link || project.github) && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary !min-h-[44px] !px-5"
              aria-label={`Visit the live ${project.title} site (opens in a new tab)`}
            >
              Live site
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-quiet !min-h-[44px] !px-5"
              aria-label={`${sourceLabel(project.github)} for ${project.title} (opens in a new tab)`}
            >
              {sourceLabel(project.github)}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  total,
  progress,
  stacked,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacked: boolean;
}) {
  const reduce = useReducedMotion();
  // Earlier cards shrink and dim slightly as later cards slide over them.
  const targetScale = 1 - (total - 1 - index) * 0.035;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const shade = useTransform(progress, [index / total, 1], [0, index === total - 1 ? 0 : 0.07]);
  const animate = stacked && !reduce;

  return (
    <motion.article
      aria-labelledby={`project-${project.id}`}
      className={`work-card relative overflow-hidden rounded-[28px] border border-line bg-paper ${
        stacked ? 'work-card--stacked' : ''
      }`}
      style={
        stacked
          ? {
              top: `calc(var(--stack-top) + ${index * STACK_STEP}px)`,
              ...(animate ? { scale, originY: 0 } : {}),
            }
          : undefined
      }
    >
      <div className="grid h-full w-full grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-10 lg:py-8">
        <div className="lg:col-span-6">
          <ProjectBody project={project} />
        </div>
        <div className="order-first lg:order-none lg:col-span-6">
          <ProjectImage project={project} />
        </div>
      </div>
      {animate && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-ink"
          style={{ opacity: shade }}
        />
      )}
    </motion.article>
  );
}

export default function Projects() {
  const stackRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stacked = useStackLayout();
  const [active, setActive] = useState(0);
  const total = PROJECTS.length;

  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  // The active project is the last card whose natural position has reached its pinned spot.
  useMotionValueEvent(scrollYProgress, 'change', () => {
    if (!stacked) return;
    const stackTop = parseFloat(getComputedStyle(stackRef.current!).getPropertyValue('--stack-top-px')) || 140;
    let current = 0;
    markerRefs.current.forEach((m, i) => {
      if (m && m.getBoundingClientRect().top <= stackTop + i * STACK_STEP + 4) current = i;
    });
    setActive(current);
  });

  const jumpTo = (i: number) => {
    const marker = markerRefs.current[i];
    if (!marker || !stackRef.current) return;
    const stackTop = parseFloat(getComputedStyle(stackRef.current).getPropertyValue('--stack-top-px')) || 140;
    const y = marker.getBoundingClientRect().top + window.scrollY - stackTop - i * STACK_STEP;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <div className="wrap">
        <header className="section-head">
          <span className="section-index">04</span>
          <span className="eyebrow">Selected Work</span>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <Headline id="projects-title" className="h-section" wrapperClassName="lg:col-span-7">
            Selected work across <em className="italic">eCommerce</em>, institutions, and utilities.
          </Headline>
          <Reveal from="right" className="lg:col-span-5" delay={0.06}>
            <p className="body-muted max-w-[30rem] lg:ml-auto">
              Six real projects — each shown with a screenshot or interface preview, the stack it was built
              with, and a link where one is publicly available.
            </p>
          </Reveal>
        </div>

        <div ref={stackRef} className="work-stack relative mt-12 lg:mt-16">
          {/* Pinned project switcher — mirrors the stack below and jumps to a card. */}
          {stacked && (
            <nav aria-label="Jump to a project" className="work-switcher">
              <ol className="flex items-center gap-1 rounded-full border border-line bg-paper/90 p-1 shadow-[0_8px_30px_-18px_rgba(36,36,36,0.35)] backdrop-blur">
                {PROJECTS.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-current={active === i ? 'true' : undefined}
                      className={`rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors duration-300 ${
                        active === i ? 'bg-ink text-ivory' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {p.title}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className={stacked ? '' : 'space-y-6 sm:space-y-8'}>
            {PROJECTS.map((project, i) => (
              <Fragment key={project.id}>
                <div
                  aria-hidden="true"
                  ref={(el) => {
                    markerRefs.current[i] = el;
                  }}
                />
                {stacked ? (
                  <ProjectCard project={project} index={i} total={total} progress={scrollYProgress} stacked />
                ) : (
                  <Reveal from="up" blur={false}>
                    <ProjectCard project={project} index={i} total={total} progress={scrollYProgress} stacked={false} />
                  </Reveal>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
