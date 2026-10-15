import { useRef, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

interface DepthProps {
  children: ReactNode;
  className?: string;
  /** Maximum scroll-linked tilt in degrees. Kept small so it reads as depth, not motion. */
  strength?: number;
  /** Also tilt toward a mouse pointer (ignored for touch). */
  tilt?: boolean;
  /** Maximum pointer tilt in degrees. */
  tiltStrength?: number;
}

/**
 * Subtle 3D depth tied to normal page scrolling.
 * As the element travels up the viewport it eases from a slight backward lean
 * to flat, then leans a touch forward as it leaves — no scroll-jacking, no pinning.
 * Optional pointer tilt on desktop. Fully static for users who prefer reduced motion.
 */
export default function Depth({ children, className, strength = 8, tilt = false, tiltStrength = 5 }: DepthProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scrollRotate = useTransform(scrollYProgress, [0, 0.5, 1], [strength, 0, -strength * 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.985]);
  const smoothRotate = useSpring(scrollRotate, { stiffness: 140, damping: 26, mass: 0.4 });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltY = useSpring(pointerX, { stiffness: 160, damping: 18, mass: 0.5 });
  const tiltX = useSpring(pointerY, { stiffness: 160, damping: 18, mass: 0.5 });
  const rotateX = useTransform(() => smoothRotate.get() + tiltX.get());

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    pointerX.set(nx * 2 * tiltStrength);
    pointerY.set(-ny * 2 * tiltStrength);
  };
  const handleLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 1200 }}
      onPointerMove={tilt ? handleMove : undefined}
      onPointerLeave={tilt ? handleLeave : undefined}
    >
      <motion.div style={{ rotateX, rotateY: tiltY, scale, transformStyle: 'preserve-3d', willChange: 'transform' }}>
        {children}
      </motion.div>
    </div>
  );
}
