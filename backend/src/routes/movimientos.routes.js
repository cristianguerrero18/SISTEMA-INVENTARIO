import { method as MovimientosController} from "../controllers/movimientos.controllers.js";
import Router from "express"

const router  =  Router();


router.get("/",MovimientosController.getMovimientos);
router.post("/" , MovimientosController.postMovimientos);
router.put("/:id",MovimientosController.editarMovimientos);
router.delete("/:id",MovimientosController.deleteMovimientos);
router.get("/:id",MovimientosController.getMovid);

export default router;

