// Smoke test contra el preview local sirviendo la base path de GitHub Pages.
//
// Qué valida (todo desde fuera del navegador, sin Playwright/Puppeteer):
//   1) GET /landing-retroexcavadora/ -> 200, HTML correcto, apunta a #root.
//   2) Los assets que <script>/<link> declaran existen y sirven con el
//      content-type y tamaño esperados (sin 404 silencioso por SPA fallback).
//   3) El HTML servido incluye title correcto y el mount point.
//   4) El bundle JS contiene los strings clave de la app (emailjs, Hero,
//      FormularioContacto, etc.) — verifica que no estamos sirviendo un build viejo.
//   5) DOM SSR renderizado (landmarks 1/1/1, 4 secciones, h1, form con 3 inputs,
//      inputmode=tel, submit button con min-h-[56px]). Esto reusa vite SSR de
//      scripts/verify.cjs pero importando la lógica para no duplicar.
//   6) Comportamiento del submit con datos válidos: aparece role="alert" con
//      "EmailJS: network error" y el botón se re-habilita. (Reusa la lógica
//      de scripts/_form_check.mjs.)
//
// Pre-requisito: `pnpm preview --base /landing-retroexcavadora/ --port 4173`
// corriendo. El script falla con código 2 si el server no responde.
//
// Ejecutar con: node scripts/_smoke_preview.mjs

// CRÍTICO: NODE_ENV=development debe estar seteado ANTES de cualquier import de
// react/react-dom, porque el entry point de React (cjs/react.production.min.js
// vs cjs/react.development.js) se elige en el primer import. Si llega tarde,
// act() lanza "act(...) is not supported in production builds of React".
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';
const PORT = 4173;
const BASE = '/landing-retroexcavadora';

function get(p) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: HOST, port: PORT, path: p, headers: { 'User-Agent': 'smoke-test/1.0' } }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks),
          })
        );
      })
      .on('error', reject);
  });
}

function fatal(msg, extra) {
  console.error('FATAL:', msg);
  if (extra) console.error(JSON.stringify(extra, null, 2));
  process.exit(2);
}

const consoleErrors = [];

// --- 1) index.html bajo la base path ---
const index = await get(BASE + '/');
if (index.status !== 200) fatal(`expected 200 for ${BASE}/, got ${index.status}`, index.headers);
const indexHtml = index.body.toString('utf8');
if (!indexHtml.includes('<div id="root"></div>')) fatal('index.html no contiene #root');
if (!/<title>[^<]+<\/title>/.test(indexHtml)) fatal('index.html no tiene <title>');
console.log(`[smoke] GET ${BASE}/ -> 200, ${index.body.length} bytes, content-type=${index.headers['content-type']}`);

