import getConexion from "../db/database.js";
import { validationResult } from "express-validator";
import ProveedoresModel from "../models/proveedores.models.js";
import { response } from "express";

const getProveedores = async (req, res) => {
  try {
    const proveedores = await ProveedoresModel.getAll();
    return res.json(proveedores);
  } catch (error) {
    console.error("error" + error);
  }
};

const postProveedores = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  try {
    const { nombre, telefono, email, direccion } = req.body;
    const result = await ProveedoresModel.postProvedores({nombre,telefono,email,direccion});
    res.json({
      mensaje: "agregado exitosamente",
    });
  } catch (error) {
    console.error("error en el api " + error);
  }
};

const getProveedoresPorid = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ProveedoresModel.getPorId(id);
    
    if(!result){
      res.status(400).json({mensaje : "verifica el id"});
    }
    res.json(result);
  } catch (error) {
    console.log("error en el api" + error);
  }
};

const deleteProveedores = async (req, res) => {
  const { id } = req.params;

  try { 
    const result = await ProveedoresModel.deleteProv(id);
    if (result > 0) {
      res.json({ mensaje: "eliminado correctamente" });
    } else {
      res.json({ mensaje: "proveedor no encontrado verifique su id" });
    }
  } catch (error) {
    console.log("error en el api " + error);
  }
};

const putProveedores = async (req,res)  => { 

    const {nombre,telefono,email,direccion} = req.body;
    const {id} = req.params ; 

    try {
      const result = await ProveedoresModel.putProv({nombre,telefono,email,direccion,id});

      if(result>0) { 
        res.json({
          mensaje : "editado exitoso"
        });
      }else { 
        res.json({
          error : "errror en el api"
        })
      }

    } catch (error) {
      console.log("ERROR 404 NO FOUND");
    }
}

const getNombreProveedor = async (req,res) => { 
   try {
    const row = await ProveedoresModel.ProNom();
    res.json(row);
   } catch (error) {
    console.log("error en el api");
   }
}

export const method = {
  getProveedores,
  postProveedores,
  getProveedoresPorid,
  deleteProveedores,
  putProveedores,
  getNombreProveedor
};
