const pool = require("../db"); // Conexión a PostgreSQL

// Obtener todos los roles
exports.obtenerRoles = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rol ORDER BY id ASC");
    const roles = result.rows.map((rol) => ({
      ...rol,
      permisos: typeof rol.permisos === "string"
        ? rol.permisos.split(",").map(p => p.trim()).filter(p => p !== "")
        : [],
    }));
    res.json(roles);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({ mensaje: "Error al obtener los roles" });
  }
};

// Crear un nuevo rol
exports.crearRol = async (req, res) => {
  const { nombre, permisos } = req.body;
  try {
    const existe = await pool.query("SELECT * FROM rol WHERE nombre = $1", [nombre]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ mensaje: "Ese rol ya existe" });
    }

    const permisosStr = Array.isArray(permisos) ? permisos.join(",") : "";
    const result = await pool.query(
      "INSERT INTO rol (nombre, permisos) VALUES ($1, $2) RETURNING *",
      [nombre, permisosStr]
    );

    const rolCreado = result.rows[0];
    rolCreado.permisos = permisos;
    res.status(201).json(rolCreado);
  } catch (error) {
    console.error("Error al crear rol:", error);
    res.status(500).json({ mensaje: "Error al crear rol" });
  }
};

// Actualizar un rol existente
exports.actualizarRol = async (req, res) => {
  const { id } = req.params;
  const { nombre, permisos } = req.body;

  try {
    const permisosStr = Array.isArray(permisos) ? permisos.join(",") : "";

    const result = await pool.query(
      "UPDATE rol SET nombre = $1, permisos = $2 WHERE id = $3 RETURNING *",
      [nombre, permisosStr, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }

    const rolActualizado = result.rows[0];
    rolActualizado.permisos = permisos;

    res.json(rolActualizado);
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ mensaje: "Error al actualizar rol" });
  }
};

// Eliminar un rol
exports.eliminarRol = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM rol WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }
    res.json({ mensaje: "Rol eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    res.status(500).json({ mensaje: "Error al eliminar rol" });
  }
};
