import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';

/**
 * Hover a row/pill → a small image follows the cursor (like landonorris.com's lists).
 * Mouse only and off for reduced motion — on touch screens nothing changes.
 * Purely decorative (the row already says what it is), so hidden from screen readers.
 *
 * It only appears after a real mouse movement over the element and hides as soon as the
 * page scrolls — browsers fire "mouse enter" when content scrolls under a resting cursor,
 * and that must not pop images over the text being read.
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
  const inside = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(Boolean(src) && fine && !reduce);
  }, [src]);

  // Any scroll hides the preview; the visitor has to move the mouse again to bring it back.
  useEffect(() => {
    if (!show) return;
    const hide = () => setShow(false);
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('wheel', hide, { passive: true });
    return () => {
      window.removeEventListener('scroll', hide);
      window.removeEventListener('wheel', hide);
    };
  }, [show]);

  if (!enabled) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      className={className}
      onPointerEnter={() => {
        inside.current = true;
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !inside.current) return;
        // Scroll-generated pointer events have no movement; only a real move shows the preview.
        if (!show) {
          if (e.movementX === 0 && e.movementY === 0) return;
          x.jump(e.clientX);
          y.jump(e.clientY);
          sx.jump(e.clientX);
          sy.jump(e.clientY);
          setShow(true);
          return;
        }
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => {
        inside.current = false;
        setShow(false);
      }}
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
              exit={{ opacity: 0, scale: 0.9, rotate: 3, clipPath: 'inset(50% 50% 50% 50% round 10px)', transition: { duration: 0.18 } }}
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
