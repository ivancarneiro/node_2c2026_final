# Requisitos Técnicos del Proyecto

## 1. Configuración Inicial
- Punto de entrada: `index.js`.
- Inicializar con `npm init -y`.
- Habilitar ESModules: `"type": "module"` en `package.json`.
- Script de ejecución: `"start": "node index.js"` (`npm run start`).

## 2. Dependencias Requeridas
- `express`
- `cors`
- `body-parser`
- `dotenv`
- `firebase`
- `jsonwebtoken`

```bash
npm i express cors body-parser dotenv firebase jsonwebtoken
```

## 3. Configuración del Servidor (`index.js`)
- Servidor web con Express.
- Middleware global `cors` habilitado.
- Middleware global `body-parser` (JSON).
- Middleware para rutas no encontradas: status `404` y mensaje descriptivo.
- Carga de variables de entorno mediante archivo `.env`.

## 4. Endpoints y Rutas

### Productos (`products.routes.js`)
- `GET /api/products`: Devuelve todos los productos.
- `GET /api/products/:id`: Devuelve el producto con el ID indicado.
- `POST /api/products/create`: Crea y guarda un nuevo producto en Firestore desde el `body`.
- `DELETE /api/products/:id`: Elimina el producto con el ID indicado.

### Autenticación (`auth.routes.js`)
- `POST /auth/login`: Recibe credenciales en el `body`; retorna `Bearer token` si son válidas o error de autenticación (`401`).

## 5. Arquitectura en Capas
- **Rutas (`routes/`):** Definición de endpoints.
- **Controladores (`controllers/`):** Manejo de peticiones (`req`) y respuestas (`res`).
- **Servicios (`services/`):** Lógica de negocio.
- **Modelos (`models/`):** Acceso y persistencia de datos.
- **Middlewares (`middlewares/`):** Autenticación y control de errores/rutas.
- **Configuración (`config/`):** Conexión a Firebase y variables de entorno.

## 6. Persistencia de Datos (Firebase Firestore)
- Proyecto configurado en Firebase con Firestore Database.
- Colección de productos con estructura de datos definida.
- Inicialización y conexión de Firebase en el backend.
- Métodos en el modelo para operaciones CRUD contra Firestore.
- Comunicación de servicios con modelos.

## 7. Autenticación y Seguridad (JWT)
- Configuración de `jsonwebtoken` mediante secreto en `.env`.
- Middleware de autenticación: valida `Bearer token` en encabezados y protege rutas.
- Controlador de login: valida identidad del usuario y emite el token.

## 8. Manejo de Errores y Códigos HTTP
- `400`: Peticiones con datos inválidos o malformadas.
- `401` / `403`: Falta de autenticación o credenciales/token inválidos.
- `404`: Rutas no definidas o recursos no encontrados.
- `500`: Errores internos de servidor o fallas de conexión con Firebase.
