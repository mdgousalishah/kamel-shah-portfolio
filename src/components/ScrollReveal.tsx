import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollRevealProps {
  children: ReactNode;
}

export default function ScrollReveal({ children }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
