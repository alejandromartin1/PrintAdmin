const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');

router.post('/crear', cotizacionController.crearCotizacion); //crear nueva cotizacion
router.get('/todas', cotizacionController.obtenerCotizaciones); //obtener todas las cotizaciones
router.get('/:id', cotizacionController.obtenerCotizacionPorId); //obtener una cotizacion especifica, usando su ID
router.get('/cliente/:id_cliente', cotizacionController.obtenerCotizacionesPorCliente); //Trae todas las cotizaciones asociadas a un cliente especifico por su ID


module.exports = router;
