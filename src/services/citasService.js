// Servicio mock de citas.
// DEV: resuelve { ok: true, id: <timestamp> }.
// PROD: rechaza con mensaje claro para forzar el manejo de error en UI.

export function crearCita(payload) {
  if (import.meta.env.PROD) {
    return Promise.reject(
      new Error('citasService: backend no disponible fuera de modo dev')
    );
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true, id: Date.now(), payload }), 250);
  });
}
