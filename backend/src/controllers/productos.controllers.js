import ProductosModel from "../models/productos.models.js";

const getProductos = async (req, res) => {
  try {
    const productos = await ProductosModel.getAll();
    return res.json(productos);
  } catch (error) {
    console.error("error en el api" + error);
  }
};

const postProductos = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      stock,
      unidad_medida,
      precio_unitario,
      id_categoria,
      id_proveedor,
    } = req.body;

    const result = await ProductosModel.postProducto({
      nombre,
      descripcion,
      stock,
      unidad_medida,
      precio_unitario,
      id_categoria,
      id_proveedor,
    });

    res.status(200).json({
      mensaje: "agregado correctamente",
    });
  } catch (error) {
    console.error("nose pudo agregar" + error);
  }
};

const putProductos = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      descripcion,
      stock,
      unidad_medida,
      precio_unitario,
      id_categoria,
      id_proveedor,
    } = req.body;
    const result = await ProductosModel.putProducto(
      id,
      nombre,
      descripcion,
      stock,
      unidad_medida,
      precio_unitario,
      id_categoria,
      id_proveedor
    );
    if (result === 0) {
      res.status(400).json({
        mensaje: "verifica los datos",
      });
    } else {
      res.status(200).json({
        mensaje: "editado exitoso",
      });
    }
  } catch (error) {
    console.error("error en el api " + error);
  }
};

const deleteProductos = async (req, res) => {
  const {id} = req.params;

  try {
    const result = await ProductosModel.delProducto(id);

    if (!result) {
      res.status(404).json({
        mensaje: "no encontrado",
      });
    } else {
      res.json({
        mensaje: "eliminado correctamente",
      });
    }
  } catch (error) {
    console.error("error en el api" + error);
  }
};

const obtenerProductoPorId = async (req,res) => { 

   const {id} = req.params;

   try {
    const result = await ProductosModel.getPorId(id);
    if(!result) { 
        res.json({
            mensaje : "no encontrado"
        });
    }else { 
        res.json(result);
    }
   } catch (error) {
    console.error("error en el api " + error);
   }
}


const obtenerProductoPorCategorias = async (req,res) => {
     
    const {id_categoria} = req.params ; 

    try {
        const rows = await ProductosModel.getCategoriaPro(id_categoria);
        
        if(rows.length === 0 ){ 
            res.json({
                mensaje : "nose encontraron productos de esta categoria"
            });
        }else { 
            res.json(rows);
        }
    } catch (error) {
        console.error("error en el api" + error);
    }

}


const getProdNom = async(req,res) => { 
  try {
    const result =  await ProductosModel.getNombrePro();
    res.json(result);
  } catch (error) {
    console.log(error);
  }
}
export const method = {
  getProductos,
  postProductos,
  putProductos,
  deleteProductos,
  obtenerProductoPorId,
  obtenerProductoPorCategorias,
  getProdNom
};
