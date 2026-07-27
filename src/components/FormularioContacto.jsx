import { useState } from 'react';
import { Campo } from './form/Campo.jsx';
import { SubmitButton } from './form/SubmitButton.jsx';
import { Feedback } from './form/Feedback.jsx';
import { validarCita } from './form/validacion.js';
import { sendContactEmail } from '../services/emailService.js';
import { SectionHeader } from './ui/SectionHeader.jsx';

const HOY = new Date().toISOString().slice(0, 10);

export function FormularioContacto() {
  const [valores, setValores] = useState({ nombre: '', telefono: '', fecha: '' });
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setValores((v) => ({ ...v, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setEstado(null);
    const { ok, errores: errs } = validarCita(valores);
    setErrores(errs);
    if (!ok) return;

    setEnviando(true);
    try {
      await sendContactEmail({
        name: valores.nombre,
        phone: valores.telefono,
        date: valores.fecha,
      });
      setEstado({ tipo: 'success', mensaje: '¡Listo! Tu mensaje fue enviado. Te contactaremos pronto.' });
      setValores({ nombre: '', telefono: '', fecha: '' });
    } catch (err) {
      setEstado({
        tipo: 'error',
        mensaje: err?.message || 'Error inesperado. Intenta de nuevo en unos minutos.',
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="bg-brand-paper py-16 sm:py-20"
    >
      <div className="mx-auto max-w-xl px-6">
        <SectionHeader
          kicker="Reserva"
          title="Formulario de contacto"
          subtitle="Te respondemos en el día para confirmar disponibilidad."
          id="contacto-title"
        />
        <form noValidate onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <Campo
            id="nombre"
            name="nombre"
            label="Nombre y apellido"
            autoComplete="name"
            value={valores.nombre}
            onChange={onChange}
            error={errores.nombre}
            required
          />
          <Campo
            id="telefono"
            name="telefono"
            label="Teléfono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={valores.telefono}
            onChange={onChange}
            error={errores.telefono}
            required
          />
          <Campo
            id="fecha"
            name="fecha"
            label="Fecha de la cita"
            type="date"
            autoComplete="off"
            value={valores.fecha}
            onChange={onChange}
            error={errores.fecha}
            min={HOY}
            required
          />
          <Feedback estado={estado} />
          <SubmitButton disabled={enviando}>
            {enviando ? 'Enviando…' : 'Reservar cita'}
          </SubmitButton>
        </form>
      </div>
    </section>
  );
}
