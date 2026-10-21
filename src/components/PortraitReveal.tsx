import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Portrait with a second photo hidden underneath (inspired by landonorris.com's hero).
 *
 * Mouse:     a soft "liquid" trail follows the pointer and reveals the alternate photo
 *            inside it; the trail fades on its own, so the original always comes back.
 * Touch/Key: tap or press Enter/Space to reveal the whole alternate photo with an
 *            expanding circle from the tap point; tap again to restore.
 * Reduced motion: a plain crossfade instead of the trail.
 *
 * The base photo is never replaced — the alternate is drawn on a canvas layered on top,
 * so the frame size never changes and there is no layout shift.
 */

interface Props {
  /** The default photo (normal <picture>/<img>, rendered as children). */
  children: ReactNode;
  /** Alternate photo URL. */
  alt: string;
  /** Accessible description of the alternate photo. */
  altLabel: string;
  /** Point in the alternate image (0–1) to line up with `anchor`. */
  focal?: { x: number; y: number };
  /** Where that point should land in the frame (0–1). */
  anchor?: { x: number; y: number };
  className?: string;
}

interface Dot {
  x: number;
  y: number;
  born: number;
}

const LIFE = 900; // ms a trail dot takes to fade
const RADIUS = 0.17; // trail radius as a share of frame width
const MAX_DOTS = 90;

export default function PortraitReveal({
  children,
  alt,
  altLabel,
  focal = { x: 0.5, y: 0.28 },
  anchor = { x: 0.46, y: 0.25 },
  className = '',
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dots = useRef<Dot[]>([]);
  const hovering = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef(0);
  const [revealed, setRevealed] = useState(false); // touch / keyboard full reveal
  const [origin, setOrigin] = useState({ x: 50, y: 35 });
  const [reduce, setReduce] = useState(false);
  const [fineHover, setFineHover] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fp = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => {
      setReduce(rm.matches);
      setFineHover(fp.matches);
    };
    update();
    rm.addEventListener('change', update);
    fp.addEventListener('change', update);
    return () => {
      rm.removeEventListener('change', update);
      fp.removeEventListener('change', update);
    };
  }, []);

  // Preload the alternate photo once the hero is mounted (it is the only extra hero asset).
  useEffect(() => {
    const img = new Image();
    img.decoding = 'async';
    img.src = alt;
    imgRef.current = img;
  }, [alt]);

  // Keep the canvas pixel size in step with the frame.
  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(frame.offsetWidth * dpr);
      canvas.height = Math.round(frame.offsetHeight * dpr);
    });
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /** Draws the alternate photo, cover-fitted and lined up on the focal point. */
  const drawAlt = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const img = imgRef.current;
    if (!img || !img.complete || !img.naturalWidth) return;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * 1.02;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = Math.min(0, Math.max(w - dw, anchor.x * w - focal.x * dw));
    const dy = Math.min(0, Math.max(h - dh, anchor.y * h - focal.y * dh));
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  const tick = () => {
    raf.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const now = performance.now();
    const w = canvas.width;
    const h = canvas.height;

    // While the pointer rests inside, keep its current spot alive.
    if (hovering.current && last.current) {
      const head = dots.current[dots.current.length - 1];
      if (head) head.born = now;
    }
    dots.current = dots.current.filter((d) => now - d.born < LIFE);

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    if (!dots.current.length) return; // trail gone: original photo fully back, loop stops

    // 1) Soft mask from the trail.
    const r = RADIUS * w;
    for (const d of dots.current) {
      const life = 1 - (now - d.born) / LIFE;
      const eased = life * life * (3 - 2 * life);
      const rr = r * (0.35 + 0.65 * eased);
      const g = ctx.createRadialGradient(d.x * w, d.y * h, 0, d.x * w, d.y * h, rr);
      g.addColorStop(0, `rgba(0,0,0,${0.95 * eased})`);
      g.addColorStop(0.6, `rgba(0,0,0,${0.75 * eased})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x * w, d.y * h, rr, 0, Math.PI * 2);
      ctx.fill();
    }
    // 2) Alternate photo only where the mask is.
    ctx.globalCompositeOperation = 'source-in';
    drawAlt(ctx, w, h);
    ctx.globalCompositeOperation = 'source-over';

    raf.current = requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  const toLocal = (clientX: number, clientY: number) => {
    // getBoundingClientRect includes scroll-driven transforms, so this stays accurate while scaled.
    const rect = frameRef.current!.getBoundingClientRect();
    return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || reduce || revealed) return;
    const p = toLocal(e.clientX, e.clientY);
    const now = performance.now();
    const prev = last.current;
    // Fill gaps on fast moves so the trail stays continuous.
    if (prev) {
      const dist = Math.hypot(p.x - prev.x, p.y - prev.y);
      const steps = Math.min(8, Math.floor(dist / 0.035));
      for (let i = 1; i <= steps; i++) {
        const t = i / (steps + 1);
        dots.current.push({ x: prev.x + (p.x - prev.x) * t, y: prev.y + (p.y - prev.y) * t, born: now });
      }
    }
    dots.current.push({ ...p, born: now });
    if (dots.current.length > MAX_DOTS) dots.current.splice(0, dots.current.length - MAX_DOTS);
    last.current = p;
    hovering.current = true;
    schedule();
  };

  const onPointerLeave = () => {
    hovering.current = false;
    last.current = null;
    schedule(); // let the remaining trail fade out
  };

  const toggle = (x = 50, y = 35) => {
    setOrigin({ x, y });
    setRevealed((v) => !v);
  };

  const onClick = (e: React.MouseEvent) => {
    // Mouse users get the hover trail; taps (and reduced-motion clicks) toggle the full reveal.
    if (fineHover && !reduce) return;
    const p = toLocal(e.clientX, e.clientY);
    toggle(p.x * 100, p.y * 100);
  };

  return (
    <div
      ref={frameRef}
      role="button"
      tabIndex={0}
      aria-pressed={revealed}
      aria-label={revealed ? 'Show the original portrait' : `Reveal another portrait: ${altLabel}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      className={`portrait-reveal relative overflow-hidden ${reduce && fineHover ? 'portrait-reveal--fade' : ''} ${className}`}
    >
      {children}

      {/* Mouse trail layer */}
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Full reveal (tap / keyboard / reduced-motion hover) */}
      <img
        src={alt}
        alt=""
        aria-hidden="true"
        decoding="async"
        loading="lazy"
        className="portrait-reveal__full pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: `${focal.x * 100}% ${focal.y * 100}%`,
          clipPath: revealed
            ? `circle(150% at ${origin.x}% ${origin.y}%)`
            : `circle(0% at ${origin.x}% ${origin.y}%)`,
        }}
      />

      {!fineHover && (
        <span aria-hidden="true" className="portrait-reveal__hint">
          {revealed ? 'Tap to go back' : 'Tap the photo'}
        </span>
      )}
    </div>
  );
}
