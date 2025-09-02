const EntradasModel = require('../models/entradasModel');

// Obtener todas las facturas (opcional si las necesitas)
const getFacturas = async (req, res) => {
  try {
    const facturas = await EntradasModel.getEntradas();
    res.json(facturas.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener factura por ID
const getFacturaById = async (req, res) => {
  const { id } = req.params;
  try {
    const entrada = await EntradasModel.getEntradaById(id);
    if (!entrada) return res.status(404).json({ message: 'Entrada no encontrada' });
    res.json(entrada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFacturas,
  getFacturaById
};
