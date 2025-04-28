const pool = require('../db');

const getEntradas = () => {
  return pool.query(`
    SELECT e.*, c.nombre, c.apellido 
    FROM entradas e
    JOIN cliente c ON e.id_cliente = c.id
    ORDER BY e.fecha DESC
  `);
};

const crearEntrada = (entrada) => {
  const { id_cliente, fecha, concepto, cantidad_total, abono, estado } = entrada;
  return pool.query(`
    INSERT INTO entradas (id_cliente, fecha, concepto, cantidad_total, abono, estado)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [id_cliente, fecha, concepto, cantidad_total, abono, estado]
  );
};

const marcarPagado = (id) => {
  return pool.query(`
    UPDATE entradas
    SET abono = cantidad_total, estado = 'completado'
    WHERE id = $1 RETURNING *`,
    [id]
  );
};

const getPendientes = () => {
  return pool.query(`
    SELECT e.*, c.nombre, c.apellido 
    FROM entradas e
    JOIN cliente c ON e.id_cliente = c.id
    WHERE e.saldo > 0
    ORDER BY e.fecha DESC
  `);
};


const getResumenDiario = async (req, res) => {
  try {
    const query = `
      SELECT SUM(abono) AS total 
      FROM entradas 
      WHERE DATE(fecha) = CURRENT_DATE
    `;
    const result = await pool.query(query);
    
    res.json({
      diario: result.rows[0]?.total || 0
    });
  } catch (error) {
    console.error('Error al obtener resumen diario:', error);
    res.status(500).json({ error: 'Error al obtener resumen diario' });
  }
};

const getResumenSemanal = async (req, res) => {
  try {
    // Obtener el inicio (lunes) y fin (domingo) de la semana actual
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0=domingo, 1=lunes, ..., 6=sábado
    
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
    lunes.setHours(0, 0, 0, 0);
    
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);

    const query = `
      SELECT SUM(abono) AS total 
      FROM entradas 
      WHERE fecha BETWEEN $1 AND $2
    `;
    const result = await pool.query(query, [lunes, domingo]);
    
    res.json({
      semanal: result.rows[0]?.total || 0
    });
  } catch (error) {
    console.error('Error al obtener resumen semanal:', error);
    res.status(500).json({ error: 'Error al obtener resumen semanal' });
  }
};

const getResumenMensual = async (req, res) => {
  try {
    const query = `
      SELECT SUM(abono) AS total 
      FROM entradas 
      WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const result = await pool.query(query);
    
    res.json({
      mensual: result.rows[0]?.total || 0
    });
  } catch (error) {
    console.error('Error al obtener resumen mensual:', error);
    res.status(500).json({ error: 'Error al obtener resumen mensual' });
  }
};

  const getEntradasFiltradas = (cliente, estado, fechaInicio, fechaFin, concepto) => {
    let query = 'SELECT * FROM entradas WHERE 1=1';
    const params = [];
  
    if (cliente) {
      params.push(`%${cliente}%`);
      query += ` AND cliente ILIKE $${params.length}`;
    }
    if (estado) {
      params.push(estado);
      query += ` AND estado = $${params.length}`;
    }
    if (fechaInicio) {
      params.push(fechaInicio);
      query += ` AND fecha >= $${params.length}`;
    }
    if (fechaFin) {
      params.push(fechaFin);
      query += ` AND fecha <= $${params.length}`;
    }
    if (concepto) {
      params.push(`%${concepto}%`);
      query += ` AND concepto ILIKE $${params.length}`;
    }
  
    return pool.query(query, params);
  };
  
  
  const getEntradasPorCliente = (idCliente) => {
    return pool.query(
      'SELECT * FROM entradas WHERE id_cliente = $1 ORDER BY fecha DESC',
      [idCliente]
    );
  };
  
  const editarEntrada = (id, datos) => {
    const { concepto, cantidad_total, estado } = datos;
    return pool.query(
      `UPDATE entradas SET concepto = $1, cantidad_total = $2, estado = $3 WHERE id = $4 RETURNING *`,
      [concepto, cantidad_total, estado, id]
    );
  };
  
  const eliminarEntrada = (id) => {
    return pool.query('DELETE FROM entradas WHERE id = $1', [id]);
  };

module.exports = {
  getEntradas,
  crearEntrada,
  marcarPagado,
  getPendientes,
  getResumenDiario,
  getResumenSemanal,
  getResumenMensual,
  getEntradasFiltradas,
  getEntradasPorCliente,
  editarEntrada,
  eliminarEntrada
};
