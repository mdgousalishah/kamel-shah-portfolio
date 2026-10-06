import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { chatApiRouter } from './src/server/chatApi';

const app = express();
const port = Number(process.env.PORT) || 3000;
const distDirectory = path.resolve(process.cwd(), 'dist');

if (!existsSync(path.join(distDirectory, 'index.html'))) {
  console.error('Portfolio build not found. Run `npm run build` before starting the production server.');
  process.exit(1);
}

app.disable('x-powered-by');
app.use('/api', chatApiRouter);
app.get('/kamel-shah', (_req, res) => res.sendFile(path.join(distDirectory, 'kamel-shah', 'index.html')));
app.use(express.static(distDirectory, {
  setHeaders(res, filePath) {
    if (filePath.includes(`${path.sep}assets${path.sep}`)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || path.extname(req.path)) return next();
  res.sendFile(path.join(distDirectory, 'index.html'));
});
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Portfolio server error:', error);
  if (!res.headersSent) res.status(500).json({ error: 'The server could not complete that request.' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Portfolio server listening on port ${port}`);
});
