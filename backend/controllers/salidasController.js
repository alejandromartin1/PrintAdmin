const SalidasModel = require('../models/salidasModel');
const pool = require('../db');

const getSalidas = async (req, res) => {
  try {
    const result = await SalidasModel.getSalidas();
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearSalida = async (req, res) => {
  try {
    const nuevaSalida = req.body;
    const result = await SalidasModel.crearSalida(nuevaSalida);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResumenDiario = async (req, res) => {
  try {
    await SalidasModel.getResumenDiario(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen diario' });
  }
};

const getResumenSemanal = async (req, res) => {
  try {
    await SalidasModel.getResumenSemanal(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen semanal' });
  }
};

const getResumenMensual = async (req, res) => {
  try {
    await SalidasModel.getResumenMensual(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen mensual' });
  }
};
  
  
  const buscarSalidas = async (req, res) => {
    const { descripcion, fechaInicio } = req.query;
    try {
      const result = await SalidasModel.getSalidasFiltradas(descripcion, fechaInicio);
      res.json(result.rows);
    } catch (error) {
      console.error('Error en búsqueda de salidas:', error);
      res.status(500).json({ error: 'Error en búsqueda de salidas' });
    }
  };
  
  
   const actualizarSalida = async (req, res) => {
    const { id } = req.params;
    const { descripcion, fecha, cantidad } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE salidas SET descripcion = $1, fecha = $2, cantidad = $3 WHERE id = $4 RETURNING *',
        [descripcion, fecha, cantidad, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ mensaje: 'Salida no encontrada' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Error al actualizar salida' });
    }
  };
  
   const eliminarSalida = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM salidas WHERE id = $1', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ mensaje: 'Salida no encontrada' });
      }
  
      res.json({ mensaje: 'Salida eliminada' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Error al eliminar salida' });
    }
  };
  

module.exports = {
  getSalidas,
  crearSalida,
  getResumenDiario,
  getResumenSemanal,
  getResumenMensual,
  buscarSalidas,
  actualizarSalida,
  eliminarSalida
};
