import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────
   PhotoReveal — "Reveal" + "Morph" transition for images.
   A curtain wipe opens the photo from one side while the image
   inside settles from a slight zoom; corners morph from soft to
   the frame's final radius. Runs once, on normal scroll.
   ───────────────────────────────────────────────────────────── */
type Side = 'left' | 'right' | 'bottom';

const CLIP_START: Record<Side, string> = {
  left: 'inset(0% 100% 0% 0% round 48px)',
  right: 'inset(0% 0% 0% 100% round 48px)',
  bottom: 'inset(100% 0% 0% 0% round 48px)',
};

export function PhotoReveal({
  children,
  from = 'left',
  className,
  delay = 0,
  radius = 0,
}: {
  children: ReactNode;
  from?: Side;
  className?: string;
  delay?: number;
  /** Final corner radius in px, matched to the frame it wraps. */
  radius?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ clipPath: CLIP_START[from], opacity: 0.4 }}
      // Ends slightly outside the box so shadows and hover tilt are never cut off.
      whileInView={{ clipPath: `inset(-12% -12% -12% -12% round ${radius}px)`, opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.25, delay, ease: EASE }}
    >
      <motion.div
        initial={{ scale: 1.16 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 1.6, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Headline — entrance colour + grow, scroll-linked grow/shrink,
   and a soft fade on exit (as it scrolls off the top).
   ───────────────────────────────────────────────────────────── */
export function Headline({
  id,
  children,
  className,
  wrapperClassName,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // Grow toward the middle of the screen, shrink a touch on the way out.
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.95, 1, 0.97]);
  // Exit: fade as the heading nears the top edge.
  const opacity = useTransform(scrollYProgress, [0.7, 0.96], [1, 0.12]);

  if (reduce) {
    return (
      <div ref={ref} className={wrapperClassName}>
        <h2 id={id} className={className}>{children}</h2>
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={wrapperClassName} style={{ scale, opacity, originX: 0, originY: 1 }}>
      <motion.h2
        id={id}
        className={className}
        initial={{ opacity: 0, scale: 0.86, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.1, ease: EASE, opacity: { duration: 1.4, ease: 'easeOut' } }}
        style={{ originX: 0 }}
      >
        {children}
      </motion.h2>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ScrollFade — exit fade + gentle lift for a block as it scrolls
   off the top of the screen (used on the hero text).
   ───────────────────────────────────────────────────────────── */
export function ScrollFade({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0.15, 0.85], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  if (reduce) return <div ref={ref} className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ opacity, y, scale, originX: 0 }}>
      {children}
    </motion.div>
  );
}
