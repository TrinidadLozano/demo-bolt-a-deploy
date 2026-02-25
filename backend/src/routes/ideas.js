import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, titulo, descripcion, estado, created_at FROM ideas ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body;
    if (!titulo || !descripcion || !estado) {
      return res.status(400).json({
        error: 'Missing required fields: titulo, descripcion, estado',
      });
    }
    const validEstados = ['pendiente', 'en progreso', 'hecha'];
    if (!validEstados.includes(estado)) {
      return res.status(400).json({
        error: 'estado must be one of: pendiente, en progreso, hecha',
      });
    }
    const { rows } = await pool.query(
      `INSERT INTO ideas (titulo, descripcion, estado)
       VALUES ($1, $2, $3)
       RETURNING id, titulo, descripcion, estado, created_at`,
      [titulo, descripcion, estado]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
