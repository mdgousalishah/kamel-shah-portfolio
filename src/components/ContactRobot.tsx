import { useEffect, useRef, useState } from 'react';
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

function deriveState(p: ContactRobotProps): { mood: Mood; line: string } {
  const v = p.values;
  const first = v.firstName.trim();
  const last = v.lastName.trim();
  const email = v.email.trim();
  const msgLen = v.message.trim().length;
  const ready = Boolean(first && last && EMAIL_RE.test(email) && msgLen >= p.minMessage);

  if (p.formState === 'loading') return { mood: 'thinking', line: 'Sending… beep boop.' };
  if (p.formState === 'success') {
    return { mood: 'happy', line: `Delivered! Kamel will reply soon${p.sentName ? `, ${p.sentName}` : ''}.` };
  }
  if (p.formState === 'error') return { mood: 'sad', line: "Uh-oh, that didn't go through. See the note below." };

  if (p.submitHover) {
    return ready
      ? { mood: 'excited', line: 'Ooh. Do it. Press it.' }
      : { mood: 'sad', line: 'Fill in the starred fields first.' };
  }

  switch (p.focused) {
    case 'firstName':
      return first
        ? { mood: 'happy', line: `Nice to meet you, ${first}!` }
        : { mood: 'idle', line: "Let's start with your name." };
    case 'lastName':
      return last
        ? { mood: 'happy', line: `${first || 'Hello'} ${last}. Got it.` }
        : { mood: 'idle', line: 'And your last name?' };
    case 'email':
      if (!email) return { mood: 'idle', line: 'Where should Kamel reply?' };
      return EMAIL_RE.test(email)
        ? { mood: 'happy', line: 'Perfect. Replies go there.' }
        : { mood: 'idle', line: "Hmm, that email isn't finished yet." };
    case 'phone':
      return { mood: 'idle', line: 'Optional. WhatsApp works too.' };
    case 'message':
      if (msgLen < p.minMessage) {
        const left = p.minMessage - msgLen;
        return { mood: 'meter', line: `${left} more character${left === 1 ? '' : 's'}, please.` };
      }
      return msgLen < 140
        ? { mood: 'meter', line: "Tell me more, I'm listening." }
        : { mood: 'meter', line: 'Great detail. Kamel will love this.' };
    default:
      if (ready) return { mood: 'excited', line: "All set. Hit Send when you're ready." };
      if (first || email || msgLen) return { mood: 'idle', line: "Still here when you're ready." };
      return { mood: 'idle', line: "Hi, I'm Pixel. I take messages straight to Kamel." };
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
  const { mood, line } = deriveState(props);
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
    <div aria-hidden="true" className="robot pointer-events-none select-none" data-mood={mood}>
      {/* Speech bubble */}
      <div className="mb-1.5 flex h-[2.6rem] items-end justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={line}
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
