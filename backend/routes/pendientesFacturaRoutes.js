const express = require('express');
const router = express.Router();
const pendientesCtrl = require('../controllers/pendientesFacturaController');

// Guardar factura pendiente
router.post('/', pendientesCtrl.guardarPendiente);

// Obtener todas las facturas pendientes
router.get('/', pendientesCtrl.getPendientes);

// Marcar como facturado
router.put('/:id/facturado', pendientesCtrl.marcarFacturado);

module.exports = router;
