# Pasos concretos: Demo Bolt → Cursor → Deploy

Proyecto demo: **Board de Ideas** (una tabla `ideas`, listado + formulario para crear).

**Stack elegido (más conveniente para el demo):** Base de datos → **Neon**. Backend API → **Railway**. Frontend → **Vercel**.

---

## FASE 0 – Preparación (Cursor)

1. Crear carpeta `demo-bolt-a-deploy` en el workspace.
2. Crear `demo-bolt-a-deploy/GUIA_FLUJO_BOLT_CURSOR_DEPLOY.md` con secciones: Introducción, Fase 1 Bolt, Fase 2 Exportar, Fase 3 Cursor, Fase 4 Deploy, Resumen.
3. Crear reglas de Cursor para el proyecto: en `demo-bolt-a-deploy/.cursor/rules/` añadir una regla (ej. `transicion-bolt.mdc`) que exija: usar siempre variables de entorno para `DATABASE_URL` y `VITE_API_URL`, no hardcodear URLs ni credenciales, mantener estructura `frontend/` y `backend/` separadas.

---

## FASE 1 – Construir en Bolt (tú)

1. Entra a Bolt, crea proyecto nuevo.
2. Pega este prompt:
   ```
   Create a full-stack app: React frontend (Vite), Node.js + Express backend, PostgreSQL. One table "ideas" with columns: titulo (text), descripcion (text), estado (text: pendiente | en progreso | hecha). REST API with controllers, routes, services. One page: list all ideas and a form to add new idea. Clean folder separation frontend/backend.
   ```
3. En Bolt: crea pantalla de listado y formulario para agregar idea. Prueba que funcione.
4. En Bolt: Export / Download y descarga el ZIP del proyecto.

---

## FASE 2 – Exportar y traer aquí (tú)

1. Descomprime el ZIP.
2. Copia todo dentro de `Trabajo_Independiente/demo-bolt-a-deploy/`.
3. Si no hay `frontend/` y `backend/` separados, créalos y mueve los archivos (React/Vite → frontend, Node/Express → backend).
4. En terminal, dentro de `demo-bolt-a-deploy/`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit from Bolt"
   git branch -M main
   ```
5. Crea repo en GitHub, luego:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/demo-bolt-a-deploy.git
   git push -u origin main
   ```
6. Avísame cuando el código esté en `demo-bolt-a-deploy/` para seguir con Fase 3.

---

## FASE 3 – Transición en Cursor (Cursor + tú)

### 3.0 Plan y subagentes (obligatorio antes de tocar código)

1. En Cursor, activar **Plan Mode**. Pedir: «Plan de transición para este proyecto: crear/verificar DB en Neon, configurar .env y CORS en backend, .env en frontend, limpieza. Listar archivos a tocar y orden. No ejecutar aún.»
2. Revisar el plan, aprobar y salir de Plan Mode. Pasar a **Agent Mode** para ejecutar.
3. Usar **subagentes**: lanzar un agente de exploración sobre `demo-bolt-a-deploy/` para que informe estructura (rutas API, dónde está la conexión a DB, dónde se llama la API en el front). Con ese resultado, ejecutar en el mismo chat (o en otro agente) la configuración de .env, CORS y pruebas.

### 3.1 Base de datos (Neon)

1. Entra a **neon.tech**, crea cuenta, crea un proyecto y una base de datos PostgreSQL.
2. En el dashboard copia la **connection string** (Connection string → copiar).
3. En Neon: pestaña SQL Editor, ejecuta:
   ```sql
   CREATE TABLE ideas (
     id SERIAL PRIMARY KEY,
     titulo VARCHAR(255) NOT NULL,
     descripcion TEXT,
     estado VARCHAR(50) DEFAULT 'pendiente',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### 3.2 Backend

4. En `demo-bolt-a-deploy/backend/` crea `.env`:
   ```
   DATABASE_URL=pegá_la_connection_string
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```
5. Crea `.env.example` con las mismas claves sin valores.
6. Verifica que `backend/.gitignore` tenga `.env`.
7. Verifica que el backend use `process.env.DATABASE_URL` (nada hardcodeado).
8. Verifica CORS con `origin: process.env.FRONTEND_URL`. Si no está, añadirlo.
9. `cd demo-bolt-a-deploy/backend && npm install && npm run dev` — debe arrancar y conectar a la DB.

### 3.3 Frontend

10. En `demo-bolt-a-deploy/frontend/` crea `.env`:
    ```
    VITE_API_URL=http://localhost:5000
    ```
11. Verifica que el front use `import.meta.env.VITE_API_URL` para la API.
12. `cd demo-bolt-a-deploy/frontend && npm install && npm run dev` — prueba agregar idea y ver listado.

### 3.4 Limpieza

13. Revisa que no haya contraseñas/URLs en el código. Revisa dependencias no usadas en ambos `package.json`.
14. Usar una **Skill** de Cursor (o crearla) que revise: existencia de `.env.example`, `.env` en `.gitignore`, y estructura `frontend/` y `backend/` correcta. Ejecutarla y corregir lo que marque.
15. Tener **MCP** configurado para las herramientas que uses (navegador para probar la app, o CLI de Vercel/Railway). Verificar que la conexión funcione antes de pasar a Fase 4.

---

## FASE 4 – Deploy (tú + Cursor)

### Backend (Railway)

1. railway.app → New Project → Deploy from GitHub → repo `demo-bolt-a-deploy`.
2. Root directory = `backend`. Build = `npm install && npm run build` (o `npm install`). Start = `npm start`.
3. Variables: `DATABASE_URL` (la connection string de **Neon**), `NODE_ENV=production`, `FRONTEND_URL=https://....vercel.app` (lo pones después).
4. Deploy. Anota la URL del backend.

### Frontend (Vercel)

5. vercel.com → Import from GitHub → repo `demo-bolt-a-deploy`.
6. Root = `frontend`. Build = `npm run build`. Output = `dist`.
7. Variable: `VITE_API_URL` = URL del backend (Railway).
8. Deploy. Anota la URL del frontend.

### Cierre

9. En Railway, variable `FRONTEND_URL` = URL de Vercel. Redeploy backend si hace falta.
10. Prueba en el navegador: abrir URL de Vercel, agregar idea, ver que se guarde y se liste.

---

## FASE 5 – Guía para el jefe (Cursor)

Completar `GUIA_FLUJO_BOLT_CURSOR_DEPLOY.md` con:

1. Introducción (objetivo del demo).
2. Fase 1: qué es Bolt, qué se construyó, prompt usado.
3. Fase 2: exportar, copiar a workspace, Git, GitHub, estructura.
4. Fase 3: qué se hizo en Cursor (DB, .env, CORS, pruebas). Incluir uso de Plan Mode, reglas del proyecto, subagentes, Skill de revisión y MCP.
5. Fase 4: Vercel + Railway + Neon, checklist, enlace a la app.
6. Resumen: Bolt = prototipo; Cursor + transición = producción.

---

Referencia técnica completa: [PROCESO_TRANSICION_BOLT.md](PROCESO_TRANSICION_BOLT.md).
