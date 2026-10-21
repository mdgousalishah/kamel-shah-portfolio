/**
 * Original holographic "suit-up" armour drawn over the red studio portrait
 * (hero-portrait-red.webp). It is an original design — a wireframe helmet dome,
 * a HUD visor across the sunglasses, a targeting reticle, seam lines and readouts —
 * not any existing character's suit.
 *
 * Coordinates are measured on the original 1086 × 1448 photo and converted with
 * `map`, so the armour stays locked to the face at any frame size.
 */

const W = 1086;
const H = 1448;
const ACCENT = '#E8622C';
const GLOW = 'rgba(232, 98, 44, 0.9)';

type Map = (u: number, v: number) => [number, number];

export function drawArmour(ctx: CanvasRenderingContext2D, map: Map, drawnWidth: number) {
  const P = (x: number, y: number) => map(x / W, y / H);
  const L = (n: number) => (n / W) * drawnWidth; // design px → canvas px

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = ACCENT;
  ctx.shadowColor = GLOW;

  const ellipseArc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) => {
    const [x, y] = P(cx, cy);
    ctx.beginPath();
    ctx.ellipse(x, y, L(rx), L(ry), 0, a0, a1);
    ctx.stroke();
  };

  // ── Helmet dome (wireframe) ──────────────────────────────
  const CX = 548;
  const CY = 420;
  const RX = 292;
  const RY = 400;
  ctx.shadowBlur = L(18);
  ctx.lineWidth = L(4);
  ctx.globalAlpha = 0.95;
  ellipseArc(CX, CY, RX, RY, 0.8 * Math.PI, 2.2 * Math.PI);

  ctx.shadowBlur = L(10);
  ctx.lineWidth = L(2);
  ctx.globalAlpha = 0.6;
  for (const f of [0.62, 0.28]) ellipseArc(CX, CY, RX * f, RY, 1.02 * Math.PI, 1.98 * Math.PI);
  for (const y of [190, 290]) {
    const t = (y - CY) / RY;
    const hw = RX * Math.sqrt(Math.max(0, 1 - t * t));
    ellipseArc(CX, y, hw, 16, 0, Math.PI);
  }

  // ── HUD visor across the sunglasses ─────────────────────
  const visor: [number, number][] = [
    [322, 362], [505, 378], [522, 372], [748, 345],
    [744, 470], [522, 468], [505, 472], [326, 480],
  ];
  const tracePoly = () => {
    ctx.beginPath();
    visor.forEach(([x, y], i) => {
      const [px, py] = P(x, y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
  };

  const [gx0, gy0] = P(322, 345);
  const [gx1, gy1] = P(748, 480);
  const grad = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
  grad.addColorStop(0, 'rgba(232, 98, 44, 0.32)');
  grad.addColorStop(0.5, 'rgba(255, 170, 120, 0.12)');
  grad.addColorStop(1, 'rgba(232, 98, 44, 0.3)');
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  tracePoly();
  ctx.fillStyle = grad;
  ctx.fill();

  // Scan lines inside the visor
  ctx.save();
  tracePoly();
  ctx.clip();
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = Math.max(1, L(1.5));
  for (let y = 345; y <= 480; y += 9) {
    const [ax, ay] = P(300, y);
    const [bx, by] = P(770, y);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
  ctx.restore();

  ctx.globalAlpha = 0.95;
  ctx.shadowBlur = L(14);
  ctx.lineWidth = L(3);
  tracePoly();
  ctx.stroke();

  // ── Targeting reticle on the right lens ─────────────────
  const [rx, ry] = P(628, 405);
  const r = L(40);
  ctx.lineWidth = L(2.5);
  ctx.beginPath();
  ctx.arc(rx, ry, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(rx, ry, r * 0.45, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    ctx.moveTo(rx + dx * r * 0.7, ry + dy * r * 0.7);
    ctx.lineTo(rx + dx * r * 1.35, ry + dy * r * 1.35);
  }
  ctx.stroke();

  // ── Cheek seams + face brackets ─────────────────────────
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = L(3);
  const seg = (a: [number, number], b: [number, number]) => {
    const [x0, y0] = P(...a);
    const [x1, y1] = P(...b);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };
  seg([352, 540], [410, 670]);
  seg([738, 520], [682, 660]);

  ctx.globalAlpha = 0.6;
  ctx.lineWidth = L(2);
  const bracket = (x: number, y: number, sx: number, sy: number) => {
    seg([x, y], [x + 46 * sx, y]);
    seg([x, y], [x, y + 46 * sy]);
  };
  bracket(250, 150, 1, 1);
  bracket(846, 150, -1, 1);
  bracket(250, 760, 1, -1);
  bracket(846, 760, -1, -1);

  // ── Readouts ────────────────────────────────────────────
  ctx.shadowBlur = L(8);
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = '#FFD9C4';
  ctx.font = `600 ${Math.max(9, L(22))}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textBaseline = 'alphabetic';
  const text = (s: string, x: number, y: number) => {
    const [px, py] = P(x, y);
    ctx.fillText(s, px, py);
  };
  text('KS-01 // ONLINE', 770, 330);
  text('VISOR SYNC 98%', 770, 362);
  ctx.globalAlpha = 0.75;
  text('BUILD · SHIP · SUPPORT', 262, 530);

  ctx.restore();
}
