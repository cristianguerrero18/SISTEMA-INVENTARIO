import getConexion from "../db/database.js";


const UsuarioModel = {

   getAll : async() => {
   
    const conexion = await getConexion();
    const [rows] = await conexion.query("select * from usuarios");
    return rows;
   },

   getPorId : async(id) => {
     
     const conexion = await getConexion();
     const [rows] = await conexion.query("select * from usuarios where id_usuario=?" , [id]);
     return rows[0];
   },

   postUser : async({nombre,rol_id,usuario,clave}) => { 
      const conexion = await getConexion();
      const [rows] = await conexion.query("INSERT INTO usuarios (nombre,rol_id,usuario,clave) values (?,?,?,?)",[nombre,rol_id,usuario,clave]);
      return rows.insertId;
   },

   deleteUser : async(id) => { 
    const conexion = await getConexion();
    const [rows] = await conexion.query("delete from usuarios where id_usuario=?",[id]);
    return rows.affectedRows;

   },

  putUser : async({nombre,usuario,clave,rol_id,id}) => {
   const conexion =  await getConexion();
   const [rows] =  await conexion.query("UPDATE usuarios SET nombre=?,usuario=?,clave=?,rol_id=? WHERE id_usuario=?",[nombre,usuario,clave, rol_id,id]);
   return rows.affectedRows;  
},

getUserName :  async()=>{ 
   const conexion =  await getConexion();
   const [rows] = await conexion.query("select nombre , id_usuario from usuarios");
   return rows;
}


}

export default UsuarioModel;