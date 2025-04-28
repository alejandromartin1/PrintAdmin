const pool = require('../db'); // Importamos la conexión a la base de datos

exports.getClientes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cliente');
        res.status(200).json(result.rows);
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los clientes', error: err });
    }
};

exports.addCliente = async (req, res) => {
    const { nombre, apellido, numero_telefono, correo, tipo_cliente } = req.body;
    
    try {
    const result = await pool.query(
        'INSERT INTO cliente (nombre, apellido, numero_telefono, correo, tipo_cliente) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [nombre, apellido, numero_telefono, correo, tipo_cliente]
    );
    res.status(201).json({ message: 'Cliente insertado con éxito', clienteId: result.rows[0].id });
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al insertar el cliente', error: err });
    }
};

exports.deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM cliente WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente eliminado con éxito', cliente: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el cliente', error: err });
    }
};

exports.updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, numero_telefono, correo, tipo_cliente } = req.body;
    
    try {
        const result = await pool.query(
            'UPDATE cliente SET nombre = $1, apellido = $2, numero_telefono = $3, correo = $4, tipo_cliente = $5 WHERE id = $6 RETURNING *',
            [nombre, apellido, numero_telefono, correo, tipo_cliente, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente actualizado con éxito', cliente: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el cliente', error: err });
    }
};
// Obtener cliente por ID
exports.getClienteById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM cliente WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el cliente por ID', error: err });
    }
};
