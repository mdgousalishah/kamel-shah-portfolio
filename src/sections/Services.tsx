import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Globe, LayoutTemplate, Wrench, Search } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Reveal from '../components/Reveal';
import { Headline } from '../components/Motion';

const services = [
  {
    title: 'Web Development',
    icon: Globe,
    desc: 'Full-stack web applications with modular architecture, RESTful API endpoints, and structured database models using Node.js, Express, PHP, Laravel, MySQL, and MongoDB.',
    details: ['Full-stack architecture', 'REST API development', 'Database schema design', 'Authentication & CRUD']
  },
  {
    title: 'Frontend Development',
    icon: LayoutTemplate,
    desc: 'Responsive, accessible interfaces built with React, TypeScript, and modern CSS — prioritising readability, consistency, and fast load times on every screen.',
    details: ['React & TypeScript', 'Mobile-first layouts', 'Reusable components', 'Interface performance']
  },
  {
    title: 'Website Maintenance & Support',
    icon: Wrench,
    desc: 'Troubleshooting, updates, and ongoing maintenance for educational platforms, institutional portals, and business websites.',
    details: ['Platform troubleshooting', 'Routine maintenance', 'Institutional IT setup', 'Content & asset updates']
  },
  {
    title: 'Digital Marketing & Technical SEO',
    icon: Search,
    desc: 'Search visibility through semantic markup, on-page SEO practice, meta configuration, and performance tuning.',
    details: ['On-page SEO', 'Semantic markup', 'Performance tuning', 'CMS & Squarespace support']
  }
];

/** Horizontal pinned scroll on desktop; phones/tablets and reduced motion keep the grid. */
const HORIZONTAL_QUERY = '(min-width: 1024px)';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** Original two-column grid — used on smaller screens and for reduced motion. */
function ServicesGrid() {
  return (
    <div className="mt-12 grid grid-cols-1 border-t border-ink md:grid-cols-2 lg:mt-16">
      {services.map((svc, i) => {
        const Icon = svc.icon;
        return (
          <Reveal from={i % 2 === 0 ? 'left' : 'right'}
            key={svc.title}
            delay={(i % 2) * 0.06}
            className={`border-b border-line py-9 md:py-12 ${
              i % 2 === 0 ? 'md:border-r md:pr-10' : 'md:pl-10'
            }`}
          >
            <div className="flex items-start justify-between gap-6">
              <h3 className="font-serif text-[1.6rem] leading-tight text-ink">{svc.title}</h3>
              <Icon size={22} strokeWidth={1.25} className="mt-1 shrink-0 text-muted" aria-hidden="true" />
            </div>
            <p className="mt-4 max-w-[32rem] text-[0.9375rem] leading-relaxed text-ink-soft">{svc.desc}</p>
            <p className="mt-5 text-sm text-muted">{svc.details.join('  ·  ')}</p>
          </Reveal>
        );
      })}
    </div>
  );
}

/**
 * Desktop: the section pins and vertical scrolling slides the service cards sideways.
 * The outer block is exactly as tall as the sideways distance, so the pin releases
 * the moment the last card is in view.
 */
function ServicesTrack() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <div ref={outerRef} className="services-pin mt-10" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="services-stage">
        <motion.div ref={trackRef} className="services-track" style={{ x }}>
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <article key={svc.title} className="service-card">
                <div className="flex items-start justify-between gap-6">
                  <span className="section-index text-sm">{String(i + 1).padStart(2, '0')}</span>
                  <Icon size={26} strokeWidth={1.25} className="shrink-0 text-muted" aria-hidden="true" />
                </div>
                <h3 className="mt-10 font-serif text-[clamp(1.6rem,2.4vw,2.1rem)] leading-tight text-ink">
                  {svc.title}
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">{svc.desc}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${svc.title} includes`}>
                  {svc.details.map((d) => (
                    <li key={d} className="tag">
                      {d}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}

          <a href="#contact" className="service-card service-card--cta group">
            <span className="eyebrow !text-[#B9B3A7]">Next step</span>
            <span className="mt-auto block font-serif text-[clamp(1.8rem,2.8vw,2.5rem)] leading-[1.1] text-ivory">
              Have a project in mind?
            </span>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ivory">
              Start a conversation
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </a>
        </motion.div>

        <div className="wrap mt-8">
          <div className="h-px w-full bg-line">
            <motion.div className="h-px origin-left bg-ink" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const wide = useMediaQuery(HORIZONTAL_QUERY);
  const reduce = useReducedMotion();
  const horizontal = wide && !reduce;

  return (
    <section id="services" aria-labelledby="services-title" className="section">
      <div className="wrap">
        <header className="section-head">
          <span className="section-index">05</span>
          <span className="eyebrow">Services</span>
        </header>

        <Headline id="services-title" className="h-section max-w-[18ch]">
            How I can help with your next project.
          </Headline>

        {!horizontal && <ServicesGrid />}
      </div>

      {horizontal && <ServicesTrack />}
    </section>
  );
}
