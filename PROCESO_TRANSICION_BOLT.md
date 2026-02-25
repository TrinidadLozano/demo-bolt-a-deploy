# Proceso de Transición: Bolt → Producción
## Guía Paso a Paso para Transicionar de Low-Code a Producción

---

## 🎯 ¿Qué es la Transición?

**Transición =** Llevar el código generado en Bolt a una infraestructura profesional y lista para producción.

**Bolt genera código, pero NO:**
- ❌ Crea la base de datos PostgreSQL
- ❌ Hace el deploy profesional
- ❌ Configura seguridad empresarial
- ❌ Separa ambientes

**Eso lo haces TÚ en la transición.**

---

## 📦 Paso 1: Exportar de Bolt

### 1.1 Exportar el Código

**⚠️ NUNCA dejes la app viviendo en Bolt**

1. En Bolt, busca opción **"Export"** o **"Download"**
2. Descarga el proyecto completo
3. O conecta directamente a GitHub si Bolt lo permite

### 1.2 Subir a GitHub

```bash
# Crear repositorio en GitHub primero
# Luego en tu máquina local:

git init
git add .
git commit -m "Initial commit from Bolt"
git branch -M main
git remote add origin https://github.com/tu-usuario/nombre-proyecto.git
git push -u origin main
```

### 1.3 Verificar Estructura

**Deberías tener algo así:**

```
proyecto/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

**Si frontend y backend vienen juntos, sepáralos en carpetas diferentes.**

---

## 🗄️ Paso 2: Crear Base de Datos PostgreSQL

### 2.1 ⚠️ IMPORTANTE: Bolt NO crea la base de datos

**Bolt solo genera código que se conecta a PostgreSQL. Tú debes crear la base.**

### 2.2 Opciones Recomendadas

#### Opción A: Neon (Más fácil para empezar)
1. Ve a [neon.tech](https://neon.tech)
2. Crea cuenta gratuita
3. Crea nuevo proyecto
4. Copia la connection string:
   ```
   postgres://usuario:password@host.neon.tech/dbname?sslmode=require
   ```

#### Opción B: Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea proyecto
3. Ve a Settings > Database
4. Copia connection string

#### Opción C: Railway
1. Ve a [railway.app](https://railway.app)
2. New Project > Add Database > PostgreSQL
3. Copia DATABASE_URL del dashboard

### 2.3 Configurar Variables de Entorno

**Crear archivo `.env` en el backend:**

```env
# Base de datos (PEGAR LA URL QUE COPIaste)
DATABASE_URL=postgres://usuario:password@host:5432/dbname

# JWT
JWT_SECRET=tu-secret-super-seguro-minimo-32-caracteres
JWT_EXPIRES_IN=7d

# Servidor
PORT=5000
NODE_ENV=development

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANTE:**
- Agregar `.env` al `.gitignore`
- Crear `.env.example` con estructura sin valores:

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
NODE_ENV=development
FRONTEND_URL=
```

### 2.4 Verificar Conexión

**El código de Bolt ya debería tener algo como:**

```typescript
// backend/src/config/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default pool;
```

**Probar conexión:**
```bash
cd backend
npm install
npm run dev
# Deberías ver conexión exitosa
```

---

## 🔧 Paso 3: Preparar Código para Producción

### 3.1 Configurar CORS

**El backend debe aceptar requests del frontend:**

```typescript
// backend/src/config/cors.ts
import cors from 'cors';

export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// En server.ts:
import cors from 'cors';
import { corsOptions } from './config/cors';
app.use(cors(corsOptions));
```

### 3.2 Variables de Entorno en Frontend

**Crear `.env` en frontend:**

```env
VITE_API_URL=http://localhost:5000
```

**En el código del frontend, usar:**
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

### 3.3 Limpieza Básica

- [ ] Revisar `package.json` y eliminar dependencias innecesarias
- [ ] Verificar que no haya credenciales hardcodeadas
- [ ] Asegurar que `.env` esté en `.gitignore`

---

## 🚀 Paso 4: Deploy a Producción

### 4.1 Arquitectura de Deploy

```
┌─────────────────┐
│   Frontend      │ → Vercel
│   (React)       │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│   Backend       │ → Railway / Render
│   (Node/Express)│
└────────┬────────┘
         │
         │ Queries
         ▼
