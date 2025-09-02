const db = require('../db');

// Crear nuevo empleado
exports.crearEmpleado = async (req, res) => {
  const { nombreapellido, rol, estado } = req.body;

  if (!nombreapellido || !rol || typeof estado !== 'boolean') {
    return res.status(400).json({ message: 'Todos los campos son obligatorios y válidos' });
  }

  try {
    await db.query(
      'INSERT INTO empleado (nombreapellido, rol, estado) VALUES ($1, $2, $3)',
      [nombreapellido, rol, estado]
    );
    res.status(201).send('Empleado creado');
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ message: 'Error del servidor al crear empleado' });
  }
};

// Obtener todos
exports.obtenerEmpleados = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM empleado ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ message: 'Error al obtener empleados' });
  }
};

// Obtener por ID
exports.obtenerEmpleadoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM empleado WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ message: 'Error al obtener empleado' });
  }
};

// Actualizar
exports.actualizarEmpleado = async (req, res) => {
  const { id } = req.params;
  const { nombreapellido, rol, estado } = req.body;

  try {
    await db.query(
      'UPDATE empleado SET nombreapellido = $1, rol = $2, estado = $3 WHERE id = $4',
      [nombreapellido, rol, estado, id]
    );
    res.send('Empleado actualizado');
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ message: 'Error al actualizar empleado' });
  }
};

// Eliminar
exports.eliminarEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM empleado WHERE id = $1', [id]);
    res.send('Empleado eliminado');
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ message: 'Error al eliminar empleado' });
  }
};
