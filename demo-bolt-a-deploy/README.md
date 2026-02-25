# Demo: Bolt → Cursor → Deploy

Proyecto de ejemplo **Board de Ideas** (Gestor de Ideas) para demostrar el flujo completo: construcción en Bolt, exportación, transición en Cursor y deploy.

## Stack

- **Frontend:** React + Vite + Tailwind (en la raíz). Llama al backend con `VITE_API_URL`.
- **Backend:** Node.js + Express en `backend/`. API en `/ideas` (GET, POST). Conexión a PostgreSQL con `DATABASE_URL`.
- **Base de datos:** PostgreSQL en **Neon**. Tabla `ideas` (crear con el SQL en `backend/sql/ideas.sql`).
- **Deploy:** Frontend → **Vercel**. Backend → **Railway**. DB → **Neon**.

## Estructura

```
demo-bolt-a-deploy/
├── src/                 # Frontend React (Vite)
├── backend/             # API Express (Node)
│   ├── src/
│   │   ├── index.js     # Servidor + CORS
│   │   ├── db.js        # Pool PostgreSQL
│   │   └── routes/ideas.js
│   ├── sql/ideas.sql    # Script para crear tabla en Neon
│   ├── .env.example
│   └── package.json
├── .env.example         # VITE_API_URL (frontend)
├── GUIA_FLUJO_BOLT_CURSOR_DEPLOY.md
└── README.md
```

## Cómo correr en local

### 1. Base de datos (Neon)

1. Crea un proyecto en [neon.tech](https://neon.tech) y copia la **connection string**.
2. En Neon → SQL Editor, ejecuta el contenido de `backend/sql/ideas.sql`.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edita .env y pega DATABASE_URL de Neon
npm install
npm run dev
```

El servidor quedará en `http://localhost:5000`. Comprueba con `curl http://localhost:5000/health`.

### 3. Frontend

En la **raíz** del repo (no dentro de backend):

```bash
cp .env.example .env
# .env debe tener: VITE_API_URL=http://localhost:5000
npm install
npm run dev
```

Abre la URL de Vite (p. ej. http://localhost:5173) y prueba agregar/listar ideas.

## Deploy

- **Backend:** Railway. Root directory = `backend`. Variables: `DATABASE_URL` (Neon), `NODE_ENV=production`, `FRONTEND_URL` = URL de Vercel.
- **Frontend:** Vercel. Root directory = `.` (raíz). Variable: `VITE_API_URL` = URL del backend en Railway.
- Después del deploy, actualiza `FRONTEND_URL` en Railway y `VITE_API_URL` en Vercel con las URLs reales.

Referencia completa: [PASOS_DEMO_BOLT_A_DEPLOY.md](../PASOS_DEMO_BOLT_A_DEPLOY.md) y [GUIA_FLUJO_BOLT_CURSOR_DEPLOY.md](GUIA_FLUJO_BOLT_CURSOR_DEPLOY.md).
