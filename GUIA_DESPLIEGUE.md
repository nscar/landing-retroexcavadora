# Guía de despliegue — landing-retroexcavadora

Esta guía explica cómo publicar la landing en GitHub Pages. Cubre los dos métodos soportados (rama `gh-pages` con el paquete `gh-pages` o GitHub Actions), los prerrequisitos y los problemas más habituales.

La landing es una Single Page App estática construida con Vite 5 + React 18 + Tailwind 3. No necesita servidor: solo servir `dist/`.

---

## 1. Prerrequisitos

| Herramienta | Versión recomendada | Verificación |
|-------------|---------------------|--------------|
| Node.js     | >= 20 LTS           | `node -v`    |
| pnpm        | >= 9                | `pnpm -v`    |
| git         | >= 2.40             | `git --version` |
| gh CLI      | >= 2.50             | `gh --version` (opcional, facilita crear el repo) |
| Cuenta GitHub | con Pages habilitado | https://github.com/settings/pages |

> Nota: el proyecto usa `pnpm` como gestor de paquetes (hay `pnpm-lock.yaml` y `pnpm-workspace.yaml`). Mantén pnpm en lugar de npm para no regenerar el lockfile.

### Instalar dependencias

```bash
pnpm install
```

---

## 2. Trabajar en local

```bash
# Servidor de desarrollo con HMR en http://127.0.0.1:5173
pnpm run dev

# Lint sobre src/
pnpm run lint

# Build de producción en dist/
pnpm run build

# Servir dist/ localmente para verificar el build
pnpm run preview
```

Smoke test automatizado (landmarks, secciones, headings y try/catch del servicio):

```bash
node scripts/verify.cjs
```

Debe imprimir `{ ok: true }`.

---

## 3. Crear el repositorio en GitHub (si todavía no existe)

Si el repo aún no está en GitHub, créalo con `gh` (más rápido) o desde la web.

Con `gh` CLI:

```bash
gh repo create landing-retroexcavadora --public --source=. --remote=origin --push
```

> El nombre del repo (`landing-retroexcavadora` en este ejemplo) define la subruta donde GitHub Pages servirá la página. Anótalo: lo necesitas en el paso 4.

Con la web:

1. Crea el repo en https://github.com/new con el mismo nombre.
2. Súbelo:
   ```bash
   git remote add origin git@github.com:<usuario>/landing-retroexcavadora.git
   git push -u origin main
   ```

---

## 4. Configurar el `base` path de Vite

GitHub Pages sirve los proyectos de usuario bajo `https://<usuario>.github.io/<repo>/`. Como la landing se carga desde una subruta, hay que ajustar `vite.config.js` para que las rutas de los assets generados apunten a esa subruta.

Edita `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/landing-retroexcavadora/',  // <-- nombre del repo en GitHub
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
});
```

Si el repo se llama distinto, cambia la cadena `'/landing-retroexcavadora/'` por `'/<tu-repo>/'`.

> Si más adelante usas un dominio propio (`www.example.com`), cambia el `base` por `'/'`.

Verifica que el build genera rutas con la subruta:

```bash
pnpm run build
grep -o '"/landing-retroexcavadora/assets/[^"]*"' dist/index.html | head
```

Debes ver referencias a `/landing-retroexcavadora/assets/...`.

---

## 5. Elegir método de deploy

Tienes dos opciones. Elige una.

### Opción A — Rama `gh-pages` con el paquete `gh-pages` (simple)

1. Instala la dependencia de desarrollo:
   ```bash
   pnpm add -D gh-pages
   ```

2. Añade los scripts `predeploy` y `deploy` a `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "pnpm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Asegúrate de tener permiso de escritura sobre el repo y ejecuta:
   ```bash
   pnpm run deploy
   ```
   El script crea (o actualiza) la rama `gh-pages` con el contenido de `dist/` y la sube al remoto.

4. Activa Pages desde la rama `gh-pages`:
   - Ve a `https://github.com/<usuario>/landing-retroexcavadora/settings/pages`.
   - En **Source**, elige `Deploy from a branch`.
   - En **Branch**, selecciona `gh-pages` y la carpeta `/ (root)`.
   - Guarda. La URL pública aparece en pocos minutos:
     `https://<usuario>.github.io/landing-retroexcavadora/`.

