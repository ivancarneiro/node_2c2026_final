import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const prefix = "Bearer ";

  // Verificar que exista el header y empiece con "Bearer "
  if (!authHeader || !authHeader.startsWith(prefix)) {
    return res.status(401).json({
      error: "Acceso no autorizado: Token no proporcionado o formato inválido",
    });
  }

  // Extraer solo el token quitando la palabra "Bearer "
  const token = authHeader.slice(prefix.length);

  // Verificar validez y firma del token
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario en la request
    next();             // Dejamos pasar al controlador
  } catch (error) {
    return res.status(403).json({
      error: "Token inválido o expirado",
    });
  }
};