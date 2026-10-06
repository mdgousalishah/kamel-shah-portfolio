import { motion } from 'motion/react';
import { PROJECTS } from '../data/projects';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';

export default function Projects() {
  return (
    <section id="projects" className="relative w-full py-20 md:py-28 px-4 sm:px-6 lg:px-12 bg-[#08080A] border-t border-white/[0.06] scroll-mt-[50px] z-10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Editorial Section Label */}
        <div className="flex items-center justify-between pb-8 border-b border-white/[0.08] mb-12 md:mb-16">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
              04 / SELECTED WORK & CASE STUDIES
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline">
            7 FEATURED PLATFORMS & SYSTEMS
          </span>
        </div>

        {/* Monumental Headline */}
        <h2 className="text-[clamp(2.25rem,4.5vw,4.25rem)] font-bold text-white leading-[1.08] tracking-tight max-w-4xl mb-6">
          Featured engineering projects.
        </h2>
        <p className="text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed mb-20">
          End-to-end web applications, e-commerce systems, institutional portals, and algorithmic utilities engineered with modern frontend, backend, and database architecture.
        </p>

        {/* Unified Editorial Project Blocks (Consistent System for All 5 Projects) */}
        <div className="flex flex-col gap-24 lg:gap-32">
          {PROJECTS.map((project, idx) => {
            const isEven = idx % 2 === 1;
            const projectImage = (
              <>
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-visual-image w-full h-full object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                {project.link && (
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={18} />
                  </div>
                )}
              </>
            );
            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="project-showcase group flex flex-col lg:flex-row items-center gap-10 lg:gap-14 pb-20 border-b border-white/[0.06] last:border-b-0 last:pb-0"
              >
                {/* Large Visual Showcase (Alternating Left/Right on Desktop) */}
                <div className={`w-full lg:w-[56%] ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-visual block relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0E0F14] shadow-2xl transition-all duration-500 group-hover:border-white/25">
                      {projectImage}
                    </a>
                  ) : (
                    <div className="project-visual relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0E0F14] shadow-2xl transition-all duration-500 group-hover:border-white/25">
                      {projectImage}
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className={`warm-panel w-full lg:w-[44%] p-5 sm:p-6 rounded-2xl border flex flex-col justify-between ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div>
                    {/* Meta Header: Number & Category */}
                    <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06] mb-4">
                      <span className="text-2xl font-bold font-mono text-neutral-500 group-hover:text-indigo-400 transition-colors">
                        #{project.number}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                        {project.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight group-hover:text-indigo-200 transition-colors">
                      {project.title}
                    </h3>

                    {/* Bullet Summaries */}
                    <div className="space-y-2.5 mb-6 text-sm text-neutral-300 leading-relaxed">
                      {Array.isArray(project.description) ? (
                        project.description.map((desc, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                            <p>{desc}</p>
                          </div>
                        ))
                      ) : (
                        <p>{project.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack & Links */}
                  <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 bg-white/[0.03] text-neutral-300 border border-white/[0.06] rounded-md text-[11px] font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {project.link && <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="warm-action inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                      >
                        <span>Visit live site</span>
                        <ArrowUpRight size={14} />
                      </a>}

                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full bg-white/[0.04] text-neutral-300 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all text-xs font-mono"
                        >
                          <Github size={14} />
                          <span>{project.github.endsWith('/mdgousalishah') ? 'GitHub profile' : 'View repository'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
