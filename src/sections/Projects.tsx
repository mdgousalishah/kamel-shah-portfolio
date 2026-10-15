import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS, type Project } from '../data/projects';
import { SITE_CONFIG } from '../data/config';
import Reveal from '../components/Reveal';
import Depth from '../components/Depth';

/** A GitHub link that is just the profile root is labelled honestly, not as a repository. */
const sourceLabel = (url: string) =>
  url.replace(/\/+$/, '') === SITE_CONFIG.socials.github.replace(/\/+$/, '') ? 'GitHub profile' : 'Source code';

function ProjectImage({ project, priority = false }: { project: Project; priority?: boolean }) {
  const [failed, setFailed] = useState(false);

  return (
    <Depth strength={10} tilt>
    <div className="frame zoom-on-hover aspect-[16/10]">
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
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setFailed(true)}
            className="object-contain object-top"
          />
        </picture>
      )}
    </div>
    </Depth>
  );
}

function ProjectMeta({ project, large = false }: { project: Project; large?: boolean }) {
  const headingId = `project-${project.id}`;
  const lines = Array.isArray(project.description) ? project.description : [project.description];
  const [lead, ...rest] = lines;

  return (
    <div className="min-w-0">
      <div className="flex items-baseline gap-3">
        <span className="section-index text-sm">{project.number}</span>
        <span className="eyebrow">{project.category}</span>
      </div>

      <h3
        id={headingId}
        className={`mt-3 font-serif leading-[1.08] tracking-[-0.02em] text-ink ${
          large ? 'text-[clamp(2rem,4vw,3rem)]' : 'text-[clamp(1.75rem,3vw,2.25rem)]'
        }`}
      >
        {project.title}
      </h3>

      <p className="mt-4 max-w-[36rem] text-[1rem] leading-relaxed text-ink-soft">{lead}</p>

      {rest.length > 0 && (
        <ul className="mt-4 max-w-[36rem] space-y-2">
          {rest.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-muted" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
        {project.tech.map((t) => (
          <li key={t} className="tag">
            {t}
          </li>
        ))}
      </ul>

      {(project.link || project.github) && (
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line text-sm font-medium"
              aria-label={`Visit the live ${project.title} site (opens in a new tab)`}
            >
              Live site
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet inline-flex items-center gap-1 text-sm"
            >
              {sourceLabel(project.github)}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const [flagship, ...others] = PROJECTS;

  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <div className="wrap">
        <header className="section-head">
          <span className="section-index">04</span>
          <span className="eyebrow">Selected Work</span>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <h2 id="projects-title" className="h-section">
              Selected work across eCommerce, institutions, and utilities.
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.06}>
            <p className="body-muted max-w-[30rem] lg:ml-auto">
              Five real projects — each shown with its own live screenshot, the stack it was built with,
              and a link where one is publicly available.
            </p>
          </Reveal>
        </div>

        {/* Flagship project */}
        {flagship && (
          <article aria-labelledby={`project-${flagship.id}`} className="mt-14 lg:mt-20">
            <Reveal>
              <ProjectImage project={flagship} />
            </Reveal>
            <Reveal delay={0.06} className="mt-8 grid grid-cols-1 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                <ProjectMeta project={flagship} large />
              </div>
            </Reveal>
          </article>
        )}

        {/* Remaining projects, alternating image and text */}
        <div className="mt-20 space-y-20 lg:mt-28 lg:space-y-28">
          {others.map((project, idx) => {
            const flip = idx % 2 === 1;
            return (
              <article
                key={project.id}
                aria-labelledby={`project-${project.id}`}
                className="grid grid-cols-1 items-center gap-8 border-t border-line pt-12 lg:grid-cols-12 lg:gap-14 lg:pt-16"
              >
                <Reveal className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
                  <ProjectImage project={project} />
                </Reveal>
                <Reveal
                  delay={0.06}
                  className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}
                >
                  <ProjectMeta project={project} />
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
