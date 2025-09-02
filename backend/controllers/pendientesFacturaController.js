const pool = require('../db');

// Guardar factura pendiente
const guardarPendiente = async (req, res) => {
  try {
    const {
      id_entrada,
      nombre = '',
      apellido = '',
      concepto = '',
      cantidad_total,
      subtotal = 0,
      iva = 0,
      total = 0,
      fecha = new Date(),
      estado = 'Pendiente'
    } = req.body;

    if (!id_entrada || cantidad_total == null) {
      return res.status(400).json({ error: 'id_entrada y cantidad_total son obligatorios' });
    }

    const result = await pool.query(
      `INSERT INTO pendientes_factura 
        (id_entrada, nombre, apellido, concepto, cantidad_total, subtotal, iva, total, fecha, estado) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [id_entrada, nombre, apellido, concepto, cantidad_total, subtotal, iva, total, fecha, estado]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error en guardarPendiente:", error);
    res.status(500).json({ error: 'No se pudo guardar la factura pendiente', detalles: error.message });
  }
};

// Obtener todas las facturas pendientes
const getPendientes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pendientes_factura WHERE estado = 'Pendiente' ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getPendientes:", error);
    res.status(500).json({ error: 'No se pudieron cargar los pendientes' });
  }
};

// Marcar como facturado
const marcarFacturado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE pendientes_factura SET estado = 'Facturado' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    res.json({ message: 'Factura marcada como Facturada', factura: result.rows[0] });
  } catch (error) {
    console.error("Error en marcarFacturado:", error);
    res.status(500).json({ error: 'No se pudo actualizar la factura' });
  }
};

module.exports = {
  guardarPendiente,
  getPendientes,
  marcarFacturado
};
