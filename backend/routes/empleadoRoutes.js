const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

router.get('/', empleadoController.obtenerEmpleados); // Puedes usar '/todos' si prefieres

router.get('/todos', empleadoController.obtenerEmpleados); // Redundante pero opcional

router.post('/crear', empleadoController.crearEmpleado);

router.get('/:id', empleadoController.obtenerEmpleadoPorId);

router.put('/editar/:id', empleadoController.actualizarEmpleado);

router.delete('/eliminar/:id', empleadoController.eliminarEmpleado);

module.exports = router;