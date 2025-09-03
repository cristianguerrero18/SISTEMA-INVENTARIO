import getConexion from "../db/database.js";

const ProductosModel = {
  getAll: async () => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(`
          SELECT p.*, c.nombre AS categoria_nombre , pr.nombre AS proveedor_nombre
          FROM productos p
          INNER JOIN categorias c ON p.id_categoria = c.id_categoria
          INNER JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
        `);
    return rows;
  },

  getPorId: async (id) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "select * from productos where id_producto=?",
      [id]
    );
    return rows[0];
  },

  postProducto: async ({
    nombre,
    descripcion,
    stock,
    unidad_medida,
    precio_unitario,
    id_categoria,
    id_proveedor,
  }) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "insert into productos (nombre,descripcion,stock,unidad_medida,precio_unitario,id_categoria,id_proveedor) values (?,?,?,?,?,?,?)",
      [
        nombre,
        descripcion,
        stock,
        unidad_medida,
        precio_unitario,
        id_categoria,
        id_proveedor,
      ]
    );
    return rows.insertId;
  },

  delProducto: async (id) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "delete from productos where id_producto=?",
      id
    );
    return rows.affectedRows;
  },

  putProducto: async (
    id,
    nombre,
    descripcion,
    stock,
    unidad_medida,
    precio_unitario,
    id_categoria,
    id_proveedor
  ) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "UPDATE productos SET nombre=?,descripcion=?,stock=?,unidad_medida=?,precio_unitario=?,id_categoria=?,id_proveedor=? where id_producto=?",
      [
        nombre,
        descripcion,
        stock,
        unidad_medida,
        precio_unitario,
        id_categoria,
        id_proveedor,
        id,
      ]
    );
    return rows.affectedRows;
  },

  getCategoriaPro: async (id_categoria) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "select * from productos where id_categoria=?",
      [id_categoria]
    );
    return rows;
  },

  getNombrePro : async()=> {
    const conexion =  await getConexion();
    const [rows] =  await conexion.query("select nombre , id_producto from productos");
    return rows;
  }
};
export default ProductosModel;
