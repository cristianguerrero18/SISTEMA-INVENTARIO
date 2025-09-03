import getConexion from "../db/database.js";


const CategoriaModel = {
    getAll : async() =>{
       const conexion = await getConexion();
       const [rows] = await conexion.query("SELECT * FROM categorias");
       return rows ;
    },
    postCat : async({nombre,descripcion}) => {
        const conexion = await getConexion();
        const [result] = await conexion.query("INSERT INTO categorias (nombre,descripcion) values (?,?)",[nombre,descripcion]);
        return result.insertId;
    },
    CatPorId : async(id) => {
        const conexion = await getConexion();
        const [result] = await conexion.query("SELECT * FROM categorias WHERE id_categoria=? " , [id]);
        return result[0];
    },
    CatEliminar : async(id) => { 
        const conexion  = await getConexion();
        const [rows] = await conexion.query("DELETE FROM categorias WHERE id_categoria=?",[id]);
        return rows.affectedRows;
    },
    CatName : async() =>  { 
        const conexion =  await getConexion();
        const  [rows] =  await conexion.query("SELECT nombre , id_categoria FROM categorias");
        return rows;
    },
    putCategoria : async({nombre,descripcion,id})=> {
        const conexion =  await getConexion();
        const [rows] =  await conexion.query("UPDATE categorias SET nombre=?,descripcion=? where id_categoria=?",[nombre,descripcion,id]);
        return rows.affectedRows;
    }
};

export default CategoriaModel;

