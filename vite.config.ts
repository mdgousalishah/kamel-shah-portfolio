import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { chatApiRouter } from './src/server/chatApi';
import { loadEnv } from 'vite';
import path from 'path';
import {defineConfig} from 'vite';

const attachChatApi = (server: { middlewares: { use: (path: string, handler: typeof chatApiRouter) => void } }) => {
  server.middlewares.use('/api', chatApiRouter);
};

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'portfolio-chat-api',
        configureServer: attachChatApi,
        configurePreviewServer: attachChatApi,
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Three's vendor chunk is 132 kB when gzipped; keep its heavier canvas code out of the main entry.
      chunkSizeWarningLimit: 550,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          profile: path.resolve(__dirname, 'kamel-shah/index.html'),
        },
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('/three/') || id.includes('/@react-three/')) return 'three';
            if (id.includes('/motion/') || id.includes('/motion-dom/')) return 'motion';
            if (id.includes('/lucide-react/')) return 'icons';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
