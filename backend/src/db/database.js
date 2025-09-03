import config from "../config.js"
import mysql from "mysql2/promise"


const connection  = mysql.createConnection({

    host: config.host ,
    database : config.database,
    user : config.user,
    password : config.password
});


const getConexion = () => {
     return connection;
}

export default getConexion ; 