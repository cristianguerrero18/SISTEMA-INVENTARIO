import getConexion from "../db/database.js";

const rolesModel = {
  getall: async () => {
    const conexion = await getConexion();
    const [rows] = await conexion.query("select * from roles");
    return rows;
  }
};

export default rolesModel;
