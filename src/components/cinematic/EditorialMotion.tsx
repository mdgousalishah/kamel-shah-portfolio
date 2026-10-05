/**
 * EditorialMotion.tsx
 * Reusable editorial typography and cinematic motion components.
 * Implements clip-path masking, directional reveals, blur reduction,
 * depth parallax, and staggered timing without layout thrashing.
 */

import React, { ReactNode } from 'react';

// Directional Reveal Component
export interface EditorialRevealProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'none';
  delay?: number; // ms
  duration?: number; // ms
  active?: boolean;
  className?: string;
  distance?: number;
  blur?: number;
  reducedMotion?: boolean;
}

export function EditorialReveal({
  children,
  direction = 'bottom',
  delay = 0,
  duration = 750,
  active = true,
  className = '',
  distance = 24,
  blur = 8,
  reducedMotion = false,
}: EditorialRevealProps) {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Calculate transform and clip-path based on direction
  let initialTransform = 'translate3d(0, 0, 0)';
  let initialClip = 'inset(0 0 0 0)';

  if (!active) {
    switch (direction) {
      case 'left':
        initialTransform = `translate3d(-${distance}px, 0, 0)`;
        initialClip = 'inset(0 100% 0 0)';
        break;
      case 'right':
        initialTransform = `translate3d(${distance}px, 0, 0)`;
        initialClip = 'inset(0 0 0 100%)';
        break;
      case 'top':
        initialTransform = `translate3d(0, -${distance}px, 0)`;
        initialClip = 'inset(0 0 100% 0)';
        break;
      case 'bottom':
      default:
        initialTransform = `translate3d(0, ${distance}px, 0)`;
        initialClip = 'inset(100% 0 0 0)';
        break;
      case 'none':
        initialTransform = 'translate3d(0, 0, 0)';
        initialClip = 'inset(0 0 0 0)';
        break;
    }
  }

  const finalTransform = 'translate3d(0, 0, 0)';
  const finalClip = 'inset(0 0 0 0)';

  return (
    <div
      className={`transition-all ${className}`}
      style={{
        transform: active ? finalTransform : initialTransform,
        clipPath: active ? finalClip : initialClip,
        WebkitClipPath: active ? finalClip : initialClip,
        opacity: active ? 1 : 0,
        filter: active ? 'blur(0px)' : `blur(${blur}px)`,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity, filter, clip-path',
      }}
    >
      {children}
    </div>
  );
}

// Masked Heading Component for line-by-line / word-by-word reveal
export interface MaskedHeadingProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  direction?: 'left' | 'right' | 'bottom';
  delay?: number;
  duration?: number;
  active?: boolean;
  className?: string;
  reducedMotion?: boolean;
}

export function MaskedHeading({
  text,
  tag = 'h1',
  direction = 'bottom',
  delay = 0,
  duration = 800,
  active = true,
  className = '',
  reducedMotion = false,
}: MaskedHeadingProps) {
  const Tag = (tag || 'h1') as React.ElementType;

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  let transform = 'translateY(0%)';
  if (!active) {
    if (direction === 'bottom') transform = 'translateY(110%)';
    else if (direction === 'left') transform = 'translateX(-100%)';
    else if (direction === 'right') transform = 'translateX(100%)';
  }

  return (
    <div className="overflow-hidden inline-block leading-[0.92]">
      <Tag
        className={`inline-block ${className}`}
        style={{
          transform,
          opacity: active ? 1 : 0,
          filter: active ? 'blur(0px)' : 'blur(8px)',
          transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration * 0.75}ms ease-out ${delay}ms, filter ${duration * 0.75}ms ease-out ${delay}ms`,
          willChange: 'transform, opacity, filter',
        }}
      >
        {text}
      </Tag>
    </div>
  );
}

// Image Reveal Component with expanding vertical slice & light sweep
export interface ImageRevealProps {
  src: string;
  alt: string;
  active?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string;
  reducedMotion?: boolean;
}

export function ImageReveal({
  src,
  alt,
  active = true,
  delay = 0,
  duration = 1000,
  className = '',
  imgClassName = '',
  aspectRatio = 'aspect-[4/5]',
  reducedMotion = false,
}: ImageRevealProps) {
  if (reducedMotion) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${aspectRatio} ${className}`}>
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${aspectRatio} ${className}`}
      style={{
        clipPath: active ? 'inset(0% 0% 0% 0%)' : 'inset(0% 48% 0% 48%)',
        WebkitClipPath: active ? 'inset(0% 0% 0% 0%)' : 'inset(0% 48% 0% 48%)',
        transform: active ? 'scale(1) translate3d(0, 0, 0)' : 'scale(1.06) translate3d(0, 15px, 0)',
        opacity: active ? 1 : 0,
        filter: active ? 'blur(0px)' : 'blur(6px)',
        transition: `clip-path ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration + 200}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration * 0.6}ms ease-out ${delay}ms, filter ${duration * 0.7}ms ease-out ${delay}ms`,
        willChange: 'clip-path, transform, opacity, filter',
      }}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-700 ${imgClassName}`}
      />
      {/* Light Sweep Across Image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
          transform: active ? 'translateX(200%)' : 'translateX(-200%)',
          transition: `transform ${duration + 400}ms ease-in-out ${delay + 100}ms`,
        }}
      />
    </div>
  );
}
