import { motion } from 'motion/react';
import { GraduationCap, Award, Calendar, Sparkles } from 'lucide-react';

interface EducationItem {
  degree: string;
  institution: string;
  field: string;
  period: string;
  status: string;
  desc: string;
  isCertificate?: boolean;
  tags?: string[];
}

const educationData: EducationItem[] = [
  {
    degree: "Bachelor of Technology (B.Tech)",
    institution: "PES College of Engineering, Aurangabad",
    field: "Electronics & Computer Engineering",
    period: "2022 — 2026",
    status: "Expected 2026",
    desc: "Rigorous engineering education covering computing architectures, embedded systems, data structures, algorithms, object-oriented software design, and digital electronics.",
    tags: ["Computing Architecture", "Embedded Systems", "Data Structures", "Software Engineering"]
  },
  {
    degree: "Master of Business Administration (MBA)",
    institution: "Dr. D. Y. Patil Vidyapeeth, Pune",
    field: "Artificial Intelligence & Machine Learning (Online MBA)",
    period: "2026 — 2028",
    status: "In Progress (2026–2028)",
    desc: "Post-graduate curriculum focusing on machine learning foundations, enterprise AI applications, predictive analytics, strategic technology decision-making, and executive business strategy.",
    tags: ["Machine Learning", "Enterprise AI", "Predictive Analytics", "Business Strategy"]
  },
  {
    degree: "Bachelor of Arts (B.A.)",
    institution: "Yashwantrao Chavan Maharashtra Open University",
    field: "Humanities & Social Sciences",
    period: "Completed 2026",
    status: "Completed 2026",
    desc: "Undergraduate degree providing a strong foundation in communication, humanities, organizational behavior, and analytical thought.",
    tags: ["Humanities", "Communication", "Organizational Behavior", "Analytical Thought"]
  },
  {
    degree: "Advanced Certificate in UI-UX Design with Agentic AI and GenAI",
    institution: "IIT Madras Pravartak Technologies Foundation",
    field: "UI/UX Design • User-Centered Design • Generative AI • Agentic AI",
    period: "2026 — 2027",
    status: "In Progress (2026–2027)",
    isCertificate: true,
    desc: "Specialized advanced professional certificate program exploring user-centered design, modern UI/UX workflows, prompt engineering, Generative AI integration, and agentic product development.",
    tags: ["UI/UX Design", "User-Centered Design", "Generative AI", "Agentic AI", "Design Thinking"]
  }
];

export default function Education() {
  return (
    <section id="education" className="relative w-full py-20 md:py-28 px-6 lg:px-12 bg-[#08080A] border-t border-white/[0.06] scroll-mt-[50px] z-10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Editorial Section Label */}
        <div className="flex items-center justify-between pb-8 border-b border-white/[0.08] mb-12 md:mb-16">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
              06 / FORMAL EDUCATION & ADVANCED LEARNING
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline">
            PES COLLEGE • DY PATIL • YCMOU • IITM PRAVARTAK
          </span>
        </div>

        {/* Monumental Headline */}
        <h2 className="text-[clamp(2.25rem,4.5vw,4.25rem)] font-bold text-white leading-[1.08] tracking-tight max-w-4xl mb-6">
          Formal engineering, management & AI credentials.
        </h2>
        <p className="text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed mb-16">
          Interdisciplinary education spanning electronics & computer engineering, AI/ML specialization, organizational humanities, and professional certification from IIT Madras Pravartak.
        </p>

        {/* Chronological Editorial Timeline */}
        <div className="relative border-l border-white/[0.1] ml-2 sm:ml-4 pl-6 sm:pl-10 space-y-12">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative group"
            >
              {/* Timeline Illuminated Node */}
              <div className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#08080A] border-2 transition-colors ${
                edu.isCertificate 
                  ? 'border-indigo-400 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.7)]' 
                  : 'border-white/40 group-hover:border-indigo-400 shadow-[0_0_8px_rgba(255,255,255,0.2)]'
              }`} />

              <div className="flex flex-col gap-2.5">
                {/* Status & Period Strip */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-mono font-bold text-white tracking-wider">
                    {edu.period}
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                    edu.isCertificate ? 'text-indigo-300' : 'text-indigo-400'
                  }`}>
                    {edu.status}
                  </span>
                  {edu.isCertificate && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-[10px] font-mono text-indigo-300 font-semibold uppercase">
                      <Award size={11} />
                      Advanced Certificate
                    </span>
                  )}
                </div>

                {/* Degree & Institution */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
                    {edu.degree}
                  </h3>
                  <div className="text-sm sm:text-base font-mono text-neutral-300 font-medium mt-1">
                    {edu.institution}
                  </div>
                  <div className="text-xs font-mono text-indigo-300/80 mt-1">
                    Field: {edu.field}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-400 leading-relaxed max-w-3xl mt-1">
                  {edu.desc}
                </p>

                {/* Tags */}
                {edu.tags && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {edu.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.06] text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
