# 📦 API REST - Gestión de Catálogo de Productos (TechLab)

> **Proyecto Final — Curso Backend con Node.js (Talento Tech)**  
> **Stack:** `🟢 Node.js (ESM)` · `⚡ Express` · `🔥 Firebase Firestore` · `🔐 JWT & bcryptjs`

---

## 📋 Requisitos del Proyecto Cumplidos

1. **⚙️ Configuración Inicial y ESModules:**
   - Punto de entrada principal en [`index.js`](./index.js).
   - Soporte nativo para **ESModules** (`"type": "module"` en [`package.json`](./package.json)).
   - Scripts de ejecución configurados (`npm run start`, `npm run dev`, `npm test`).
2. **🛡️ Dependencias y Seguridad:**
   - `express`, `cors`, `body-parser`, `dotenv`, `firebase`, `jsonwebtoken` y `bcryptjs`.
   - Git Hook `pre-commit` automatizado ([`scripts/pre-commit-check.js`](./scripts/pre-commit-check.js)) para detección de secretos, validación de sintaxis (`node --check`) y auditoría de vulnerabilidades (CVEs).
3. **🌐 Configuración del Servidor Web:**
   - Habilitación de **CORS** para peticiones de origen cruzado desde clientes Frontend.
   - Interpretación de cuerpos en formato JSON (`express.json()`).
   - Middleware global para manejo de rutas desconocidas devolviendo estado `404 Not Found`.
   - Gestión de configuración y credenciales mediante variables de entorno (`.env`).
4. **🏗️ Arquitectura Escalable en Capas:**
   - **Rutas (`src/routes/`):** Definición de endpoints para productos y autenticación.
   - **Controladores (`src/controllers/`):** Recepción de peticiones HTTP (`req`, `res`) y manejo de respuestas y bloques `try / catch`.
   - **Servicios (`src/services/`):** Lógica de negocio, validaciones de datos, marcas de tiempo de auditoría (`createdAt`, `updateAt`), cifrado de contraseñas y firma de tokens JWT.
   - **Modelos (`src/models/`):** Capa de acceso a datos y operaciones CRUD contra las colecciones `products` y `users` en **Firebase Firestore**.
   - **Middlewares (`src/middlewares/`):** Protección de rutas mediante verificación de `Bearer Token` JWT.
   - **Configuración (`src/config/`):** Inicialización modular del SDK de Firebase.

---

## 🏛️ Estructura del Proyecto

```text
node_2c2026_final/
├── .githooks/
│   └── pre-commit                   # Hook de Git para validaciones pre-commit
├── scripts/
│   └── pre-commit-check.js          # Escaneo de secretos, sintaxis JS y CVEs
├── src/
│   ├── config/
│   │   └── firebase.js              # Conexión e instancia de Firebase Firestore
│   ├── controllers/
│   │   ├── auth.controller.js       # Controladores de login y registro
│   │   └── products.controller.js   # Controladores CRUD de productos
│   ├── middlewares/
│   │   └── auth.middleware.js       # Verificación de JWT (Bearer Token)
│   ├── models/
│   │   ├── product.models.js        # Persistencia CRUD en colección 'products'
│   │   └── user.models.js           # Persistencia en colección 'users'
│   ├── routes/
│   │   ├── auth.routes.js           # Endpoints bajo /auth
│   │   └── products.routes.js       # Endpoints bajo /api/products
│   └── services/
│       ├── auth.service.js          # Lógica de autenticación, bcrypt y JWT
│       └── products.service.js      # Validaciones de negocio y timestamps
├── .env.example                     # Plantilla de variables de entorno
├── index.js                         # Punto de entrada y servidor Express
├── package.json
└── test.js                          # Suite integral de pruebas y poblado de catálogo
```

---

## 🚦 Endpoints de la API

### 🔐 Autenticación (`/auth`)

| Método | Ruta | Acceso | Descripción | Códigos de Respuesta |
| :--- | :--- | :---: | :--- | :--- |
| 🔵 **`POST`** | `/auth/login` | 🔓 Público | Autentica al usuario con `email` y `password` y retorna un `Bearer Token` JWT. | 🟢 `200 OK`<br>🟠 `400 Bad Request`<br>🔴 `401 Unauthorized` |
| 🔵 **`POST`** | `/auth/register` | 🔒 JWT | Registra un nuevo usuario en Firestore con contraseña cifrada (`bcryptjs`). | 🟢 `201 Created`<br>🟠 `400 Bad Request`<br>🔴 `401 / 403`<br>🟣 `409 Conflict` |

### 📦 Productos (`/api/products`)

| Método | Ruta | Acceso | Descripción | Códigos de Respuesta |
| :--- | :--- | :---: | :--- | :--- |
| 🟢 **`GET`** | `/api/products` | 🔓 Público | Devuelve el listado completo de productos del catálogo. | 🟢 `200 OK`<br>🔴 `500 Server Error` |
| 🟢 **`GET`** | `/api/products/:id` | 🔓 Público | Devuelve el detalle del producto correspondiente al `id`. | 🟢 `200 OK`<br>🟡 `404 Not Found` |
| 🔵 **`POST`** | `/api/products/create` | 🔒 JWT | Crea un nuevo producto en Firestore con marcas `createdAt` y `updateAt`. | 🟢 `201 Created`<br>🟠 `400 Bad Request`<br>🔴 `401 / 403` |
| 🟠 **`PUT`** | `/api/products/:id` | 🔒 JWT | Actualiza los campos de un producto existente y renueva `updateAt`. | 🟢 `200 OK`<br>🟠 `400 Bad Request`<br>🔴 `401 / 403`<br>🟡 `404 Not Found` |
| 🔴 **`DELETE`** | `/api/products/:id` | 🔒 JWT | Elimina el producto con el `id` indicado de Firestore. | 🟢 `200 OK`<br>🔴 `401 / 403`<br>🟡 `404 Not Found` |

---

## 🛠️ Instalación y Ejecución Local

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   git clone https://github.com/ivancarneiro/node_2c2026_final.git
   cd node_2c2026_final
   npm install
   ```

2. **Configurar variables de entorno:**
   Crear un archivo `.env` en la raíz basándose en la plantilla [`.env.example`](./.env.example).

3. **Iniciar el servidor:**
   ```bash
   # Modo producción
   npm run start

   # Modo desarrollo (con recarga automática --watch)
   npm run dev
   ```

4. **Ejecutar la suite de pruebas integrales:**
   ```bash
   npm test
   ```
