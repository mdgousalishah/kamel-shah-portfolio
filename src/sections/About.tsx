import { SITE_CONFIG } from '../data/config';
import Reveal from '../components/Reveal';
import Depth from '../components/Depth';

const DETAILS = [
  {
    label: 'Education',
    items: [
      'B.Tech, Electronics & Computer Engineering — PES College of Engineering, Aurangabad (DBATU). Expected 2026.',
      'MBA, Artificial Intelligence & Machine Learning — Dr. D. Y. Patil Vidyapeeth, Pune. Pursuing, 2026 – present.'
    ]
  },
  {
    label: 'Interests',
    items: ['Full-stack web applications, REST API design, interface design, and practical applications of agentic AI.']
  },
  {
    label: 'Practice',
    items: [
      'eCommerce platforms, institutional portals, and business websites — alongside hands-on IT support for a multi-school education society.'
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
          <Reveal className="lg:col-span-5 lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:self-start">
            <figure className="mx-auto w-full max-w-[26rem] lg:max-w-none">
              <Depth strength={6} tilt>
              <div className="frame zoom-on-hover aspect-[1200/1490]">
                <picture>
                  <source srcSet={SITE_CONFIG.images.aboutWebp} type="image/webp" />
                  <img
                    src={SITE_CONFIG.images.about}
                    alt="Black-and-white portrait of Mohammed Gous Ali Shah wearing a blazer"
                    width={1200}
                    height={1490}
                    loading="lazy"
                    decoding="async"
                    className="object-cover object-[50%_20%]"
                  />
                </picture>
              </div>
              </Depth>
              <figcaption className="mt-3 text-xs text-muted">Parbhani, Maharashtra</figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-span-7 min-w-0">
            <Reveal>
              <h2 id="about-title" className="h-section max-w-[18ch]">
                Engineering for the web, grounded in everyday IT practice.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
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

            <Reveal delay={0.12}>
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
