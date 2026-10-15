import { SITE_CONFIG } from '../data/config';
import Reveal from '../components/Reveal';
import { Headline, PhotoReveal } from '../components/Motion';
import Depth from '../components/Depth';

const DETAILS = [
  {
    label: 'Interests',
    items: ['Full-stack web applications, REST API design, interface design, and practical applications of agentic AI.']
  },
  {
    label: 'Practice',
    items: [
      'eCommerce platforms, institutional portals, and business websites — alongside hands-on IT support for a multi-school education society.'
    ]
  },
  {
    label: 'Education',
    items: [
      'B.Tech, Electronics & Computer Engineering — PES College of Engineering, Aurangabad (DBATU). Expected 2026.',
      'MBA, Artificial Intelligence & Machine Learning — Dr. D. Y. Patil Vidyapeeth, Pune. Pursuing, 2026 – present.'
    ]
  }
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="wrap">
        <header className="section-head">
          <span className="section-index">01</span>
          <span className="eyebrow">About</span>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:self-start">
            <figure className="mx-auto w-full max-w-[26rem] lg:max-w-none">
              <PhotoReveal from="left" radius={12}>
              <Depth strength={6} tilt>
              <div className="frame zoom-on-hover aspect-square rounded-xl border-0 bg-[#1b1622] shadow-[0_24px_60px_-28px_rgba(36,36,36,0.55)]">
                <picture>
                  <source srcSet={SITE_CONFIG.images.aboutWebp} type="image/webp" />
                  <img
                    src={SITE_CONFIG.images.about}
                    alt="Illustrated portrait of Mohammed Gous Ali Shah at his desk, surrounded by his tech stack, projects, and studies"
                    width={1000}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="object-cover"
                  />
                </picture>
              </div>
              </Depth>
              </PhotoReveal>
              <figcaption className="mt-3 flex items-center justify-between text-xs text-muted">
                <span>Illustrated portrait</span>
                <span>Parbhani, Maharashtra</span>
              </figcaption>
            </figure>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <Headline id="about-title" className="h-section max-w-[18ch]">
                Engineering for the web, grounded in everyday IT practice.
              </Headline>

            <Reveal from="right" delay={0.08}>
              <div className="lead mt-8 max-w-[38rem] space-y-5">
                <p>
                  I am a final-year B.Tech candidate in Electronics &amp; Computer Engineering, concurrently
                  pursuing an MBA in Artificial Intelligence and Machine Learning. My work brings modern
                  full-stack web technologies together with the discipline of computer engineering.
                </p>
                <p>
                  Across my projects I work with React, TypeScript, Node.js, Express, PHP, and Laravel —
                  building responsive interfaces, clear MongoDB and MySQL data structures, and dependable
                  REST APIs shaped around real operational needs.
                </p>
                <p>
                  Since June 2023 I have also served as IT &amp; Technical Support Assistant for Kamel
                  Education Society, looking after workstations, local networking, and administrative
                  systems across its schools.
                </p>
              </div>
            </Reveal>

            <Reveal from="right" delay={0.12}>
              <dl className="mt-12 border-t border-line">
                {DETAILS.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr] sm:gap-8"
                  >
                    <dt className="eyebrow pt-1">{row.label}</dt>
                    <dd className="space-y-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {row.items.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
