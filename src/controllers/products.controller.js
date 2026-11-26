import * as productsService from "../services/products.service.js";

// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const products = await productsService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        res.status(status).json({error: error.message || "Error al obtener los productos"
        });
    }
}

// Obtener un producto por ID (GET /:id)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsService.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || "Error al obtener el producto" });
  }
};

// Crear un nuevo producto (POST)
export const createProduct = async (req, res) => {
  try {
    const newProduct = await productsService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || "Error al crear el producto" });
  }
};

// Actualizar un producto (PUT /:id)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productsService.updateProduct(id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || "Error al actualizar el producto" });
  }
};

// Eliminar un producto (DELETE /:id)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productsService.deleteProduct(id);
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || "Error al eliminar el producto" });
  }
};