┌─────────────────┐
│   PostgreSQL    │ → Neon / Supabase
│   Database       │
└─────────────────┘
```

### 4.2 Deploy del Frontend (Vercel)

**Opción A: Desde GitHub (Recomendado)**

1. Ve a [vercel.com](https://vercel.com)
2. **Import project**
3. Selecciona tu repo de GitHub
4. Configura:
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
5. **Environment Variables:**
   - Agregar: `VITE_API_URL=https://tu-backend.railway.app`
6. Deploy

**Opción B: Desde CLI**

```bash
npm install -g vercel
cd frontend
vercel
```

### 4.3 Deploy del Backend (Railway)

**Opción A: Desde GitHub (Recomendado)**

1. Ve a [railway.app](https://railway.app)
2. **New Project** > **Deploy from GitHub**
3. Selecciona tu repo
4. Configura:
   - **Root directory:** `backend`
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
5. **Variables de entorno:**
   - `DATABASE_URL` = (la URL de tu PostgreSQL)
   - `JWT_SECRET` = (tu secret)
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://tu-frontend.vercel.app`
6. Deploy

**Opción B: Desde CLI**

```bash
npm install -g @railway/cli
cd backend
railway login
railway init
railway variables set DATABASE_URL=tu-url-postgres
railway up
```

**Alternativa: Render**

1. Ve a [render.com](https://render.com)
2. **New** > **Web Service**
3. Conecta GitHub
4. Configura igual que Railway

### 4.4 Actualizar CORS en Backend

**Después del deploy, actualizar `FRONTEND_URL` en backend:**

```env
FRONTEND_URL=https://tu-frontend.vercel.app
```

**Y redeployar el backend.**

### 4.5 Actualizar Frontend con URL del Backend

**En Vercel, actualizar variable de entorno:**

```
VITE_API_URL=https://tu-backend.railway.app
```

**Y redeployar el frontend.**

---

## ✅ Checklist de Transición

### Pre-Deploy
- [ ] Código exportado de Bolt
- [ ] Código subido a GitHub
- [ ] Frontend y backend separados en carpetas
- [ ] Base de datos PostgreSQL creada (Neon/Supabase/Railway)
- [ ] Variables de entorno configuradas (`.env` en backend)
- [ ] CORS configurado en backend
- [ ] Conexión a base de datos verificada localmente

### Deploy
- [ ] Frontend deployado en Vercel
- [ ] Backend deployado en Railway/Render
- [ ] Variables de entorno configuradas en producción
- [ ] `FRONTEND_URL` actualizado en backend con URL de Vercel
- [ ] `VITE_API_URL` actualizado en frontend con URL de Railway
- [ ] Frontend y backend se comunican correctamente
- [ ] Base de datos conectada y funcionando

### Verificación Final
- [ ] Frontend carga correctamente
- [ ] Backend responde (probar endpoint `/health` o `/api`)
- [ ] Autenticación funciona (si aplica)
- [ ] Base de datos guarda datos correctamente
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en logs del backend

---

## 🚨 Errores Comunes

1. **❌ Dejar app en Bolt** → Siempre exportar y subir a GitHub
2. **❌ No crear base de datos** → Bolt NO la crea, tú debes crearla
3. **❌ Hardcodear URLs** → Usar variables de entorno siempre
4. **❌ CORS mal configurado** → Backend debe aceptar requests del frontend
5. **❌ Variables de entorno incorrectas** → Verificar en cada plataforma
6. **❌ No actualizar URLs después del deploy** → Frontend y backend necesitan URLs de producción

---

## 🔄 Flujo Completo Resumido

```
1. Exportar de Bolt
   ↓
2. Subir a GitHub
   ↓
3. Crear PostgreSQL (Neon/Supabase)
   ↓
4. Configurar .env local
   ↓
5. Probar localmente
   ↓
6. Deploy frontend (Vercel)
   ↓
7. Deploy backend (Railway)
   ↓
8. Actualizar URLs entre servicios
   ↓
9. Verificar todo funciona
   ↓
10. ✅ Listo para producción
```

---

## 📝 Notas Importantes

- **Bolt es solo el generador inicial** - El código real lo controlas tú
- **Siempre separa frontend y backend** - Diferentes plataformas de hosting
- **Nunca hardcodees credenciales** - Usa variables de entorno
- **Prueba localmente primero** - Antes de hacer deploy
- **Actualiza URLs después del deploy** - Frontend y backend necesitan conocerse

---

*Documento creado para transición rápida de Bolt a producción*
*Versión: 1.0*
