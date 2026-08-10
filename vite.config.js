import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path configurable vía VITE_BASE_PATH.
// Por defecto usa '/' porque el sitio se sirve con dominio custom
// (nahueldelsur.cl) en la raíz. Si vuelves a GitHub Pages en subruta
// <usuario>.github.io/<repo>/, exporta VITE_BASE_PATH=/<repo>/ antes de buildear.
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
});
