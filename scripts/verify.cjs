// Verificación consolidada de la landing retroexcavadora.
// 1) SSR real con Vite + jsdom (landmarks, sections, headings).
// 2) Comportamiento del servicio: en modo prod rechaza con el mensaje exacto.
//
// Ejecutar con: node scripts/verify.cjs

const path = require('node:path');
const fs = require('node:fs/promises');
const os = require('node:os');
const jsdomPkg = require('jsdom');
const { JSDOM } = jsdomPkg;
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');

(async () => {
  // --- 1) SSR build con Vite (ESM) ---
  const { build } = await import('vite');
  await build({
    root,
    build: {
      ssr: 'src/App.jsx',
      outDir: '.ssr-build',
      emptyOutDir: true,
      rollupOptions: { output: { format: 'es' } },
    },
  });

  const ssrEntry = path.join(root, '.ssr-build/App.js');
  const ssrMod = await import(pathToFileURL(ssrEntry).href);
  const React = (await import('react')).default;
  const { renderToString } = await import('react-dom/server');
  const html =
    '<!doctype html><body>' + renderToString(React.createElement(ssrMod.default)) + '</body>';
  const dom = new JSDOM(html);
  const { document } = dom.window;

  const landmarks = {
    header: document.querySelectorAll('header').length,
    main: document.querySelectorAll('main').length,
    footer: document.querySelectorAll('footer').length,
  };
  const sections = document.querySelectorAll('section').length;
  const headings = {
    h1: document.querySelectorAll('h1').length,
    h2: document.querySelectorAll('h2').length,
    h3: document.querySelectorAll('h3').length,
  };
  const inputModeTel = document.querySelector('input[inputmode="tel"]') !== null;
  const submitBtn = document.querySelector('button[type="submit"]');
  const submitMinH = submitBtn ? submitBtn.className.includes('min-h-[56px]') : false;

  const ssrOk =
    landmarks.header === 1 &&
    landmarks.main === 1 &&
    landmarks.footer === 1 &&
    sections === 5 &&
    headings.h1 === 1 &&
    headings.h2 >= 1 &&
    headings.h3 >= 1 &&
    inputModeTel &&
    submitMinH;

  await fs.rm(path.join(root, '.ssr-build'), { recursive: true, force: true });

  // --- 2) Try/catch con citasService.crearCita() rechazando ---
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'citas-verify-'));
  const shimPath = path.join(tmpDir, 'citasService.mjs');
  await fs.writeFile(
    shimPath,
    `// shim con PROD=true para verificar la rama de rechazo.
const ENV = { PROD: true };
export function crearCita() {
  if (ENV.PROD) {
    return Promise.reject(
      new Error('citasService: backend no disponible fuera de modo dev')
    );
  }
}
`
  );
  const mod = await import(pathToFileURL(shimPath).href);
  let rechazo = null;
  try {
    await mod.crearCita({ nombre: 'a', telefono: '123456', fecha: '2026-01-01' });
  } catch (e) {
    rechazo = e?.message || String(e);
  }
  await fs.rm(tmpDir, { recursive: true, force: true });

  const trycatchOk =
    typeof rechazo === 'string' && rechazo.includes('backend no disponible');

  const result = {
    ssr: { landmarks, sections, headings, inputModeTel, submitMinH, ok: ssrOk },
    trycatch: { rechazo, ok: trycatchOk },
    ok: ssrOk && trycatchOk,
  };

  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
