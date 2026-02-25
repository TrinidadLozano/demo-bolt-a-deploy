# Deploy del backend en Render

## 1. Conectar el repo

1. Entra en **[render.com](https://render.com)** e inicia sesión (o regístrate con GitHub).
2. **Dashboard** → **New +** → **Blueprint**.
3. Conecta el repo **TrinidadLozano/demo-bolt-a-deploy** (si no está, “Connect account” con GitHub y elige el repo).
4. Render detectará el `render.yaml` en la raíz y creará el servicio **demo-bolt-backend** con `rootDir: backend`.

## 2. Variables de entorno (obligatorias)

En el servicio **demo-bolt-backend** → **Environment** añade:

| Variable         | Valor |
|------------------|--------|
| `DATABASE_URL`   | La connection string de **Neon** (PostgreSQL). |
| `FRONTEND_URL`   | URL del frontend en Vercel, ej. `https://demo-bolt-a-deploy-front.vercel.app` |

`NODE_ENV=production` ya está en el blueprint.

## 3. Deploy

- Guarda los cambios y Render hará el deploy.
- Cuando termine, anota la **URL del servicio** (ej. `https://demo-bolt-backend-xxxx.onrender.com`).

## 4. Frontend (Vercel)

En el proyecto de **Vercel** (demo-bolt-a-deploy-front) añade o actualiza la variable:

- **`VITE_API_URL`** = URL del backend en Render (la que anotaste).

Vuelve a desplegar el frontend en Vercel si hace falta para que use la nueva URL.

## 5. Comprobar

- Backend: `https://tu-backend.onrender.com/health` → `{"ok":true}`.
- Frontend en Vercel: abrir la app, agregar una idea y ver que se guarda y se lista.

---

**Nota:** En plan gratis, Render puede “dormir” el servicio tras inactividad; la primera petición puede tardar unos segundos.
