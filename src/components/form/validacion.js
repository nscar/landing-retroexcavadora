// Validación mínima cliente para los 3 campos del formulario.
// Devuelve { ok, errores } donde errores es un mapa campo->mensaje.

const SOLO_TEL = /^[0-9+\s()-]{6,30}$/;

export function validarCita({ nombre, telefono, fecha }) {
  const errores = {};
  if (!nombre || nombre.trim().length < 2) {
    errores.nombre = 'Ingresa tu nombre (mínimo 2 caracteres).';
  } else if (nombre.length > 120) {
    errores.nombre = 'El nombre no puede superar los 120 caracteres.';
  }
  if (!telefono || !SOLO_TEL.test(telefono.trim())) {
    errores.telefono = 'Ingresa un teléfono válido.';
  } else if (telefono.length > 30) {
    errores.telefono = 'El teléfono no puede superar los 30 caracteres.';
  }
  if (!fecha) {
    errores.fecha = 'Elige una fecha para la cita.';
  }
  return { ok: Object.keys(errores).length === 0, errores };
}
