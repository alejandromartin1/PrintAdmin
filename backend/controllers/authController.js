const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Traemos usuario + rol (+ permisos si existen en la tabla rol)
    const result = await pool.query(`
      SELECT 
        u.id, 
        (u.nombre || ' ' || u.apellido) AS nombreapellido, 
        u.correo, 
        u.contrasena, 
        u.foto, 
        r.nombre AS rol,
        r.permisos
      FROM usuario u
      LEFT JOIN rol r ON u.id_rol = r.id
      WHERE u.correo = $1
    `, [correo]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificación de contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generamos token
    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      process.env.JWT_SECRET || 'secreto_usuario',
      { expiresIn: '10h' }
    );

    // Convertir permisos a array
    let permisos = [];
    if (user.permisos) {
      permisos = user.permisos.split(',').map(p => p.trim());
    }

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombreapellido,
        correo: user.correo,
        rol: user.rol,
        foto: user.foto,
        permisos
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener datos mínimos del usuario autenticado
const getUserData = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No autorizado' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_usuario');

    const result = await pool.query(
      `SELECT id, (nombre || ' ' || apellido) AS nombreapellido, correo FROM usuario WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener perfil completo (nombre completo, correo, rol y foto_perfil)
const getPerfilCompleto = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No autorizado' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_usuario');

    const result = await pool.query(`
      SELECT 
        u.id,
        (u.nombre || ' ' || u.apellido) AS nombreapellido,
        u.correo,
        r.nombre AS rol,
        u.foto AS foto_perfil
      FROM usuario u
      LEFT JOIN rol r ON u.id_rol = r.id
      WHERE u.id = $1
    `, [decoded.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil completo:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Subir foto de perfil
const subirFotoPerfil = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No autorizado' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_usuario');

    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna foto' });
    }

    const rutaFoto = req.file.filename;

    await pool.query(
      'UPDATE usuario SET foto = $1 WHERE id = $2',
      [rutaFoto, decoded.id]
    );

    res.json({ message: 'Foto de perfil actualizada correctamente', foto: rutaFoto });
  } catch (error) {
    console.error('Error al subir foto:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const register = (req, res) => {
  return res.status(403).json({
    message: 'Registro no permitido. Contacta al administrador.'
  });
};

module.exports = {
  register,
  login,
  getUserData,
  getPerfilCompleto,
  subirFotoPerfil
};
