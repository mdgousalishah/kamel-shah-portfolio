/**
 * Vercel serverless function — POST /api/contact
 *
 * Vercel serves only the static `dist/` build, so server.ts and the Vite
 * middleware never run there. Without this file, the deployed contact form had
 * no backend to talk to.
 *
 * Configure CONTACT_SMTP_* (and optionally CONTACT_TO_EMAIL) in
 * Vercel → Project → Settings → Environment Variables, then redeploy.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
// The .js extension is required for Node ESM on Vercel; TypeScript and Vite map it to the .ts source.
import { handleContactSubmission } from '../src/server/contactCore.js';

type VercelRequest = IncomingMessage & { body?: unknown };

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readJsonBody(req: VercelRequest): Promise<unknown> {
  // Vercel normally pre-parses JSON into req.body; fall back to reading the stream.
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch { return undefined; }
    }
    return req.body;
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > 16 * 1024) return undefined;
    chunks.push(chunk as Buffer);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return undefined;
  }
}

export default async function handler(req: VercelRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const forwarded = req.headers['x-forwarded-for'];
    const clientId =
      (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    const result = await handleContactSubmission(body, clientId);
    sendJson(res, result.status, result.body);
  } catch (err) {
    console.error('[ContactAPI] Unexpected error:', err);
    sendJson(res, 500, { error: 'Message could not be sent. Please try again or contact me directly.' });
  }
}
