import { Globe, LayoutTemplate, Wrench, Search } from 'lucide-react';
import Reveal from '../components/Reveal';

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

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section">
      <div className="wrap">
        <header className="section-head">
          <span className="section-index">05</span>
          <span className="eyebrow">Services</span>
        </header>

        <Reveal>
          <h2 id="services-title" className="h-section max-w-[18ch]">
            How I can help with your next project.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 border-t border-ink md:grid-cols-2 lg:mt-16">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <Reveal
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
      </div>
    </section>
  );
}
