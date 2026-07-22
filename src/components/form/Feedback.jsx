export function Feedback({ estado }) {
  if (!estado) return null;
  if (estado.tipo === 'success') {
    return (
      <div role="status" className="rounded-md border border-success/30 bg-green-50 p-3 text-sm text-success">
        {estado.mensaje}
      </div>
    );
  }
  if (estado.tipo === 'error') {
    return (
      <div role="alert" className="rounded-md border border-danger/30 bg-red-50 p-3 text-sm text-danger">
        {estado.mensaje}
      </div>
    );
  }
  return null;
}
