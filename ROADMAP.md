# 🗺️ ROADMAP - Proyecto Final Node.js

> **Propósito:** Guía de desarrollo paso a paso para codear personalmente cada línea del proyecto, asimilando el estilo, sintaxis y patrones del profesor Jean Paul Ferreira (Comisión 26226).  
> *(Nota: Este archivo se eliminará antes de la presentación final del proyecto).*

---

## 🧠 Análisis del Estilo y Patrones del Profesor

Tras analizar a fondo la rama `dev` del repositorio oficial (`api-rest-comision-26226`), destacamos sus convenciones clave para replicarlas:

1. **Modularidad ECMAScript (ESM):**
   - Uso de `"type": "module"` en `package.json`.
   - `import / export` nativos (sin `require`).
   - Carga directa de variables con `import "dotenv/config";`.

2. **Estructura del Servidor (`index.js`):**
   - Servidor Express conciso.
   - Middlewares esenciales: `express.json()` (comentado como `// bodyParser middleware`) y `cors()`.
   - Middleware de registro simple:
     ```javascript
     app.use((req, res, next) => {
       console.log(`${req.method} ${req.url}`);
       next();
     });
     ```
   - Montaje de rutas con prefijos organizados (e.g., `app.use("/api/products", productsRouter)`).

3. **Arquitectura y Nomenclatura:**
   - **Rutas:** Separadas por dominio en `src/routes/` usando `Router()`.
   - **Controladores (`src/controllers/`):** Funciones flecha async exportadas (`export const getProducts = async (req, res) => { ... }`).
     - Uso sistemático de bloques `try / catch`.
     - Manejo explícito de códigos de estado (`200`, `201`, `400` / `422`, `404`, `500`).
     - Mensajes de error en JSON con la clave `{ error: "..." }`.
   - **Modelos (`src/models/`):** Métodos CRUD idiomáticos:
     - `findAll(filter)`
     - `findById(id)`
     - `create(data)`
     - `update(id, data)`
     - `remove(id)`
     - Manipulación limpia de Firestore:
       `snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))`.
   - **Servicios (`src/services/`):** Capa intermedia para la lógica de negocio requerida en las consignas finales (validaciones de negocio, cálculo, coordinación con modelos).
   - **Seguridad (`src/middlewares/auth.middleware.js`):** Validación de tokens JWT en el header `Authorization: Bearer <token>`.

---

## 📋 Checklist General de Tareas

```text
[x] FASE 1: Servidor Base y Middlewares Globales (index.js)
[x] FASE 2: Conexión con Firebase Firestore (src/config/firebase.js)
[x] FASE 3: Capa de Modelos (src/models/product.models.js)
[ ] FASE 4: Capa de Servicios (src/services/)
[ ] FASE 5: Capa de Controladores (src/controllers/)
[ ] FASE 6: Capa de Rutas (src/routes/)
[ ] FASE 7: Seguridad y Protección con JWT (src/middlewares/auth.middleware.js)
[ ] FASE 8: Manejo de Rutas Desconocidas (404) y Errores
[ ] FASE 9: Testing Integral de Endpoints y Casos Límite
[ ] FASE 10: Limpieza Final y Preparación de Entrega
```

---

## 🔍 Tareas Diseccionadas Paso a Paso

### 🚀 FASE 1: Servidor Base y Middlewares Globales
**Objetivo:** Crear el punto de entrada `index.js`, levantar Express y configurar los middlewares básicos.
- [x] **1.1** Crear el archivo `index.js` en la raíz.
- [x] **1.2** Importar `express`, `cors` y cargar variables de entorno (`dotenv/config`).
- [x] **1.3** Instanciar la aplicación Express (`const app = express();`).
- [x] **1.4** Registrar el middleware `express.json()` (bodyParser).
- [x] **1.5** Registrar el middleware `cors()`.
- [x] **1.6** Implementar el middleware logger (`console.log("${req.method} ${req.url}")`).
- [x] **1.7** Crear ruta de prueba `GET /` ("API funcionando").
- [x] **1.8** Configurar el puerto dinámico (`process.env.PORT || 3000`) y poner a escuchar el servidor con `app.listen()`.
- [x] **1.9** Probar ejecución con `npm run start` o `npm run dev`.

---

