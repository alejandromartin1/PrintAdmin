require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // 👈 Faltaba esto


const authRoutes = require('./routes/authRoutes');
const cotizacionRoutes = require('./routes/cotizacionRoutes');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const inventarioRoutes = require('./routes/inventario');
const clientesRoutes = require('./routes/clientes');
const entradasRoutes = require('./routes/entradasRoutes');
const salidasRoutes = require ('./routes/salidasRoutes');
const busquedaRoutes = require('./routes/busquedaRoutes');
const correosRoutes = require('./routes/correos');
const rolesRoutes = require('./routes/rolesRoutes');
const usuarioRoutes = require('./routes/usuario.routes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const facturasRoutes = require("./routes/facturasRoutes");
const pendientesFacturaRoutes = require('./routes/pendientesFacturaRoutes');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(helmet());

app.use(clientesRoutes);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos por IP
  message: "Demasiados intentos, intenta más tarde.",
});

// Solo se aplica en la ruta de login
app.use("/api/auth/login", limiter);

// Rutas
app.use('/api/inventario', inventarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);
app.use('/api/cotizaciones', require('./routes/cotizacionRoutes'));
app.use('/api/entradas', entradasRoutes);
app.use('/api/salidas', salidasRoutes);
app.use('/api/busqueda', busquedaRoutes);
app.use('/api', correosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/pendientes-factura', pendientesFacturaRoutes); // ✅ Corrección
app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
