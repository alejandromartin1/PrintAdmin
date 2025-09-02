const pool = require('../db');

// Crear factura a partir de entrada
const crearFactura = async ({ entrada_id, metodo_pago, notas, creado_por }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Obtener datos de la entrada
    const entradaRes = await client.query(
      `SELECT id, total, descripcion, cantidad, id_cliente 
       FROM entradas 
       WHERE id = $1`,
      [entrada_id]
    );

    if (entradaRes.rows.length === 0) {
      throw new Error("Entrada no encontrada");
    }

    const entrada = entradaRes.rows[0];
    const subtotal = entrada.total;
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const cliente_id = entrada.id_cliente || null;
    const folio = "FAC-" + Date.now();

    // Insertar en facturas
    const facturaRes = await client.query(
      `INSERT INTO facturas 
        (folio, entrada_id, cliente_id, subtotal, iva, total, metodo_pago, estatus, notas, creado_por)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'emitida',$8,$9)
       RETURNING *`,
      [folio, entrada_id, cliente_id, subtotal, iva, total, metodo_pago, notas, creado_por]
    );

    await client.query("COMMIT");
    return facturaRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Obtener todas las facturas
const getFacturas = async () => {
  const res = await pool.query(
    `SELECT f.*, c.nombre AS cliente_nombre
     FROM facturas f
     LEFT JOIN clientes c ON c.id = f.cliente_id
     ORDER BY f.id DESC`
  );
  return res.rows;
};

// Obtener factura por id
const getFacturaById = async (id) => {
  const res = await pool.query(
    `SELECT f.*, c.nombre AS cliente_nombre
     FROM facturas f
     LEFT JOIN clientes c ON c.id = f.cliente_id
     WHERE f.id = $1`,
    [id]
  );
  return res.rows[0];
};

module.exports = {
  crearFactura,
  getFacturas,
  getFacturaById,
};
