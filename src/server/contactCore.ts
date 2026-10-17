/**
 * Contact form core — shared by every runtime that serves POST /api/contact:
 *   • Vite dev / preview middleware   (src/server/contactApi.ts)
 *   • Express production server       (server.ts → src/server/contactApi.ts)
 *   • Vercel serverless function      (api/contact.ts)
 *
 * It returns a plain { status, body } result and never touches the response
 * object itself, so it works the same on Express, Vite's Connect server and Vercel.
 *
 * Required environment variables (see .env.example):
 *   CONTACT_SMTP_HOST     – SMTP host, e.g. smtp.gmail.com
 *   CONTACT_SMTP_PORT     – 465 (SSL) or 587 (STARTTLS)
 *   CONTACT_SMTP_SECURE   – "true" for 465, "false" for 587
 *   CONTACT_SMTP_USER     – sender account, e.g. your Gmail address
 *   CONTACT_SMTP_PASS     – Gmail App Password (not your normal password)
 *   CONTACT_TO_EMAIL      – optional recipient override
 */
import nodemailer from 'nodemailer';

/** Default inbox. CONTACT_TO_EMAIL, when set, takes precedence. */
export const DEFAULT_RECIPIENT = 'kamelshah2003@gmail.com';

const MIN_MESSAGE_LENGTH = 10;
const MAX_CONTACT_PER_HOUR = 5;

/** Upper bounds keep oversized or scripted payloads out of the inbox. */
export const CONTACT_LIMITS = { name: 80, email: 254, phone: 30, message: 5000 } as const;

export interface ContactResult {
  status: number;
  body: { ok: true } | { error: string };
}

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  /** Honeypot: hidden from people, so only bots fill it in. */
  website?: string;
}

const within = (value: string, min: number, max: number) => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

function isValidPayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.firstName === 'string' && within(b.firstName, 1, CONTACT_LIMITS.name) &&
    typeof b.lastName === 'string' && within(b.lastName, 1, CONTACT_LIMITS.name) &&
    typeof b.email === 'string' && within(b.email, 3, CONTACT_LIMITS.email) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim()) &&
    typeof b.message === 'string' && within(b.message, MIN_MESSAGE_LENGTH, CONTACT_LIMITS.message) &&
    (b.phone === undefined || (typeof b.phone === 'string' && b.phone.trim().length <= CONTACT_LIMITS.phone)) &&
    (b.website === undefined || typeof b.website === 'string')
  );
}

/** True when the hidden honeypot field was filled in, which people never do. */
function isHoneypotFilled(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const website = (body as Record<string, unknown>).website;
  return typeof website === 'string' && website.trim().length > 0;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Strip characters that could break an email header. */
const headerSafe = (value: string) => value.replace(/[\r\n"<>]/g, ' ').trim();

function buildTransporter() {
  const host = process.env.CONTACT_SMTP_HOST;
  const port = Number(process.env.CONTACT_SMTP_PORT) || 587;
  const secure = process.env.CONTACT_SMTP_SECURE === 'true';
  const user = process.env.CONTACT_SMTP_USER;
  const pass = process.env.CONTACT_SMTP_PASS;

  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    // Fail fast instead of hanging the request (and a serverless function) for minutes.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

// Per-instance, best-effort rate limit (max 5 submissions per client per hour).
const contactRateMap = new Map<string, { startedAt: number; count: number }>();

function isContactRateLimited(clientId: string): boolean {
  const now = Date.now();
  const entry = contactRateMap.get(clientId);
  if (!entry || now - entry.startedAt >= 3_600_000) {
    contactRateMap.set(clientId, { startedAt: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_CONTACT_PER_HOUR;
}

export async function handleContactSubmission(body: unknown, clientId: string): Promise<ContactResult> {
  if (isContactRateLimited(clientId)) {
    return { status: 429, body: { error: 'Too many submissions. Please wait before trying again.' } };
  }

  // Bots get the normal success reply so they don't learn to skip the field; nothing is emailed.
  if (isHoneypotFilled(body)) {
    console.warn('[ContactAPI] Honeypot field filled; submission discarded.');
    return { status: 200, body: { ok: true } };
  }

  if (!isValidPayload(body)) {
    return { status: 400, body: { error: 'Invalid form data. Please check all required fields.' } };
  }

  const firstName = body.firstName.trim();
  const lastName = body.lastName.trim();
  const email = body.email.trim();
  const phone = body.phone?.trim() || '';
  const message = body.message.trim();
  const fullName = `${firstName} ${lastName}`;
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_RECIPIENT;

  const transporter = buildTransporter();
  if (!transporter) {
    console.error('[ContactAPI] SMTP not configured. Set CONTACT_SMTP_HOST, CONTACT_SMTP_USER and CONTACT_SMTP_PASS.');
    return {
      status: 503,
      body: { error: `Email service is not configured on this server. Please contact me directly at ${toEmail}.` },
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.CONTACT_SMTP_USER}>`,
      replyTo: `"${headerSafe(fullName)}" <${headerSafe(email)}>`,
      to: toEmail,
      subject: `[Portfolio Contact] New message from ${headerSafe(fullName)}`,
      text: [
        `Name:    ${fullName}`,
        `Email:   ${email}`,
        `Phone:   ${phone || 'Not provided'}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;padding:32px;background:#F3F0E8;border-radius:8px;color:#242424;">
          <h2 style="font-size:20px;margin:0 0 20px;color:#242424;">New portfolio message</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:8px 0;font-size:12px;color:#77746E;width:90px;">From</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${escapeHtml(fullName)}</td></tr>
            <tr><td style="padding:8px 0;font-size:12px;color:#77746E;">Reply-to</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#242424;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;font-size:12px;color:#77746E;">Phone</td><td style="padding:8px 0;font-size:14px;">${escapeHtml(phone) || '&mdash;'}</td></tr>
          </table>
          <div style="border-top:1px solid #D8D3C9;padding-top:20px;">
            <p style="font-size:12px;color:#77746E;margin:0 0 8px;">Message</p>
            <p style="font-size:14px;line-height:1.6;white-space:pre-wrap;margin:0;">${escapeHtml(message)}</p>
          </div>
          <p style="margin-top:32px;font-size:11px;color:#77746E;">Reply to this email to respond directly to ${escapeHtml(email)}.</p>
        </div>
      `,
    });

    console.info(`[ContactAPI] Delivered to SMTP server. messageId=${info.messageId} accepted=${info.accepted.length}`);
    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error('[ContactAPI] Failed to send email:', err);
    return { status: 502, body: { error: 'Message could not be sent. Please try again or contact me directly.' } };
  }
}
