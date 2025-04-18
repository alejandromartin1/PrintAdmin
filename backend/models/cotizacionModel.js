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
    const cotizaciones = await pool.query(
      'SELECT * FROM cotizaciones WHERE id_cliente = $1',
      [id_cliente]
    );
    return cotizaciones.rows;
  }
};



  
module.exports = Cotizacion;