### Opción B — GitHub Actions (recomendado para CI)

1. Crea el workflow en `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: pages
     cancel-in-progress: true

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v4
           with:
             version: 9
         - uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: pnpm
         - run: pnpm install --frozen-lockfile
         - run: pnpm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: dist

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

2. Activa Pages desde GitHub Actions:
   - `Settings → Pages → Source → GitHub Actions`.

3. Empuja a `main`. El workflow construye y publica solo. URL pública:
   `https://<usuario>.github.io/landing-retroexcavadora/`.

> En la primera ejecución, GitHub puede pedirte confirmación para permitir el deploy desde Actions. Acepta y re-ejecuta el workflow si queda en cola.

---

## 6. Verificación post-despliegue

1. Abre la URL pública en el navegador. Debe cargar sin errores en la consola.
2. Recorre las secciones: Hero, Precio, Beneficios, Formulario, Footer.
3. Envía el formulario con datos válidos. Como `src/services/citasService.js` rechaza en producción (no hay backend), la UI debe mostrar el mensaje de error configurado, no un crash.
4. Abre DevTools → Network y comprueba que los assets (CSS, JS, imágenes) cargan con `200` desde la subruta `/landing-retroexcavadora/assets/...`.
5. Lanza el smoke test local contra la build de producción:
   ```bash
   pnpm run build
   node scripts/verify.cjs
   ```

---

## 7. Troubleshooting

### 404 en CSS o JS al abrir la página publicada
- El `base` de `vite.config.js` no coincide con el nombre real del repo.
- Solución: ajusta `base: '/<nombre-real-del-repo>/'`, vuelve a buildear y redespliega.

### La página carga pero el CSS no se aplica
- Mismo problema, pero más sutil: el HTML referencia `/assets/...` cuando debería ser `/<repo>/assets/...`.
- Solución: confirma que `dist/index.html` contiene la subruta correcta (`grep base dist/index.html`).

### `citasService` rechaza con "backend no disponible"
- Es el comportamiento esperado en producción. La UI ya muestra un mensaje de error.
- Cuando exista el endpoint real `POST /api/citas`, ajusta `src/services/citasService.js` para que apunte a la URL del backend (por ejemplo, una Cloud Function o un endpoint en Cloudflare Workers).

### El workflow de GitHub Actions queda pendiente
- Revisa `Settings → Pages` y comprueba que **Source** está en `GitHub Actions`.
- Revisa la pestaña **Actions** del repo: el log suele indicar la causa (permisos, `pnpm install` fallando, etc.).

### `pnpm run deploy` falla con "permission denied"
- Asegúrate de tener `push` sobre el repo (tu SSH key o tu token de `gh` están configurados).
- Si usas HTTPS con 2FA, configura un Personal Access Token con scope `repo`.

### La rama `gh-pages` se queda desincronizada
- Ejecuta `pnpm run deploy` de nuevo: el script `predeploy` regenera `dist/` desde cero.
- Si persiste, fuerza un push limpio: `git push origin --delete gh-pages && pnpm run deploy`.

### Quiero usar dominio propio (`www.miempresa.com`)
- En `vite.config.js` cambia `base: '/'`.
- Apunta el CNAME de tu DNS a `<usuario>.github.io`.
- En `Settings → Pages → Custom domain` introduce el dominio y guarda.

---

## 8. Resumen rápido (TL;DR)

```bash
# 1. Clonar
git clone git@github.com:<usuario>/landing-retroexcavadora.git
cd landing-retroexcavadora
pnpm install

# 2. Ajustar base path en vite.config.js
#    base: '/landing-retroexcavadora/'

# 3. Build
pnpm run build
node scripts/verify.cjs

# 4. Deploy (opción A con gh-pages)
pnpm add -D gh-pages
# añadir predeploy/deploy a package.json
pnpm run deploy

#    o (opción B con Actions)
#    crear .github/workflows/deploy.yml, push a main
```

URL pública esperada: `https://<usuario>.github.io/landing-retroexcavadora/`.
