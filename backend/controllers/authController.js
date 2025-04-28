const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const userExists = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    await pool.query(
      'INSERT INTO usuario (nombre, apellido, correo, contrasena) VALUES ($1, $2, $3, $4)',
      [nombre, apellido, correo, hashedPassword]
    );

    res.json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const result = await pool.query(
      'SELECT id, nombre, apellido, correo, contrasena FROM usuario WHERE correo = $1',
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo }, 
      process.env.JWT_SECRET, 
      { expiresIn: '10h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

  // Añade este nuevo método al final del archivo
const getUserData = async (req, res) => {
  try {
    // Verificar el token JWT
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Obtener datos del usuario
    const result = await pool.query(
      'SELECT id, nombre, apellido, correo FROM usuario WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Añade getUserData a las exportaciones
module.exports = { register, login, getUserData };
