require('dotenv').config();
const express = require('express');
const cors = require('cors');
<<<<<<< HEAD

const authRoutes = require('./routes/authRoutes');
const cotizacionRoutes = require('./routes/cotizacionRoutes');
=======
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const inventarioRoutes = require('./routes/inventario');
const clientesRoutes = require('./routes/clientes');
>>>>>>> a9e47f8b3cb0ecd707d947e2e57639e2292905d7

const app = express();
app.use(cors());
<<<<<<< HEAD
app.use(express.json());
=======
app.use('/api/inventario', inventarioRoutes);
app.use(clientesRoutes);
>>>>>>> a9e47f8b3cb0ecd707d947e2e57639e2292905d7

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
