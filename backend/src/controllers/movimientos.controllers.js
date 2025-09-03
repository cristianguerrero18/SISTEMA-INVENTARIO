import MovimientosModal from "../models/movimientos.models.js";

const getMovimientos = async (req, res) => {
  try {
    const result = await MovimientosModal.getAll();
    res.json(result);
  } catch (error) {
    console.error("error en el api");
  }
};

const postMovimientos = async (req, res) => {
  const { id_producto, tipo, cantidad, fecha, observacion, id_usuario } = req.body;
  try {
    const result = await MovimientosModal.postMovimientos({
      id_producto,
      tipo,
      cantidad,
      fecha,
      observacion,
      id_usuario,
    });

    res.json({
      mensaje: "agregado correctamente",
    });
  } catch (error) {
    console.log("error en el api verifica" + error);
  }
};

const deleteMovimientos = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await MovimientosModal.deleteMovimientos(id);

    if (result > 0) {
      res.json({
        mensaje: "eliminado correctamente",
      });
    } else {
      res.json({
        mensaje: "nose encontro el id",
      });
    }
  } catch (error) {
    console.error("error en el api" + error);
  }
};

const editarMovimientos = async (req, res) => {
  const { id_producto, tipo, cantidad, observacion, id_usuario } = req.body;
  const { id } = req.params;

  try {
    const result = await MovimientosModal.editMovimientos({
      id_producto,
      tipo,
      cantidad,
      observacion,
      id_usuario,
      id,
    });

    if (result > 0) {
      res.json({
        mensaje: "editado correctamente",
      });
    } else {
      res.json({
        mensaje: "error al editar",
      });
    }
  } catch (error) {
    console.error("error en el api" +error);
  }
};

const getMovid = async (req, res) => { 
  try {
    const { id } = req.params;
    const result = await MovimientosModal.getMovid(id);

    if (result.length > 0) {
      res.json(result[0]); // 🔹 devolver el primer objeto
    } else {
      res.status(404).json({ mensaje: "No se encontró el movimiento" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};




export const method = {
  postMovimientos,
  getMovimientos,
  deleteMovimientos,
  editarMovimientos,
  getMovid
};
