import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';

/**
 * Scroll-lit statement (landonorris.com style): the words start faint and light up
 * one by one as you scroll, with a few accent words in serif italic and a blinking
 * cursor at the end. Built only from wording already used on the site.
 * Screen readers get the plain sentence.
 */
const PARTS: { text: string; accent?: boolean }[] = [
  { text: 'I build' },
  { text: 'practical', accent: true },
  { text: 'web experiences,' },
  { text: 'full-stack', accent: true },
  { text: 'applications and' },
  { text: 'dependable', accent: true },
  { text: 'REST APIs — engineering for the web, grounded in' },
  { text: 'everyday', accent: true },
  { text: 'IT practice.' },
];

const WORDS = PARTS.flatMap((part) =>
  part.text.split(' ').map((word) => ({ word, accent: Boolean(part.accent) })),
);
const SENTENCE = PARTS.map((p) => p.text).join(' ');

function Word({
  word,
  accent,
  index,
  progress,
}: {
  word: string;
  accent: boolean;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = index / WORDS.length;
  const span = 1 / WORDS.length;
  const opacity = useTransform(progress, [start * 0.92, start * 0.92 + span * 2], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={accent ? 'statement__accent' : undefined}>
      {word}
    </motion.span>
  );
}

export default function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Starts lighting as it enters the lower part of the screen; fully lit by the time it is centred.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'center 50%'] });

  return (
    <section aria-label="Statement" className="statement">
      <div className="wrap">
        <div ref={ref}>
          <p className="sr-only">{SENTENCE}</p>
          <p aria-hidden="true" className="statement__text">
            {WORDS.map((w, i) =>
              reduce ? (
                <span key={i} className={w.accent ? 'statement__accent' : undefined}>
                  {w.word}{' '}
                </span>
              ) : (
                <span key={i}>
                  <Word word={w.word} accent={w.accent} index={i} progress={scrollYProgress} />{' '}
                </span>
              ),
            )}
            <span className="statement__cursor" data-pause-offscreen />
          </p>
        </div>
      </div>
    </section>
  );
}
