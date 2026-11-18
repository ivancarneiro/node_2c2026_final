import * as productModel from "../models/product.models.js";


// Obtener todos los productos
export const getAllProducts = async () => {
    return await productModel.findAll();
};


// Obtener un producto por ID
export const getProductById = async (id) => {
    if (!id) {
        const error = new Error("El ID del producto es obligatorio");
        error.statusCode = 400;
        throw error;
    }

    const product = await productModel.findById(id);

    if (!product) {
        const error = new Error(`Producto con ID ${id} no encontrado`);
        error.statusCode = 404;
        throw error;
    }

    return product;
};


// Crear un nuevo producto
export const createProduct = async (productData) => {
    const { name, price, stock, description, category, subCategory } = productData ?? {};

    // Validacion de datos obligatorios
    if (!name || typeof name !== "string" || name.trim() === "") {
        const error = new Error("El campo 'name' es obligatorio y debe ser string");
        error.statusCode = 400;
        throw error;
    }

    if (price === undefined || typeof price !== "number" || price <= 0) {
        const error = new Error("El campo 'price' es obligatorio y debe ser un número mayor a 0");
        error.statusCode = 400;
        throw error;
    }

    // Validacion de stock
    if (stock === undefined || (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock))) {
        const error = new Error("El campo 'stock' es obligatorio y debe ser un número entero mayor o igual a 0");
        error.statusCode = 400;
        throw error;
    }

    // Estructuracion de objeto product para creacion en Firestore
    const now = new Date();
    const newProduct = {
        name: name.trim(),
        price,
        stock: stock ?? 0,
        description: description ? description.trim() : "",
        category: category ? category.trim() : "General",
        subCategory: subCategory ? subCategory.trim() : "General",
        createdAt: now,
        updateAt: now
    };

    return await productModel.create(newProduct);

};


// Actualiza un producto por id
export const updateProduct = async (id, updateData) => {
    if (!id) {
        const error = new Error("El ID del producto es obligatorio");
        error.statusCode = 400;
        throw error;
    }

    if (!updateData || Object.keys(updateData).length === 0) {
        const error = new Error("Debe enviar al menos un campo para actualizar");
        error.statusCode = 400;
        throw error;
    }

    const { name, price, stock, description, category, subCategory } = updateData;

    // Objeto (documento) con campos permitidos para actualizar
    const fieldsToUpdate = {};

    if (name !== undefined) {
        if (typeof name !== "string" || name.trim() === "") {
            const error = new Error("El campo 'name' debe ser un texto valido");
            error.statusCode = 400;
            throw error;
        }
        fieldsToUpdate.name = name.trim();
    }

    if (price !== undefined) {
        if (typeof price !== "number" || price < 1) {
            const error = new Error("El campo 'price' debe ser un número mayor a 0");
            error.statusCode = 400;
            throw error;
        }
        fieldsToUpdate.price = price;
    }

    if (stock !== undefined) {
        if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
            const error = new Error("El campo 'stock' debe ser un número mayor o igual a 0");
            error.statusCode = 400;
            throw error;
        }
        fieldsToUpdate.stock = stock;
    }

    if (description !== undefined) fieldsToUpdate.description = description.trim();
    if (category !== undefined) fieldsToUpdate.category = category.trim();
    if (subCategory !== undefined) fieldsToUpdate.subCategory = subCategory.trim();

    // Actualizamos automáticamente la fecha de modificación
    fieldsToUpdate.updateAt = new Date();

    const updatedProduct = await productModel.update(id, fieldsToUpdate);

    if (!updatedProduct) {
        const error = new Error(`Producto con ID ${id} no encontrado`);
        error.statusCode = 404;
        throw error;
    }
    return updatedProduct;

}


// Eliminar un producto por ID
export const deleteProduct = async (id) => {
    if (!id) {
        const error = new Error("El ID del producto es obligatorio");
        error.statusCode = 400;
        throw error;
    }

    const deletedProduct = await productModel.remove(id);

    if (!deletedProduct) {
        const error = new Error(`Producto con ID ${id} no encontrado`);
        error.statusCode = 404;
        throw error;
    }

    return deletedProduct;
};