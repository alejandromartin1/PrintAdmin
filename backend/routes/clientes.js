// routes/clientesRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/total', clienteController.getTotalClientes); 
router.get('/:id', clienteController.getClienteById);     
router.get('/', clienteController.getClientes);           
router.post('/', clienteController.addCliente);
router.delete('/:id', clienteController.deleteCliente);
router.put('/:id', clienteController.updateCliente);

module.exports = router;
