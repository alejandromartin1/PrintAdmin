const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController'); // Asegúrate de que la ruta sea correcta

// ponemos las rutas de los clientes
router.get('/api/clientes', clienteController.getClientes);
router.post('/api/cliente', clienteController.addCliente);
router.delete('/api/cliente/:id', clienteController.deleteCliente);
router.put('/api/cliente/:id', clienteController.updateCliente);
router.get('/api/clientes/:id', clienteController.getClienteById);
module.exports = router;
