import getConexion from "../db/database.js";
import CategoriaModel from "../models/categorias.models.js"


const getCategorias = async (req,res) => {

    try {
        const categorias = await  CategoriaModel.getAll();
        res.json(categorias);
    } catch (error) {
        console.error("500");
    }
}


const postCategorias = async (req,res) => {
   
   try {

      const {nombre,descripcion} = req.body; 
      
      const id = await CategoriaModel.postCat({nombre,descripcion});

      res.status(200).json({
        mensaje : "agregado correctamente"
      });
   } catch (error) {
    console.error("error al insertar" + error);
   }

}

const deleteCategorias = async (req,res) => {
    try {
        const {id} = req.params;
        
        const rows = await CategoriaModel.CatEliminar(id);

        if(rows === 0) {
            return res.status(400).json({mensaje : "id no encontrado"});
        }
        res.status(200).json({
            mensaje : "eliminado correctamente"
        });
    } catch (error) {
        console.error("error al eliminar" + error);
    }
}

const getCategoriaPorId = async (req,res) => {
    try {
         const {id} = req.params;

         const result = await CategoriaModel.CatPorId(id);
  
         if(!result) {
            return res.status(400).json({mensaje : "id no encontrado"});
        }
         res.json(result);
    } catch (error) {
        console.error("error al obtener categoria");
    }
}

const getCatName =  async (req,res) => { 

  try {
    const rows =  await CategoriaModel.CatName();
    res.json(rows);
  } catch (error) {
    console.log("error en el api" + error)
  }
}

const putCategoria =  async (req,res) => {
    try {
        const {id} = req.params ; 
        const {nombre,descripcion} =  req.body ; 

        const result =  await CategoriaModel.putCategoria({nombre,descripcion,id});

        if(result>0){ 
            res.json({
                mensaje : "editado correctamente"
            });
        }else { 
            res.json({
                mensaje : "error al editar"
            });
        }
    } catch (error) {
        console.log("error en el api" + error);
    }
}

export const method =  {
     getCategorias,
     postCategorias,
     deleteCategorias,
     getCategoriaPorId,
     getCatName,
     putCategoria
}



