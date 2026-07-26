# Landing retroexcavadora

Landing estática en React + Vite + Tailwind para captar citas de alquiler de retroexcavadora.

## Stack
- React 18 + Vite 5 + Tailwind 3 (JSX, sin TypeScript).
- Paleta: `#FACC15` (brand), `#0A0A0A` (ink), `#FFFFFF` (paper).
- Servicio mock `src/services/citasService.js` que resuelve en dev y rechaza en prod.

## Scripts
- `pnpm dev` — servidor en `http://127.0.0.1:5173`.
- `pnpm build` — bundle de producción en `dist/`.
- `pnpm lint` — ESLint sobre `src/`.
- `pnpm preview` — sirve `dist/` localmente.
- `pnpm deploy` — publica `dist/` en la rama `gh-pages` (requiere `gh-pages` instalado y push habilitado).

## Deploy a GitHub Pages
Hay dos caminos soportados:

1. **GitHub Actions (recomendado).** El workflow `.github/workflows/deploy.yml` construye y publica en Pages automáticamente en cada `push` a `main`. El base path se inyecta vía `VITE_BASE_PATH=/${{ github.event.repository.name }}/`.
2. **Manual con `gh-pages`.** `pnpm deploy` después de configurar el remote de GitHub.

Para instrucciones paso a paso, prerrequisitos, troubleshooting y cómo activar Pages en el repo, consulta [GUIA_DESPLIEGUE.md](./GUIA_DESPLIEGUE.md).

> Si renombras el repo en GitHub, actualiza el `base` en `vite.config.js` o exporta `VITE_BASE_PATH=/nuevo-nombre/` antes de buildear. El workflow lo lee del nombre del repo en runtime, así que no necesita cambios.

## Estructura
```
src/
  App.jsx
  main.jsx
  index.css
  components/
    Hero.jsx
    PrecioDestacado.jsx
    Beneficios.jsx
    FormularioContacto.jsx
    Footer.jsx
    ui/         (Icon, SectionHeader, PrimaryCta)
    form/       (Campo, SubmitButton, Feedback, validacion)
  services/
    citasService.js
db/
  schema.sql
```

## Deploy
La landing se publica como sitio estático en GitHub Pages. Para instrucciones detalladas (prerrequisitos, métodos soportados, solución de problemas), consulta [GUIA_DESPLIEGUE.md](./GUIA_DESPLIEGUE.md).

Resumen rápido:
- `npm run build` genera el bundle de producción en `dist/`.
- `npm run deploy` (tras instalar `gh-pages` y añadir el script al `package.json`) publica `dist/` en la rama `gh-pages`.
- También se puede desplegar con GitHub Actions; el workflow vive en `.github/workflows/deploy.yml`.

## Backend (referencia)
`db/schema.sql` define la tabla `citas` que el endpoint real debe usar.
