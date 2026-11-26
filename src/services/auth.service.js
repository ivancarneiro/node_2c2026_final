import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userModel from "../models/user.models.js";

export const registerUser = async (email, password) => {
    if (!email || typeof email !== "string" || !email.includes("@")) {
        const error = new Error("Debes proporcionar un email válido");
        error.statusCode = 400;
        throw error;
    }
    if (!password || typeof password !== "string" || password.length < 6) {
        const error = new Error("La contraseña debe tener al menos 6 caracteres");
        error.statusCode = 400;
        throw error;
    }

    // Validacion de si ya existe el usuario
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
        const error = new Error("El email ya está registrado");
        error.statusCode = 409; // Conflict
        throw error;
    }

    // Cifrar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar en base de datos
    const newUser = await userModel.create({ email, password: hashedPassword });

    return { id: newUser.id, email: newUser.email };
};


export const loginUser = async (email, password) => {
  // Validar argumentos
  if (!email || !password) {
    const error = new Error("Email y password son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  // Buscar usuario en Firestore
  const user = await userModel.findByEmail(email);
  if (!user) {
    const error = new Error("Credenciales inválidas: email o password incorrectos");
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // Comparar password en texto plano con el hash en Firestore
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Credenciales inválidas: email o password incorrectos");
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // Generar y firmar el JWT
  const JWT_SECRET = process.env.JWT_SECRET;

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15min" });

  // Retornar el token
  return {
    token,
    tokenType: "Bearer",
    expiresIn: "15min",
  };
};