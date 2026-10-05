import { motion } from 'motion/react';
import { Globe, Layout, Search, ArrowUpRight } from 'lucide-react';

const services = [
  {
    number: "01",
    title: "Full-Stack Web Development",
    icon: Globe,
    description: "Architecting end-to-end web applications with modular components, secure RESTful APIs, and scalable database schemas.",
    deliverables: [
      "Modern Web & SaaS Systems (React / Vite)",
      "Node.js & Express REST APIs",
      "Database Modeling (MongoDB, MySQL, PostgreSQL)",
      "Authentication & Secure CRUD Operations"
    ]
  },
  {
    number: "02",
    title: "Frontend Engineering & UI/UX",
    icon: Layout,
    description: "Building responsive, pixel-accurate web interfaces with smooth micro-interactions, clean typography, and fast load times.",
    deliverables: [
      "Tailwind CSS & Modern CSS Architecture",
      "TypeScript Component Architecture",
      "Mobile-First Responsive Layouts",
      "UI/UX Design & AI-Assisted Workflows"
    ]
  },
  {
    number: "03",
    title: "Digital Marketing & Technical SEO",
    icon: Search,
    description: "Practical web visibility optimization, on-page SEO best practices, structured metadata, and fast mobile performance.",
    deliverables: [
      "On-Page Technical SEO",
      "Semantic HTML & Metadata",
      "Core Web Vitals & Speed Optimization",
      "Squarespace & CMS Deployment"
    ]
  }
];

export default function Services() {
  return (
    <section id="services" className="relative w-full py-20 md:py-28 px-6 lg:px-12 bg-[#0B0C10] border-t border-white/[0.06] scroll-mt-[50px] z-10">
      <div className="max-w-7xl mx-auto w-full">
        {/* Editorial Section Label */}
        <div className="flex items-center justify-between pb-8 border-b border-white/[0.08] mb-12 md:mb-16">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
              05 / CORE SERVICES & OFFERINGS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline">
            PRACTICAL SPECIALIZATIONS
          </span>
        </div>

        {/* Monumental Headline */}
        <h2 className="text-[clamp(2.25rem,4.5vw,4.25rem)] font-bold text-white leading-[1.08] tracking-tight max-w-4xl mb-6">
          Practical offerings tailored to business outcomes.
        </h2>
        <p className="text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed mb-16">
          Clean, maintainable web engineering focused on speed, usability, and modern digital visibility without inflated claims.
        </p>

        {/* Editorial Services Grid (Large Numbers, Fine Hairlines, Zero Clunky Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] border-y border-white/[0.08]">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="py-10 lg:py-12 px-0 lg:px-8 first:lg:pl-0 last:lg:pr-0 flex flex-col justify-between group"
              >
                <div>
                  {/* Large Editorial Number & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-4xl lg:text-5xl font-mono font-bold text-neutral-600 group-hover:text-indigo-400 transition-colors">
                      {service.number}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                    {service.description}
                  </p>
                </div>

                {/* Deliverables List */}
                <div className="pt-6 border-t border-white/[0.06]">
                  <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-3 font-semibold">
                    Deliverables
                  </span>
                  <ul className="space-y-2">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-center gap-2 font-mono">
                        <span className="w-1 h-1 rounded-full bg-indigo-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
