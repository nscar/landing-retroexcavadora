# Landing retroexcavadora

Landing estática en React + Vite + Tailwind para captar citas de alquiler de retroexcavadora.

## Stack
- React 18 + Vite 5 + Tailwind 3 (JSX, sin TypeScript).
- Paleta: `#FACC15` (brand), `#0A0A0A` (ink), `#FFFFFF` (paper).
- Servicio mock `src/services/citasService.js` que resuelve en dev y rechaza en prod.

## Scripts
- `npm run dev` — servidor en `http://127.0.0.1:5173`.
- `npm run build` — bundle de producción en `dist/`.
- `npm run lint` — ESLint sobre `src/`.
- `npm run preview` — sirve `dist/` localmente.

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

## Backend (referencia)
`db/schema.sql` define la tabla `citas` que el endpoint real debe usar.