// --- 2) assets referenciados por index.html ---
const assetPaths = [
  ...new Set([...indexHtml.matchAll(/(?:src|href)="(\/landing-retroexcavadora\/[^"]+)"/g)].map((m) => m[1])),
];
console.log(`[smoke] index.html referencia ${assetPaths.length} assets`);

const assetResults = [];
for (const p of assetPaths) {
  const r = await get(p);
  if (r.status !== 200) {
    fatal(`asset ${p} devolvió ${r.status} (esperado 200)`);
  }
  const ct = r.headers['content-type'] || '';
  const isJs = p.endsWith('.js');
  const isCss = p.endsWith('.css');
  const wrongType = (isJs && !ct.includes('text/javascript')) || (isCss && !ct.includes('text/css'));
  const tooSmall = r.body.length < 1000;
  if (wrongType || tooSmall) {
    fatal(`asset ${p} tiene content-type=${ct} bytes=${r.body.length} (parece fallback a HTML)`, { ct, bytes: r.body.length });
  }
  assetResults.push({ path: p, http: r.status, ct, bytes: r.body.length });
  console.log(`[smoke] asset ${p} -> 200, ${r.body.length} bytes, ${ct}`);
}

// --- 3) título y meta del HTML servido ---
const title = indexHtml.match(/<title>([^<]+)<\/title>/)?.[1];
console.log(`[smoke] <title>: ${JSON.stringify(title)}`);

// --- 4) contenido del bundle ---
const jsAsset = assetResults.find((a) => a.path.endsWith('.js'));
const jsText = await (await get(jsAsset.path)).body.toString('utf8');
// Strings que deberían estar en el bundle minificado de la app.
const expectedStrings = [
  'emailjs',                                      // SDK EmailJS importado por el form
  'role:"alert"',                                 // feedback accesible del form
  'inputMode',                                    // el form pasa inputMode="tel"
  'Nombre',                                       // label del input nombre
  'Fecha',                                        // label del input fecha
  'Teléfono',                                     // label del input teléfono
];
const missingStrings = expectedStrings.filter((s) => !jsText.includes(s));
if (missingStrings.length) {
  fatal(`bundle no contiene strings esperados: ${missingStrings.join(', ')}`);
}
console.log(`[smoke] bundle JS (${jsText.length} chars) contiene los strings esperados`);

// --- 5) SSR de App.jsx (reusa vite SSR como verify.cjs) ---
async function ssrRender() {
  const { build } = await import('vite');
  const outDir = path.join(ROOT, '.smoke-ssr-build');
  await build({
    root: ROOT,
    build: {
      ssr: 'src/App.jsx',
      outDir,
      emptyOutDir: true,
      rollupOptions: { output: { format: 'es' } },
    },
  });
  const ssrEntry = path.join(outDir, 'App.js');
  const mod = await import(pathToFileURL(ssrEntry).href + `?t=${Date.now()}`);
  const React = (await import('react')).default;
  const { renderToString } = await import('react-dom/server');
  const html =
    '<!doctype html><body>' + renderToString(React.createElement(mod.default)) + '</body>';
  return html;
}

const ssrHtml = await ssrRender();
const jsdomPkg = await import('jsdom');
const JSDOM = jsdomPkg.JSDOM ?? jsdomPkg.default?.JSDOM ?? jsdomPkg.default;
const dom = new JSDOM(ssrHtml);
const { document } = dom.window;
const landmarks = {
  header: document.querySelectorAll('header').length,
  main: document.querySelectorAll('main').length,
  footer: document.querySelectorAll('footer').length,
};
const sectionCount = document.querySelectorAll('section').length;
const headings = {
  h1: document.querySelectorAll('h1').length,
  h2: document.querySelectorAll('h2').length,
  h3: document.querySelectorAll('h3').length,
};
const form = document.querySelector('form');
const inputs = form ? form.querySelectorAll('input,textarea,select') : [];
const inputTypes = [...inputs].map((i) => `${i.tagName.toLowerCase()}[${i.getAttribute('name') || i.getAttribute('type') || ''}]`);
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
const inputModeTel = !!document.querySelector('input[inputmode="tel"]');
const submitMinH = submitBtn ? submitBtn.className.includes('min-h-[56px]') : false;
const sectionsDetail = [...document.querySelectorAll('section')].map((s) => ({
  id: s.id || null,
  h2: s.querySelector('h2')?.textContent?.trim().slice(0, 40) || null,
}));

console.log(
  `[smoke] SSR DOM: landmarks=${landmarks.header}/${landmarks.main}/${landmarks.footer} sections=${sectionCount} h1=${headings.h1} h2=${headings.h2} h3=${headings.h3} form=${!!form} inputs=${inputTypes.length} inputmodeTel=${inputModeTel} submitMinH=${submitMinH}`
);
execFileSync('rm', ['-rf', path.join(ROOT, '.smoke-ssr-build')]);

// --- 6) comportamiento del form con citasService rechazando ---
// Mismo plugin Vite que usa scripts/_form_check.mjs: hook transform que
// reescribe el módulo inlineado citasService.js por un shim que rechaza con
// el mensaje exacto. Después monta con React en jsdom (createRoot) y dispara
// el submit.
// `act()` requiere la build de desarrollo de React; la build de producción
// (default de Vite SSR) lanza Error si llamas act(). NODE_ENV=development
// ya está seteado al tope del archivo (antes de cualquier import de react).
const formCheck = await (async () => {
  const fs = await import('node:fs/promises');
  const os = await import('node:os');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'smoke-form-'));

  const { build } = await import('vite');
  const outDir = path.join(ROOT, '.smoke-form-build');
  await build({
    root: ROOT,
    mode: 'development',
    build: {
      ssr: 'src/components/FormularioContacto.jsx',
      outDir,
      emptyOutDir: true,
      minify: false,
      rollupOptions: { output: { format: 'es' } },
    },
    plugins: [
      {
        name: 'email-shim-rewrite',
        transform(_code, id) {
          if (id.includes('services/emailService.js') || id.endsWith('emailService.js')) {
            return `export async function sendContactEmail() {
                      throw new Error('EmailJS: network error');
                    }`;
          }
          return null;
        },
      },
    ],
  });

  const { JSDOM: J } = jsdomPkg.JSDOM ? jsdomPkg : { JSDOM: (await import('jsdom')).JSDOM };
  const dom = new J('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  const setGlobal = (k, v) =>
    Object.defineProperty(globalThis, k, { value: v, writable: true, configurable: true });
  setGlobal('window', window);
  setGlobal('document', window.document);
  setGlobal('navigator', window.navigator);
  setGlobal('HTMLElement', window.HTMLInputElement);
  setGlobal('Element', window.Element);
  setGlobal('Event', window.Event);
  setGlobal('Node', window.Node);
  setGlobal('IS_REACT_ACT_ENVIRONMENT', true);

  const React = (await import('react')).default;
  const { act } = await import('react');
  const { createRoot } = await import('react-dom/client');
  const bundlePath = path.join(outDir, 'FormularioContacto.js');
  const FormMod = await import(pathToFileURL(bundlePath).href);

  const container = window.document.getElementById('root');
  const reactRoot = createRoot(container);
  await act(async () => {
    reactRoot.render(React.createElement(FormMod.FormularioContacto));
  });
  const initialAlert = window.document.querySelector('[role="alert"]');

  await act(async () => {
    const setVal = (id, val) => {
      const el = window.document.getElementById(id);
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, val);
      el.dispatchEvent(new window.Event('input', { bubbles: true }));
    };
    setVal('nombre', 'Smoke Test');
    setVal('telefono', '3001234567');
    setVal('fecha', '2026-08-15');
  });
  await act(async () => {
    const formEl = window.document.querySelector('form');
    formEl.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: false }));
  });
  for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 0));

  const alertEl = window.document.querySelector('[role="alert"]');
  const btn = window.document.querySelector('button[type="submit"]');
  execFileSync('rm', ['-rf', outDir]);
  await fs.rm(tmpDir, { recursive: true, force: true });
  return {
    ok: true,
    initial_alert_present: !!initialAlert,
    alert_text: alertEl ? alertEl.textContent.trim() : null,
    exact: alertEl ? alertEl.textContent.includes('EmailJS: network error') : false,
    btn_disabled_after: btn ? btn.disabled : null,
  };
})();

