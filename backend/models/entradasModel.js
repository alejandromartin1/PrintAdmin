const pool = require('../db');

// Obtener todas las entradas con info del cliente
const getEntradas = () => {
  return pool.query(`
    SELECT e.*, c.nombre, c.apellido
    FROM entradas e
    JOIN cliente c ON e.id_cliente = c.id
    ORDER BY e.fecha DESC, e.id DESC
  `);
};

// Obtener entrada por ID con info del cliente
const getEntradaById = (id) => {
  return pool.query(`
    SELECT e.*, c.nombre, c.apellido
    FROM entradas e
    JOIN cliente c ON e.id_cliente = c.id
    WHERE e.id = $1
  `, [id]);
};

// Crear nueva entrada
const crearEntrada = (entrada) => {
  const {
    id_cliente,
    fecha,
    concepto,
    cantidad_total,
    abono = 0,
    estado = abono >= cantidad_total ? 'completado' : 'pendiente',
    metodo_pago,
    evidencia
  } = entrada;

  return pool.query(`
    INSERT INTO entradas (
      id_cliente, fecha, concepto, cantidad_total, abono, estado, metodo_pago, evidencia
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [id_cliente, fecha, concepto, cantidad_total, abono, estado, metodo_pago || null, evidencia || null]);
};

// Editar entrada (sumando nuevo abono)
const editarEntrada = async (id, datos) => {
  const { abono = 0, metodo_pago, evidencia } = datos;

  const entradaActual = await pool.query(
    'SELECT abono, cantidad_total FROM entradas WHERE id = $1',
    [id]
  );

  if (!entradaActual.rows.length) throw new Error('Entrada no encontrada');

  const abonoPrevio = Number(entradaActual.rows[0].abono || 0);
  const cantidadTotal = Number(entradaActual.rows[0].cantidad_total);

  let abonoTotal = abonoPrevio + Number(abono);
  if (abonoTotal > cantidadTotal) abonoTotal = cantidadTotal;

  const estado = abonoTotal >= cantidadTotal ? 'completado' : 'pendiente';

  const result = await pool.query(`
    UPDATE entradas
    SET 
      abono = $1,
      estado = $2,
      metodo_pago = COALESCE($3, metodo_pago),
      evidencia = COALESCE($4, evidencia)
    WHERE id = $5
    RETURNING *
  `, [abonoTotal, estado, metodo_pago || null, evidencia || null, id]);

  return result.rows[0];
};

// Eliminar entrada
const eliminarEntrada = (id) => {
  return pool.query('DELETE FROM entradas WHERE id = $1', [id]);
};

// Marcar como pagado
const marcarPagado = (id) => {
  return pool.query(`
    UPDATE entradas
    SET abono = cantidad_total, estado = 'completado'
    WHERE id = $1
    RETURNING *
  `, [id]);
};

// Entradas pendientes
const getPendientes = () => {
  return pool.query(`
    SELECT e.*, c.nombre, c.apellido, (e.cantidad_total - e.abono) AS saldo
    FROM entradas e
    JOIN cliente c ON e.id_cliente = c.id
    WHERE (e.cantidad_total - e.abono) > 0
    ORDER BY e.fecha DESC, e.id DESC
  `);
};

// Resumen diario, semanal y mensual
const getResumenDiario = () => pool.query(`
  SELECT SUM(abono) AS total FROM entradas WHERE DATE(fecha) = CURRENT_DATE
`);

const getResumenSemanal = () => {
  const hoy = new Date();
  const diaSemana = hoy.getDay();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
  lunes.setHours(0, 0, 0, 0);

  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);
  domingo.setHours(23, 59, 59, 999);

  return pool.query(`SELECT SUM(abono) AS total FROM entradas WHERE fecha BETWEEN $1 AND $2`, [lunes, domingo]);
};

const getResumenMensual = () => pool.query(`
  SELECT SUM(abono) AS total 
  FROM entradas 
  WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
`);

// Filtrar entradas
const getEntradasFiltradas = (cliente, estado, fechaInicio, fechaFin, concepto) => {
  let query = `
    SELECT e.*, c.nombre, c.apellido
    FROM entradas e
    JOIN cliente c ON e.id_cliente = c.id
    WHERE 1=1
  `;
  const params = [];

  if (cliente) {
    params.push(`%${cliente}%`);
    query += ` AND (c.nombre ILIKE $${params.length} OR c.apellido ILIKE $${params.length})`;
  }
  if (estado) {
    params.push(estado);
    query += ` AND e.estado = $${params.length}`;
  }
  if (fechaInicio) {
    params.push(fechaInicio);
    query += ` AND e.fecha >= $${params.length}`;
  }
  if (fechaFin) {
    params.push(fechaFin);
    query += ` AND e.fecha <= $${params.length}`;
  }
  if (concepto) {
    params.push(`%${concepto}%`);
    query += ` AND e.concepto ILIKE $${params.length}`;
  }

  query += ' ORDER BY e.fecha DESC, e.id DESC';
  return pool.query(query, params);
};

// Entradas por cliente
const getEntradasPorCliente = (idCliente) => {
  return pool.query(`
    SELECT *
    FROM entradas
    WHERE id_cliente = $1
    ORDER BY fecha DESC, id DESC
  `, [idCliente]);
};

module.exports = {
  getEntradas,
  getEntradaById,
  crearEntrada,
  editarEntrada,
  eliminarEntrada,
  marcarPagado,
  getPendientes,
  getResumenDiario,
  getResumenSemanal,
  getResumenMensual,
  getEntradasFiltradas,
  getEntradasPorCliente
};
