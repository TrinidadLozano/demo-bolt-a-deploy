-- Ejecutar en Neon (SQL Editor) para crear la tabla ideas
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text NOT NULL,
  estado text NOT NULL CHECK (estado IN ('pendiente', 'en progreso', 'hecha')),
  created_at timestamptz DEFAULT now()
);
