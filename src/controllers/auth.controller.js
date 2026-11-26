import * as authService from "../services/auth.service.js";

// Registrar un nuevo usuario (POST /auth/register)
export const register = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    const newUser = await authService.registerUser(email, password);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || "Error al registrar el usuario" });
  }
};

// Iniciar sesión y obtener Bearer Token (POST /auth/login)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    const authData = await authService.loginUser(email, password);
    res.status(200).json(authData);
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || "Error al iniciar sesión" });
  }
};