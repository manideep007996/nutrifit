import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH lets the same code serve from a sub-folder, e.g. GitHub Pages
// project sites at https://<user>.github.io/<repo>/ (set in the deploy workflow).
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: { port: 5173, open: true },
});
