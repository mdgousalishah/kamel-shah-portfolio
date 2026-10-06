import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SITE_CONFIG } from '../data/config';
import { ArrowDown, Download } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section ref={containerRef} id="home" className="relative min-h-[100svh] flex items-center pt-24 pb-12 px-6 overflow-hidden">
      {/* Background soft gradient */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" 
      />
      
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Content */}
        <motion.div 
          style={{ y: textY, opacity: textOpacity }}
          className="w-full lg:w-3/5 flex flex-col items-start order-2 lg:order-1"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[1px] w-12 bg-[#EDEDED]"></div>
            <span className="text-sm font-semibold tracking-widest text-[#EDEDED] uppercase font-mono">
              {SITE_CONFIG.alias}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            <span className="block">Mohammed Gous</span>
            <span className="block text-[#A3A3A3]">Ali Shah.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-2 mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-[#EDEDED]">Software Developer</h2>
            <p className="text-[#A3A3A3] text-sm md:text-base font-medium font-mono uppercase tracking-wide">
              Full-Stack Web Development <span className="mx-2 text-white/20">|</span> React <span className="mx-2 text-white/20">|</span> Node.js
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-[#A3A3A3] max-w-xl leading-relaxed mb-12"
          >
            {SITE_CONFIG.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a 
              href="#projects"
              className="group flex items-center justify-center gap-2 bg-[#EDEDED] text-[#0A0A0A] px-8 py-4 rounded-full font-bold hover:bg-white transition-all hover:scale-105 active:scale-95"
            >
              View My Work <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </a>
            <a 
              href={SITE_CONFIG.resume}
              download
              className="group flex items-center justify-center gap-2 bg-transparent border border-white/20 text-[#EDEDED] px-8 py-4 rounded-full font-bold hover:bg-white/5 hover:border-white/40 transition-all hover:scale-105 active:scale-95"
            >
              Resume <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div 
          style={{ y: imageY, opacity: textOpacity }}
          className="w-full lg:w-2/5 flex justify-center lg:justify-end order-1 lg:order-2"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[280px] h-[340px] sm:w-[320px] sm:h-[400px] lg:w-[400px] lg:h-[500px] group"
          >
            {/* Image frame */}
            <div className="absolute inset-0 bg-[#121212] rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10">
              <img 
                src="/Photos/kamel-shah-portrait.png" 
                alt="Mohammed Gous Ali Shah" 
                className="w-full h-full object-cover [object-position:50%_36%] grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-full h-full border border-white/10 rounded-2xl z-0 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform duration-700" />
            
            {/* Minimal floating elements */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
              className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
