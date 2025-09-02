const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// Rutas específicas PRIMERO
router.get('/', inventarioController.getInventario);
router.post('/', inventarioController.addInventario);
router.put('/incrementar/:id', inventarioController.incrementarInventario);
router.put('/disminuir/:id', inventarioController.disminuirInventario);

// Ruta genérica al final
router.put('/:id', inventarioController.updateInventario);
router.delete('/:id', inventarioController.deleteInventario);

module.exports = router;
