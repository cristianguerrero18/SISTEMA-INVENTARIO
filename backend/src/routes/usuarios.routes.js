import { method as UsuariosController } from "../controllers/usuarios.controllers.js";
import Router from "express";
import { body } from "express-validator";
import { verificarToken } from "../middlewares/auth.js";
const router = Router();

router.get("/", verificarToken , UsuariosController.getUsuarios);
router.post(
  "/",
  [
   body("nombre").notEmpty().withMessage("el nombre es obligatorio").isAlpha('es-ES',{ignore: ' '}).withMessage("solo deberia ser letras"),
   body("clave").isLength({min : 5}).withMessage("el valor min de la clave es 5")
  ],
  UsuariosController.postUsuarios
);
router.delete("/:id", UsuariosController.deleteUsuarios);
router.post("/login", UsuariosController.login);
router.put("/:id", UsuariosController.putUsuarios);
router.get("/:id"  ,verificarToken, UsuariosController.ObtenerUsuarioPorID);
router.get("/nombre/usuario",UsuariosController.getNomUser);


export default router;
