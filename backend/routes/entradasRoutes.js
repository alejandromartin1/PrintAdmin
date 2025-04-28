const express = require('express');
const router = express.Router();
const EntradasController = require('../controllers/entradasController');

router.get('/todos', EntradasController.getEntradas);// Devuelve todas las entradas
router.post('/crear', EntradasController.crearEntrada);// Crea las entradas
router.put('/:id/pagar', EntradasController.marcarPagado);// Para marcar en pagado
router.get('/pendientes', EntradasController.getPendientes);// Para visualizar pagos pendientes
router.get('/resumen/diario', EntradasController.getResumenDiario);// Ruta para obtener el resumen diario
router.get('/resumen/semanal', EntradasController.getResumenSemanal);// Ruta para obtener el resumen semanal
router.get('/resumen/mensual', EntradasController.getResumenMensual);// Ruta para obtener el resumen mensual
router.get('/buscar', EntradasController.buscarEntradas);// Buscar entradas
router.get('/cliente/:id', EntradasController.historialPorCliente);// Buscar por id cliente
router.put('/editar/:id', EntradasController.editarEntrada); // Editar una entrada
router.delete('/eliminar/:id', EntradasController.eliminarEntrada);// Eliminar una entradas

module.exports = router;
