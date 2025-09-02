const express = require('express');
const router = express.Router();
const { getFacturas, getFacturaById } = require('../controllers/facturasController');

// Ruta para obtener todas las facturas
router.get('/', getFacturas);

// Ruta para obtener factura por ID
router.get('/:id', getFacturaById);

module.exports = router;
