import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SITE_CONFIG, SOCIAL_LINKS, whatsappHref } from '../data/config';
import { ArrowUpRight, CheckCircle, X, Loader2, AlertCircle } from 'lucide-react';
import Reveal from '../components/Reveal';
import { Headline } from '../components/Motion';
import ContactRobot, { type RobotField } from '../components/ContactRobot';

// ── Success Toast ─────────────────────────────────────────────────────────────

interface SuccessToastProps {
  onClose: () => void;
}

function SuccessToast({ onClose }: SuccessToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onClose]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[min(92vw,440px)]"
    >
      <div className="relative bg-ivory border border-line rounded-md shadow-xl px-5 py-4 flex items-start gap-3.5 overflow-hidden">
        {/* Accent line */}
        <div className="absolute inset-y-0 left-0 w-1 bg-ink" />

        {/* Auto-dismiss progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-ink/30"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 4, ease: 'linear' }}
        />

        <CheckCircle size={20} className="text-ink shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          <p className="text-base font-serif text-ink mb-0.5">
            Message sent.
          </p>
          <p className="text-xs text-muted leading-relaxed">
            Thank you for reaching out. Your message has been sent. I'll get back to you soon.
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close notification"
          id="contact-success-toast-close"
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-sand transition-colors -mt-1"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

type FormState = 'idle' | 'loading' | 'success' | 'error';

// `website` is a honeypot: hidden from people, so only bots fill it in.
const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', message: '', website: '' };

// Keep in sync with CONTACT_LIMITS in src/server/contactCore.ts (not imported, so no server code reaches the browser).
const LIMITS = { name: 80, email: 254, phone: 30, message: 5000 };

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  // Drives the robot above the form.
  const [focused, setFocused] = useState<RobotField>(null);
  const [submitHover, setSubmitHover] = useState(false);
  const [sentName, setSentName] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the confirmation so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (formState === 'success') successHeadingRef.current?.focus();
  }, [formState]);

  const startOver = () => {
    setSubmitHover(false);
    setShowToast(false);
    setFormState('idle');
    setSentName('');
    setSentEmail('');
  };

  const isLoading = formState === 'loading';

  // Client-side validation
  const validate = (): string | null => {
    if (!formData.firstName.trim()) return 'First Name is required.';
    if (!formData.lastName.trim())  return 'Last Name is required.';
    if (!formData.email.trim())     return 'Email Address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      return 'Please enter a valid email address.';
    if (!formData.message.trim() || formData.message.trim().length < 10)
      return 'Message must be at least 10 characters.';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error as user types
    if (formState === 'error') { setFormState('idle'); setErrorMsg(''); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const validationError = validate();
    if (validationError) {
      setFormState('error');
      setErrorMsg(validationError);
      return;
    }

    setFormState('loading');
    setErrorMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName:  formData.lastName.trim(),
          email:     formData.email.trim(),
          phone:     formData.phone.trim() || undefined,
          message:   formData.message.trim(),
          website:   formData.website,
        }),
      });

      // A missing backend returns an HTML error page, so never assume JSON.
      const data = await response.json().catch(() => ({})) as { ok?: boolean; error?: string };

      if (response.ok && data.ok) {
        setSentName(formData.firstName.trim());
        setSentEmail(formData.email.trim());
        setSubmitHover(false); // the button is replaced by the confirmation, so mouseleave never fires
        setFormState('success');
        setFormData(EMPTY_FORM);
        setShowToast(true);
      } else {
        throw new Error(
          data.error ||
          `The message service is unavailable right now (error ${response.status}). Please email ${SITE_CONFIG.email} directly.`
        );
      }
    } catch (err) {
      const offline = err instanceof TypeError; // fetch() itself failed: network or server down
      const msg = offline
        ? `Could not reach the message service. Please check your connection, or email ${SITE_CONFIG.email} directly.`
        : err instanceof Error ? err.message : '';
      setFormState('error');
      setErrorMsg(msg || 'Message could not be sent. Please try again or contact me directly.');
    }
  };

  const field = (name: keyof typeof EMPTY_FORM) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    disabled: isLoading,
  });

  const channels = [
    { label: 'Email', value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}`, external: false },
    { label: 'WhatsApp', value: SITE_CONFIG.phone, href: whatsappHref(), external: true },
    { label: 'Location', value: SITE_CONFIG.location, href: '', external: false }
  ];

  return (
    <>
      {/* Success toast (fixed at top) */}
      <AnimatePresence>
        {showToast && (
          <SuccessToast onClose={() => setShowToast(false)} />
        )}
      </AnimatePresence>

      <section id="contact" aria-labelledby="contact-title" className="section">
        <div className="wrap">
          <header className="section-head">
            <span className="section-index">08</span>
            <span className="eyebrow">Contact</span>
          </header>

          <Headline id="contact-title" className="display max-w-[14ch] text-[clamp(2.6rem,7vw,5.75rem)] text-ink">
              Let&rsquo;s build something useful together.
            </Headline>
          <Reveal from="left" delay={0.06}>
            <p className="lead mt-6 max-w-[36rem]">
              Open to full-stack development roles, technical collaborations, and web projects for
              businesses and institutions.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-16">
            {/* Direct channels */}
            <Reveal from="left" className="lg:col-span-5">
              <dl className="border-t border-ink">
                {channels.map((c) => (
                  <div key={c.label} className="border-b border-line py-5">
                    <dt className="eyebrow">{c.label}</dt>
                    <dd className="mt-2">
                      {c.href ? (
                        <a
                          href={c.href}
                          target={c.external ? '_blank' : undefined}
                          rel={c.external ? 'noopener noreferrer' : undefined}
                          className="link-line break-all font-serif text-[1.35rem] leading-snug sm:text-2xl"
                        >
                          {c.value}
                          <ArrowUpRight size={16} aria-hidden="true" className="shrink-0" />
                        </a>
                      ) : (
                        <span className="font-serif text-[1.35rem] leading-snug text-ink sm:text-2xl">{c.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10">
                <p className="eyebrow">Elsewhere</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {SOCIAL_LINKS.map((s) => (
                    <li key={s.key}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="btn btn-quiet btn-sm">
                        {s.label}
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal from="right" blur={false} className="lg:col-span-7" delay={0.08}>
              <div className="relative z-10 -mb-[7px]">
                <ContactRobot
                  focused={focused}
                  values={formData}
                  formState={formState}
                  submitHover={submitHover}
                  sentName={sentName}
                  minMessage={10}
                />
              </div>
              <form
                onSubmit={handleSubmit}
                onFocus={(e) => {
                  const name = (e.target as HTMLElement).getAttribute('name') ?? '';
                  setFocused(['firstName', 'lastName', 'email', 'phone', 'message'].includes(name) ? name as RobotField : null);
                }}
                onBlur={() => setFocused(null)}
                noValidate
                aria-labelledby="contact-form-title"
                className="rounded-md border border-line bg-paper p-5 sm:p-7"
              >
                <h3 id="contact-form-title" className="font-serif text-xl text-ink sm:text-2xl">Send a message</h3>
                <p className="mt-1 text-sm text-muted">
                  It goes straight to my inbox.{' '}
                  <a href="/privacy" className="underline decoration-line underline-offset-2 hover:decoration-ink">How your details are used</a>.
                </p>

                <AnimatePresence>
                  {formState === 'error' && errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        role="alert"
                        id="contact-error-banner"
                        className="mt-6 flex items-start gap-2 rounded-md border border-[#D9B4AA] bg-[#F7EBE6] p-3 text-[#8A3A26]"
                      >
                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                        <span className="text-sm leading-relaxed">{errorMsg}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {formState === 'success' ? (
                  <motion.div
                    role="status"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-5 border-t border-line pt-6"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-ivory">
                        <CheckCircle size={18} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h4
                          ref={successHeadingRef}
                          tabIndex={-1}
                          className="font-serif text-[1.6rem] leading-tight text-ink outline-none"
                        >
                          Your message has been emailed{sentName ? `, ${sentName}` : ''}.
                        </h4>
                        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                          It&rsquo;s in my inbox now. I&rsquo;ll get back to you by email very soon.
                        </p>
                        {sentEmail && (
                          <p className="mt-2 text-sm text-muted">
                            Reply will go to{' '}
                            <strong className="font-medium text-ink [overflow-wrap:anywhere]">{sentEmail}</strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="eyebrow mt-6">What happens next</p>
                    <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-soft">
                      <li className="flex gap-3"><span className="section-index text-sm">01</span><span>I read every message personally and reply from my own email.</span></li>
                      <li className="flex gap-3"><span className="section-index text-sm">02</span><span>Keep an eye on your inbox, and check spam or promotions if you don&rsquo;t see my reply.</span></li>
                      <li className="flex gap-3"><span className="section-index text-sm">03</span><span>Need a faster answer? WhatsApp me and mention your message.</span></li>
                    </ol>

                    <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button type="button" onClick={startOver} className="link-quiet inline-flex items-center justify-center gap-1 text-sm">
                        Send another message
                      </button>
                      <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Message on WhatsApp
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <>
                  <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-8">
                    <div>
                      <label htmlFor="contact-first-name" className="field-label">First name *</label>
                      <input type="text" id="contact-first-name" required maxLength={LIMITS.name} autoComplete="given-name" className="field" {...field('firstName')} />
                    </div>
                    <div>
                      <label htmlFor="contact-last-name" className="field-label">Last name *</label>
                      <input type="text" id="contact-last-name" required maxLength={LIMITS.name} autoComplete="family-name" className="field" {...field('lastName')} />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="contact-email" className="field-label">Email address *</label>
                      <input type="email" id="contact-email" required maxLength={LIMITS.email} autoComplete="email" placeholder="you@example.com" className="field" {...field('email')} />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="contact-phone" className="field-label">Phone (optional)</label>
                      <input type="tel" id="contact-phone" maxLength={LIMITS.phone} autoComplete="tel" placeholder="+91" className="field" {...field('phone')} />
                    </div>
                    {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                      <label htmlFor="contact-website">Website</label>
                      <input type="text" id="contact-website" tabIndex={-1} autoComplete="off" {...field('website')} />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="contact-message" className="field-label">Message *</label>
                      <textarea
                        rows={3}
                        id="contact-message"
                        required
                        maxLength={LIMITS.message}
                        placeholder="A few lines about your project, question, or opportunity."
                        className="field resize-none"
                        {...field('message')}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="link-quiet inline-flex items-center justify-center gap-1 text-sm">
                      Prefer WhatsApp?
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                    <button
                      type="submit"
                      id="contact-submit-btn"
                      disabled={isLoading}
                      onMouseEnter={() => setSubmitHover(true)}
                      onMouseLeave={() => setSubmitHover(false)}
                      onFocus={() => setSubmitHover(true)}
                      onBlur={() => setSubmitHover(false)}
                      className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                  </>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