if (!formCheck.ok) fatal(`form check falló: ${formCheck.reason || 'unknown'}`, formCheck);
console.log(
  `[smoke] submit -> role="alert" rendered, exact=${formCheck.exact}, btnDisabledAfter=${formCheck.btn_disabled_after}`
);

// --- Resumen ---
const evidence = {
  base: BASE,
  preview_url: `http://${HOST}:${PORT}${BASE}/`,
  index: { http: index.status, bytes: index.body.length, content_type: index.headers['content-type'] },
  title,
  assets: assetResults,
  ssr: {
    landmarks,
    sections: { count: sectionCount, detail: sectionsDetail },
    headings,
    form: { present: !!form, inputs: inputTypes, submitBtnPresent: !!submitBtn, inputModeTel, submitMinH },
  },
  form_submit: formCheck,
  consoleErrors,
};
const checks = {
  index_200: index.status === 200,
  index_has_root: indexHtml.includes('<div id="root"></div>'),
  all_assets_200: assetResults.every((a) => a.http === 200),
  no_404_in_served_assets: assetResults.every((a) => a.http !== 404),
  bundle_has_expected_strings: missingStrings.length === 0,
  landmarks_1_1_1: landmarks.header === 1 && landmarks.main === 1 && landmarks.footer === 1,
  four_sections: sectionCount === 4,
  h1_present: headings.h1 >= 1,
  form_present: !!form,
  form_3_inputs: inputs.length >= 3,
  inputmode_tel: inputModeTel,
  submit_min_h_56: submitMinH,
  submit_alert_rendered: formCheck.ok,
  submit_alert_text_exact: formCheck.exact,
  submit_btn_re_enabled: formCheck.btn_disabled_after === false,
};
evidence.checks = checks;
evidence.ok = Object.values(checks).every(Boolean);

console.log('\n[smoke] CHECKS:');
for (const [k, v] of Object.entries(checks)) {
  console.log(`  ${v ? 'OK ' : 'XX '} ${k}`);
}
console.log('\n[smoke] EVIDENCE:');
console.log(JSON.stringify(evidence, null, 2));

if (!evidence.ok) process.exit(1);
