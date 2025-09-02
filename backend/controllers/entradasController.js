const EntradasModel = require('../models/entradasModel');

// Obtener todas las entradas
const getEntradas = async (req, res) => {
  try {
    const result = await EntradasModel.getEntradas();
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener entradas:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener entrada por ID
const getEntradaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await EntradasModel.getEntradaById(id);
    if (!result.rows.length) return res.status(404).json({ message: 'Entrada no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener entrada por ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// Crear nueva entrada
const crearEntrada = async (req, res) => {
  try {
    const nuevaEntrada = req.body;
    if (req.file) nuevaEntrada.evidencia = req.file.filename;
    const result = await EntradasModel.crearEntrada(nuevaEntrada);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear entrada:', error);
    res.status(500).json({ error: error.message });
  }
};

// Editar entrada
const editarEntrada = async (req, res) => {
  try {
    const result = await EntradasModel.editarEntrada(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error al editar entrada:', error);
    res.status(500).json({ error: error.message });
  }
};

// Marcar como pagado
const marcarPagado = async (req, res) => {
  try {
    const result = await EntradasModel.marcarPagado(req.params.id);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al marcar como pagado:', error);
    res.status(500).json({ error: error.message });
  }
};

// Entradas pendientes
const getPendientes = async (req, res) => {
  try {
    const result = await EntradasModel.getPendientes();
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener pendientes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Resúmenes
const getResumenDiario = async (req, res) => {
  try {
    const result = await EntradasModel.getResumenDiario();
    res.json({ diario: parseFloat(result.rows[0]?.total || 0) });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen diario' });
  }
};

const getResumenSemanal = async (req, res) => {
  try {
    const result = await EntradasModel.getResumenSemanal();
    res.json({ semanal: parseFloat(result.rows[0]?.total || 0) });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen semanal' });
  }
};

const getResumenMensual = async (req, res) => {
  try {
    const result = await EntradasModel.getResumenMensual();
    res.json({ mensual: parseFloat(result.rows[0]?.total || 0) });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen mensual' });
  }
};

// Buscar entradas filtradas
const buscarEntradas = async (req, res) => {
  const { id_cliente, estado, fechaInicio, fechaFin, concepto } = req.query;
  try {
    const result = await EntradasModel.getEntradasFiltradas(id_cliente, estado, fechaInicio, fechaFin, concepto);
    res.json(result.rows);
  } catch (error) {
    console.error('Error en búsqueda de entradas:', error);
    res.status(500).json({ error: 'Error en búsqueda de entradas' });
  }
};

// Historial por cliente
const historialPorCliente = async (req, res) => {
  try {
    const result = await EntradasModel.getEntradasPorCliente(req.params.id);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener historial del cliente:', error);
    res.status(500).json({ error: 'Error al obtener historial del cliente' });
  }
};

// Eliminar entrada
const eliminarEntrada = async (req, res) => {
  try {
    await EntradasModel.eliminarEntrada(req.params.id);
    res.json({ mensaje: 'Entrada eliminada' });
  } catch (error) {
    console.error('Error al eliminar entrada:', error);
    res.status(500).json({ error: 'Error al eliminar entrada' });
  }
};



module.exports = {
  getEntradas,
  getEntradaById,
  crearEntrada,
  editarEntrada,
  marcarPagado,
  getPendientes,
  getResumenDiario,
  getResumenSemanal,
  getResumenMensual,
  buscarEntradas,
  historialPorCliente,
  eliminarEntrada
};
