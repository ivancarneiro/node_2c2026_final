import * as productModel from "./src/models/product.models.js";
import assert from "node:assert/strict";

// Objeto de prueba con las propiedades de tu colección
const mockProduct = {
  name: "Mouse Inalámbrico",
  price: 18000,
  category: "Informatica",
  subCategory: "Periferico",
  description: "Mouse óptico 2.4GHz con receptor USB",
  stock: 20
};

const stats = { passed: 0, failed: 0 };

const runSuite = async () => {
  console.log("\n=======================================================");
  console.log("       🧪 SUITE DE PRUEBAS: product.models.js");
  console.log("=======================================================\n");

  let createdId = null;

  // ---------------------------------------------------------
  // TEST 1: findAll()
  // ---------------------------------------------------------
  console.log("▶ PRUEBA 1: productModel.findAll()");
  try {
    const products = await productModel.findAll();
    console.log("  [Salida / Datos obtenidos]:");
    console.dir(products, { depth: null, colors: true });

    assert(Array.isArray(products), "Debe retornar un Array");
    assert(products.length > 0, "El array no debe estar vacío");
    assert.ok(products[0].id, "Cada producto debe tener una propiedad 'id'");

    stats.passed++;
    console.log("  ✔ PASS: findAll() ejecutado con éxito.\n");
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // TEST 2: create()
  // ---------------------------------------------------------
  console.log("▶ PRUEBA 2: productModel.create(mockProduct)");
  try {
    const created = await productModel.create(mockProduct);
    console.log("  [Salida / Documento creado en Firestore]:");
    console.dir(created, { depth: null, colors: true });

    assert.ok(created.id, "Debe tener un 'id' generado");
    assert.equal(created.name, mockProduct.name, "El nombre debe coincidir");
    assert.equal(created.price, mockProduct.price, "El precio debe coincidir");
    assert.equal(created.category, mockProduct.category, "La categoría debe coincidir");

    createdId = created.id;
    stats.passed++;
    console.log(`  ✔ PASS: create() insertó el producto con ID: ${createdId}\n`);
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // TEST 3: findById()
  // ---------------------------------------------------------
  console.log(`▶ PRUEBA 3: productModel.findById("${createdId}")`);
  try {
    assert.ok(createdId, "Se requiere el ID generado en la prueba anterior");

    const found = await productModel.findById(createdId);
    console.log("  [Salida / Documento recuperado por ID]:");
    console.dir(found, { depth: null, colors: true });

    assert.ok(found, "Debe encontrar el producto");
    assert.equal(found.id, createdId, "El ID debe coincidir");

    // Prueba adicional con ID inexistente
    const notFound = await productModel.findById("id-inexistente-12345");
    console.log("  [Salida con ID inexistente]:", notFound);
    assert.equal(notFound, null, "Debe retornar null cuando no existe");

    stats.passed++;
    console.log("  ✔ PASS: findById() encontró el producto y manejó correctamente un ID inexistente.\n");
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // TEST 4: remove()
  // ---------------------------------------------------------
  console.log(`▶ PRUEBA 4: productModel.remove("${createdId}")`);
  try {
    assert.ok(createdId, "Se requiere el ID para eliminar");

    const removed = await productModel.remove(createdId);
    console.log("  [Salida / Documento eliminado]:");
    console.dir(removed, { depth: null, colors: true });

    assert.ok(removed, "Debe retornar el objeto eliminado");
    assert.equal(removed.id, createdId, "El ID debe coincidir");

    // Verificar que realmente ya no existe en la base de datos
    const checkDeleted = await productModel.findById(createdId);
    console.log("  [Verificación post-eliminación con findById]:", checkDeleted);
    assert.equal(checkDeleted, null, "El documento ya no debe existir en Firestore");

    stats.passed++;
    console.log("  ✔ PASS: remove() eliminó el documento de Firestore correctamente.\n");
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // RESUMEN FINAL
  // ---------------------------------------------------------
  console.log("=======================================================");
  console.log(` 📊 RESUMEN FINAL: ${stats.passed} PASADOS | ${stats.failed} FALLADOS`);
  console.log("=======================================================\n");

  process.exit(stats.failed === 0 ? 0 : 1);
};

runSuite();
