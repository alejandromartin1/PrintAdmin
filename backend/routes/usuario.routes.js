const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { obtenerPerfil } = require('../controllers/usuario.controller');

// Ruta protegida
router.get('/perfil', authMiddleware, obtenerPerfil);

module.exports = router;
