/**
 * Contact form API — POST /api/contact (Vite dev/preview middleware and server.ts).
 *
 * The router is mounted both on an Express app (server.ts) and directly on
 * Vite's plain Connect server (vite.config.ts). Connect does not add Express's
 * `res.status()` / `res.json()` helpers, so responses are written with plain
 * Node APIs — calling `res.status()` there threw, crashed the dev server, and
 * made the browser report "Failed to fetch".
 *
 * Delivery logic lives in ./contactCore so the Vercel function (api/contact.ts)
 * behaves identically.
 */
import express, { type Request, type Response } from 'express';
import type { ServerResponse } from 'node:http';
import { handleContactSubmission } from './contactCore';

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  if (res.headersSent) return;
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export const contactApiRouter = express.Router();
contactApiRouter.use(express.json({ limit: '16kb' }));

contactApiRouter.post('/', async (req: Request, res: Response) => {
  try {
    const clientId = req.ip || req.socket.remoteAddress || 'unknown';
    const result = await handleContactSubmission(req.body, clientId);
    sendJson(res, result.status, result.body);
  } catch (err) {
    // Never let an error escape an async handler: it would crash the dev server.
    console.error('[ContactAPI] Unexpected error:', err);
    sendJson(res, 500, { error: 'Message could not be sent. Please try again or contact me directly.' });
  }
});
