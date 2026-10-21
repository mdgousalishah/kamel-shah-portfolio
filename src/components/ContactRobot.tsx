import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';

/**
 * "Pixel" — a small robot that peeks over the contact form and reacts to it:
 * its eyes follow the pointer or the focused field, its speech bubble changes
 * per field, its screen becomes a length meter while you write the message,
 * and it cheers on success. Purely decorative: every real state (errors,
 * success) is still announced by the form itself, so it is hidden from
 * screen readers.
 */

export type RobotField = 'firstName' | 'lastName' | 'email' | 'phone' | 'message' | null;

interface ContactRobotProps {
  focused: RobotField;
  values: { firstName: string; lastName: string; email: string; phone: string; message: string };
  formState: 'idle' | 'loading' | 'success' | 'error';
  submitHover: boolean;
  /** First name captured just before a successful send (the form resets after). */
  sentName: string;
  minMessage: number;
}

type Mood = 'idle' | 'happy' | 'sad' | 'excited' | 'thinking' | 'meter';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "kamel" → "Kamel" (keeps what the visitor typed otherwise). */
const nice = (name: string) => (name ? name.charAt(0).toUpperCase() + name.slice(1) : '');

/** Keeps long emails from blowing up the speech bubble. */
const shortEmail = (email: string) => (email.length > 26 ? `${email.slice(0, 24)}…` : email);

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return 'Up late';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

/** Rough topic of the message, so Pixel can react to what it is about. */
function topicOf(message: string): string | null {
  const m = message.toLowerCase();
  // "How did you make this website?" is a question about the build, not a new project.
  if (/\bhow\b[^.?!]*\b(do|does|dose|did)\b[^.?!]*\b(make|made|build|built|create|created)\b/.test(m)) return 'how';
  if (/\b(job|hiring|hire|role|position|opening|vacancy|interview|internship|opportunit)/.test(m)) return 'role';
  if (/\b(collab|partner|together|team up)/.test(m)) return 'collab';
  if (/\b(website|web ?site|app|project|build|develop|store|shop|ecommerce|portal|landing)/.test(m)) return 'project';
  if (/\b(seo|marketing|ranking|google)/.test(m)) return 'seo';
  if (/\b(bug|fix|issue|error|broken|maintenance|support)/.test(m)) return 'fix';
  return null;
}

const TOPIC_LINES: Record<string, (n: string) => string> = {
  how: (n) => `Curious how it's built${n ? `, ${n}` : ''}? Kamel will explain.`,
  role: (n) => `A role${n ? `, ${n}` : ''}? Kamel is all ears.`,
  collab: (n) => `A collaboration! Love it${n ? `, ${n}` : ''}.`,
  project: (n) => `A new project! Tell me the scope${n ? `, ${n}` : ''}.`,
  seo: () => 'SEO talk — Kamel can help with that.',
  fix: () => "Something to fix? Describe what's happening.",
};

/**
 * Picks Pixel's mood and line from the live form values.
 * `key` changes only when the *kind* of line changes, so the bubble animates
 * between steps but updates smoothly while someone types.
 */
