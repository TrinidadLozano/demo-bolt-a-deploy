import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import ideasRouter from './routes/ideas.js';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/ideas', ideasRouter);

app.get('/', (_, res) => {
  res.json({ message: 'API del Gestor de Ideas. Usa GET/POST /ideas y GET /health. La app está en http://localhost:5173' });
});

app.get('/health', (_, res) => {
  res.json({ ok: true });
});

app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ideas (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        titulo text NOT NULL,
        descripcion text NOT NULL,
        estado text NOT NULL CHECK (estado IN ('pendiente', 'en progreso', 'hecha')),
        created_at timestamptz DEFAULT now()
      )
    `);
    console.log(`Server running on http://localhost:${PORT} (DB connected)`);
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
});
