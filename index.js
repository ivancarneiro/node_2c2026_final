import express from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./src/routes/auth.routes.js";
import productsRouter from "./src/routes/products.routes.js";

const app = express();

// Middlewares
app.use(express.json()); // Para que el servidor entienda el formato JSON (bodyParser)
app.use(cors()); // Para permitir peticiones desde diferentes origenes (Cross-Origin Resource Sharing)

// Permite ver las peticiones por consola
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Ruta inicial de verificación
app.get("/", (req, res) => {
    res.send(`¡Servidor OK! ${new Date().toLocaleString()}`);
});

// Rutas de la API
app.use("/auth", authRouter);
app.use("/api/products", productsRouter);

// Middleware para rutas desconocidas (404 Not Found)
app.use((req, res) => {
    res.status(404).json({
        error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;