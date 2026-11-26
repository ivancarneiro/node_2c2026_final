import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas de lectura
router.get("/", getProducts);
router.get("/:id", getProductById);

// Rutas protegidas con JWT
router.post("/create", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;