import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const interactive = target.closest('a, button, input, textarea, select, [role="button"], .interactive-hover');
      setIsHovered(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="custom-cursor pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Spring Ring */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered ? 'rgba(110, 116, 90, 0.7)' : 'rgba(25, 25, 25, 0.25)',
          backgroundColor: isHovered ? 'rgba(110, 116, 90, 0.08)' : 'rgba(25, 25, 25, 0)'
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="w-8 h-8 rounded-full border border-[#191919]/25 pointer-events-none"
      />

      {/* Center Precise Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovered ? 0 : 1
        }}
        transition={{ duration: 0.1 }}
        className="w-1.5 h-1.5 bg-[#191919] rounded-full pointer-events-none"
      />
    </div>
  );
}
