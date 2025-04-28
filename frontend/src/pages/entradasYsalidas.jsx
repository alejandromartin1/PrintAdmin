import "../styles/entradasysalidas.css";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from "sweetalert2";

const EntradasySalidas = () => {
  const [clientes, setClientes] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [gastos, setGastos] = useState([]); 
  const [activeTab, setActiveTab] = useState('entradas');
  const [editingTrabajo, setEditingTrabajo] = useState(null);
  const [editingGasto, setEditingGasto] = useState(null);

  const [nuevoTrabajo, setNuevoTrabajo] = useState({
    cliente:'', 
    fecha: '',
    concepto: '',
    cantidad_total: '',
    abono: '',
    saldo: '',
    estado: 'pendiente'
  });

  const [nuevoGasto, setNuevoGasto] = useState({
    descripcion: '',
    cantidad: '',
    fecha: '',
  });

  useEffect(() => {
    if (activeTab === 'entradas') {
      fetchEntradas();
    } else {
      fetchSalidas();
    }
    fetchClientes();
  }, [activeTab]);

  const fetchEntradas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/entradas/todos');
      setTrabajos(res.data);
    } catch (error) {
      console.error('Error al cargar entradas:', error);
    }
  };

  const fetchSalidas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/salidas/todos');
      setGastos(res.data);
    } catch (error) {
      console.error('Error al cargar salidas:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clientes');
      setClientes(res.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const handleTrabajoChange = (e) => {
    const { name, value } = e.target;
    setNuevoTrabajo(prev => ({ ...prev, [name]: value }));
  };

  const handleGastoChange = (e) => {
    const { name, value } = e.target;
    setNuevoGasto(prev => ({ ...prev, [name]: value }));
  };

  const agregarTrabajo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/entradas/crear', {
        id_cliente: nuevoTrabajo.cliente,
        fecha: nuevoTrabajo.fecha,
        concepto: nuevoTrabajo.concepto,
        cantidad_total: nuevoTrabajo.cantidad_total,
        abono: nuevoTrabajo.abono,
        saldo: nuevoTrabajo.cantidad_total - nuevoTrabajo.abono,
        estado: nuevoTrabajo.estado
      });

      await fetchEntradas();
      setNuevoTrabajo({
        cliente: '',
        fecha: '',
        concepto: '',
        cantidad_total: '',
        abono: '',
        saldo: '',
        estado: 'pendiente'
      });

      Swal.fire('¡Éxito!', 'Trabajo registrado con éxito.', 'success');
    } catch (error) {
      console.error('Error al agregar trabajo:', error);
      Swal.fire('Error', 'No se pudo registrar el trabajo.', 'error');
    }
  };
  
  const agregarGasto = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/salidas/crear', nuevoGasto);
      await fetchSalidas();
      setNuevoGasto({ fecha: '', descripcion: '', cantidad: '' });
      Swal.fire('¡Éxito!', 'Gasto registrado con éxito.', 'success');
    } catch (error) {
      console.error('Error al agregar gasto:', error);
      Swal.fire('Error', 'No se pudo registrar el gasto.', 'error');
    }
  };

  const editarTrabajo = (trabajo) => {
    setEditingTrabajo(trabajo.id);
    setNuevoTrabajo({
      cliente: trabajo.id_cliente,
      fecha: trabajo.fecha.split('T')[0],
      concepto: trabajo.concepto,
      cantidad_total: trabajo.cantidad_total,
      abono: trabajo.abono,
      saldo: trabajo.saldo,
      estado: trabajo.estado
    });
  };
  
  const actualizarTrabajo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/entradas/editar/${editingTrabajo}`, {
        id_cliente: nuevoTrabajo.cliente,
        fecha: nuevoTrabajo.fecha,
        concepto: nuevoTrabajo.concepto,
        cantidad_total: nuevoTrabajo.cantidad_total,
        abono: nuevoTrabajo.abono,
        saldo: nuevoTrabajo.cantidad_total - nuevoTrabajo.abono,
        estado: nuevoTrabajo.estado
      });
      await fetchEntradas();
      setEditingTrabajo(null);
      setNuevoTrabajo({
        cliente: '',
        fecha: '',
        concepto: '',
        cantidad_total: '',
        abono: '',
        saldo: '',
        estado: 'pendiente'
      });
      Swal.fire('¡Actualizado!', 'Trabajo actualizado con éxito.', 'success');
    } catch (error) {
      console.error('Error al actualizar trabajo:', error);
      Swal.fire('Error', 'No se pudo actualizar el trabajo.', 'error');
    }
  };

  const eliminarTrabajo = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/entradas/eliminar/${id}`);
        await fetchEntradas();
        Swal.fire('Eliminado', 'El trabajo fue eliminado.', 'success');
      } catch (error) {
        console.error('Error al eliminar trabajo:', error);
        Swal.fire('Error', 'No se pudo eliminar el trabajo.', 'error');
      }
    }
  };

  const editarGasto = (gasto) => {
    setEditingGasto(gasto.id);
    setNuevoGasto({
      descripcion: gasto.descripcion,
      cantidad: gasto.cantidad,
      fecha: gasto.fecha.split('T')[0]
    });
  };

  const actualizarGasto = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/salidas/editar/${editingGasto}`, nuevoGasto);
      await fetchSalidas();
      setEditingGasto(null);
      setNuevoGasto({ fecha: '', descripcion: '', cantidad: '' });
      Swal.fire('¡Actualizado!', 'Gasto actualizado correctamente.', 'success');
    } catch (error) {
      console.error('Error al actualizar gasto:', error);
      Swal.fire('Error', 'No se pudo actualizar el gasto.', 'error');
    }
  };

  const eliminarGasto = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/salidas/eliminar/${id}`);
        await fetchSalidas();
        Swal.fire('Eliminado', 'El gasto fue eliminado.', 'success');
      } catch (error) {
        console.error('Error al eliminar gasto:', error);
        Swal.fire('Error', 'No se pudo eliminar el gasto.', 'error');
      }
    }
  };

  return (
    <div className="es-container">
      <header className="es-header">
        <h1 className="es-title">Entradas y Salidas</h1>
      </header>

      <div className="es-tabs-container">
        <button 
          className={`es-tab-button ${activeTab === 'entradas' ? 'es-active' : ''}`}
          onClick={() => setActiveTab('entradas')}
        >
          Entradas (Trabajos)
        </button>
        <button 
          className={`es-tab-button ${activeTab === 'salidas' ? 'es-active' : ''}`}
          onClick={() => setActiveTab('salidas')}
        >
          Salidas (Gastos)
        </button>
      </div>

      {activeTab === 'entradas' ? (
        <div className="es-content-section">
          <div className="es-form-container">
            <h2 className="es-form-title"> + Registrar Nuevo Trabajo</h2>
            <form className="es-form" onSubmit={editingTrabajo ? actualizarTrabajo : agregarTrabajo}>
              <div className="es-form-group">
                <label className="es-label">Cliente:</label>
                <select
                  className="es-select"
                  name="cliente"
                  value={nuevoTrabajo.cliente}
                  onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, cliente: e.target.value })}
                >
                  <option value="" disabled>Seleccione un cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="es-form-group">
                <label className="es-label">Descripción:</label>
                <textarea
                  className="es-textarea"
                  name="concepto"
                  value={nuevoTrabajo.concepto}
                  onChange={handleTrabajoChange}
                  required
                />
              </div>

              <div className="es-form-row">
                <div className="es-form-group">
                  <label className="es-label">Cantidad Total ($):</label>
                  <input
                    className="es-input"
                    type="number"
                    name="cantidad_total"
                    value={nuevoTrabajo.cantidad_total}
                    onChange={handleTrabajoChange}
                    required
                  />
                </div>

                <div className="es-form-group">
                  <label className="es-label">Abono ($):</label>
                  <input
                    className="es-input"
                    type="number"
                    name="abono"
                    value={nuevoTrabajo.abono}
                    onChange={handleTrabajoChange}
                    required
                  />
                </div>
                
                <div className="es-form-group">
                  <label className="es-label">Fecha:</label>
                  <input
                    className="es-input"
                    type="date"
                    name="fecha"
                    value={nuevoTrabajo.fecha}
                    onChange={handleTrabajoChange}
                    required
                  />
                </div>
                
                <div className="es-form-group">
                  <label className="es-label">Estado:</label>
                  <select
                    className="es-select"
                    name="estado"
                    value={nuevoTrabajo.estado}
                    onChange={handleTrabajoChange}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="completado">Completado</option>
                  </select>
                </div>
              </div>
              
              <div className="es-form-actions">
                {editingTrabajo && (
                  <button 
                    type="button" 
                    className="es-cancel-button" 
                    onClick={() => {
                      setEditingTrabajo(null);
                      setNuevoTrabajo({
                        cliente: '',
                        fecha: '',
                        concepto: '',
                        cantidad_total: '',
                        abono: '',
                        saldo: '',
                        estado: 'pendiente'
                      });
                    }}
                  >
                    Cancelar
                  </button>
                )}
                <button type="submit" className="es-submit-button">
                  {editingTrabajo ? 'Actualizar Trabajo' : 'Registrar Trabajo'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="es-list-container">
            <h2 className="es-list-title">Listado de Trabajos</h2>
            <div className="es-table-responsive">
              <table className="es-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Concepto</th>
                    <th>Cantidad</th>
                    <th>Abono</th>
                    <th>Saldo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {trabajos.map((trabajo) => (
                    <tr key={trabajo.id}>
                      <td>{trabajo.id}</td>
                      <td>{trabajo.nombre} {trabajo.apellido}</td>
                      <td>{new Date(trabajo.fecha).toLocaleDateString('es-ES')}</td>
                      <td>{trabajo.concepto}</td>
                      <td>${(trabajo.cantidad_total || 0).toLocaleString()}</td>
                      <td>${(trabajo.abono || 0).toLocaleString()}</td>
                      <td>${(trabajo.saldo || 0).toLocaleString()}</td>
                      <td>
                        <span className={`es-estado-badge ${trabajo.estado}`}>
                          {trabajo.estado}
                        </span>
                      </td>
                      <td>
                        <div className="es-action-buttons">
                          <button 
                            className="es-edit-button" 
                            onClick={() => editarTrabajo(trabajo)}
                          >
                            Editar
                          </button>
                          <button 
                            className="es-delete-button" 
                            onClick={() => eliminarTrabajo(trabajo.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="es-content-section">
          <div className="es-form-container">
            <h2 className="es-form-title">-Registrar Nuevo Gasto</h2>
            <form className="es-form" onSubmit={editingGasto ? actualizarGasto : agregarGasto}>
              <div className="es-form-group">
                <label className="es-label">Descripción:</label>
                <textarea
                  className="es-textarea"
                  name="descripcion"
                  value={nuevoGasto.descripcion}
                  onChange={handleGastoChange}
                  required
                />
              </div>
              
              <div className="es-form-row">
                <div className="es-form-group">
                  <label className="es-label">Cantidad ($):</label>
                  <input
                    className="es-input"
                    type="number"
                    name="cantidad"
                    value={nuevoGasto.cantidad}
                    onChange={handleGastoChange}
                    required
                  />
                </div>
                
                <div className="es-form-group">
                  <label className="es-label">Fecha:</label>
                  <input
                    className="es-input"
                    type="date"
                    name="fecha"
                    value={nuevoGasto.fecha}
                    onChange={handleGastoChange}
                    required
                  />
                </div>
              </div>
              
              <div className="es-form-actions">
                <button type="submit" className="es-submit-button">
                  {editingGasto ? 'Actualizar Gasto' : 'Registrar Gasto'}
                </button>
                {editingGasto && (
                  <button 
                    type="button" 
                    className="es-cancel-button" 
                    onClick={() => {
                      setEditingGasto(null);
                      setNuevoGasto({ fecha: "", descripcion: "", cantidad: "" });
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="es-list-container">
            <h2 className="es-list-title">Listado de Gastos</h2>
            <div className="es-table-responsive">
              <table className="es-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {gastos.map((gasto) => (
                    <tr key={gasto.id}>
                      <td>{gasto.id}</td>
                      <td>{new Date(gasto.fecha).toLocaleDateString('es-ES')}</td>
                      <td>{gasto.descripcion}</td>
                      <td>${gasto.cantidad.toLocaleString()}</td>
                      <td>
                        <div className="es-action-buttons">
                          <button 
                            className="es-edit-button" 
                            onClick={() => editarGasto(gasto)}
                          >
                            Editar
                          </button>
                          <button 
                            className="es-delete-button" 
                            onClick={() => eliminarGasto(gasto.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntradasySalidas;