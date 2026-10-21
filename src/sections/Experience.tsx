import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import Reveal from '../components/Reveal';
import { Headline } from '../components/Motion';
import HoverPreview from '../components/HoverPreview';

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  kind: string;
  location: string;
  tasks: string[];
  /** Optional image shown next to the cursor when the row is hovered. */
  preview?: string;
}

const experiences: ExperienceItem[] = [
  {
    role: 'IT & Technical Support Assistant',
    company: 'Kamel Education Society',
    period: 'June 2023 — Present',
    kind: 'Ongoing role',
    location: 'Parbhani, Maharashtra, India',
    // Ties to the CampusOne ERP rollout mentioned in this role.
    preview: '/Photos/optimized/CampusOne.webp',
    tasks: [
      'Administer IT infrastructure across 5 institutional schools, maintaining 10–20 workstation computers, network switches, and peripherals.',
      'Diagnose and resolve hardware, operating system, and Wi-Fi/LAN connectivity issues for 100+ students and 10+ faculty members.',
      'Manage institutional digital student records and support administration platforms, including the rollout of the CampusOne ERP system.',
      'Provide technical setup, audiovisual support, and staging for educational workshops, conferences, and institutional events.'
    ]
  },
  {
    role: 'Developer Intern',
    company: 'Bilim Technologies',
    period: 'September 2025 — November 2025',
    kind: 'Internship · Completed',
    location: 'Remote',
    tasks: [
      'Built and integrated modular frontend components for live web platforms using HTML5, CSS3, JavaScript, and Bootstrap.',
      'Ensured cross-device responsiveness and accessibility across mobile, tablet, and desktop viewports.',
      'Gained hands-on codebase experience with PHP, Laravel, and MySQL by connecting UI components to backend controllers.',
      'Worked with REST API endpoints to bind dynamic server responses to client-side views.'
    ]
  }
];

/** Desktop only: the pinned timeline index sits in the left column. */
const DESKTOP_QUERY = '(min-width: 1024px)';

function useIsDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return desktop;
}

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const desktop = useIsDesktop();
  const reduce = useReducedMotion();

  // Fills the timeline line as the role list scrolls through the middle of the screen.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 60%'] });

  // The active role is the last one whose top has passed the middle of the screen.
  useMotionValueEvent(scrollYProgress, 'change', () => {
    const line = window.innerHeight * 0.55;
    let current = 0;
    itemRefs.current.forEach((el, i) => {
      if (el && el.getBoundingClientRect().top <= line) current = i;
    });
    setActive(current);
  });

  const jumpTo = (i: number) => {
    const el = itemRefs.current[i];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section id="experience" aria-labelledby="experience-title" className="section">
      <div className="wrap">
        <header className="section-head">
          <span className="section-index">03</span>
          <span className="eyebrow">Experience</span>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Headline id="experience-title" className="h-section">
              Hands‑on roles in development and IT support.
            </Headline>

            {/* Pinned timeline index (desktop) */}
            {desktop && (
              <nav aria-label="Experience timeline" className="sticky top-[calc(var(--nav-height)+2.5rem)] mt-12">
                <div className="relative pl-6">
                  <span aria-hidden="true" className="absolute bottom-1 left-[5px] top-1 w-px bg-line" />
                  <motion.span
                    aria-hidden="true"
                    className="absolute bottom-1 left-[5px] top-1 w-px origin-top bg-ink"
                    style={{ scaleY: reduce ? 1 : scrollYProgress }}
                  />
                  <ol className="space-y-6">
                    {experiences.map((exp, i) => {
                      const on = active === i;
                      return (
                        <li key={exp.company} className="relative">
                          <span
                            aria-hidden="true"
                            className={`absolute -left-6 top-[0.35rem] h-[11px] w-[11px] rounded-full border transition-colors duration-500 ${
                              on ? 'border-ink bg-ink' : 'border-line bg-ivory'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => jumpTo(i)}
                            aria-current={on ? 'true' : undefined}
                            className="block text-left"
                          >
                            <span
                              className={`block text-[0.7rem] font-medium uppercase tracking-[0.16em] transition-colors duration-500 ${
                                on ? 'text-ink' : 'text-muted'
                              }`}
                            >
                              {exp.period}
                            </span>
                            <span
                              className={`mt-1 block font-serif text-[1.15rem] leading-snug transition-colors duration-500 ${
                                on ? 'text-ink' : 'text-muted'
                              }`}
                            >
                              {exp.company}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </nav>
            )}
          </div>

          <ol ref={listRef} className="lg:col-span-8 border-t border-ink">
            {experiences.map((exp, i) => (
              <li
                key={exp.company}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="border-b border-line"
              >
                <Reveal from="right" delay={i * 0.06}>
                  <HoverPreview src={exp.preview}>
                  <div
                    className={`grid grid-cols-1 gap-4 py-8 transition-opacity duration-700 md:grid-cols-[12rem_1fr] md:gap-10 md:py-10 ${
                      desktop && !reduce && active !== i ? 'opacity-45' : 'opacity-100'
                    }`}
                  >
                    <div className="text-sm">
                      <p className="font-medium text-ink">{exp.period}</p>
                      <p className="mt-1 text-muted">{exp.kind}</p>
                      <p className="mt-1 text-muted">{exp.location}</p>
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-serif text-[1.65rem] leading-tight text-ink sm:text-[1.85rem]">
                        {exp.role}
                      </h3>
                      <p className="mt-1 text-[0.9375rem] text-muted">{exp.company}</p>

                      <ul className="mt-5 space-y-2.5">
                        {exp.tasks.map((task) => (
                          <li key={task} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                            <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-muted" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  </HoverPreview>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
