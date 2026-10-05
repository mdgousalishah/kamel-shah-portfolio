import { motion } from 'motion/react';
import { Briefcase, MapPin, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const experiences = [
  {
    number: "01",
    role: "IT Support Specialist",
    company: "Kamel Education Society",
    period: "2023 — PRESENT",
    date: "June 2023 – Present",
    location: "Parbhani, Maharashtra",
    badge: "Current Institutional Role",
    tasks: [
      "Administered IT infrastructure across 5 institutional schools, maintaining and troubleshooting 10–20 workstation computers, network routing switches, and peripherals.",
      "Resolved hardware, system software, Wi-Fi networking, and LAN connectivity issues for 100+ students and 10+ faculty members.",
      "Managed educational digital records, spreadsheets, and supported school digital platforms including the rollout and operations of the CampusOne ERP system.",
      "Delivered on-site technical staging and AV/IT hardware support for educational workshops, annual seminars, and institutional events."
    ]
  },
  {
    number: "02",
    role: "Developer Intern",
    company: "Bilim Technologies",
    period: "09 / 2025 — 11 / 2025",
    date: "September 2025 – November 2025",
    location: "Remote",
    badge: "Software Engineering Internship",
    tasks: [
      "Engineered and integrated modular frontend components for active web platforms, aligning with established architecture guidelines.",
      "Built responsive, accessible user interfaces using HTML5, CSS3, JavaScript, and Bootstrap across desktop and mobile viewports.",
      "Gained hands-on codebase exposure to PHP, Laravel, and MySQL database schemas by tracing data flow between UI components and backend controllers.",
      "Collaborated with REST API endpoints to bind dynamic server data to client-side views."
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="relative w-full py-20 md:py-28 px-4 sm:px-6 lg:px-12 bg-[#08080A] border-t border-white/[0.06] scroll-mt-[50px] z-10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Editorial Section Label */}
        <div className="flex items-center justify-between pb-8 border-b border-white/[0.08] mb-12 md:mb-16">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
              02 / PRACTICAL EXPERIENCE & TIMELINE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline">
            CAREER & OPERATIONAL HISTORY
          </span>
        </div>

        {/* Monumental Headline */}
        <h2 className="text-[clamp(2.25rem,4.5vw,4.25rem)] font-bold text-white leading-[1.08] tracking-tight max-w-4xl mb-6">
          Hands-on technical roles & systems management.
        </h2>
        <p className="text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed mb-16">
          Dual background spanning production software development internships and physical institutional IT infrastructure operations.
        </p>

        {/* Modern Editorial Timeline */}
        <div className="relative border-l border-white/[0.1] ml-2 sm:ml-4 pl-6 sm:pl-10 space-y-12 md:space-y-16">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Timeline Illuminated Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#08080A] border-2 border-indigo-500 group-hover:bg-indigo-500 transition-colors shadow-[0_0_12px_rgba(99,102,241,0.5)]" />

              <div className="flex flex-col gap-4">
                {/* Meta Strip */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm sm:text-base font-mono font-bold text-white tracking-wider">
                    {exp.period}
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                    {exp.badge}
                  </span>
                  <span className="text-neutral-600 hidden sm:inline">•</span>
                  <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                    {exp.location}
                  </span>
                </div>

                {/* Role & Company Header */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
                    {exp.role}
                  </h3>
                  <div className="text-base font-mono text-neutral-300 font-medium mt-1">
                    {exp.company}
                  </div>
                </div>

                {/* Structured Bullet Points */}
                <ul className="space-y-2.5 pt-2 max-w-3xl">
                  {exp.tasks.map((task, i) => (
                    <li key={i} className="text-sm md:text-base text-neutral-300 leading-relaxed flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 shrink-0" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
