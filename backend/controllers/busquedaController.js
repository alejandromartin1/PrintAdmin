const pool = require('../db');
const buscarGlobal = async (req, res) => {
  const { q } = req.query;
  try {
    console.log('🔎 Búsqueda recibida:', q);

    const query = `
      -- CLIENTE
      SELECT 'cliente' AS origen, id, nombre || ' ' || apellido AS titulo, correo AS detalle,
             '/clientes/agregarCliente?buscar=' || id AS ruta
      FROM cliente 
      WHERE CAST(id AS TEXT) = $1 OR nombre = $1 OR apellido = $1 OR correo = $1

      UNION ALL
      -- USUARIO
      SELECT 'usuario', id, nombre || ' ' || apellido, correo,
             '/roles?usuario=' || id AS ruta
      FROM usuario 
      WHERE CAST(id AS TEXT) = $1 OR nombre = $1 OR apellido = $1 OR correo = $1

      UNION ALL
      -- COTIZACIONES
      SELECT 'cotizaciones', id, 'Cotización #' || id, '', 
             '/cotizacion?buscar=' || id AS ruta
      FROM cotizaciones 
      WHERE CAST(id AS TEXT) = $1

      UNION ALL
      -- INVENTARIO
      SELECT 'inventario', id, producto, descripcion,
             '/inventario?buscar=' || id AS ruta
      FROM inventario 
      WHERE CAST(id AS TEXT) = $1 OR producto = $1

      UNION ALL
      -- BITÁCORA
      SELECT 'bitacora_actividades', id, accion, '', 
             '/dashboard?bitacora=' || id AS ruta
      FROM bitacora_actividades 
      WHERE CAST(id AS TEXT) = $1 OR accion = $1

      UNION ALL
      -- ENTRADAS
      SELECT 'entradas', id, concepto, '', 
             '/EntradasYSalidas?entrada=' || id AS ruta
      FROM entradas 
      WHERE CAST(id AS TEXT) = $1 OR concepto = $1

      UNION ALL
      -- SALIDAS
      SELECT 'salidas', id, descripcion, '', 
             '/EntradasYSalidas?salida=' || id AS ruta
      FROM salidas 
      WHERE CAST(id AS TEXT) = $1 OR descripcion = $1

      UNION ALL
      -- DETALLE COTIZACION
      SELECT 'detalle_cotizacion', id, 'Detalle #' || id, '', 
             '/cotizacion/detalle?buscar=' || id AS ruta
      FROM detalle_cotizacion 
      WHERE CAST(id AS TEXT) = $1

      UNION ALL
      -- ROL
      SELECT 'rol', id, nombre, '', 
             '/roles?rol=' || id AS ruta
      FROM rol 
      WHERE CAST(id AS TEXT) = $1 OR nombre = $1

      UNION ALL
      -- FACTURA
      SELECT 'factura', id, 'Factura #' || id, '', 
             '/factura?buscar=' || id AS ruta
      FROM factura 
      WHERE CAST(id AS TEXT) = $1

      UNION ALL
      -- PENDIENTES FACTURA
      SELECT 'pendientes_factura', id, 'Pendiente Factura #' || id, '', 
             '/pendientes-factura?buscar=' || id AS ruta
      FROM pendientes_factura 
      WHERE CAST(id AS TEXT) = $1

      UNION ALL
      -- EMPLEADO
    SELECT 'empleado' AS origen, id, nombreapellido AS titulo, rol AS detalle,
       '/empleados?buscar=' || id AS ruta
FROM empleado 
WHERE CAST(id AS TEXT) = $1 OR nombreapellido = $1 OR rol = $1
    `;

    const { rows } = await pool.query(query, [q]); // 👈 búsqueda exacta
    res.json(rows);
  } catch (error) {
    console.error('❌ Error en la búsqueda global:', error.message);
    res.status(500).json({ error: 'Error al realizar la búsqueda global' });
  }
};

module.exports = { buscarGlobal };
