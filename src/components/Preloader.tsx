import { motion } from 'motion/react';
import { useEffect } from 'react';
import { SITE_CONFIG } from '../data/config';

/**
 * Brief branded intro. Kept short so it never delays reading;
 * skipped entirely for users who prefer reduced motion.
 */
export default function Preloader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(onComplete, reduce ? 0 : 700);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-ivory"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-5"
      >
        <img src={SITE_CONFIG.logo} alt="" width={1021} height={448} className="h-12 w-auto md:h-14" />
        <span className="text-xs font-semibold tracking-[0.3em] text-muted">KAMEL SHAH</span>
      </motion.div>
    </motion.div>
  );
}
