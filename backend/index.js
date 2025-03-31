require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    console.log('Body recibido:', req.body); // Agrega esto
    
    try {
        const { nombre, apellido, correo, contrasena } = req.body;
        
        // Validación básica
        if (!nombre || !apellido || !correo || !contrasena) {
            console.log('Faltan campos requeridos');
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const userExists = await pool.query(
            'SELECT * FROM usuario WHERE correo = $1', 
            [correo]
        );
        
        if (userExists.rows.length > 0) {
            console.log('Usuario ya existe');
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        console.log('Contraseña hasheada correctamente');
        
        await pool.query(
            'INSERT INTO usuario (nombre, apellido, correo, contrasena) VALUES ($1, $2, $3, $4)',
            [nombre, apellido, correo, hashedPassword]
        );

        console.log('Usuario registrado exitosamente');
        res.json({ message: 'Usuario registrado correctamente' });
        
    } catch (error) {
        console.error('Error completo en registro:', error); // Esto te dará más detalles
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: error.message // Envía el mensaje de error al frontend
        });
    }
});

// 🔹 Login de usuario
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    
    try {
        // Buscar usuario en la base de datos
        const userResult = await pool.query(
            'SELECT id, nombre, apellido, correo, contrasena FROM usuario WHERE correo = $1',
            [correo]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = userResult.rows[0];
        
        // Comparar contraseñas
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id,
                correo: user.correo 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
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
});

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));