import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type From = 'up' | 'left' | 'right' | 'zoom';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Direction the element slides in from. */
  from?: From;
  /** Travel distance in px for up/left/right. Kept modest on purpose. */
  distance?: number;
  /** Soft blur-to-sharp while sliding in (best for text; off for photos). */
  blur?: boolean;
  as?: 'div' | 'li' | 'article';
  /** Legacy alias for an upward distance. */
  y?: number;
}

/**
 * Entrance motion triggered once when the element scrolls into view:
 * a short slide (up / from the left / from the right / zoom), a gentle 3D turn,
 * and an optional blur-to-sharp. Normal scrolling only; static for reduced motion.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  from = 'up',
  distance,
  blur = true,
  as = 'div',
  y,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = as;

  if (reduce) return <Tag className={className}>{children}</Tag>;

  const d = distance ?? y ?? (from === 'up' ? 22 : 56);
  const start = {
    up: { y: d, rotateX: 10 },
    left: { x: -d, rotateY: 8 },
    right: { x: d, rotateY: -8 },
    zoom: { scale: 0.92, y: 16 },
  }[from];

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...start, filter: blur ? 'blur(6px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0, filter: 'blur(0px)' }}
      style={{ transformPerspective: 1000, originY: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
