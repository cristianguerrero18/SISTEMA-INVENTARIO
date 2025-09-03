import getConexion from "../db/database.js";


const ProveedoresModel = { 

   getAll : async() => { 
    const conexion = await getConexion();
    const [rows] = await conexion.query("SELECT * FROM proveedores");
    return rows;
   },
   getPorId : async(id) => { 
      const conexion = await getConexion();
      const [rows] = await conexion.query("SELECT * FROM proveedores where id_proveedor=?" , [id]);
    return rows[0];
   },
   postProvedores :  async({nombre,telefono,email,direccion}) => { 

      const conexion =  await getConexion();
      const [rows] =  await conexion.query("INSERT INTO proveedores (nombre,telefono,email,direccion) values (?,?,?,?)",[nombre,telefono,email,direccion]);
      return rows.insertId;
   },
   deleteProv :  async(id) => {
      const conexion =  await  getConexion();
      const [rows] = await conexion.query("DELETE FROM proveedores WHERE id_proveedor=? " , [id]);
      return rows.affectedRows;
   },
   putProv : async({nombre,telefono,email,direccion,id}) => { 

      const conexion =  await getConexion();
      const [rows] =  await conexion.query("UPDATE proveedores SET nombre=?,telefono=?,email=?,direccion=? WHERE id_proveedor=?",[nombre,telefono,email,direccion,id]);
      return rows.affectedRows;
   },
   ProNom : async() => { 
     const conexion  =  await getConexion();
     const [rows] =  await conexion.query("select nombre , id_proveedor FROM proveedores");
     return rows ;
   }
}



export default ProveedoresModel;