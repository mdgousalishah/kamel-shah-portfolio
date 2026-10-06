import { motion } from 'motion/react';
import { Code2, Terminal, Database, Sparkles, Wrench } from 'lucide-react';

const skillCategories = [
  {
    number: "01",
    title: "FRONTEND",
    icon: Code2,
    description: "Component-driven architectures, responsive engineering, and accessible user interfaces.",
    skills: [
      "React",
      "React 19",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Bootstrap"
    ]
  },
  {
    number: "02",
    title: "BACKEND & REST APIS",
    icon: Terminal,
    description: "Server-side controllers, microservices, routing architectures, and RESTful service design.",
    skills: [
      "Node.js",
      "Express.js",
      "PHP",
      "Laravel",
      "Lumen",
      "REST APIs"
    ]
  },
  {
    number: "03",
    title: "DATABASE",
    icon: Database,
    description: "Relational modeling, document persistence, migrations, and query optimization.",
    skills: [
      "MongoDB",
      "MySQL",
      "SQLite",
      "PostgreSQL",
      "Mongoose"
    ]
  },
  {
    number: "04",
    title: "AI / GENAI",
    icon: Sparkles,
    description: "Practical workflows across Generative AI integration, prompt engineering, and agentic systems.",
    skills: [
      "Generative AI",
      "Agentic AI",
      "LLM Applications",
      "RAG Concepts",
      "Embeddings",
      "Semantic Search"
    ]
  },
  {
    number: "05",
    title: "TOOLS & INFRASTRUCTURE",
    icon: Wrench,
    description: "Version control toolchains, IT system administration, and technical deployment workflows.",
    skills: [
      "Git",
      "GitHub",
      "VS Code",
      "IT Infrastructure Support",
      "Postman",
      "Network Routing"
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="relative w-full py-20 md:py-28 px-4 sm:px-6 lg:px-12 bg-[#0B0C10] border-t border-white/[0.06] scroll-mt-[50px] z-10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Editorial Section Label */}
        <div className="flex items-center justify-between pb-8 border-b border-white/[0.08] mb-12 md:mb-16">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
              03 / CAPABILITIES & TECHNICAL MATRIX
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline">
            STRUCTURED PROFICIENCY MATRIX
          </span>
        </div>

        {/* Monumental Headline */}
        <h2 className="text-[clamp(2.25rem,4.5vw,4.25rem)] font-bold text-white leading-[1.08] tracking-tight max-w-4xl mb-6">
          Technical stack & engineering capabilities.
        </h2>
        <p className="text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed mb-16">
          Organized technical competencies across modern frontend architecture, backend routing, persistent data models, and emerging AI workflows.
        </p>

        {/* Grouped Capability Grid (High Hierarchy, Zero Keyword Wall) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {skillCategories.map((group, index) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="warm-panel flex flex-col justify-between p-5 sm:p-7 rounded-2xl border transition-all group"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
                    <span className="text-xs font-mono font-bold text-indigo-400 tracking-wider">
                      {group.number}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                    {group.title}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                    {group.description}
                  </p>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.05]">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-white/[0.02] hover:bg-white/[0.06] text-neutral-300 hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
