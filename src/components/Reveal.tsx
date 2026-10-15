import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px. Kept small on purpose. */
  y?: number;
  as?: 'div' | 'li' | 'article';
}

/**
 * Short fade-and-rise entrance with a slight 3D flip-up, triggered once when the element enters the viewport.
 * Content is never hidden for users who prefer reduced motion.
 */
export default function Reveal({ children, className, delay = 0, y = 16, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = as;

  if (reduce) return <Tag className={className}>{children}</Tag>;

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      style={{ transformPerspective: 1000, originY: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
