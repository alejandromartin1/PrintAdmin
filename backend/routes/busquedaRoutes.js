// backend/routes/busquedaRoutes.js
const express = require('express');
const router = express.Router();
const { buscarGlobal } = require('../controllers/busquedaController');

router.get('/busqueda', buscarGlobal);
router.get('/', buscarGlobal);


module.exports = router;
