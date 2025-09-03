import { method as MovimientosController} from "../controllers/movimientos.controllers.js";
import Router from "express"
import {verificarToken} from "../middlewares/auth.js";
const router  =  Router();


router.get("/",verificarToken ,MovimientosController.getMovimientos);
router.post("/" ,verificarToken, MovimientosController.postMovimientos);
router.put("/:id", verificarToken,MovimientosController.editarMovimientos);
router.delete("/:id", verificarToken,MovimientosController.deleteMovimientos);
router.get("/:id", verificarToken,MovimientosController.getMovid);

export default router;

