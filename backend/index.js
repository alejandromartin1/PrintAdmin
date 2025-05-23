require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const cotizacionRoutes = require('./routes/cotizacionRoutes');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const inventarioRoutes = require('./routes/inventario');
const clientesRoutes = require('./routes/clientes');
const entradasRoutes = require('./routes/entradasRoutes');
const salidasRoutes = require ('./routes/salidasRoutes');

const app = express();
app.use(cors());
app.use(express.json());


app.use(clientesRoutes);

// Rutas
app.use('/api/inventario', inventarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);
app.use('/api/entradas', entradasRoutes);
app.use('/api/salidas', salidasRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
