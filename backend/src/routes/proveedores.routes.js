import { method as ProveedoresController } from "../controllers/proveedores.controllers.js";
import Router from "express";
import { body } from "express-validator";
import { verificarToken } from "../middlewares/auth.js";


const router = Router();

router.get("/", verificarToken,ProveedoresController.getProveedores);
router.post("/",ProveedoresController.postProveedores);

router.get("/:id" , ProveedoresController.getProveedoresPorid);
router.delete("/:id" , ProveedoresController.deleteProveedores);
router.put("/:id" , ProveedoresController.putProveedores);
router.get("/nombre/proveedor" , ProveedoresController.getNombreProveedor);

export default router;
