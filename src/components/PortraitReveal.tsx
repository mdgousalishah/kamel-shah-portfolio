import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Portrait with a second photo hidden underneath, revealed through a honeycomb of
 * hexagons that "compile" from code into the photo.
 *
 * Mouse:      hexagons light up around the cursor. Cells at the edge of the reveal show
 *             flickering code glyphs; cells closer in resolve into the alternate photo.
 *             The trail fades on its own, so the original photo always comes back.
 * Touch/Key:  tap (or Enter/Space) sends a honeycomb wave across the whole photo from the
 *             tap point; tap again to wave it back.
 * Reduced motion: a plain crossfade instead.
 *
 * The base photo is never replaced — everything is drawn on a canvas layered on top,
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

interface Cell {
  cx: number; // centre, CSS px
  cy: number;
  v: number; // current reveal 0..1
  glyph: string;
  next: number; // when to swap the glyph
}

const LIFE = 1100; // ms a trail point keeps cells lit
const HEX = 15; // hexagon radius in CSS px
const REACH = 0.2; // trail influence radius, share of frame width
const MAX_DOTS = 70;
const GLYPHS = '01{}</>;=()[]#$*&+:|?ABCDEF';
const ACCENT = '#E8622C';
const INK = '#141413';

const randGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

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
  const photoLayer = useRef<HTMLCanvasElement | null>(null); // alt photo pre-fitted to the frame
  const cells = useRef<Cell[]>([]);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const dots = useRef<Dot[]>([]);
  const hovering = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const wave = useRef<{ on: boolean; x: number; y: number; start: number } | null>(null);
  const raf = useRef(0);
  const [revealed, setRevealed] = useState(false);
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

  /** Pre-renders the alternate photo, cover-fitted and lined up on the focal point. */
  const buildPhotoLayer = () => {
    const img = imgRef.current;
    const { w, h, dpr } = size.current;
    if (!img || !img.complete || !img.naturalWidth || !w) return;
    const layer = photoLayer.current ?? document.createElement('canvas');
    layer.width = Math.round(w * dpr);
    layer.height = Math.round(h * dpr);
    const ctx = layer.getContext('2d')!;
    const W = layer.width;
    const H = layer.height;
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight) * 1.02;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = Math.min(0, Math.max(W - dw, anchor.x * W - focal.x * dw));
    const dy = Math.min(0, Math.max(H - dh, anchor.y * H - focal.y * dh));
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, dx, dy, dw, dh);
    photoLayer.current = layer;
  };

  /** Lays out a honeycomb (pointy-top hexagons) that covers the frame. */
  const buildCells = () => {
    const { w, h } = size.current;
    const colW = Math.sqrt(3) * HEX;
    const rowH = 1.5 * HEX;
    const list: Cell[] = [];
    for (let r = -1, y = -HEX / 2; y < h + HEX; r++, y += rowH) {
      const offset = r % 2 === 0 ? 0 : colW / 2;
      for (let x = -colW / 2 + offset; x < w + colW; x += colW) {
        list.push({ cx: x, cy: y, v: 0, glyph: randGlyph(), next: 0 });
      }
    }
    cells.current = list;
  };

  // Preload the alternate photo once (it is the only extra hero asset).
  useEffect(() => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = buildPhotoLayer;
    img.src = alt;
    imgRef.current = img;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alt]);

  // Keep the canvas, honeycomb and photo layer in step with the frame size.
  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = frame.offsetWidth;
      const h = frame.offsetHeight;
      size.current = { w, h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      buildCells();
      buildPhotoLayer();
      schedule();
    });
    ro.observe(frame);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const hexPath = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  };

  const tick = () => {
    raf.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { w, h, dpr } = size.current;
    const now = performance.now();

    // While the pointer rests inside, keep its current spot alive.
    if (hovering.current && last.current) {
      const head = dots.current[dots.current.length - 1];
      if (head) head.born = now;
    }
    dots.current = dots.current.filter((d) => now - d.born < LIFE);

    const reach = REACH * w;
    const wv = wave.current;
    const diag = Math.hypot(w, h);
    // Keep animating while the trail lives or a wave is still travelling (not forever while held).
    let busy = dots.current.length > 0 || Boolean(wv && now - wv.start < 1800);

    for (const c of cells.current) {
      // Target from the cursor trail…
      let target = 0;
      for (const d of dots.current) {
        const dist = Math.hypot(c.cx - d.x * w, c.cy - d.y * h);
        if (dist > reach) continue;
        const life = 1 - (now - d.born) / LIFE;
        const t = (1 - dist / reach) * life;
        if (t > target) target = t;
      }
      // …or from a tap/keyboard wave.
      if (wv) {
        const dist = Math.hypot(c.cx - wv.x * w, c.cy - wv.y * h);
        const front = ((now - wv.start) / 900) * diag;
        const k = Math.max(0, Math.min(1, (front - dist) / (HEX * 6)));
        target = Math.max(target, wv.on ? k : 1 - k);
      }
      target = Math.min(1, target * 1.6);
      // Rise quickly, fall a little slower so cells ripple out.
      c.v += (target - c.v) * (target > c.v ? 0.35 : 0.12);
      if (c.v < 0.004) c.v = 0;
      if (Math.abs(target - c.v) > 0.01) busy = true;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const layer = photoLayer.current;
    const pattern = layer ? ctx.createPattern(layer, 'no-repeat') : null;
    pattern?.setTransform(new DOMMatrix([1 / dpr, 0, 0, 1 / dpr, 0, 0]));
    ctx.font = `600 ${Math.round(HEX * 0.95)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const c of cells.current) {
      if (c.v <= 0) continue;
      const pop = 0.55 + 0.45 * Math.min(1, c.v * 1.4);
      const r = HEX * pop;

      if (c.v > 0.5 && pattern) {
        // Inner cells: the alternate photo, in a hexagon.
        ctx.globalAlpha = Math.min(1, (c.v - 0.5) * 3);
        hexPath(ctx, c.cx, c.cy, HEX + 0.6);
        ctx.fillStyle = pattern;
        ctx.fill();
        ctx.globalAlpha = Math.min(0.55, (c.v - 0.5) * 1.5);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Edge cells: "compiling" code glyphs.
        const a = Math.min(1, c.v * 2.2);
        ctx.globalAlpha = a * 0.88;
        hexPath(ctx, c.cx, c.cy, r);
        ctx.fillStyle = INK;
        ctx.fill();
        if (now > c.next) {
          c.glyph = randGlyph();
          c.next = now + 70 + Math.random() * 110;
        }
        ctx.globalAlpha = a;
        ctx.fillStyle = c.v > 0.32 ? '#F3F0E8' : ACCENT;
        ctx.fillText(c.glyph, c.cx, c.cy + 1);
      }
    }
    ctx.globalAlpha = 1;

    // A finished "hide" wave can be dropped; a finished "show" wave stays to hold the reveal.
    if (wv && !wv.on && now - wv.start > 1400) wave.current = null;
    if (busy || cells.current.some((c) => c.v > 0 && c.v < 0.999)) raf.current = requestAnimationFrame(tick);
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
      const steps = Math.min(8, Math.floor(dist / 0.04));
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
    schedule(); // let the remaining cells fade out
  };

  const toggle = (x = 0.5, y = 0.35) => {
    const next = !revealed;
    setRevealed(next);
    if (!reduce) {
      wave.current = { on: next, x, y, start: performance.now() };
      schedule();
    }
  };

  const onClick = (e: React.MouseEvent) => {
    // Mouse users get the hover honeycomb; taps (and reduced-motion clicks) toggle the full reveal.
    if (fineHover && !reduce) return;
    const p = toLocal(e.clientX, e.clientY);
    toggle(p.x, p.y);
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
      className={`portrait-reveal relative overflow-hidden ${reduce ? 'portrait-reveal--fade' : ''} ${className}`}
    >
      {children}

      {/* Honeycomb / code layer */}
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Reduced motion only: simple crossfade to the alternate photo */}
      {reduce && (
        <img
          src={alt}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="lazy"
          className="portrait-reveal__full pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `${focal.x * 100}% ${focal.y * 100}%` }}
        />
      )}

      {!fineHover && (
        <span aria-hidden="true" className="portrait-reveal__hint">
          {revealed ? 'Tap to go back' : 'Tap the photo'}
        </span>
      )}
    </div>
  );
}
