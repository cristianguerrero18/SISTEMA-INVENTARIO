import { method } from "../controllers/productos.controllers.js";
import Router from "express";
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

router.get("/",method.getProductos);
router.post("/", verificarToken, method.postProductos);
router.put("/:id", verificarToken, method.putProductos);
router.delete("/:id",verificarToken, method.deleteProductos);
router.get("/:id", verificarToken, method.obtenerProductoPorId);
router.get("/categoria/:id_categoria", verificarToken, method.obtenerProductoPorCategorias);
router.get("/producto/nombre",method.getProdNom);

export default router;
