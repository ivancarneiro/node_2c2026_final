import "dotenv/config";
import assert from "node:assert/strict";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./src/config/firebase.js";
import * as productsService from "./src/services/products.service.js";
import * as authService from "./src/services/auth.service.js";
import { authenticate } from "./src/middlewares/auth.middleware.js";

// Catálogo base de 20 artículos permanentes para Firestore
const catalogSeed = [
  {
    name: "Mouse Gamer Logitech G502 Hero",
    price: 68000,
    stock: 25,
    category: "Informatica",
    subCategory: "Periferico",
    description: "Mouse óptico gamer con sensor HERO 25K y 11 botones programables.",
  },
  {
    name: "Auriculares HyperX Cloud II Wireless",
    price: 145000,
    stock: 12,
    category: "Informatica",
    subCategory: "Audio",
    description: "Auriculares inalámbricos con sonido envolvente 7.1 y micrófono desmontable.",
  },
  {
    name: "Monitor Samsung Odyssey G4 25\" 240Hz",
    price: 420000,
    stock: 8,
    category: "Informatica",
    subCategory: "Monitores",
    description: "Monitor gaming panel IPS Full HD con tasa de refresco de 240Hz y 1ms.",
  },
  {
    name: "Monitor LG UltraGear 27\" QHD 144Hz",
    price: 510000,
    stock: 6,
    category: "Informatica",
    subCategory: "Monitores",
    description: "Monitor 2K Nano IPS compatible con NVIDIA G-Sync y AMD FreeSync.",
  },
  {
    name: "Notebook Lenovo IdeaPad Gaming 3",
    price: 1350000,
    stock: 5,
    category: "Informatica",
    subCategory: "Notebooks",
    description: "Notebook Ryzen 5, 16GB RAM, 512GB NVMe SSD y GPU RTX 3050.",
  },
  {
    name: "Notebook ASUS Vivobook 15 OLED",
    price: 1120000,
    stock: 7,
    category: "Informatica",
    subCategory: "Notebooks",
    description: "Ultrabook Intel Core i7, 16GB RAM, 512GB SSD y pantalla OLED Full HD.",
  },
  {
    name: "Procesador AMD Ryzen 7 5700X",
    price: 265000,
    stock: 14,
    category: "Componentes",
    subCategory: "Procesadores",
    description: "Procesador de 8 núcleos y 16 hilos Socket AM4 hasta 4.6GHz.",
  },
  {
    name: "Procesador Intel Core i5-13400F",
    price: 248000,
    stock: 18,
    category: "Componentes",
    subCategory: "Procesadores",
    description: "Procesador de 10 núcleos (6P+4E) Socket LGA1700 13va Generación.",
  },
  {
    name: "Placa de Video NVIDIA RTX 4060 8GB",
    price: 495000,
    stock: 9,
    category: "Componentes",
    subCategory: "Placas de Video",
    description: "Placa gráfica GDDR6 con soporte DLSS 3 y Ray Tracing de 3ra generación.",
  },
  {
    name: "Placa de Video AMD Radeon RX 7600 8GB",
    price: 440000,
    stock: 10,
    category: "Componentes",
    subCategory: "Placas de Video",
    description: "GPU arquitectura RDNA 3 ideal para gaming en 1080p Ultra.",
  },
  {
    name: "Memoria RAM Kingston Fury Beast 16GB DDR4",
    price: 54000,
    stock: 40,
    category: "Componentes",
    subCategory: "Memorias RAM",
    description: "Módulo de memoria DDR4 3200MHz CL16 con disipador de aluminio.",
  },
  {
    name: "Memoria RAM Corsair Vengeance RGB 32GB DDR5",
    price: 165000,
    stock: 15,
    category: "Componentes",
    subCategory: "Memorias RAM",
    description: "Kit 2x16GB DDR5 6000MHz con iluminación RGB dinámica.",
  },
  {
    name: "Disco SSD NVMe Kingston NV2 1TB",
    price: 82000,
    stock: 30,
    category: "Almacenamiento",
    subCategory: "SSD",
    description: "Unidad de estado sólido M.2 PCIe 4.0 x4 hasta 3500MB/s.",
  },
  {
    name: "Disco SSD Samsung 980 PRO 1TB NVMe",
    price: 138000,
    stock: 12,
    category: "Almacenamiento",
    subCategory: "SSD",
    description: "SSD M.2 PCIe Gen4 de alto rendimiento hasta 7000MB/s de lectura.",
  },
  {
    name: "Motherboard ASUS TUF Gaming B550M-Plus WiFi",
    price: 195000,
    stock: 11,
    category: "Componentes",
    subCategory: "Motherboards",
    description: "Placa madre Micro-ATX AM4 con PCIe 4.0, WiFi 6 y disipadores VRM.",
  },
  {
    name: "Fuente Corsair RM750e 750W 80 Plus Gold",
    price: 152000,
    stock: 14,
    category: "Componentes",
    subCategory: "Fuentes",
    description: "Fuente de alimentación 100% modular ATX 3.0 y PCIe 5.0 silenciosa.",
  },
  {
    name: "Gabinete NZXT H5 Flow Mid-Tower",
    price: 128000,
    stock: 9,
    category: "Componentes",
    subCategory: "Gabinetes",
    description: "Gabinete ATX con panel frontal perforado para alto flujo de aire y vidrio templado.",
  },
  {
    name: "Webcam Logitech C920s Pro HD",
    price: 92000,
    stock: 16,
    category: "Informatica",
    subCategory: "Periferico",
    description: "Cámara web Full HD 1080p con tapa de privacidad y micrófonos estéreo.",
  },
  {
    name: "Micrófono USB HyperX QuadCast S RGB",
    price: 175000,
    stock: 10,
    category: "Informatica",
    subCategory: "Audio",
    description: "Micrófono condensador con montura antivibración y 4 patrones polares.",
  },
  {
    name: "Mousepad Gamer XL Redragon Flick",
    price: 22000,
    stock: 35,
    category: "Informatica",
    subCategory: "Periferico",
    description: "Alfombrilla extendida 900x400mm con bordes cosidos y base antideslizante.",
  },
];

