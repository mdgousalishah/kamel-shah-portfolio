import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { SITE_CONFIG } from '../data/config';

const FACTS = [
  { label: 'Focus', value: 'Full-stack web development' },
  { label: 'Education', value: 'B.Tech ECE · MBA in AI & ML' },
  { label: 'Based in', value: 'Parbhani, Maharashtra, India' }
];

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative">
      <div className="wrap pt-10 pb-16 sm:pt-14 md:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Text column */}
          <div className="lg:col-span-7 min-w-0">
            <p className="eyebrow rise">Kamel Shah · Portfolio</p>

            <h1
              id="hero-title"
              className="display rise d-1 mt-6 text-[clamp(2.6rem,calc(1rem+6.2vw),5.5rem)] text-ink"
            >
              Mohammed Gous Ali&nbsp;Shah
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
          </div>

          {/* Portrait column */}
          <figure className="lg:col-span-5 mx-auto w-full max-w-[26rem] sm:max-w-[28rem] lg:max-w-none">
            <div className="frame unveil aspect-[1200/1490]">
              <picture>
                <source srcSet={SITE_CONFIG.images.heroWebp} type="image/webp" />
                <img
                  src={SITE_CONFIG.images.hero}
                  alt="Black-and-white close-up portrait of Mohammed Gous Ali Shah, resting his chin on his hand"
                  width={1200}
                  height={1490}
                  fetchPriority="high"
                  decoding="async"
                  className="object-cover object-[50%_30%]"
                />
              </picture>
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
