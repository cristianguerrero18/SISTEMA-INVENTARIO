import { method as CategoriasController} from "../controllers/categorias.controllers.js"
import Router from "express"
import {verificarToken} from "../middlewares/auth.js";

const router = Router();

router.get('/', verificarToken, CategoriasController.getCategorias);
router.post('/', verificarToken,CategoriasController.postCategorias);
router.delete('/:id', verificarToken , CategoriasController.deleteCategorias);
router.get('/:id', verificarToken , CategoriasController.getCategoriaPorId);
router.get('/nombre/categoria', verificarToken , CategoriasController.getCatName);
router.put('/:id', verificarToken, CategoriasController.putCategoria);

export default router ; 




