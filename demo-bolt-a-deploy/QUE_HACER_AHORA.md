# Qué hacer ahora (Bolt a Deploy)

Ya trajiste el código de Bolt y se añadió un **backend Node/Express** que usa **Neon** (PostgreSQL). El frontend llama a ese backend.

---

## 1. Base de datos (Neon)

1. Entra a [neon.tech](https://neon.tech), crea un proyecto y una base de datos.
2. Copia la **connection string** (Connection string en el dashboard).
3. En Neon → pestaña **SQL Editor**, ejecuta el contenido del archivo `backend/sql/ideas.sql` (crea la tabla `ideas`).

---

## 2. Backend (local)

```bash
cd demo-bolt-a-deploy/backend
cp .env.example .env
```

Abre `.env` y pega la connection string de Neon:

```
DATABASE_URL=postgres://...tu_url_de_neon...
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Luego:

```bash
npm install
npm run dev
```

Deberías ver algo como: `Server running on http://localhost:5000 (DB connected)`.

---

## 3. Frontend (local)

En **otra terminal**, en la raíz del proyecto (no dentro de `backend`):

```bash
cd demo-bolt-a-deploy
cp .env.example .env
```

En `.env` deja:

```
VITE_API_URL=http://localhost:5000
```

Luego:

```bash
npm install
npm run dev
```

Abre la URL que indique Vite (p. ej. http://localhost:5173) y prueba agregar y listar ideas.

---

## 4. Git / GitHub (si falta)

```bash
cd demo-bolt-a-deploy
git add .
git commit -m "Add Express backend + Neon, frontend uses API"
git push origin main
```

---

## 5. Deploy (producción)

- **Railway:** Conecta el repo, root = `backend`, variables `DATABASE_URL`, `NODE_ENV=production`, `FRONTEND_URL` (URL de Vercel). Anota la URL del backend.
- **Vercel:** Conecta el repo, root = `.`, variable `VITE_API_URL` = URL del backend en Railway.
- Actualiza `FRONTEND_URL` en Railway con la URL de Vercel y redeploya si hace falta.

Detalle en [README.md](README.md) y [PASOS_DEMO_BOLT_A_DEPLOY.md](../PASOS_DEMO_BOLT_A_DEPLOY.md).
