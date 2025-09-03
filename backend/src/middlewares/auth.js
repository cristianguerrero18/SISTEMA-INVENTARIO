import jwt from "jsonwebtoken";
import config from "../config.js";

export const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ mensaje: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], config.jwtSecret);
    req.user = decoded; // aquí queda disponible el id y rol
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};


