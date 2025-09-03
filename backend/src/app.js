import express from "express"
import CategoriasRouter from "./routes/categorias.routes.js"
import UsuariosRouter from "./routes/usuarios.routes.js"
import ProveedoresRouter from "./routes/proveedores.routes.js"
import ProductosRouter from "./routes/productos.routes.js"
import MovimientosRouter from "./routes/movimientos.routes.js"
import RolesRouter  from "./routes/roles.routes.js"
import cors from "cors";


const app = express();

app.use(cors());
app.use(express.json())
app.use('/api/roles',RolesRouter);
app.use('/api/categorias', CategoriasRouter);
app.use('/api/usuarios',UsuariosRouter);
app.use('/api/proveedores',ProveedoresRouter);
app.use('/api/productos',ProductosRouter);
app.use('/api/movimientos',MovimientosRouter);
app.set("PORT" , 7000);


export default app;