### ☁️ FASE 2: Conexión con Firebase Firestore
**Objetivo:** Conectar nuestra aplicación Node.js con Firestore siguiendo el patrón del profesor.
- [x] **2.1** Configurar las variables de Firebase en el archivo `.env` (`FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, etc.).
- [x] **2.2** Crear la carpeta `src/config/` y el archivo `src/config/firebase.js`.
- [x] **2.3** Importar `initializeApp` de `firebase/app` y `getFirestore` de `firebase/firestore`.
- [x] **2.4** Definir el objeto `firebaseConfig` leyendo las variables de entorno (`process.env.*`).
- [x] **2.5** Inicializar la app y exportar la instancia `db` (`export const db = getFirestore(app);`).
- [x] **2.6** Crear en la consola de Firebase la colección `products` y agregar un primer documento de prueba.

---

### 📦 FASE 3: Capa de Modelos (Persistencia en Firestore)
**Objetivo:** Implementar las operaciones de acceso a datos en `src/models/product.models.js`.
- [x] **3.1** Crear `src/models/product.models.js`.
- [x] **3.2** Importar funciones de `firebase/firestore` (`collection`, `getDocs`, `getDoc`, `addDoc`, `deleteDoc`, `doc`) y la instancia `db`.
- [x] **3.3** Definir la referencia a la colección: `const productsCollection = collection(db, "products");`.
- [x] **3.4** Implementar `findAll()`: obtener snapshot de docs y mapear a array `{ id: doc.id, ...doc.data() }`.
- [x] **3.5** Implementar `findById(id)`: buscar documento por ID y verificar si existe con `.exists()`.
- [x] **3.6** Implementar `create(productData)`: guardar nuevo producto con `addDoc` y retornar el objeto con su ID asignado.
- [x] **3.7** Implementar `remove(id)`: verificar existencia y eliminar documento con `deleteDoc`.

---

### ⚙️ FASE 4: Capa de Servicios
**Objetivo:** Crear la lógica de negocio y validaciones que separan los controladores de los modelos.
- [ ] **4.1** Crear `src/services/products.service.js`.
  - [ ] Validar parámetros recibidos (IDs válidos, campos obligatorios: `name`, `price`).
  - [ ] Llamar a los métodos correspondientes de `products.model.js`.
  - [ ] Manejar errores de negocio (e.g. producto inexistente).
- [ ] **4.2** Crear `src/services/auth.service.js`.
  - [ ] Validar credenciales de usuario (email y contraseña).
  - [ ] Generar y firmar el token JWT (`jwt.sign`) con payload, clave secreta y tiempo de expiración.
  - [ ] Retornar el token en formato Bearer.

---

### 🎮 FASE 5: Capa de Controladores
**Objetivo:** Manejar las peticiones HTTP (`req`, `res`) con `try / catch` y códigos de respuesta apropiados.
- [ ] **5.1** Crear `src/controllers/products.controller.js`.
  - [ ] `getProducts`: llamar al servicio y responder con status `200` y JSON.
  - [ ] `getProductById`: obtener `req.params.id`, invocar servicio y responder `200` o `404` si no existe.
  - [ ] `createProduct`: leer `req.body`, validar campos obligatorios (`400`), llamar al servicio y responder con status `201`.
  - [ ] `deleteProduct`: leer `req.params.id`, invocar servicio y responder `200` o `404`.
- [ ] **5.2** Crear `src/controllers/auth.controller.js`.
  - [ ] `login`: leer `req.body`, invocar servicio de autenticación y responder `200` con el token o `401` en caso de credenciales inválidas.

---

### 🚦 FASE 6: Capa de Rutas
**Objetivo:** Definir los endpoints solicitados en la consigna y montarlos en `index.js`.
- [ ] **6.1** Crear `src/routes/products.routes.js`:
  - `GET /` -> `getProducts`
  - `GET /:id` -> `getProductById`
  - `POST /create` -> `createProduct`
  - `DELETE /:id` -> `deleteProduct`
- [ ] **6.2** Crear `src/routes/auth.routes.js`:
  - `POST /login` -> `login`
- [ ] **6.3** Montar los routers en `index.js`:
  - `app.use("/api/products", productsRouter);`
  - `app.use("/auth", authRouter);`

---

### 🛡️ FASE 7: Middleware de Autenticación con JWT
**Objetivo:** Proteger los endpoints que requieren autorización mediante tokens Bearer.
- [ ] **7.1** Crear `src/middlewares/auth.middleware.js`.
- [ ] **7.2** Extraer la cabecera `Authorization` de la petición.
- [ ] **7.3** Verificar que comience con `Bearer <token>` (si no, responder `401`).
- [ ] **7.4** Validar el token con `jwt.verify(token, process.env.JWT_SECRET)`.
- [ ] **7.5** Si el token es válido, adjuntar los datos del usuario en `req.user` y llamar a `next()`; si es inválido, responder con `403`.
- [ ] **7.6** Aplicar el middleware a las rutas protegidas (ej. `POST /create` y `DELETE /:id`).

---

### 🛑 FASE 8: Middleware de Rutas Desconocidas (404)
**Objetivo:** Manejar cualquier ruta no definida en el servidor.
- [ ] **8.1** Crear `src/middlewares/notFound.middleware.js` (o definirlo al final de las rutas en `index.js`).
- [ ] **8.2** Responder con status `404` y un JSON descriptivo (`{ error: "Ruta no encontrada" }`).

---

### 🧪 FASE 9: Pruebas y Validación de la API
**Objetivo:** Comprobar que cada endpoint y código HTTP funcione como se solicita.
- [ ] **9.1** Probar `POST /auth/login` con credenciales válidas e inválidas (200 con token vs 401).
- [ ] **9.2** Probar `GET /api/products` (200 con listado).
- [ ] **9.3** Probar `POST /api/products/create` sin token (401), con token inválido (403), con datos incompletos (400), y exitoso (201).
- [ ] **9.4** Probar `GET /api/products/:id` existente (200) e inexistente (404).
- [ ] **9.5** Probar `DELETE /api/products/:id` existente (200) e inexistente (404).
- [ ] **9.6** Probar ruta inexistente (404).

---

### 🧹 FASE 10: Limpieza Final
- [ ] **10.1** Eliminar este archivo `ROADMAP.md`.
- [ ] **10.2** Verificar que `.env` esté ignorado en `.gitignore`.
- [ ] **10.3** Revisar que el código esté prolijo, comentado y listo para presentar.

