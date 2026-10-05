import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + Math.floor(Math.random() * 20) + 12;
      });
    }, 70);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[999] bg-[#0A0A0A] flex flex-col items-center justify-center text-white"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-16 md:h-20"
        >
          <img src="/Photos/My Logo.png" alt="Kamel Shah Logo" className="h-full w-auto object-contain filter invert opacity-90" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm tracking-[0.3em] font-medium text-[#A3A3A3] uppercase"
        >
          Kamel Shah
        </motion.div>

        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden mt-4">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-white/80"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
