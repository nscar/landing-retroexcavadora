// Verifica que el formulario de contacto muestre el Feedback de error cuando
// citasService rechaza. Es un check de integración end-to-end del manejo de
// error del formulario (la parte de UI; el comportamiento del servicio lo
// cubre scripts/verify.cjs).
//
// Cómo funciona: hace un build SSR de FormularioContacto.jsx con Vite,
// inyectando un plugin local que reemplaza ../services/citasService.js por
// un shim que rechaza como en PROD. Después monta el componente en jsdom,
// rellena los campos con valores válidos, dispara el submit del form,
// espera a que la promesa rechazada se asiente en el estado de React, e
// inspecciona el árbol DOM resultante buscando el role="alert" con el
// mensaje de error.
//
// Sale con código 0 si todo encaja, 1 en caso contrario (no imprime nada en
// éxito para no contaminar CI). Pensado para `node scripts/_form_check.mjs`.

import { JSDOM } from 'jsdom';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { rmSync, mkdtempSync } from 'node:fs';
import { build } from 'vite';

// import.meta.url ya viene con espacios URL-encoded (%20); decodeURI los
// restaura para que la ruta resuelva correctamente en disco.
const root = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)), '..');

// El build SSR tiene que estar dentro del proyecto (bajo su root) para que la
// resolución de 'react', 'react-dom' y demás deps siga funcionando.
const tmp = mkdtempSync(path.join(root, '.form-check-'));

const cleanup = () => {
  try {
    rmSync(tmp, { recursive: true, force: true });
  } catch {
    // best-effort: si el rm falla, no contaminamos la salida del script
  }
};

try {
  // NODE_ENV=development es crítico: el build default de Vite es production
  // y React.act() lanza en producción.
  process.env.NODE_ENV = 'development';
  await build({
    root,
    build: {
      ssr: 'src/components/FormularioContacto.jsx',
      outDir: tmp,
      emptyOutDir: true,
      rollupOptions: { output: { format: 'es' } },
    },
    // Plugin local: reemplaza ../services/emailService.js por un shim que
    // rechaza simulando un error de red de EmailJS. El hook transform actúa
    // al final, cuando el módulo ya está inlined en el bundle; ahí
    // reescribimos su código.
    plugins: [
      {
        name: 'email-service-shim',
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

  // Bootstrap jsdom. Node 22 hace globalThis.navigator un getter de sólo
  // lectura, así que usamos defineProperty para sobreescribir sin TypeError.
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
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
  // IS_REACT_ACT_ENVIRONMENT suprime los warnings de React 18 sobre act().
  setGlobal('IS_REACT_ACT_ENVIRONMENT', true);

  const React = (await import('react')).default;
  const { act } = await import('react');
  const { createRoot } = await import('react-dom/client');
  const bundlePath = path.join(tmp, 'FormularioContacto.js');
  const FormMod = await import(pathToFileURL(bundlePath).href);

  const container = window.document.getElementById('root');
  const reactRoot = createRoot(container);
  await act(async () => {
    reactRoot.render(React.createElement(FormMod.FormularioContacto));
  });

  // Estado inicial: NO debe haber role=alert antes del submit.
  const initialAlert = window.document.querySelector('[role="alert"]');

  // Rellenar los campos con valores válidos. Importante: el setter nativo
  // debe invocarse desde el prototype para que React registre el cambio,
  // porque sobrescribe value en el descriptor.
  await act(async () => {
    const setVal = (id, val) => {
      const el = window.document.getElementById(id);
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      ).set;
      setter.call(el, val);
      el.dispatchEvent(new window.Event('input', { bubbles: true }));
    };
    setVal('nombre', 'Ada Lovelace');
    setVal('telefono', '1122334455');
    setVal('fecha', '2026-09-01');
  });

  // Disparar el submit. El handler es async; este act() espera a la porción
  // sincrónica (hasta el primer await). El catch del await crearCita()
  // corre en microtasks posteriores, fuera de act().
  await act(async () => {
    const form = window.document.querySelector('form');
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: false }));
  });

  // Fuera de act: dar tiempo a que la promesa rechazada se asiente y a que
  // React re-renderice con role=alert. Varios macrotasks garantizan que el
  // catch + setEstado + flush de React hayan terminado.
  for (let i = 0; i < 5; i++) {
    await new Promise((r) => setTimeout(r, 0));
  }

  const alertEl = window.document.querySelector('[role="alert"]');
  const submitBtn = window.document.querySelector('button[type="submit"]');
  const findings = {
    initial: {
      alert_present: !!initialAlert,
      form_present: !!window.document.querySelector('form'),
      submit_present: !!submitBtn,
    },
    after_submit: {
      alert_present: !!alertEl,
      alert_text: alertEl ? alertEl.textContent.trim() : null,
      alert_classes: alertEl ? alertEl.className : null,
      alert_role: alertEl ? alertEl.getAttribute('role') : null,
      submit_button_disabled: submitBtn ? submitBtn.disabled : null,
      submit_button_text: submitBtn ? submitBtn.textContent.trim() : null,
    },
  };

  const ok =
    !findings.initial.alert_present &&
    findings.after_submit.alert_present &&
    findings.after_submit.alert_role === 'alert' &&
    typeof findings.after_submit.alert_text === 'string' &&
    findings.after_submit.alert_text.includes('EmailJS: network error') &&
    findings.after_submit.alert_classes.includes('border-danger') &&
    findings.after_submit.submit_button_disabled === false &&
    findings.after_submit.submit_button_text === 'Reservar cita';

  if (!ok) {
    cleanup();
    console.error('Form error-handling check FAILED:');
    console.error(JSON.stringify(findings, null, 2));
    process.exit(1);
  }
  cleanup();
  process.exit(0);
} catch (e) {
  cleanup();
  console.error('Form error-handling check threw:');
  console.error(e);
  process.exit(1);
} finally {
  // Redundante con los cleanup() explícitos arriba, pero garantiza el borrado
  // si process.exit() no llega a invocarse (por ejemplo, si se añade lógica
  // que retorne antes). También cubre rechazos de promesas no manejados.
  cleanup();
}
