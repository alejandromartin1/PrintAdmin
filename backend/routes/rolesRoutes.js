// routes/rolesRoutes.js
const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/rolesController");


// Proteger todas las rutas con el middleware de administrador
router.get("/", rolesController.obtenerRoles);
router.post("/", rolesController.crearRol);
router.put("/:id", rolesController.actualizarRol);
router.delete("/:id", rolesController.eliminarRol);

module.exports = router;
