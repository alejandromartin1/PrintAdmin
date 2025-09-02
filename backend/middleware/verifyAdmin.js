const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'Token faltante' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'Acceso denegado: Solo admins' });
    }
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};



module.exports = verifyAdmin;
