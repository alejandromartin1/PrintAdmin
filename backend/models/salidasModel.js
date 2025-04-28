const pool = require('../db');

const getSalidas = () => {
  return pool.query(`
    SELECT * FROM salidas
    ORDER BY fecha DESC
  `);
};

const crearSalida = (salida) => {
  const { descripcion, fecha, cantidad } = salida;
  return pool.query(`
    INSERT INTO salidas (descripcion, fecha, cantidad)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [descripcion, fecha, cantidad]
  );
};


const getResumenDiario = async (req, res) => {
  try {
    const hoy = new Date();
    const query = `
      SELECT SUM(cantidad) AS total 
      FROM salidas 
      WHERE DATE(fecha) = CURRENT_DATE
    `;
    const result = await pool.query(query);
    
    res.json({
      diario: result.rows[0]?.total || 0
    });
  } catch (error) {
    console.error('Error al obtener resumen diario de salidas:', error);
    res.status(500).json({ error: 'Error al obtener resumen diario de salidas' });
  }
};

const getResumenSemanal = async (req, res) => {
  try {
    const query = `
      SELECT SUM(cantidad) AS total 
      FROM salidas 
      WHERE EXTRACT(WEEK FROM fecha) = EXTRACT(WEEK FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const result = await pool.query(query);
    
    res.json({
      semanal: result.rows[0]?.total || 0
    });
  } catch (error) {
    console.error('Error al obtener resumen semanal de salidas:', error);
    res.status(500).json({ error: 'Error al obtener resumen semanal de salidas' });
  }
};

const getResumenMensual = async (req, res) => {
  try {
    const query = `
      SELECT SUM(cantidad) AS total 
      FROM salidas 
      WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const result = await pool.query(query);
    
    res.json({
      mensual: result.rows[0]?.total || 0
    });
  } catch (error) {
    console.error('Error al obtener resumen mensual de salidas:', error);
    res.status(500).json({ error: 'Error al obtener resumen mensual de salidas' });
  }
};
  
  // Obtener todas las salidas filtradas
  const getSalidasFiltradas = (descripcion, fechaInicio) => {
    let query = 'SELECT * FROM salidas WHERE 1=1';
    const params = [];
  
    if (descripcion) {
      params.push(`%${descripcion}%`);
      query += ` AND descripcion ILIKE $${params.length}`;
    }
    if (fechaInicio) {
      params.push(fechaInicio);
      query += ` AND fecha >= $${params.length}`;
    }
  
    return pool.query(query, params);
  };
  

  
  // Editar una salida
  const editarSalida = (id, datos) => {
    const { descripcion, cantidad } = datos;
    return pool.query(
      `UPDATE salidas SET descripcion = $1, cantidad = $2 WHERE id = $3 RETURNING *`,
      [descripcion, cantidad, id]
    );
  };
  
  // Eliminar una salida
  const eliminarSalida = (id) => {
    return pool.query('DELETE FROM salidas WHERE id = $1', [id]);
  };


module.exports = {
  getSalidas,
  crearSalida,
  getSalidasFiltradas,
  editarSalida,
  eliminarSalida,
  getResumenDiario,
  getResumenSemanal,
  getResumenMensual
};
