/**
 * GlassActionButton.tsx
 * Authored Glass AI Button component featuring procedural translucent glass,
 * internal caustic illumination, swirling micro galaxy particles, subtle pointer-reactive tilt,
 * and an explosive galaxy particle burst on activation (click / Enter / Space).
 *
 * Semantic <button> or <a> tag with complete keyboard navigation, accessibility,
 * and controlled action execution.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface GlassActionButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  variant?: 'default' | 'vermilion' | 'cyan' | 'linkedin' | 'emerald';
  download?: string | boolean;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  'aria-label'?: string;
  delayNavigation?: number; // ms to let activation burst play before navigation (default: 200ms)
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

export default function GlassActionButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'default',
  download,
  target,
  rel,
  type = 'button',
  icon,
  iconPosition = 'right',
  disabled = false,
  'aria-label': ariaLabel,
  delayNavigation = 200,
}: GlassActionButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isEnergized, setIsEnergized] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50 });

  // Burst particles state
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Variant color mappings for galaxy & caustics
  const variantStyles = {
    default: {
      rim: 'border-white/20 hover:border-indigo-400/40',
      glow: 'rgba(99, 102, 241, 0.30)',
      accentLight: 'rgba(99, 102, 241, 0.40)',
      particleColors: ['#818cf8', '#a5b4fc', '#c7d2fe', '#ffffff', '#38bdf8'],
      shadow: 'shadow-[0_4px_20px_rgba(99,102,241,0.14)]',
    },
    vermilion: {
      rim: 'border-white/20 hover:border-rose-400/40',
      glow: 'rgba(224, 35, 28, 0.32)',
      accentLight: 'rgba(224, 35, 28, 0.42)',
      particleColors: ['#f43f5e', '#fb7185', '#fda4af', '#ffffff', '#e0231c'],
      shadow: 'shadow-[0_4px_20px_rgba(224,35,28,0.16)]',
    },
    cyan: {
      rim: 'border-white/20 hover:border-cyan-400/40',
      glow: 'rgba(6, 182, 212, 0.32)',
      accentLight: 'rgba(6, 182, 212, 0.40)',
      particleColors: ['#06b6d4', '#38bdf8', '#7dd3fc', '#ffffff', '#a5f3fc'],
      shadow: 'shadow-[0_4px_20px_rgba(6,182,212,0.15)]',
    },
    linkedin: {
      rim: 'border-[#0A66C2]/40 hover:border-[#0A66C2]/70',
      glow: 'rgba(10, 102, 194, 0.32)',
      accentLight: 'rgba(56, 189, 248, 0.45)',
      particleColors: ['#0A66C2', '#38bdf8', '#7dd3fc', '#ffffff', '#bae6fd'],
      shadow: 'shadow-[0_4px_20px_rgba(10,102,194,0.18)]',
    },
    emerald: {
      rim: 'border-white/20 hover:border-emerald-400/40',
      glow: 'rgba(16, 185, 129, 0.32)',
      accentLight: 'rgba(52, 211, 153, 0.42)',
      particleColors: ['#10b981', '#34d399', '#6ee7b7', '#ffffff', '#a7f3d0'],
      shadow: 'shadow-[0_4px_20px_rgba(16,185,129,0.15)]',
    },
  }[variant];

  // Spawn activation particle burst
  const triggerActivationBurst = useCallback((originX?: number, originY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const w = (canvas.width = rect.width);
    const h = (canvas.height = rect.height);

    const ox = originX ?? w / 2;
    const oy = originY ?? h / 2;

    setIsEnergized(true);
    setTimeout(() => setIsEnergized(false), 550);

    const colors = variantStyles.particleColors;
    const burstCount = 36;
    const newParticles: Particle[] = [];

    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = 2.5 + Math.random() * 5.0;
      const maxLife = 35 + Math.random() * 25;
      newParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2.8,
        alpha: 1.0,
        life: 0,
        maxLife,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    particlesRef.current = newParticles;

    // Canvas particle render loop
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.alpha > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - (p.life / p.maxLife) * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
        } else {
          particles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      if (particles.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };

    render();
  }, [variantStyles]);

  // Pointer movement tracking for 3D glass tilt & caustic glare
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100));

    // Subtle 3D tilt
    const rx = ((y / rect.height - 0.5) * -8).toFixed(2);
    const ry = ((x / rect.width - 0.5) * 8).toFixed(2);

    setTilt({ rx: parseFloat(rx), ry: parseFloat(ry), px, py });
  };

  const handlePointerEnter = () => setIsHovered(true);
  const handlePointerLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    setTilt({ rx: 0, ry: 0, px: 50, py: 50 });
  };

  // Click & Action Handler
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const ox = rect ? e.clientX - rect.left : undefined;
    const oy = rect ? e.clientY - rect.top : undefined;

    triggerActivationBurst(ox, oy);

    if (onClick) {
      onClick(e);
    }

    // If an anchor href is specified and default wasn't prevented, execute navigation after short burst delay
    if (href && !e.defaultPrevented) {
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(href);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }, delayNavigation);
        }
      } else if (target === '_blank') {
        // External link
        e.preventDefault();
        setTimeout(() => {
          window.open(href, '_blank', rel || 'noopener noreferrer');
        }, delayNavigation);
      }
    }
  };

  // Keyboard accessibility (Space / Enter triggers burst)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(true);
      triggerActivationBurst();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(false);
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const sharedProps = {
    ref: buttonRef as any,
    onPointerMove: handlePointerMove,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    onPointerDown: () => setIsPressed(true),
    onPointerUp: () => setIsPressed(false),
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onClick: handleClick,
    'aria-label': ariaLabel,
    style: {
      transform: isPressed
        ? 'scale(0.97) translate3d(0, 1px, 0)'
        : isHovered
        ? `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translate3d(0, -1px, 0)`
        : 'perspective(800px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)',
      transition: isPressed ? 'transform 0.08s ease-out' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    className: `glass-action-button relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-sans text-xs sm:text-sm font-semibold tracking-wide text-white select-none overflow-hidden cursor-pointer backdrop-blur-xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${variantStyles.rim} ${variantStyles.shadow} ${
      isEnergized ? 'brightness-125' : ''
    } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`,
  };

  const content = (
    <>
      {/* 1. Procedural Glass Deep Background Base */}
      <span
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(12, 14, 20, 0.85) 50%, rgba(8, 10, 15, 0.95) 100%)',
        }}
      />

      {/* 2. Pointer-Reactive Internal Caustic Highlight */}
      <span
        className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? (isEnergized ? 1 : 0.75) : 0,
          background: `radial-gradient(circle 90px at ${tilt.px}% ${tilt.py}%, ${variantStyles.accentLight}, transparent 70%)`,
        }}
      />

      {/* 3. Flash Bloom on Activation */}
      <span
        className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
        style={{
          opacity: isEnergized ? 0.70 : 0,
          background: `radial-gradient(ellipse at center, rgba(255, 255, 255, 0.22) 0%, ${variantStyles.glow} 60%, transparent 100%)`,
          boxShadow: isEnergized ? `inset 0 0 16px ${variantStyles.glow}` : 'none',
        }}
      />

      {/* 4. Canvas Particle Burst Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20 w-full h-full"
      />

      {/* 5. Refractive Rim Sheen */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* 6. Semantic Button Label & Icons */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="shrink-0 transition-transform group-hover:translate-x-0.5">{icon}</span>}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        download={download as any}
        target={target}
        rel={rel}
        {...sharedProps}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      {...sharedProps}
    >
      {content}
    </button>
  );
}
