const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');  
const verifyAdmin = require('../middleware/verifyAdmin'); 
const multer = require('multer');
const path = require('path');

// 📂 Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads')); // guarda en /backend/uploads
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ Rutas disponibles
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getUserData);
router.get('/perfil', authMiddleware, authController.getPerfilCompleto);
router.post('/perfil/foto', authMiddleware, upload.single('foto'), authController.subirFotoPerfil);

module.exports = router;
