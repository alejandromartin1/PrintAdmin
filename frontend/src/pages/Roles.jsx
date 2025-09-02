// src/pages/Roles.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/roles.css";

// --------------------------------------
// Permisos organizados por página y sus acciones
// --------------------------------------
const permisosPorPagina = {
  dashboard: {
    nombre: "Dashboard",
    acciones: ["ver_dashboard"]
  },
  cotizacion: {
    nombre: "Cotización",
    acciones: [
      "ver_cotizacion",
      "crear_cotizacion",
      "Ver_vista_previa"
    ]
  },
  clientes: {
    nombre: "Clientes",
    acciones: [
      "ver_clientes",
      "ver_agregar_cliente",
      "historial_clientes",
      "crear_cliente",
      "editar_cliente",
      "eliminar_cliente",
      "ver_historial_por_cada_clientes"
    ]
  },
  inventario: {
    nombre: "Inventario",
    acciones: [
      "ver_inventario",
"crear_producto",
"editar_producto",
"eliminar_producto",
"disminuir_producto",
"aumentar_producto"

    ]
  },
  empleados: {
    nombre: "Empleados",
    acciones: ["agregar_empleado",
      "editar_empleado",
      "eliminar_empleado"
    ]
  },
  pendientes: {
    nombre: "Pendientes",
    acciones: ["ver_pendientes"]
  },
  movimientos: {
    nombre: "Entradas y Salidas",
    acciones: ["ver_movimientos",
      "editar_trabajo",
      "eliminar_trabajo",
      "editar_gasto",
      "eliminar_gasto"
    ]
  },
  pendientesFactura: {
    nombre: "Pendientes por Factura",
    acciones: ["ver_pendientes_factura"]
  },
  historialCotizaciones: {
    nombre: "Historial de Cotizaciones",
    acciones: ["ver_historial_cotizaciones"]
  }
};

function Roles() {
  const [roles, setRoles] = useState([]);
  const [showCrear, setShowCrear] = useState(false);
  const [nombreNuevoRol, setNombreNuevoRol] = useState("");
  const [permisosNuevoRol, setPermisosNuevoRol] = useState([]);
  const [errorCrear, setErrorCrear] = useState("");
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      const rolesProcesados = response.data.map((rol) => ({
        ...rol,
        permisos: Array.isArray(rol.permisos)
          ? rol.permisos
          : rol.permisos?.split(",").map((p) => p.trim()) || [],
      }));
      setRoles(rolesProcesados);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este rol?")) {
      try {
        await axios.delete(`http://localhost:5000/api/roles/${id}`);
        fetchRoles();
      } catch (error) {
        console.error("Error al eliminar el rol:", error);
      }
    }
  };

  const togglePermiso = (permiso) => {
    if (permisosNuevoRol.includes(permiso)) {
      setPermisosNuevoRol(permisosNuevoRol.filter((p) => p !== permiso));
    } else {
      setPermisosNuevoRol([...permisosNuevoRol, permiso]);
    }
  };

  const handleCrearRol = async (e) => {
    e.preventDefault();
    setErrorCrear("");

    if (!nombreNuevoRol.trim()) {
      setErrorCrear("El nombre del rol es obligatorio.");
      return;
    }

    setLoadingCrear(true);
    try {
      const payload = { nombre: nombreNuevoRol.trim(), permisos: permisosNuevoRol };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/roles/${editingId}`, payload);
      } else {
        await axios.post("http://localhost:5000/api/roles", payload);
      }
      setEditingId(null);
      setNombreNuevoRol("");
      setPermisosNuevoRol([]);
      setShowCrear(false);
      fetchRoles();
    } catch (error) {
      console.error("Error al guardar el rol:", error);
      setErrorCrear("Error al guardar el rol.");
    }
    setLoadingCrear(false);
  };

  const startEdit = (role) => {
    setEditingId(role.id);
    setNombreNuevoRol(role.nombre);
    setPermisosNuevoRol(
      Array.isArray(role.permisos)
        ? role.permisos
        : role.permisos?.split(",").map((p) => p.trim()) || []
    );
    setShowCrear(true);
  };

  return (
    <div className="roles-container">
      <div className="roles-content">
        <div className="roles-header">
          <h1>Gestión de Roles</h1>
          <button className="btn-crear" onClick={() => {
            setShowCrear(!showCrear);
            if (showCrear) {
              setEditingId(null);
              setNombreNuevoRol("");
              setPermisosNuevoRol([]);
            }
          }}>
            {showCrear ? "Cancelar" : "+ Crear Nuevo Rol"}
          </button>
        </div>

        {showCrear && (
          <form onSubmit={handleCrearRol} className="form-crear-rol">
            <h2>{editingId ? "Editar Rol" : "Crear Nuevo Rol"}</h2>
            {errorCrear && <p className="error">{errorCrear}</p>}

            <label>Nombre del Rol</label>
<input
  type="text"
  value={nombreNuevoRol}
  onChange={(e) => setNombreNuevoRol(e.target.value)}
  disabled={loadingCrear || !!editingId} // ❌ Deshabilitado al editar
  placeholder="Ejemplo: Administrador"
/>


            {/* ----------------------------- */}
            {/* Permisos por página */}
            {/* ----------------------------- */}
            {Object.keys(permisosPorPagina).map((paginaKey) => (
              <div key={paginaKey} className="pagina-permisos">
                <label className="pagina-titulo">{permisosPorPagina[paginaKey].nombre}</label>
                <div className="checkbox-grid">
                  {permisosPorPagina[paginaKey].acciones.map((permiso) => (
                    <label key={permiso} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={permisosNuevoRol.includes(permiso)}
                        onChange={() => togglePermiso(permiso)}
                        disabled={loadingCrear}
                      />
                      <span>{permiso.replace(/_/g, " ")}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button type="submit" className="btn-guardar" disabled={loadingCrear}>
              {editingId ? "Actualizar Rol" : "Guardar Rol"}
            </button>
          </form>
        )}

        <table className="tabla-roles">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Rol</th>
              <th>Permisos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.nombre}</td>
                  <td>{role.permisos?.join(", ") || "Sin permisos"}</td>
                  <td className="acciones">
                    <button className="btn-editar" onClick={() => startEdit(role)}>
                      Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleDelete(role.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="sin-roles">No hay roles disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Roles;
