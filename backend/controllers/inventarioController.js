const pool = require('../db'); // Asegúrate de que la ruta sea correcta

// Obtener todo el inventario
exports.getInventario = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventario');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// Agregar nuevo producto al inventario
exports.addInventario = async (req, res) => {
    const { producto, cantidad, estado, descripcion } = req.body;
    const fecha_ingreso = new Date();
    try {
        const result = await pool.query(
            'INSERT INTO inventario (producto, cantidad, estado, descripcion, fecha_ingreso) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [producto, cantidad, estado, descripcion, fecha_ingreso]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error en addInventario:', error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
};

// Eliminar producto por ID
exports.deleteInventario = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM inventario WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

// Actualizar producto por ID
exports.updateInventario = async (req, res) => {
    const { id } = req.params;
    const { producto, cantidad, descripcion } = req.body;
    try {
        const result = await pool.query(
            'UPDATE inventario SET producto = $1, cantidad = $2, descripcion = $3 WHERE id = $4 RETURNING *',
            [producto, cantidad, descripcion, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

// Disminuir cantidad de un producto (mínimo 0)
exports.disminuirInventario = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT cantidad FROM inventario WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const cantidadActual = result.rows[0].cantidad;
        if (cantidadActual <= 0) {
            return res.status(400).json({ error: 'La cantidad ya es 0, no se puede disminuir más.' });
        }

        const nuevaCantidad = cantidadActual - 1;
        const updateResult = await pool.query(
            'UPDATE inventario SET cantidad = $1 WHERE id = $2 RETURNING *',
            [nuevaCantidad, id]
        );

        res.json({
            message: 'Cantidad disminuida correctamente',
            producto: updateResult.rows[0],
        });
    } catch (error) {
        console.error('Error al disminuir cantidad:', error);
        res.status(500).json({ error: 'Error al disminuir cantidad del producto' });
    }
};

// ✅ Incrementar cantidad de un producto (+1)
exports.incrementarInventario = async (req, res) => {
    const { id } = req.params;
    try {
        const updateResult = await pool.query(
            'UPDATE inventario SET cantidad = cantidad + 1 WHERE id = $1 RETURNING *',
            [id]
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({
            message: 'Cantidad incrementada correctamente',
            producto: updateResult.rows[0],
        });
    } catch (error) {
        console.error('Error al incrementar cantidad:', error);
        res.status(500).json({ error: 'Error al incrementar cantidad del producto' });
    }
};
