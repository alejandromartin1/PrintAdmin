const express = require('express');
const router = express.Router();
const entradasController = require('../controllers/entradasController');
const multer = require('multer');
const path = require('path');

// Configuración Multer para guardar evidencia (solo para crear entrada)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Rutas
router.get('/todos', entradasController.getEntradas);
router.get('/pendientes', entradasController.getPendientes);
router.get('/resumen/diario', entradasController.getResumenDiario);
router.get('/resumen/semanal', entradasController.getResumenSemanal);
router.get('/resumen/mensual', entradasController.getResumenMensual);

// ⚠ primero la de clientes
router.get('/clientes/:id', entradasController.historialPorCliente); // Buscar por id cliente

// luego la genérica por ID
router.get('/:id', entradasController.getEntradaById);

// Crear entrada 
router.post('/crear', upload.single('evidencia'), entradasController.crearEntrada);

// Editar entrada 
router.put('/editar/:id', entradasController.editarEntrada);

// Marcar como pagado
router.put('/:id/pagar', entradasController.marcarPagado);

// Eliminar entrada
router.delete('/eliminar/:id', entradasController.eliminarEntrada);

module.exports = router;