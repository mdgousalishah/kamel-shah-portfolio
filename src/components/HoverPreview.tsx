import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';

/**
 * Hover a row/pill → a small image follows the cursor (like landonorris.com's lists).
 * Mouse only and off for reduced motion — on touch screens nothing changes.
 * Purely decorative (the row already says what it is), so hidden from screen readers.
 */
export default function HoverPreview({
  src,
  children,
  className = '',
  as: Tag = 'div',
}: {
  src?: string;
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'span';
}) {
  const [enabled, setEnabled] = useState(false);
  const [show, setShow] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(Boolean(src) && fine && !reduce);
  }, [src]);

  if (!enabled) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      className={className}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        x.jump(e.clientX);
        y.jump(e.clientY);
        sx.jump(e.clientX);
        sy.jump(e.clientY);
        setShow(true);
      }}
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setShow(false)}
    >
      {children}
      {createPortal(
        <AnimatePresence>
          {show && (
            <motion.div
              aria-hidden="true"
              className="hover-preview"
              style={{ left: sx, top: sy }}
              initial={{ opacity: 0, scale: 0.85, rotate: -4, clipPath: 'inset(50% 50% 50% 50% round 10px)' }}
              animate={{ opacity: 1, scale: 1, rotate: 0, clipPath: 'inset(0% 0% 0% 0% round 10px)' }}
              exit={{ opacity: 0, scale: 0.9, rotate: 3, clipPath: 'inset(50% 50% 50% 50% round 10px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={src} alt="" decoding="async" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </Tag>
  );
}
