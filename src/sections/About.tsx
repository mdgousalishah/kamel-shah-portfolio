import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function About() {
  const highlightPoints = [
    "Final-year B.Tech Electronics & Computer Engineering candidate (Expected 2026)",
    "Pursuing MBA in Artificial Intelligence & Machine Learning (2026–Present)",
    "Full-stack web projects using React, Node.js, Express, MongoDB, PHP, Laravel",
    "Professional IT support experience across 5 schools"
  ];

  return (
    <section id="about" className="section-container px-6 bg-[#0A0A0A] relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          <div className="w-full lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Who I Am.</h2>
              <div className="h-[2px] w-24 bg-white/20 mb-8"></div>
              <p className="text-[#A3A3A3] text-lg font-medium leading-relaxed max-w-sm">
                Bridging the gap between software development, artificial intelligence, and practical IT infrastructure.
              </p>
            </motion.div>
          </div>
          
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="prose prose-invert max-w-none"
            >
              <p className="text-xl md:text-2xl text-[#EDEDED] leading-relaxed font-medium mb-0">
                I am a final-year B.Tech Electronics & Computer Engineering candidate (Expected 2026) pursuing an MBA in Artificial Intelligence & Machine Learning.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="prose prose-invert max-w-none"
            >
              <p className="text-[#A3A3A3] text-lg leading-relaxed mb-6">
                I have hands-on experience building full-stack web projects using React, Node.js, Express, MongoDB, PHP, and Laravel. I've developed eCommerce and institutional web platforms with responsive interfaces, REST APIs, database integration, and modern frontend technologies.
              </p>
              
              <p className="text-[#A3A3A3] text-lg leading-relaxed mb-10">
                My background combines practical software development projects with professional IT support experience and a strong foundation in AI/ML, enabling me to build robust, user-focused web experiences.
              </p>
            </motion.div>
            
            {/* Quick Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlightPoints.map((point, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.3 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                >
                  <ArrowRight size={18} className="text-white/40 shrink-0 mt-0.5" />
                  <span className="text-[#EDEDED] text-sm font-medium leading-relaxed">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
