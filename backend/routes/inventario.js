const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

router.get('/', inventarioController.getInventario);
router.post('/', inventarioController.addInventario);
router.delete('/:id', inventarioController.deleteInventario);
router.put('/:id', inventarioController.updateInventario);
router.put('/disminuir/:id', inventarioController.disminuirInventario);

module.exports = router;
