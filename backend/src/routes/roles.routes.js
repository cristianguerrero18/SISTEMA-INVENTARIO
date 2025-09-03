import { method as RolesController} from "../controllers/roles.controllers.js";
import Router from "express"
import { verificarToken } from "../middlewares/auth.js";

const router  =  Router();

router.get('/', verificarToken, RolesController.getRoles);


export default router;


