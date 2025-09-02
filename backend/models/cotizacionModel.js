const pool = require('../db');

const Cotizacion = {
  createCotizacion: async (id_cliente, conceptos, subtotal, iva, total, estado = 'pendiente') => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Insertar en cotizaciones
      const result = await client.query(
        'INSERT INTO cotizaciones(id_cliente, subtotal, iva, total, estado) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [id_cliente, subtotal, iva, total, estado]
      );

      const nuevaCotizacion = result.rows[0];

      // 2. Insertar detalles
      for (const item of conceptos) {
        const { concepto, cantidad, precio_unitario, iva_porcentaje } = item;

        // Calcular el total del concepto (sin IVA)
        const totalSinIva = cantidad * precio_unitario;

        // Validar si se pasó un valor de IVA explícito, incluso si es 0
        const ivaCalculado = (iva_porcentaje !== undefined && iva_porcentaje !== null)
        ? (totalSinIva * iva_porcentaje) / 100
        : (totalSinIva * 16) / 100;

        // Calcular el total final (total sin IVA + IVA)
        const totalFinal = totalSinIva + ivaCalculado;

        // Insertar en detalle_cotizacion
        await client.query(
          'INSERT INTO detalle_cotizacion(id_cotizacion, concepto, cantidad, precio_unitario, iva_porcentaje, total_final) VALUES($1, $2, $3, $4, $5, $6)',
          [
            nuevaCotizacion.id,
            concepto,
            cantidad,
            precio_unitario,
            (iva_porcentaje !== undefined && iva_porcentaje !== null) ? iva_porcentaje : 16.0,
            totalFinal
          ]
        );
      }

      await client.query('COMMIT');
      return nuevaCotizacion;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  getAllCotizaciones: async () => {
    const result = await pool.query('SELECT * FROM cotizaciones');
    return result.rows;
  },

  getCotizacionById: async (id) => {
    const cotizacion = await pool.query('SELECT * FROM cotizaciones WHERE id = $1', [id]);
    const detalles = await pool.query('SELECT * FROM detalle_cotizacion WHERE id_cotizacion = $1', [id]);

    return {
      ...cotizacion.rows[0],
      detalles: detalles.rows
    };
  },


  getCotizacionesPorCliente: async (id_cliente) => {
  const result = await pool.query(
    `
    SELECT 
      c.id AS id,
      c.fecha_creacion AS fecha,
      c.subtotal,
      c.iva,
      c.total,
      COALESCE(
        json_agg(
          json_build_object(
            'concepto', d.concepto,
            'cantidad', d.cantidad,
            'precio_unitario', d.precio_unitario,
            'iva_porcentaje', d.iva_porcentaje,
            'total_final', d.total_final
          )
        ) FILTER (WHERE d.id IS NOT NULL), 
        '[]'
      ) AS conceptos
    FROM cotizaciones c
    LEFT JOIN detalle_cotizacion d ON d.id_cotizacion = c.id
    WHERE c.id_cliente = $1
    GROUP BY c.id, c.fecha_creacion, c.subtotal, c.iva, c.total
    ORDER BY c.fecha_creacion DESC
    `,
    [id_cliente]
  );

  return result.rows;
},

// Eliminar una cotización y sus detalles
deleteCotizacion: async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Eliminar los detalles de la cotización
    await client.query('DELETE FROM detalle_cotizacion WHERE id_cotizacion = $1', [id]);

    // 2. Eliminar la cotización
    const result = await client.query('DELETE FROM cotizaciones WHERE id = $1 RETURNING *', [id]);

    await client.query('COMMIT');

    return result.rows[0]; // Devuelve la cotización eliminada
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
},

// Editar una cotización (y opcionalmente sus detalles)
updateCotizacion: async (id, id_cliente, conceptos, subtotal, iva, total) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Actualizar cotización principal
    const result = await client.query(
      'UPDATE cotizaciones SET id_cliente = $1, subtotal = $2, iva = $3, total = $4 WHERE id = $5 RETURNING *',
      [id_cliente, subtotal, iva, total, id]
    );

    // 2. Eliminar conceptos actuales
    await client.query('DELETE FROM detalle_cotizacion WHERE id_cotizacion = $1', [id]);

    // 3. Insertar nuevos conceptos
    for (const item of conceptos) {
      const { concepto, cantidad, precio_unitario, iva_porcentaje } = item;

      const totalSinIva = cantidad * precio_unitario;
      const ivaCalculado = (iva_porcentaje !== undefined && iva_porcentaje !== null)
        ? (totalSinIva * iva_porcentaje) / 100
        : (totalSinIva * 16) / 100;
      const totalFinal = totalSinIva + ivaCalculado;

      await client.query(
        'INSERT INTO detalle_cotizacion(id_cotizacion, concepto, cantidad, precio_unitario, iva_porcentaje, total_final) VALUES($1, $2, $3, $4, $5, $6)',
        [
          id,
          concepto,
          cantidad,
          precio_unitario,
          (iva_porcentaje !== undefined && iva_porcentaje !== null) ? iva_porcentaje : 16.0,
          totalFinal
        ]
      );
    }

    await client.query('COMMIT');
    return result.rows[0]; // Devuelve la cotización actualizada
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
},

};
  
module.exports = Cotizacion;
