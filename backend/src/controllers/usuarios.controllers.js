import getConexion from "../db/database.js";
import { validationResult } from "express-validator";
import UsuarioModel from "../models/usuarios.models.js";
import jwt from "jsonwebtoken";
import config from "../config.js";

const getUsuarios = async (req, res) => {
  try {
    const usuario = await UsuarioModel.getAll();
    res.json(usuario);
  } catch (error) {
    console.error("error en el api" + error);
  }
};

const postUsuarios = async (req, res) => {
  try {
    const validar = validationResult(req);
    if (!validar.isEmpty()) {
      return res.status(400).json({ errores: validar.array() });
    }

    const { nombre, rol_id, usuario, clave } = req.body;

    const result = await UsuarioModel.postUser({ nombre, rol_id, usuario, clave });

    res.status(200).json({
      mensaje: "agregado exitosamente",
    });
  } catch (error) {
    console.error("error en el api" + error);
  }
};

const ObtenerUsuarioPorID = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await UsuarioModel.getPorId(id);

    if (!result || result.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(result);
  } catch (error) {
    console.error("error " + error);
  }
};



const deleteUsuarios = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UsuarioModel.deleteUser(id);

    if (result === 0) {
      res.status(401).json({ mensaje: "usuario no encontrado" });
    }
    res.status(200).json({
      mensaje: "eliminado correctamente",
    });
  } catch (error) {
    console.error("error en el api" + error);
  }
};

const login = async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "SELECT * FROM usuarios WHERE usuario=? and clave=? ",
      [usuario, clave]
    );

    if (rows.length > 0) {
      const user = rows[0];

      // Generamos el token con el id_usuario y rol_id
      const token = jwt.sign({ id: user.id_usuario, rol: user.rol_id }, config.jwtSecret, {
        expiresIn: config.jwtExpires,
      });

      res.json({
        success: true,
        mensaje: "login exitoso",
        token,
        id_usuario : user.id_usuario,
        rol_id: user.rol_id // Cambiar a rol_id para consistencia
      });
    } else {
      res.status(401).json({
        success: false,
        mensaje: "Usuario o contraseña incorrectos",
      });
    }
  } catch (error) {
    console.error("Error en el API:", error.stack); // Mejorar logging
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
const putUsuarios = async (req, res) => {
  try {
    const { nombre, usuario, clave , rol_id} = req.body;
    const { id } = req.params;

    const result = await UsuarioModel.putUser({ nombre, usuario, clave, rol_id, id });

    if (result > 0) {
      res.json({
        mensaje: "editado correctamente",
      });
    } else {
      res.json({
        mensaje: "nose encontro el usuario",
      });
    }
  } catch (error) {
    console.error("error en el api" + error);
  }
};

const getNomUser = async(req,res) => { 
  try {
    const result = await UsuarioModel.getUserName();
    return res.json(result);
  } catch (error) {
    console.log(error);
  }
}

export const method = {
  getUsuarios,
  postUsuarios,
  deleteUsuarios,
  login,
  putUsuarios,
  ObtenerUsuarioPorID,
  getNomUser
};
