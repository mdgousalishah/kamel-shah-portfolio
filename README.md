# Kamel Shah Portfolio

Responsive, motion-rich portfolio built with React, TypeScript, Vite, and Three.js. The site includes project case studies, a cinematic scroll experience, an accessible mobile menu, and a portfolio assistant.

## Run locally

1. Install packages with `npm install`.
2. Copy `.env.example` to `.env`.
3. Add a Google Gemini API key to `GEMINI_API_KEY` in `.env` to enable conversational AI. The key stays on the Node server and is never included in browser assets. Without a key, the assistant uses its built-in portfolio answers.
4. Start the Vite development server with `npm run dev`.

## Production

Build the site and server with `npm run build`, then run `npm start`. The Express server serves the built site and the `/api/chat` endpoint. Deploy it to a Node.js host and set `GEMINI_API_KEY` as a server environment secret; do not put it in a `VITE_` variable.

`npm run preview` serves the Vite production preview and includes the same assistant API middleware. For production hosting, use `npm start` so the site and API run together.

## Project links

Project demos and repositories are maintained in `src/data/projects.ts`. Only confirmed project-specific repositories are labeled as repositories; profile links are identified as GitHub profiles.
