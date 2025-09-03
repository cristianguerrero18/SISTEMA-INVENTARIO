import { method as UsuariosController } from "../controllers/usuarios.controllers.js";
import Router from "express";
import { body } from "express-validator";
import { verificarToken } from "../middlewares/auth.js";
const router = Router();

router.get("/", verificarToken , UsuariosController.getUsuarios);
router.post(
  "/",verificarToken,
  [
   body("nombre").notEmpty().withMessage("el nombre es obligatorio").isAlpha('es-ES',{ignore: ' '}).withMessage("solo deberia ser letras"),
   body("clave").isLength({min : 5}).withMessage("el valor min de la clave es 5")
  ],
  UsuariosController.postUsuarios
);
router.delete("/:id",verificarToken, UsuariosController.deleteUsuarios);
router.post("/login",verificarToken, UsuariosController.login);
router.put("/:id", verificarToken,UsuariosController.putUsuarios);
router.get("/:id"  ,verificarToken, UsuariosController.ObtenerUsuarioPorID);
router.get("/nombre/usuario", verificarToken,UsuariosController.getNomUser);


export default router;
