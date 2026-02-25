# Guía: De Bolt a producción (flujo completo para el jefe)

Documento didáctico que explica el camino completo desde low-code hasta una app desplegada en producción, y cómo se usa Cursor en el proceso. Incluye conceptos del curso de Claude Code aplicados a Cursor: Plan Mode, Rules, Skills, MCP y **subagentes/equipos de agentes**.

---

## 1. Introducción

**Objetivo de esta guía:** Mostrar de punta a punta cómo se lleva un producto desde un prototipo rápido en Bolt hasta una aplicación en producción, pasando por la exportación del código, la transición en Cursor y el deploy en Neon, Railway y Vercel.

**Proyecto demo:** "Board de Ideas" — una app sencilla con una tabla de ideas (título, descripción, estado), listado en el front y formulario para agregar. Sirve para ver todas las fases sin complejidad innecesaria.

**Mensaje clave:** Bolt sirve para validar y prototipar rápido; Cursor y el proceso de transición convierten ese código en algo profesional y desplegable.

---

## 2. Fase 1 – Construcción en Bolt

**Qué es Bolt:** Herramienta low-code que genera código real (React, Node, PostgreSQL). Permite describir la app en lenguaje natural y obtener un proyecto exportable, a diferencia de plataformas que dejan el producto atado a su ecosistema.

**Por qué usarlo para prototipar:** Velocidad. En minutos tienes frontend, backend y estructura de datos. Ideal para validar una idea con el cliente o para un MVP visual.

**Qué se construyó en este demo:**
- Una tabla `ideas` con: id, titulo, descripcion, estado (pendiente / en progreso / hecha), created_at.
- Una pantalla que lista todas las ideas.
- Un formulario para agregar una nueva idea.
- Backend REST con controllers, routes y services; frontend React (Vite) con separación clara de carpetas.

**Prompt tipo usado en Bolt (para que cualquier proyecto sea exportable y profesionalizable):**

```
Create a full-stack app: React frontend (Vite), Node.js + Express backend, PostgreSQL. One table "ideas" with columns: titulo (text), descripcion (text), estado (text: pendiente | en progreso | hecha). REST API with controllers, routes, services. One page: list all ideas and a form to add new idea. Clean folder separation frontend/backend.
```

**Criterios importantes:** Pedir siempre separación frontend/backend, REST API, y estructura de carpetas clara. Así el código exportado está listo para transición.

---

## 3. Fase 2 – Exportación y estructura

**Por qué no dejar la app solo en Bolt:** El producto debe vivir en tu repositorio y en tu control. Bolt no crea la base de datos real ni hace el deploy; eso se hace fuera de Bolt. Si todo queda en Bolt, no hay handoff profesional ni infraestructura real.

**Pasos realizados:**
1. Exportar / Download del proyecto desde Bolt (ZIP).
2. Descomprimir y copiar el contenido dentro de la carpeta `demo-bolt-a-deploy/` en el workspace.
3. Si Bolt no entregó carpetas `frontend/` y `backend/` separadas, crearlas y mover los archivos correspondientes (React/Vite → frontend, Node/Express → backend).
4. Inicializar Git en esa carpeta, primer commit, y subir el repo a GitHub (necesario para deploy en Railway y Vercel).

**Estructura final de carpetas del proyecto demo:**

```
demo-bolt-a-deploy/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── GUIA_FLUJO_BOLT_CURSOR_DEPLOY.md
└── README.md (opcional)
```

Con esto el código está listo para la fase de transición en Cursor.

---

## 4. Fase 3 – Transición en Cursor

**Qué hace Cursor aquí:** Editar el código exportado, configurar variables de entorno, CORS, conexión a una base de datos PostgreSQL real y asegurar que no queden credenciales hardcodeadas. Es la capa que convierte el prototipo en algo listo para producción.

**Referencia técnica detallada:** [PROCESO_TRANSICION_BOLT.md](../PROCESO_TRANSICION_BOLT.md) — ahí están todos los pasos técnicos (DB, .env, CORS, limpieza).

**Qué se hizo en este demo:**
- **Base de datos:** Crear un proyecto en Neon, obtener la connection string y crear la tabla `ideas` con SQL en el panel de Neon.
- **Backend:** Añadir `.env` y `.env.example` con `DATABASE_URL`, `PORT`, `FRONTEND_URL`, `NODE_ENV`. Verificar que el código use `process.env.DATABASE_URL` y que CORS use `process.env.FRONTEND_URL`. Probar `npm install` y `npm run dev` en el backend.
- **Frontend:** Añadir `.env` con `VITE_API_URL=http://localhost:5000` y verificar que las llamadas a la API usen esa variable. Probar el frontend en local contra el backend.
- **Limpieza:** Revisar que no haya contraseñas ni URLs sensibles en el código y que `.env` esté en `.gitignore`.

