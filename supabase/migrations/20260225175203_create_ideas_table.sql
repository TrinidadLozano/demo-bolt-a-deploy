/*
  # Create ideas table

  1. New Tables
    - `ideas`
      - `id` (uuid, primary key) - Unique identifier for each idea
      - `titulo` (text, required) - Title of the idea
      - `descripcion` (text, required) - Description of the idea
      - `estado` (text, required) - Status of the idea (pendiente | en progreso | hecha)
      - `created_at` (timestamptz) - Timestamp when the idea was created
  
  2. Security
    - Enable RLS on `ideas` table
    - Add policy for anyone to read all ideas
    - Add policy for anyone to insert new ideas
    - Add policy for anyone to update ideas
    - Add policy for anyone to delete ideas
  
  3. Constraints
    - Estado must be one of: 'pendiente', 'en progreso', 'hecha'
*/

CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text NOT NULL,
  estado text NOT NULL CHECK (estado IN ('pendiente', 'en progreso', 'hecha')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ideas"
  ON ideas FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert ideas"
  ON ideas FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update ideas"
  ON ideas FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete ideas"
  ON ideas FOR DELETE
  TO anon, authenticated
  USING (true);