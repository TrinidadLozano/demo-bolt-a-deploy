# Deploy: Railway (backend) + Vercel (frontend)

Repo: **https://github.com/TrinidadLozano/demo-bolt-a-deploy**

Todo está en la **raíz** del repo:
- **Frontend (Vite/React):** raíz (index.html, src/, package.json).
- **Backend (Express):** carpeta `backend/`.

---

## 1. Backend en Railway

1. Entra en **railway.app** e inicia sesión (con GitHub si quieres).
2. **New Project** → **Deploy from GitHub repo** → elige **TrinidadLozano/demo-bolt-a-deploy**.
3. Configura el servicio:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install` (o déjalo vacío).
   - **Start Command:** `npm start`
4. **Variables** (pestaña Variables):
   - `DATABASE_URL` = la connection string de **Neon** (la misma que en `backend/.env` en local).
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = déjalo vacío de momento; lo rellenarás después con la URL de Vercel.
5. **Deploy.** Cuando termine, abre el servicio → **Settings** → **Networking** → **Generate Domain**. Copia la URL (ej. `https://xxx.up.railway.app`). **Guárdala:** la usarás como API en Vercel.

---

## 2. Frontend en Vercel

El frontend está en la **raíz** del repo. No hace falta tocar Root Directory.

1. Entra en **vercel.com** e inicia sesión (con GitHub).
2. **Add New** → **Project** → importa **TrinidadLozano/demo-bolt-a-deploy**.
3. Configura:
   - **Root Directory:** déjalo **vacío** (raíz del repo).
   - **Build Command:** `npm run build` (por defecto con Vite).
   - **Output Directory:** `dist`
4. **Environment Variables:**
   - `VITE_API_URL` = **URL del backend en Railway** (ej. `https://xxx.up.railway.app`). Sin barra final.
5. **Deploy.** Cuando termine, copia la URL del proyecto (ej. `https://demo-bolt-a-deploy-xxx.vercel.app`).

---

## 3. Cerrar CORS en el backend

1. En **Railway**, en el proyecto del backend, ve a **Variables**.
2. Añade o edita: `FRONTEND_URL` = **URL de Vercel** (ej. `https://demo-bolt-a-deploy-xxx.vercel.app`).
3. **Redeploy** el backend para que cargue la nueva variable (o espera al siguiente deploy).

---

## 4. Probar

Abre la URL de Vercel en el navegador: deberías ver el Board de Ideas, poder agregar una y verla en la lista (los datos se guardan en Neon vía el backend en Railway).

---

## Resumen de variables

| Dónde   | Variable       | Valor |
|--------|----------------|--------|
| Railway | `DATABASE_URL` | Connection string de Neon |
| Railway | `NODE_ENV`    | `production` |
| Railway | `FRONTEND_URL`| URL de Vercel (ej. https://xxx.vercel.app) |
| Vercel  | `VITE_API_URL`| URL del backend en Railway (ej. https://xxx.up.railway.app) |
