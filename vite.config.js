import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path configurable vía VITE_BASE_PATH.
// Por defecto usa '/landing-retroexcavadora/' que es la subruta esperada en
// GitHub Pages cuando el repo se llama así. Para renombrar el repo o usar
// Pages con dominio custom, exporta VITE_BASE_PATH antes de buildear
// (por ejemplo: VITE_BASE_PATH=/mi-repo/ pnpm build).
const base = process.env.VITE_BASE_PATH || '/landing-retroexcavadora/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
});
