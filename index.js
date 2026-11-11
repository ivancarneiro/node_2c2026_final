import express from "express";
import cors from "cors";
import "dotenv/config";

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

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});