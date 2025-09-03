import getConexion from "../db/database.js";


const MovimientosModal = {

    getAll : async() => { 

        const conexion =  await getConexion();
        const [rows] =  await conexion.query("select * from movimientos");
        return rows ;
    },
    postMovimientos : async({id_producto,tipo,cantidad,fecha,observacion,id_usuario}) => {
        const conexion =  await getConexion();
        const [rows] =  await conexion.query("INSERT INTO movimientos (id_producto,tipo,cantidad,fecha,observacion,id_usuario) values (?,?,?,?,?,?)",[id_producto,tipo,cantidad,fecha,observacion,id_usuario]);
        
        let operacion = 0;

        if(tipo==="entrada"){
            operacion = cantidad;
        }else if(tipo==="salida") { 
            operacion = -cantidad;
        }else { 
            operacion = -cantidad;
        }
        
        const [result] = await conexion.query("UPDATE productos SET stock = stock + ? WHERE id_producto=?" , [operacion,id_producto]);
        return rows.insertId;
    },
    deleteMovimientos : async(id) => { 
        const conexion =  await getConexion();
        const [rows] =  await conexion.query("DELETE FROM movimientos WHERE id_movimiento=?",[id]);
        return rows.affectedRows;
    },
    editMovimientos : async({id_producto,tipo,cantidad,observacion,id_usuario,id}) => {
        const conexion =  await getConexion();
        const [rows] =  await conexion.query("UPDATE movimientos SET id_producto=?,tipo=?,cantidad=?,observacion=?,id_usuario=? WHERE id_movimiento=?",[id_producto,tipo,cantidad,observacion,id_usuario,id]);
        return rows.affectedRows;
    },
    getMovid :  async(id) => { 
        const conexion =await getConexion();
        const [rows] =  await conexion.query("SELECT * FROM movimientos WHERE id_movimiento=?",[id]);
        return rows;
    }
}

export default MovimientosModal ; 