**Conceptos del video (Claude Code) aplicados a Cursor:**
- **Plan Mode:** En Cursor se puede usar un modo de solo planificación: la IA analiza el código y propone un plan antes de tocar archivos. Para cambios estructurales grandes (refactors que tocan muchos archivos), conviene planificar primero y luego ejecutar. Ahorra tiempo y evita errores.
- **Rules (Cursor Rules):** Se pueden definir reglas por proyecto (por ejemplo convenciones de código, uso de variables de entorno, estructura de carpetas) para que la IA las respete en cada conversación.
- **Skills:** Scripts o flujos que automatizan tareas repetitivas (por ejemplo revisar que exista .env.example o la estructura frontend/backend). Se cargan cuando se necesitan y consumen menos contexto que tener todo el tiempo conectado.
- **MCP (Model Context Protocol):** Opcional; permite conectar Cursor con herramientas externas (navegador, APIs) para tareas más avanzadas.
- **Subagentes y equipos de agentes:** En el video se propone no usar la IA como un solo chat, sino como un equipo: un agente que investiga el código, otro que revisa errores, otro que hace pruebas (QA), trabajando en paralelo. En Cursor existe el concepto equivalente: se pueden lanzar **subagentes especializados** (por ejemplo uno que explora el codebase, otro que ejecuta comandos en terminal, otro de propósito general) para repartir tareas. En una transición Bolt→Cursor compleja, se puede usar un agente para analizar la estructura exportada mientras otro prepara la configuración de .env y CORS; así se acelera el trabajo y se reduce el riesgo de olvidar pasos.

---

## 5. Fase 4 – Deploy

**Arquitectura utilizada:**

- **Frontend** → Vercel (build desde la carpeta `frontend`, output `dist`).
- **Backend** → Railway (build desde la carpeta `backend`, variables de entorno para producción).
- **Base de datos** → Neon (misma instancia que en desarrollo; la connection string se configura en Railway).

**Checklist breve:**
- [ ] Repo en GitHub con código en `demo-bolt-a-deploy/`.
- [ ] Proyecto y base PostgreSQL creados en Neon; tabla `ideas` creada.
- [ ] Railway: root `backend`, variables `DATABASE_URL` (Neon), `NODE_ENV=production`, `FRONTEND_URL` = URL de Vercel.
- [ ] Vercel: root `frontend`, variable `VITE_API_URL` = URL del backend en Railway.
- [ ] Tras el primer deploy: actualizar `FRONTEND_URL` en Railway con la URL real de Vercel y `VITE_API_URL` en Vercel con la URL del backend; redeploy si hace falta.
- [ ] Prueba en navegador: abrir la URL de Vercel, agregar una idea y comprobar que se guarde y se liste.

**Enlace a la app demo en producción:** [Pendiente: añadir URL cuando esté desplegada]

---

## 6. Resumen del flujo

1. **Bolt** — Prototipo rápido: se describe la app, se genera código, se prueba en el entorno Bolt y se exporta.
2. **Export** — El código se descarga y se coloca en un repo (carpeta `demo-bolt-a-deploy/`), con frontend y backend separados y Git/GitHub configurados.
3. **Cursor** — Transición: base de datos real (Neon), variables de entorno, CORS, pruebas en local y limpieza. Aquí se aplican Plan Mode, Rules, Skills y, cuando el proyecto lo requiere, subagentes (investigar código, ejecutar comandos, revisar) para repartir trabajo.
4. **Deploy** — Frontend en Vercel, backend en Railway, base de datos en Neon; variables y URLs cruzadas configuradas; verificación en producción.

**Mensaje para el jefe:** Bolt da velocidad de validación; Cursor y el proceso de transición dan código profesional y control total sobre la infraestructura. El producto final no “vive en Bolt”, vive en tu repo y en tu stack (Vercel + Railway + Neon).

---

## 7. Próximos pasos

Este mismo flujo se puede repetir en otros proyectos de la agencia (por ejemplo Marketplace B2B, Chatbot de seguros, Sistema de inventarios): construir o refinar en Bolt, exportar, transicionar en Cursor siguiendo [PROCESO_TRANSICION_BOLT.md](../PROCESO_TRANSICION_BOLT.md) y desplegar con la misma arquitectura. La guía y los pasos concretos están en [PASOS_DEMO_BOLT_A_DEPLOY.md](../PASOS_DEMO_BOLT_A_DEPLOY.md).

---

*Documento creado como parte del proyecto demo Bolt → Cursor → Deploy. Referencias: [PROCESO_TRANSICION_BOLT.md](../PROCESO_TRANSICION_BOLT.md), [CONTEXTO_PROYECTO.md](../CONTEXTO_PROYECTO.md).*