function deriveState(p: ContactRobotProps): { mood: Mood; line: string; key: string } {
  const v = p.values;
  const first = nice(v.firstName.trim().split(/\s+/)[0] || '');
  const last = nice(v.lastName.trim());
  const email = v.email.trim();
  const message = v.message.trim();
  const msgLen = message.length;
  const digits = v.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  const emailOk = EMAIL_RE.test(email);
  const missing = [
    !first && 'first name',
    !last && 'last name',
    !emailOk && 'email',
    msgLen < p.minMessage && 'message',
  ].filter(Boolean) as string[];
  const ready = missing.length === 0;
  const you = first ? `, ${first}` : '';

  if (p.formState === 'loading') return { mood: 'thinking', key: 'loading', line: `Sending${first ? ` your note, ${first}` : ''}… beep boop.` };
  if (p.formState === 'success') {
    const n = nice(p.sentName);
    return { mood: 'happy', key: 'success', line: `Delivered! Kamel will reply soon${n ? `, ${n}` : ''}.` };
  }
  if (p.formState === 'error') return { mood: 'sad', key: 'error', line: "Uh-oh, that didn't go through. See the note below." };

  if (p.submitHover) {
    return ready
      ? { mood: 'excited', key: 'hover-ready', line: `Ready when you are${you}. Press it!` }
      : { mood: 'sad', key: 'hover-missing', line: `Still need your ${missing.join(', ')}.` };
  }

  switch (p.focused) {
    case 'firstName':
      return first
        ? { mood: 'happy', key: 'first-filled', line: `${greeting()}, ${first}! Nice to meet you.` }
        : { mood: 'idle', key: 'first-empty', line: "Let's start with your name." };
    case 'lastName':
      return last
        ? { mood: 'happy', key: 'last-filled', line: `${first ? `${first} ${last}` : last} — that has a nice ring to it.` }
        : { mood: 'idle', key: 'last-empty', line: first ? `And your last name, ${first}?` : 'And your last name?' };
    case 'email':
      if (!email) return { mood: 'idle', key: 'email-empty', line: `Where should the reply go${you}?` };
      if (!email.includes('@')) return { mood: 'thinking', key: 'email-typing', line: 'Keep going… waiting for the @.' };
      if (!emailOk) return { mood: 'thinking', key: 'email-domain', line: 'Almost there — just the domain now.' };
      return { mood: 'happy', key: 'email-ok', line: `Got it. Replies go to ${shortEmail(email)}` };
    case 'phone':
      if (!digits) return { mood: 'idle', key: 'phone-empty', line: `Optional${you}. WhatsApp works too.` };
      if (digits.length < 10) return { mood: 'thinking', key: 'phone-typing', line: `${digits.length} of 10 digits…` };
      return { mood: 'happy', key: 'phone-ok', line: 'Number saved. A call works too.' };
    case 'message': {
      if (!msgLen) return { mood: 'meter', key: 'msg-empty', line: `What's on your mind${you}?` };
      if (msgLen < p.minMessage) {
        const left = p.minMessage - msgLen;
        return { mood: 'meter', key: 'msg-short', line: `${left} more character${left === 1 ? '' : 's'}, please.` };
      }
      const topic = topicOf(message);
      if (topic) return { mood: 'meter', key: `msg-${topic}`, line: TOPIC_LINES[topic](first) };
      return msgLen < 140
        ? { mood: 'meter', key: 'msg-ok', line: "Tell me more, I'm listening." }
        : { mood: 'meter', key: 'msg-long', line: `Great detail${you}. Kamel will love this.` };
    }
    default:
      if (ready) return { mood: 'excited', key: 'ready', line: `All set${you}. Hit Send when you're ready.` };
      if (first || email || msgLen) return { mood: 'idle', key: 'waiting', line: `Still here when you're ready${you}.` };
      return { mood: 'idle', key: 'hello', line: "Hi, I'm Pixel. I take messages straight to Kamel." };
  }
}

/** Message length → number of lit bars (0–4) and the label on the robot's screen. */
function meterFor(len: number, min: number): { bars: number; label: string } {
  if (len < min) return { bars: len > 0 ? 1 : 0, label: 'TOO SHORT' };
  if (len < 60) return { bars: 2, label: 'GOOD START' };
  if (len < 140) return { bars: 3, label: 'GETTING THERE' };
  return { bars: 4, label: 'LOVE IT' };
}

const INK = '#242424';
const PAPER = '#F8F6F0';
const IVORY = '#F3F0E8';
const ACCENT = '#E8622C'; // matches the orange in the logo
const BLUSH = '#E79A86';