// Producto temporal para probar el ciclo CRUD completo (crear -> leer -> actualizar -> eliminar)
const tempCrudProduct = {
  name: "Producto Temporal Test CRUD",
  price: 15000,
  category: "Informatica",
  subCategory: "Periferico",
  description: "Artículo temporal utilizado únicamente para validar update y delete.",
  stock: 10,
};

// Usuario temporal para probar registro y bloqueo 409
const tempUser = {
  email: `test_${Date.now()}@techlab.com`,
  password: "passwordSeguro123",
};

// Usuario principal ya registrado en Firestore (leído desde .env)
const adminCredentials = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const stats = { passed: 0, failed: 0 };

const runSuite = async () => {
  console.log("\n=============================================================");
  console.log("   🧪 SUITE INTEGRAL DE PRUEBAS Y POBLADO DE CATÁLOGO (20+)");
  console.log("=============================================================\n");

  let tempProductId = null;
  let tempUserId = null;
  let validJwtToken = null;

  // ---------------------------------------------------------
  // TEST 1: Poblar catálogo permanente (>= 20 artículos que NO se eliminan)
  // ---------------------------------------------------------
  console.log("▶ PRUEBA 1: Verificación y poblado de al menos 20 artículos permanentes en Firestore");
  try {
    let currentProducts = await productsService.getAllProducts();
    const existingNames = new Set(currentProducts.map((p) => p.name));

    let insertedCount = 0;
    for (const item of catalogSeed) {
      if (!existingNames.has(item.name)) {
        await productsService.createProduct(item);
        insertedCount++;
      }
    }

    currentProducts = await productsService.getAllProducts();
    console.log(`  [Salida / Artículos recién insertados]: ${insertedCount}`);
    console.log(`  [Salida / Total de artículos permanentes en Firestore]: ${currentProducts.length}`);
    console.log("  [Muestra de los primeros 3 artículos del catálogo]:");
    console.dir(currentProducts.slice(0, 3), { depth: null, colors: true });

    assert(Array.isArray(currentProducts), "Debe retornar un Array");
    assert(
      currentProducts.length >= 20,
      `Debe haber al menos 20 productos en Firestore (actual: ${currentProducts.length})`
    );

    stats.passed++;
    console.log(`  ✔ PASS: Catálogo poblado y verificado con ${currentProducts.length} artículos permanentes.\n`);
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // TEST 2: createProduct() + Validación 400
  // ---------------------------------------------------------
  console.log("▶ PRUEBA 2: productsService.createProduct(tempCrudProduct) y validación 400");
  try {
    const created = await productsService.createProduct(tempCrudProduct);
    console.log("  [Salida / Producto creado para test CRUD]:");
    console.dir(created, { depth: null, colors: true });

    assert.ok(created.id, "Debe tener un 'id' generado por Firestore");
    assert.equal(created.name, tempCrudProduct.name, "El nombre debe coincidir");
    assert.ok(created.createdAt instanceof Date, "Debe incluir createdAt como Date");
    assert.ok(created.updateAt instanceof Date, "Debe incluir updateAt como Date");

    tempProductId = created.id;

    // Probar validación de error 400 con datos inválidos
    await assert.rejects(
      async () => await productsService.createProduct({ name: "", price: -10 }),
      (err) => {
        console.log(`  [Salida / Rechazo esperado por datos inválidos]: (${err.statusCode}) ${err.message}`);
        return err.statusCode === 400;
      }
    );

    stats.passed++;
    console.log(`  ✔ PASS: createProduct() insertó el producto (${tempProductId}) y validó errores 400.\n`);
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // TEST 3: getProductById() + Validación 404
  // ---------------------------------------------------------
  console.log(`▶ PRUEBA 3: productsService.getProductById("${tempProductId}") y validación 404`);
  try {
    assert.ok(tempProductId, "Se requiere el ID generado en la prueba anterior");

    const found = await productsService.getProductById(tempProductId);
    console.log("  [Salida / Producto recuperado por ID]:");
    console.dir(found, { depth: null, colors: true });

    assert.equal(found.id, tempProductId, "El ID debe coincidir");

    await assert.rejects(
      async () => await productsService.getProductById("id-inexistente-12345"),
      (err) => {
        console.log(`  [Salida / Rechazo esperado por ID inexistente]: (${err.statusCode}) ${err.message}`);
        return err.statusCode === 404;
      }
    );

    stats.passed++;
    console.log("  ✔ PASS: getProductById() encontró el producto y lanzó 404 para ID inexistente.\n");
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // TEST 4: updateProduct() + Validación 404
  // ---------------------------------------------------------
  console.log(`▶ PRUEBA 4: productsService.updateProduct("${tempProductId}", { price: 22500, stock: 12 })`);
  try {
    assert.ok(tempProductId, "Se requiere el ID para actualizar");

    const updated = await productsService.updateProduct(tempProductId, {
      price: 22500,
      stock: 12,
    });
    console.log("  [Salida / Producto actualizado]:");
    console.dir(updated, { depth: null, colors: true });

    assert.equal(updated.price, 22500, "El precio actualizado debe ser 22500");
    assert.equal(updated.stock, 12, "El stock actualizado debe ser 12");
    assert.ok(updated.updateAt instanceof Date, "Debe haber actualizado la marca updateAt");

    stats.passed++;
    console.log("  ✔ PASS: updateProduct() modificó los campos y actualizó updateAt correctamente.\n");
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // TEST 5: deleteProduct() (Solo elimina el producto temporal, dejando los 20+ permanentes)
  // ---------------------------------------------------------
  console.log(`▶ PRUEBA 5: productsService.deleteProduct("${tempProductId}")`);
  try {
    assert.ok(tempProductId, "Se requiere el ID para eliminar");

    const removed = await productsService.deleteProduct(tempProductId);
    console.log("  [Salida / Producto temporal eliminado]:");
    console.dir(removed, { depth: null, colors: true });

    assert.equal(removed.id, tempProductId, "El ID eliminado debe coincidir");

    await assert.rejects(
      async () => await productsService.getProductById(tempProductId),
      (err) => {
        console.log(`  [Verificación post-eliminación]: (${err.statusCode}) ${err.message}`);
        return err.statusCode === 404;
      }
    );

    const remainingProducts = await productsService.getAllProducts();
    console.log(`  [Catálogo permanente intacto en Firestore]: ${remainingProducts.length} artículos.`);
    assert(remainingProducts.length >= 20, "Deben permanecer al menos 20 artículos en la colección");

    stats.passed++;
    console.log("  ✔ PASS: deleteProduct() funcionó y los 20+ artículos del catálogo siguen intactos.\n");
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // TEST 6: Login con tu usuario real (admin@techlab.com) y emisión de JWT
  // ---------------------------------------------------------
  console.log(`▶ PRUEBA 6: authService.loginUser("${adminCredentials.email}", "***") y validación 401`);
  try {
    const authData = await authService.loginUser(
      adminCredentials.email,
      adminCredentials.password
    );
    console.log("  [Salida / Login exitoso con usuario principal y Bearer Token emitido]:");
    console.dir(authData, { depth: null, colors: true });

    assert.ok(authData.token, "Debe retornar un token JWT");
    assert.equal(authData.tokenType, "Bearer", "El tipo de token debe ser Bearer");
    validJwtToken = authData.token;

    // Intentar login con contraseña errónea debe lanzar 401 Unauthorized
    await assert.rejects(
      async () => await authService.loginUser(adminCredentials.email, "claveIncorrecta"),
      (err) => {
        console.log(`  [Salida / Rechazo esperado por clave errónea]: (${err.statusCode}) ${err.message}`);
        return err.statusCode === 401;
      }
    );

    stats.passed++;
    console.log("  ✔ PASS: loginUser() autenticó tu usuario principal, emitió JWT y rechazó claves inválidas (401).\n");
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // TEST 7: authService.registerUser() y control de duplicados (409)
  // ---------------------------------------------------------
  console.log(`▶ PRUEBA 7: authService.registerUser("${tempUser.email}", "***") y validación 409`);
  try {
    const newUser = await authService.registerUser(tempUser.email, tempUser.password);
    console.log("  [Salida / Usuario registrado en Firestore]:");
    console.dir(newUser, { depth: null, colors: true });

    assert.ok(newUser.id, "El usuario registrado debe tener un 'id'");
    assert.equal(newUser.email, tempUser.email, "El email debe coincidir");
    assert.equal(newUser.password, undefined, "Por seguridad no debe exponer el hash del password");

    tempUserId = newUser.id;

    // Intentar registrar un email ya existente (como admin@techlab.com) debe lanzar 409 Conflict
    await assert.rejects(
      async () => await authService.registerUser(adminCredentials.email, "cualquierPass123"),
      (err) => {
        console.log(`  [Salida / Rechazo esperado por email duplicado]: (${err.statusCode}) ${err.message}`);
        return err.statusCode === 409;
      }
    );

    stats.passed++;
    console.log("  ✔ PASS: registerUser() cifró password con bcrypt y bloqueó duplicados con 409.\n");
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  } finally {
    if (tempUserId) {
      await deleteDoc(doc(db, "users", tempUserId));
      console.log(`  🧹 [Limpieza]: Usuario temporal (${tempUserId}) eliminado. Tu usuario principal queda intacto.\n`);
    }
  }

  // ---------------------------------------------------------
  // TEST 8: Middleware JWT authenticate (401, 403 y paso válido)
  // ---------------------------------------------------------
  console.log("▶ PRUEBA 8: Middleware authenticate (401 sin token, 403 token inválido, next() con token válido)");
  try {
    const createMockRes = () => ({
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    });

    // A) Sin token -> 401
    const resNoToken = createMockRes();
    authenticate({ headers: {} }, resNoToken, () => {});
    console.log(`  [Salida sin token]: (${resNoToken.statusCode})`, resNoToken.body);
    assert.equal(resNoToken.statusCode, 401, "Debe responder 401 cuando no hay token");

    // B) Con token falso -> 403
    const resBadToken = createMockRes();
    authenticate({ headers: { authorization: "Bearer token.falso.123" } }, resBadToken, () => {});
    console.log(`  [Salida con token inválido]: (${resBadToken.statusCode})`, resBadToken.body);
    assert.equal(resBadToken.statusCode, 403, "Debe responder 403 cuando el token es inválido");

    // C) Con token válido -> llama a next() e inyecta req.user
    let nextCalled = false;
    const reqValid = { headers: { authorization: `Bearer ${validJwtToken}` } };
    const resValid = createMockRes();
    authenticate(reqValid, resValid, () => {
      nextCalled = true;
    });
    console.log("  [Salida con token válido - req.user decodificado]:", reqValid.user);
    assert.equal(nextCalled, true, "Debe llamar a next() con un token válido");
    assert.equal(reqValid.user.email, adminCredentials.email, "req.user.email debe coincidir con tu usuario");

    stats.passed++;
    console.log("  ✔ PASS: Middleware authenticate protegió y decodificó el JWT correctamente.\n");
  } catch (error) {
    stats.failed++;
    console.error(`  ✖ FAIL: ${error.message}\n`);
  }

  // ---------------------------------------------------------
  // RESUMEN FINAL
  // ---------------------------------------------------------
  console.log("=============================================================");
  console.log(` 📊 RESUMEN FINAL: ${stats.passed} PASADOS | ${stats.failed} FALLADOS`);
  console.log("=============================================================\n");

  process.exit(stats.failed === 0 ? 0 : 1);
};

runSuite();
