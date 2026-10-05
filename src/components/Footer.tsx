import { SITE_CONFIG } from '../data/config';
import { Github, Linkedin, Twitter, Globe, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-16 px-6 lg:px-12 bg-[#050507] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-10">
        
        {/* Top: Minimal Brand & Professional Identity */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-sans">
              Kamel Shah
            </h2>
            <p className="text-xs sm:text-sm font-mono text-neutral-400 uppercase tracking-wider">
              Full-Stack Developer <span className="text-neutral-600 mx-2">•</span> Agentic AI Developer <span className="text-neutral-600 mx-2">•</span> IT & Technical Support
            </p>
          </div>

          <a
            href="#home"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Bottom: Clean Social Channels & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-400">
          <div className="flex flex-wrap items-center gap-6">
            <a
              href={SITE_CONFIG.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Linkedin size={14} />
              <span>LinkedIn</span>
            </a>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <a
              href={SITE_CONFIG.socials.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <a
              href={SITE_CONFIG.socials.x}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Twitter size={14} />
              <span>X</span>
            </a>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <a
              href={SITE_CONFIG.socials.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Globe size={14} />
              <span>Portfolio</span>
            </a>
          </div>

          <div className="text-neutral-500">
            &copy; 2026 Kamel Shah
          </div>
        </div>

      </div>
    </footer>
  );
}