export default function ContactRobot(props: ContactRobotProps) {
  const { mood, line, key } = deriveState(props);

  // A quick nod each time a key is pressed in the form.
  const [typing, setTyping] = useState(false);
  const typed = Object.values(props.values).join('\u0000');
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setTyping(true);
    const t = window.setTimeout(() => setTyping(false), 380);
    return () => window.clearTimeout(t);
  }, [typed]);
  const headRef = useRef<SVGSVGElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });

  // Eyes follow the focused field, otherwise the pointer.
  useEffect(() => {
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const update = () => {
      frame = 0;
      const head = headRef.current;
      if (!head) return;
      const box = head.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height * 0.45;

      let target = pointer;
      const active = document.activeElement as HTMLElement | null;
      if (active && active.closest('#contact form') && active.matches('input, textarea')) {
        const r = active.getBoundingClientRect();
        target = { x: r.left + Math.min(r.width, 220) / 2, y: r.top + r.height / 2 };
      }
      if (!target) return setLook({ x: 0, y: 0 });

      const dx = target.x - cx;
      const dy = target.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / 260);
      setLook({ x: (dx / dist) * 4.5 * reach, y: (dy / dist) * 3.5 * reach });
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onPointer = (e: PointerEvent) => { pointer = { x: e.clientX, y: e.clientY }; schedule(); };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('focusin', schedule);
    document.addEventListener('focusout', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('focusin', schedule);
      document.removeEventListener('focusout', schedule);
    };
  }, []);

  const meter = meterFor(props.values.message.trim().length, props.minMessage);
  const eyes = `translate(${look.x.toFixed(2)} ${look.y.toFixed(2)})`;

  return (
    <div aria-hidden="true" className="robot pointer-events-none select-none" data-pause-offscreen data-mood={mood} data-typing={typing ? 'true' : undefined}>
      {/* Speech bubble */}
      <div className="mb-1.5 flex h-[2.6rem] items-end justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={key}
            layout
            initial={{ opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="robot-bubble"
          >
            {line}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Robot */}
      <svg
        ref={headRef}
        viewBox="0 0 140 112"
        width="105"
        height="84"
        className="robot-body mx-auto block"
      >
        {/* Antenna */}
        <line x1="70" y1="9" x2="70" y2="20" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <circle className="robot-antenna" cx="70" cy="7" r="4.5" fill={ACCENT} stroke={INK} strokeWidth="2" />

        {/* Ears */}
        <rect x="21" y="42" width="11" height="24" rx="4" fill={PAPER} stroke={INK} strokeWidth="2.5" />
        <rect x="108" y="42" width="11" height="24" rx="4" fill={PAPER} stroke={INK} strokeWidth="2.5" />

        {/* Head + screen */}
        <rect x="30" y="20" width="80" height="70" rx="17" fill={PAPER} stroke={INK} strokeWidth="3" />
        <rect x="39" y="29" width="62" height="46" rx="11" fill={INK} />

        {mood === 'meter' ? (
          <g>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={49 + i * 11}
                y="41"
                width="8"
                height="13"
                rx="2"
                fill={i < meter.bars ? (meter.bars >= 3 ? '#5FC4A8' : ACCENT) : '#4A4845'}
              />
            ))}
            <text x="70" y="66" textAnchor="middle" fontSize="6.2" fontWeight="700" letterSpacing="0.6" fill={IVORY} fontFamily="Inter, system-ui, sans-serif">
              {meter.label}
            </text>
          </g>
        ) : mood === 'thinking' ? (
          <g fill={IVORY}>
            <circle className="robot-dot" cx="58" cy="52" r="3.6" />
            <circle className="robot-dot" cx="70" cy="52" r="3.6" style={{ animationDelay: '0.15s' }} />
            <circle className="robot-dot" cx="82" cy="52" r="3.6" style={{ animationDelay: '0.3s' }} />
          </g>
        ) : (
          <g transform={eyes} style={{ transition: 'transform 120ms ease-out' }}>
            {mood === 'happy' ? (
              <g fill="none" stroke={IVORY} strokeWidth="3.2" strokeLinecap="round">
                <path d="M52 54 Q58 46 64 54" />
                <path d="M76 54 Q82 46 88 54" />
              </g>
            ) : (
              <g className="robot-eyes" fill={IVORY}>
                <circle cx="58" cy="50" r={mood === 'excited' ? 6.5 : 5} />
                <circle cx="82" cy="50" r={mood === 'excited' ? 6.5 : 5} />
              </g>
            )}
            {mood === 'sad' && (
              <g stroke={IVORY} strokeWidth="2.4" strokeLinecap="round">
                <line x1="52" y1="41" x2="62" y2="44" />
                <line x1="88" y1="41" x2="78" y2="44" />
              </g>
            )}
            {/* Mouth */}
            {mood === 'happy' || mood === 'excited' ? (
              <path d="M63 61 Q70 69 77 61" fill={IVORY} />
            ) : mood === 'sad' ? (
              <path d="M64 66 Q70 61 76 66" fill="none" stroke={IVORY} strokeWidth="2.4" strokeLinecap="round" />
            ) : (
              <line x1="66" y1="63" x2="74" y2="63" stroke={IVORY} strokeWidth="2.4" strokeLinecap="round" />
            )}
          </g>
        )}

        {/* Blush */}
        {(mood === 'happy' || mood === 'excited') && (
          <g fill={BLUSH} opacity="0.85">
            <ellipse cx="47" cy="63" rx="4.5" ry="2.6" />
            <ellipse cx="93" cy="63" rx="4.5" ry="2.6" />
          </g>
        )}

        {/* Hands gripping the card edge */}
        <g fill={PAPER} stroke={INK} strokeWidth="2.5">
          <rect x="30" y="94" width="24" height="16" rx="6" />
          <rect x="86" y="94" width="24" height="16" rx="6" />
        </g>
        <g stroke={INK} strokeWidth="1.8" strokeLinecap="round">
          <line x1="38" y1="104" x2="38" y2="110" />
          <line x1="46" y1="104" x2="46" y2="110" />
          <line x1="94" y1="104" x2="94" y2="110" />
          <line x1="102" y1="104" x2="102" y2="110" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Slim "Pixel says…" pill fixed under the nav. Shown by the contact form while
 * the big robot is scrolled out of view, so the live replies stay visible.
 * Decorative like Pixel itself, so hidden from screen readers.
 */
