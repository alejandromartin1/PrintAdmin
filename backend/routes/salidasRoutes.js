const express = require('express');
const router = express.Router();
const salidascontroller = require('../controllers/salidasController');


router.get('/todos', salidascontroller.getSalidas); //obtener salidas
router.post('/crear', salidascontroller.crearSalida); //crear salidas
router.get('/resumen/diario', salidascontroller.getResumenDiario);// Ruta para obtener el resumen diario
router.get('/resumen/semanal', salidascontroller.getResumenSemanal);// Ruta para obtener el resumen semanal
router.get('/resumen/mensual', salidascontroller.getResumenMensual);// Ruta para obtener el resumen mensual
router.get('/buscar', salidascontroller.buscarSalidas);// Búsqueda de salidas por filtros
router.put('/editar/:id', salidascontroller.actualizarSalida);// Editar una salida
router.delete('/eliminar/:id', salidascontroller.eliminarSalida);// Eliminar una salida


module.exports = router;
