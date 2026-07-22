-- Schema de la tabla de citas.
-- Backend real: cuando se implemente el endpoint POST /api/citas, debe persistir
-- usando esta estructura. La columna 'fecha' representa la fecha solicitada
-- por el cliente (no la de creación).

CREATE TABLE IF NOT EXISTS citas (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  telefono    VARCHAR(30)  NOT NULL,
  fecha       TIMESTAMP    NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas (fecha);