export function PixelDock({ visible, ...props }: ContactRobotProps & { visible: boolean }) {
  const { mood, line } = deriveState(props);
  if (typeof document === 'undefined') return null;
  // Portalled to <body>: the form column is animated with a transform, which would break position: fixed.
  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="pixel-dock pointer-events-none fixed left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-full border border-line bg-paper py-1.5 pl-1.5 pr-4 shadow-[0_14px_40px_-20px_rgba(0,0,0,0.45)]"
          style={{ top: 'calc(var(--nav-height) + 0.5rem)' }}
          data-mood={mood}
        >
          <svg viewBox="0 0 40 32" width="40" height="32" className="shrink-0">
            <rect x="2" y="2" width="36" height="28" rx="9" fill={PAPER} stroke={INK} strokeWidth="2.2" />
            <rect x="7" y="7" width="26" height="18" rx="5" fill={INK} />
            {mood === 'happy' || mood === 'excited' ? (
              <g fill="none" stroke={IVORY} strokeWidth="2" strokeLinecap="round">
                <path d="M12.5 17 Q15 14 17.5 17" />
                <path d="M22.5 17 Q25 14 27.5 17" />
              </g>
            ) : (
              <g fill={IVORY}>
                <circle cx="15" cy="16" r="2.3" />
                <circle cx="25" cy="16" r="2.3" />
              </g>
            )}
            <circle cx="20" cy="2" r="2" fill={ACCENT} />
          </svg>
          <span className="min-w-0 truncate text-[0.8rem] font-medium text-ink">
            <span className="text-muted">Pixel: </span>
            {line}
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
