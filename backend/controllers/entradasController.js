const EntradasModel = require('../models/entradasModel');

const getEntradas = async (req, res) => {
  try {
    const result = await EntradasModel.getEntradas();
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearEntrada = async (req, res) => {
  try {
    const nuevaEntrada = req.body;
    const result = await EntradasModel.crearEntrada(nuevaEntrada);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const marcarPagado = async (req, res) => {
  try {
    const result = await EntradasModel.marcarPagado(req.params.id);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPendientes = async (req, res) => {
  try {
    const result = await EntradasModel.getPendientes();
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResumenDiario = async (req, res) => {
    try {
      await EntradasModel.getResumenDiario(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener resumen diario' });
    }
  };
  
  const getResumenSemanal = async (req, res) => {
    try {
      await EntradasModel.getResumenSemanal(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener resumen semanal' });
    }
  };
  
  const getResumenMensual = async (req, res) => {
    try {
      await EntradasModel.getResumenMensual(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener resumen mensual' });
    }
  };
  
  const buscarEntradas = async (req, res) => {
    const { cliente, estado, fechaInicio, fechaFin, concepto } = req.query;
    try {
      const result = await EntradasModel.getEntradasFiltradas(cliente, estado, fechaInicio, fechaFin, concepto);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Error en búsqueda de entradas' });
    }
  };
  
  
  const historialPorCliente = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await EntradasModel.getEntradasPorCliente(id);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener historial del cliente' });
    }
  };
  
  const editarEntrada = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await EntradasModel.editarEntrada(id, req.body);
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al editar entrada' });
    }
  };
  
  const eliminarEntrada = async (req, res) => {
    const id = req.params.id;
    try {
      await EntradasModel.eliminarEntrada(id);
      res.json({ mensaje: 'Entrada eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar entrada' });
    }
  };

module.exports = {
  getEntradas,
  crearEntrada,
  marcarPagado,
  getPendientes,
  getResumenDiario,
  getResumenSemanal,
  getResumenMensual,
  buscarEntradas,
  historialPorCliente,
  editarEntrada,
  eliminarEntrada
};
