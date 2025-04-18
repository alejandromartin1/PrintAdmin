const Cotizacion = require('../models/cotizacionModel');

const crearCotizacion = async (req, res) => {
  const { id_cliente, conceptos, subtotal, iva, total } = req.body;

  try {
    const cotizacion = await Cotizacion.createCotizacion(id_cliente, conceptos, subtotal, iva, total);
    res.status(201).json({ message: 'Cotización creada', cotizacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cotización', error: error.message });
  }
};

const obtenerCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.getAllCotizaciones();
    res.status(200).json(cotizaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cotizaciones', error: error.message });
  }
};

const obtenerCotizacionPorId = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.getCotizacionById(req.params.id);
    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    res.status(200).json(cotizacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cotización', error: error.message });
  }
};


const obtenerCotizacionesPorCliente = async (req, res) => {
    try {
      const { id_cliente } = req.params;
      const cotizaciones = await Cotizacion.getCotizacionesPorCliente(id_cliente);
  
      if (cotizaciones.length === 0) {
        return res.status(404).json({ message: 'No se encontraron cotizaciones para este cliente' });
      }
  
      res.status(200).json(cotizaciones);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener cotizaciones por cliente', error: error.message });
    }
  };

  
module.exports = {
  crearCotizacion,
  obtenerCotizaciones,
  obtenerCotizacionPorId,
  obtenerCotizacionesPorCliente
};
