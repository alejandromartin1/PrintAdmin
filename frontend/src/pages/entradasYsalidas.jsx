import "../styles/entradasysalidas.css";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const EntradasySalidas = () => {
  const [clientes, setClientes] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [activeTab, setActiveTab] = useState('entradas');
  const [editingTrabajo, setEditingTrabajo] = useState(null);
  const [editingGasto, setEditingGasto] = useState(null);
  const [mostrarEvidencia, setMostrarEvidencia] = useState(false);
  const [evidenciaFile, setEvidenciaFile] = useState(null);
  const [imagenModal, setImagenModal] = useState(null);
  const [deseaFacturar, setDeseaFacturar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

    const permisosUsuario = JSON.parse(localStorage.getItem("permisos")) || [];
    const rol = localStorage.getItem("rol");
    const esAdmin = rol === "Administrador";

  const [nuevoTrabajo, setNuevoTrabajo] = useState({
    cliente:'', 
    fecha: new Date().toISOString().split("T")[0],
    concepto: '',
    cantidad_total: '',
    abono: '',
    saldo: '',
    estado: 'pendiente',
    metodo_pago: ''
  });

  const [nuevoGasto, setNuevoGasto] = useState({
    descripcion: '',
    cantidad: '',
    fecha: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchClientes();
    if(activeTab === 'entradas'){
      fetchEntradas();
    } else {
      fetchSalidas();
    }
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

  const handleMetodoPagoChange = (e) => {
    const valor = e.target.value;
    handleTrabajoChange(e);
    if (valor === "transferencia" || valor === "deposito") {
      setMostrarEvidencia(true);
    } else {
      setMostrarEvidencia(false);
      setEvidenciaFile(null);
    }
  };

  const handleGastoChange = (e) => {
    const { name, value } = e.target;
    setNuevoGasto(prev => ({ ...prev, [name]: value }));
  };

  const agregarTrabajo = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('id_cliente', nuevoTrabajo.cliente);
      formData.append('fecha', nuevoTrabajo.fecha);
      formData.append('concepto', nuevoTrabajo.concepto);
      formData.append('cantidad_total', nuevoTrabajo.cantidad_total);
      formData.append('abono', nuevoTrabajo.abono);
      formData.append('saldo', nuevoTrabajo.cantidad_total - nuevoTrabajo.abono);
      formData.append('estado', nuevoTrabajo.estado);
      formData.append('metodo_pago', nuevoTrabajo.metodo_pago);
      if (mostrarEvidencia && evidenciaFile) {
        formData.append('evidencia', evidenciaFile);
      }
      const res = await axios.post('http://localhost:5000/api/entradas/crear', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchEntradas();
      setNuevoTrabajo({
        cliente: '',
        fecha: new Date().toISOString().split("T")[0],
        concepto: '',
        cantidad_total: '',
        abono: '',
        saldo: '',
        estado: 'pendiente',
        metodo_pago: ''
      });
      setMostrarEvidencia(false);
      setEvidenciaFile(null);
      Swal.fire('¡Éxito!', 'Trabajo registrado con éxito.', 'success');
      if(deseaFacturar){
        navigate(`/factura/${res.data.id}`);
      }
      setDeseaFacturar(false);
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
      setNuevoGasto({ descripcion: '', cantidad: '', fecha: new Date().toISOString().split("T")[0] });
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
      estado: trabajo.estado,
      metodo_pago: trabajo.metodo_pago || ''
    });
    if (trabajo.metodo_pago === "transferencia" || trabajo.metodo_pago === "deposito") {
      setMostrarEvidencia(true);
    } else {
      setMostrarEvidencia(false);
    }
    setEvidenciaFile(null);
  };

  const actualizarTrabajo = async (e) => {
  e.preventDefault();
  try {
    if (!editingTrabajo) return;
    const trabajoActual = trabajos.find(t => t.id === editingTrabajo);
    if (!trabajoActual) return;

    const datosActualizar = {
      abono: Number(nuevoTrabajo.abono),
      metodo_pago: nuevoTrabajo.metodo_pago || trabajoActual.metodo_pago,
      evidencia: evidenciaFile || null
    };

    await axios.put(`http://localhost:5000/api/entradas/editar/${editingTrabajo}`, datosActualizar);
    await fetchEntradas();
    setEditingTrabajo(null);
    setNuevoTrabajo({
      cliente: '',
      fecha: new Date().toISOString().split("T")[0],
      concepto: '',
      cantidad_total: '',
      abono: '',
      saldo: '',
      estado: 'pendiente',
      metodo_pago: ''
    });
    setMostrarEvidencia(false);
    setEvidenciaFile(null);
    Swal.fire('¡Éxito!', 'Trabajo actualizado correctamente.', 'success');
  } catch (error) {
    console.error('Error al actualizar trabajo:', error.response?.data || error.message);
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
    if(confirm.isConfirmed){
      try {
        await axios.delete(`http://localhost:5000/api/entradas/eliminar/${id}`);
        await fetchEntradas();
        Swal.fire('Eliminado', 'El trabajo fue eliminado.', 'success');
      } catch(error){
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
      setNuevoGasto({ descripcion: '', cantidad: '', fecha: new Date().toISOString().split("T")[0] });
      Swal.fire('¡Actualizado!', 'Gasto actualizado correctamente.', 'success');
    } catch(error){
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
    if(confirm.isConfirmed){
      try{
        await axios.delete(`http://localhost:5000/api/salidas/eliminar/${id}`);
        await fetchSalidas();
        Swal.fire('Eliminado', 'El gasto fue eliminado.', 'success');
      } catch(error){
        console.error('Error al eliminar gasto:', error);
        Swal.fire('Error', 'No se pudo eliminar el gasto.', 'error');
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrabajos = trabajos.slice(indexOfFirstItem, indexOfLastItem);
  const currentGastos = gastos.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="es-container">
      <header className="es-header">
        <h1 className="es-title">Entradas y Salidas</h1>
      </header>

      <div className="es-tabs-container">
        <button className={`es-tab-button ${activeTab === 'entradas' ? 'es-active' : ''}`} onClick={()=>setActiveTab('entradas')}>Entradas (Trabajos)</button>
        <button className={`es-tab-button ${activeTab === 'salidas' ? 'es-active' : ''}`} onClick={()=>setActiveTab('salidas')}>Salidas (Gastos)</button>
      </div>

      {activeTab === 'entradas' ? (
        <div className="es-content-section">
          {/* FORMULARIO ENTRADAS */}
          <div className="es-form-container">
            <h2 className="es-form-title">{editingTrabajo ? "Editar Trabajo" : "+ Registrar Nuevo Trabajo"}</h2>
            <form className="es-form" onSubmit={editingTrabajo ? actualizarTrabajo : agregarTrabajo}>
              <div className="es-form-group">
                <label className="es-label">Cliente:</label>
                <select className="es-select" name="cliente" value={nuevoTrabajo.cliente} onChange={handleTrabajoChange} disabled={!!editingTrabajo} required>
                  <option value="" disabled>Seleccione un cliente</option>
                  {clientes.map(c => <option key={`cliente-${c.id}`} value={c.id}>{c.nombre} {c.apellido}</option>)}
                </select>
              </div>

              <div className="es-form-group">
                <label className="es-label">Descripción:</label>
                <textarea className="es-textarea" name="concepto" value={nuevoTrabajo.concepto} onChange={handleTrabajoChange} required disabled={!!editingTrabajo} />
              </div>

              <div className="es-form-row">
                <div className="es-form-group">
                  <label className="es-label">Cantidad Total ($):</label>
                  <input className="es-input" type="number" name="cantidad_total" value={nuevoTrabajo.cantidad_total} onChange={handleTrabajoChange} required disabled={!!editingTrabajo} />
                </div>
                <div className="es-form-group">
                  <label className="es-label">Abono ($):</label>
                  <input className="es-input" type="number" name="abono" value={nuevoTrabajo.abono} onChange={handleTrabajoChange} required />
                </div>
                <div className="es-form-group">
                  <label className="es-label">Fecha:</label>
                  <input className="es-input" type="date" name="fecha" value={nuevoTrabajo.fecha} onChange={handleTrabajoChange} required />
                </div>
                <div className="es-form-group">
                  <label className="es-label">Estado:</label>
                  <select className="es-select" name="estado" value={nuevoTrabajo.estado} onChange={handleTrabajoChange}>
                    <option value="pendiente">Pendiente</option>
                    <option value="completado">Completado</option>
                  </select>
                </div>
              </div>

              <div className="es-form-group">
                <label className="es-label">Método de Pago:</label>
                <select className="es-select" name="metodo_pago" value={nuevoTrabajo.metodo_pago || ''} onChange={handleMetodoPagoChange} required>
                  <option value="" disabled>Seleccione un método</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="deposito">Depósito</option>
                  <option value="transferencia">Transferencia</option>
                </select>
                {mostrarEvidencia && (
                  <div className="es-evidencia-modal">
                    {!editingTrabajo ? (
                      <>
                        <label className="es-label">Subir evidencia de pago:</label>
                        <input type="file" accept="image/*" onChange={(e)=>setEvidenciaFile(e.target.files[0])} />
                        {evidenciaFile && <p style={{marginTop:'8px'}}>Archivo nuevo: {evidenciaFile.name}</p>}
                      </>
                    ) : (
                      <div style={{marginTop:'8px'}}>
                        <p>Evidencia registrada:</p>
                        <img src={`http://localhost:5000/uploads/${trabajos.find(t=>t.id===editingTrabajo)?.evidencia}`} alt="Evidencia actual" style={{width:'120px', borderRadius:'8px'}} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="es-form-group">
                <label className="es-label">
                  <input type="checkbox" checked={deseaFacturar} onChange={e=>setDeseaFacturar(e.target.checked)} /> ¿Desea facturar?
                </label>
              </div>

              <div className="es-form-actions">
                {editingTrabajo && (
                  <button type="button" className="es-cancel-button" onClick={()=>{
                    setEditingTrabajo(null);
                    setNuevoTrabajo({
                      cliente:'', fecha:new Date().toISOString().split("T")[0], concepto:'', cantidad_total:'', abono:'', saldo:'', estado:'pendiente', metodo_pago:''
                    });
                  }}>Cancelar</button>
                )}
                <button type="submit" className="es-submit-button">{editingTrabajo ? 'Actualizar Trabajo' : 'Registrar Trabajo'}</button>
              </div>
            </form>
          </div>

          {/* LISTADO ENTRADAS */}
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
                    <th>Método de Pago</th>
                    <th>Evidencia</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTrabajos.map((t, index) => (
  <tr key={`trabajo-${t.id}-${index}`}>
    <td>{t.id}</td>
                      <td>{t.nombre} {t.apellido}</td>
                      <td>{new Date(t.fecha).toLocaleDateString('es-ES')}</td>
                      <td>{t.concepto}</td>
                      <td>${(t.cantidad_total||0).toLocaleString()}</td>
                      <td>${(t.abono||0).toLocaleString()}</td>
                      <td>${(t.saldo||0).toLocaleString()}</td>
                      <td><span className={`es-estado-badge ${t.estado}`}>{t.estado}</span></td>
                      <td>{t.metodo_pago}</td>
                      <td>
                        {t.evidencia ? (
                          <img src={`http://localhost:5000/uploads/${t.evidencia}`} alt="Evidencia" className="es-thumbnail" onClick={()=>setImagenModal(`http://localhost:5000/uploads/${t.evidencia}`)} />
                        ) : <span>Sin evidencia</span>}
                      </td>
                      <td>
                        <div className="es-action-buttons">
                            {(esAdmin || permisosUsuario.includes("editar_trabajo")) && (
                          <button className="es-edit-button" onClick={()=>editarTrabajo(t)}>Editar</button>
                           )}
                            {(esAdmin || permisosUsuario.includes("eliminar_trabajo")) && (
                          <button className="es-delete-button" onClick={()=>eliminarTrabajo(t.id)}>Eliminar</button>
                        )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINACIÓN */}
          <div className="es-pagination">
            {Array.from({ length: Math.ceil(trabajos.length/itemsPerPage) }, (_, i) => (
              <button key={`page-trabajo-${i+1}`} onClick={()=>setCurrentPage(i+1)} className={currentPage===i+1?'es-page-button active':'es-page-button'}>{i+1}</button>
            ))}
          </div>

          {imagenModal && (
  <div className="es-modal-overlay" onClick={() => setImagenModal(null)}>
    <div className="es-modal-content" onClick={e => e.stopPropagation()}>
      <button className="es-modal-close" onClick={() => setImagenModal(null)}>×</button>
      <img src={imagenModal} alt="Evidencia" />
    </div>
  </div>
)}
        </div>
      ) : (
        <div className="es-content-section">
          {/* FORMULARIO GASTOS */}
          <div className="es-form-container">
            <h2 className="es-form-title">{editingGasto ? "Editar Gasto" : "+ Registrar Nuevo Gasto"}</h2>
            <form className="es-form" onSubmit={editingGasto ? actualizarGasto : agregarGasto}>
              <div className="es-form-group">
                <label className="es-label">Descripción:</label>
                <textarea className="es-textarea" name="descripcion" value={nuevoGasto.descripcion} onChange={handleGastoChange} required />
              </div>

              <div className="es-form-group">
                <label className="es-label">Cantidad ($):</label>
                <input className="es-input" type="number" name="cantidad" value={nuevoGasto.cantidad} onChange={handleGastoChange} required />
              </div>

              <div className="es-form-group">
                <label className="es-label">Fecha:</label>
                <input className="es-input" type="date" name="fecha" value={nuevoGasto.fecha} onChange={handleGastoChange} required />
              </div>

              <div className="es-form-actions">
                {editingGasto && (
                  <button type="button" className="es-cancel-button" onClick={()=>{ setEditingGasto(null); setNuevoGasto({ descripcion:'', cantidad:'', fecha:new Date().toISOString().split("T")[0] }); }}>Cancelar</button>
                )}
                <button type="submit" className="es-submit-button">{editingGasto ? 'Actualizar Gasto' : 'Registrar Gasto'}</button>
              </div>
            </form>
          </div>

          {/* LISTADO GASTOS */}
          <div className="es-list-container">
            <h2 className="es-list-title">Listado de Gastos</h2>
            <div className="es-table-responsive">
              <table className="es-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Cantidad ($)</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentGastos.map((gasto, index) => (
  <tr key={`gasto-${gasto.id}-${index}`}>
    <td>{gasto.id}</td>
                      <td>{gasto.descripcion}</td>
                      <td>${Number(gasto.cantidad).toLocaleString()}</td>
                      <td>{new Date(gasto.fecha).toLocaleDateString('es-ES')}</td>
                      <td>
                        <div className="es-action-buttons">
                           {(esAdmin || permisosUsuario.includes("editar_gasto")) && (
                          <button className="es-edit-button" onClick={()=>editarGasto(gasto)}>Editar</button>
                             )}
                              {(esAdmin || permisosUsuario.includes("eliminar_gasto")) && (
                          <button className="es-delete-button" onClick={()=>eliminarGasto(gasto.id)}>Eliminar</button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINACIÓN */}
          <div className="es-pagination">
            {Array.from({ length: Math.ceil(gastos.length/itemsPerPage) }, (_, i) => (
              <button key={`page-gasto-${i+1}`} onClick={()=>setCurrentPage(i+1)} className={currentPage===i+1?'es-page-button active':'es-page-button'}>{i+1}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EntradasySalidas;
