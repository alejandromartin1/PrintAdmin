import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUsersCog, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import '../styles/empleados.css';

import {useLocation } from 'react-router-dom';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState(null);

   const location = useLocation();
  const params = new URLSearchParams(location.search);
  const buscarId = params.get("buscar"); // 👈 capturar query param


    const permisosUsuario = JSON.parse(localStorage.getItem("permisos")) || [];
    const rol = localStorage.getItem("rol");
    const esAdmin = rol === "Administrador";

  useEffect(() => {
    obtenerEmpleados();
  }, []);

   useEffect(() => {
  if (buscarId) {
    const empleadoEncontrado = empleados.find(e => e.id.toString() === buscarId);
    if (empleadoEncontrado) {
      setEditingEmpleado(empleadoEncontrado); // abre modal
    }
  }
}, [empleados, buscarId]);


  const obtenerEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/empleados/todos');
      setEmpleados(res.data);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const eliminarEmpleado = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/empleados/eliminar/${id}`);
        await obtenerEmpleados();
        Swal.fire('Eliminado', 'El empleado ha sido eliminado.', 'success');
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        Swal.fire('Error', 'No se pudo eliminar el empleado.', 'error');
      }
    }
  };

  const editarEmpleado = async (e) => {
    e.preventDefault();
    try {
      // Convierte estado a boolean antes de enviar
      const empleadoAEnviar = {
        ...editingEmpleado,
        estado: editingEmpleado.estado === true || editingEmpleado.estado === 'true',
      };
      await axios.put(`http://localhost:5000/api/empleados/editar/${editingEmpleado.id}`, empleadoAEnviar);
      setEditingEmpleado(null);
      obtenerEmpleados();
      Swal.fire('Actualizado', 'El empleado fue actualizado correctamente.', 'success');
    } catch (error) {
      console.error('Error al editar empleado:', error);
      Swal.fire('Error', 'No se pudo actualizar el empleado.', 'error');
    }
  };

  const agregarEmpleado = async (e) => {
    e.preventDefault();
    try {
      // Convierte estado a boolean antes de enviar
      const empleadoAEnviar = {
        ...nuevoEmpleado,
        estado: nuevoEmpleado.estado === true || nuevoEmpleado.estado === 'true',
      };
      await axios.post('http://localhost:5000/api/empleados/crear', empleadoAEnviar);
      setNuevoEmpleado(null);
      obtenerEmpleados();
      Swal.fire('Agregado', 'El nuevo empleado ha sido agregado.', 'success');
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      Swal.fire('Error', 'No se pudo agregar el empleado.', 'error');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEmpleado({
      ...editingEmpleado,
      [name]: name === 'estado' ? (value === 'true') : value,
    });
  };

  const handleNuevoChange = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado({
      ...nuevoEmpleado,
      [name]: name === 'estado' ? (value === 'true') : value,
    });
  };

  return (
    <div className="empleados-container">
      <div className="empleados-header">
        <h2 className="empleados-title">
          <FontAwesomeIcon icon={faUsersCog} /> Gestión de Empleados
        </h2>
         {(esAdmin || permisosUsuario.includes("agregar_empleado")) && (
        <button
          className="empleados-add-btn"
          onClick={() => setNuevoEmpleado({ nombreapellido: '', rol: '', estado: true })}
        >
          <FontAwesomeIcon icon={faPlus} /> Agregar Empleado
        </button>
         )}

      </div>

      <div className="empleados-table-container">
        <table className="empleados-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.nombreapellido}</td>
                <td>{emp.rol}</td>
                <td>
                  <span className={`empleados-badge ${emp.estado ? 'empleados-badge-activo' : 'empleados-badge-inactivo'}`}>
                    {emp.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="empleados-actions">
                   {(esAdmin || permisosUsuario.includes("editar_empleado")) && (
                  <button
                    className="empleados-btn-edit"
                    onClick={() => setEditingEmpleado(emp)}
                    title="Editar"
                  >
                    <FontAwesomeIcon icon={faEdit} /> Editar
                  </button>
                    )}

                      {(esAdmin || permisosUsuario.includes("eliminar_empleado")) && (
                  <button
                    className="empleados-btn-delete"
                    onClick={() => eliminarEmpleado(emp.id)}
                    title="Eliminar"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                  </button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Editar */}
      {editingEmpleado && (
        <div className="empleados-modal-overlay">
          <form onSubmit={editarEmpleado} className="empleados-form-modal">
            <h3>Editar Empleado</h3>
            <div className="empleados-form-group">
              <label>Nombre y Apellido</label>
              <input type="text" name="nombreapellido" value={editingEmpleado.nombreapellido} onChange={handleEditChange} required />
            </div>
            <div className="empleados-form-group">
              <label>Rol</label>
              <input type="text" name="rol" value={editingEmpleado.rol} onChange={handleEditChange} required />
            </div>
            <div className="empleados-form-group">
              <label>Estado</label>
              <select name="estado" value={editingEmpleado.estado ? 'true' : 'false'} onChange={handleEditChange}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <div className="empleados-modal-buttons">
              <button type="submit" className="empleados-modal-confirm">Guardar</button>
              <button type="button" className="empleados-modal-cancel" onClick={() => setEditingEmpleado(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Agregar */}
      {nuevoEmpleado && (
        <div className="empleados-modal-overlay">
          <form onSubmit={agregarEmpleado} className="empleados-form-modal">
            <h3>Agregar Empleado</h3>
            <div className="empleados-form-group">
              <label>Nombre y Apellido</label>
              <input type="text" name="nombreapellido" value={nuevoEmpleado.nombreapellido} onChange={handleNuevoChange} required />
            </div>
            <div className="empleados-form-group">
              <label>Rol</label>
              <input type="text" name="rol" value={nuevoEmpleado.rol} onChange={handleNuevoChange} required />
            </div>
            <div className="empleados-form-group">
              <label>Estado</label>
              <select name="estado" value={nuevoEmpleado.estado ? 'true' : 'false'} onChange={handleNuevoChange}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <div className="empleados-modal-buttons">
              <button type="submit" className="empleados-modal-confirm">Guardar</button>
              <button type="button" className="empleados-modal-cancel" onClick={() => setNuevoEmpleado(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Empleados;
