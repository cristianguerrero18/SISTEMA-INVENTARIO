import { method as ProveedoresController } from "../controllers/proveedores.controllers.js";
import Router from "express";
import { body } from "express-validator";
import { verificarToken } from "../middlewares/auth.js";


const router = Router();

router.get("/", verificarToken,ProveedoresController.getProveedores);
router.post("/", verificarToken,ProveedoresController.postProveedores);

router.get("/:id" ,verificarToken, ProveedoresController.getProveedoresPorid);
router.delete("/:id" , verificarToken, ProveedoresController.deleteProveedores);
router.put("/:id" , verificarToken,ProveedoresController.putProveedores);
router.get("/nombre/proveedor" ,verificarToken, ProveedoresController.getNombreProveedor);

export default router;
