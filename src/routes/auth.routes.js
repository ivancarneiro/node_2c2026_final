import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Luego de crear el 1er usuario, se protege la ruta con 'authenticate' para evitar quu register quede público.
router.post("/register", authenticate, register);
router.post("/login", login);

export default router;