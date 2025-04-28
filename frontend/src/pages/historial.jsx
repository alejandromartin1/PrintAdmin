import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import '../styles/historialClientes.css';
import Swal from 'sweetalert2';

const HistorialCliente = () => {
  // Estados principales
  const [clienteId, setClienteId] = useState('');
  const [clientes, setClientes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [filteredHistorial, setFilteredHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clienteInfo, setClienteInfo] = useState(null);
  
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    estado: 'todos',
    fechaDesde: '',
    fechaHasta: '',
    montoMinimo: '',
    montoMaximo: ''
  });

  const suggestionsRef = useRef(null);

  // Cargar lista de clientes al montar el componente
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clientes');
        setClientes(response.data);
      } catch (err) {
        console.error('Error al cargar clientes:', err);
      }
    };
    cargarClientes();

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  // Manejar cambios en el input de búsqueda
  const handleClienteChange = (e) => {
    const value = e.target.value;
    setClienteId(value);
    
    if (value.length > 1) {
      const filtered = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(value.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(value.toLowerCase()) ||
        cliente.id.toString().includes(value)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  // Seleccionar un cliente de las sugerencias
  const selectCliente = (cliente) => {
    setClienteId(`${cliente.nombre} ${cliente.apellido} (ID: ${cliente.id})`);
    setClienteInfo(cliente);
    setSuggestions([]);
    // Guardar el ID real para usar en la búsqueda
    setClienteId(cliente.id);
  };

  // Buscar historial
  const buscarHistorial = async () => {
    if (!clienteId) {
      Swal.fire({
        icon: 'warning',
        title: 'Cliente requerido',
        text: 'Por favor selecciona un cliente para buscar su historial',
        confirmButtonColor: '#db3434'
      });
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:5000/api/entradas/cliente/${clienteId}`);
      setHistorial(response.data);
      setFilteredHistorial(response.data);
  
      // Mostrar alerta solo si hay resultados
      if (response.data.length > 0) {
        Swal.fire({
          icon: 'success',
          title: 'Historial cargado',
          text: `Se encontraron ${response.data.length} registros`,
          showConfirmButton: false,
          timer: 1300
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Sin resultados',
          text: 'No se encontraron registros para este cliente',
          confirmButtonColor: '#db3434'
        });
      }
      
    } catch (err) {
      console.error('Error al obtener historial:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'No se pudo obtener el historial',
        confirmButtonColor: '#db3434'
      });
    } finally {
      setLoading(false);
    }
  };
  // Aplicar filtros
  const aplicarFiltros = () => {
    let resultado = [...historial];

    // Filtrar por estado
    if (filtros.estado !== 'todos') {
      resultado = resultado.filter(t => t.estado === filtros.estado);
    }

    // Filtrar por fecha
    if (filtros.fechaDesde) {
      resultado = resultado.filter(t => new Date(t.fecha) >= new Date(filtros.fechaDesde));
    }
    if (filtros.fechaHasta) {
      resultado = resultado.filter(t => new Date(t.fecha) <= new Date(filtros.fechaHasta));
    }

    // Filtrar por monto
    if (filtros.montoMinimo) {
      resultado = resultado.filter(t => parseFloat(t.cantidad_total) >= parseFloat(filtros.montoMinimo));
    }
    if (filtros.montoMaximo) {
      resultado = resultado.filter(t => parseFloat(t.cantidad_total) <= parseFloat(filtros.montoMaximo));
    }

    setFilteredHistorial(resultado);
  }
    if (filteredHistorial.length === 0 && historial.length > 0) {

  };

  // Resetear filtros
  const resetearFiltros = () => {
    setFiltros({
      estado: 'todos',
      fechaDesde: '',
      fechaHasta: '',
      montoMinimo: '',
      montoMaximo: ''
    });
    Swal.fire({
      icon: 'success',
      title: 'Filtros restablecidos',
      showConfirmButton: false,
      timer: 1000
    });
    setFilteredHistorial(historial);
  };

  // Exportar a Excel
  const exportarExcel = () => {
    // Preparar datos con formatos adecuados
    const data = filteredHistorial.map(item => ({
      'Fecha': formatDate(item.fecha),
      'Concepto': item.concepto,
      'Total': item.cantidad_total,
      'Abono': item.abono,
      'Saldo': item.saldo,
      'Estado': item.estado.toUpperCase(),
      'Detalles': item.detalles || ''
    }));
  
    // Crear hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Ajustar anchos de columnas
    const wscols = [
      {wch: 15}, // Fecha
      {wch: 30}, // Concepto
      {wch: 12}, // Total
      {wch: 12}, // Abono
      {wch: 12}, // Saldo
      {wch: 15}, // Estado
    ];
    ws['!cols'] = wscols;
  
    // Crear libro y guardar
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial");
    
    // Nombre del archivo con nombre del cliente si está disponible
    const fileName = clienteInfo 
      ? `Historial_${clienteInfo.nombre}_${clienteInfo.apellido}_${new Date().toISOString().slice(0,10)}.xlsx`
      : `historial_cliente_${clienteId}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
  };
  

  // Funciones de formato
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  return (
    <div className="historial-container">
      <header className='headerhistorial'>
      <h2 className='title-historial'>Historial de Cliente</h2>
      </header>
      {/* Búsqueda con autocompletado */}
      <div className="search-section">
        <div className="autocomplete" ref={suggestionsRef}>
          <input
            type="text"
            value={typeof clienteId === 'number' ? 
              clientes.find(c => c.id === clienteId)?.nombre || '' : clienteId}
            onChange={handleClienteChange}
            placeholder="Buscar cliente por nombre, apellido o ID"
            className="search-input"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map(cliente => (
                <li 
                  key={cliente.id} 
                  onClick={() => selectCliente(cliente)}
                  className="suggestion-item"
                >
                  {cliente.nombre} {cliente.apellido} 
                </li>
              ))}
            </ul>
          )}
        </div>
        <button 
          onClick={buscarHistorial}
          disabled={loading || !clienteId}
          className="search-button"
        >
          {loading ? 'Buscando...' : 'Buscar Historial'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Información del cliente */}
      {clienteInfo && (
        <div className="cliente-info">
          <h3>{clienteInfo.nombre} {clienteInfo.apellido}</h3>
          <div className="cliente-details">
            {clienteInfo.numero_telefono && <p><strong>Teléfono:</strong> {clienteInfo.numero_telefono}</p>}
            {clienteInfo.correo && <p><strong>Email:</strong> {clienteInfo.correo}</p>}
            {clienteInfo.tipo_cliente && <p><strong>Tipo de Cliente:</strong> {clienteInfo.tipo_cliente}</p>}
          </div>
        </div>
      )}

      {/* Filtros */}
      {historial.length > 0 && (
        <div className="filters-section">
          <h3>Filtros</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Estado:</label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Fecha desde:</label>
              <input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
              />
            </div>

            <div className="filter-group">
              <label>Fecha hasta:</label>
              <input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
              />
            </div>

            <div className="filter-group">
              <label>Monto mínimo:</label>
              <input
                type="number"
                value={filtros.montoMinimo}
                onChange={(e) => setFiltros({...filtros, montoMinimo: e.target.value})}
                placeholder="$0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="filter-group">
              <label>Monto máximo:</label>
              <input
                type="number"
                value={filtros.montoMaximo}
                onChange={(e) => setFiltros({...filtros, montoMaximo: e.target.value})}
                placeholder="$0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={aplicarFiltros} className="filter-button apply">
              Aplicar Filtros
            </button>
            <button onClick={resetearFiltros} className="filter-button reset">
              Restablecer
            </button>
          </div>
        </div>
      )}

      {/* Resultados */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando historial...</p>
        </div>
      ) : filteredHistorial.length > 0 ? (
          <div className="es-list-containerhistorial">
             {/* Exportación */}
      {filteredHistorial.length > 0 && (
        <div className="export-section">
          <button onClick={exportarExcel} className="export-button excel">
            Exportar a Excel
          </button>
        </div>
      )}
          <div className="summary">
            <p>Mostrando {filteredHistorial.length} de {historial.length} trabajos</p>
            <p>Saldo total pendiente: {formatCurrency(filteredHistorial.reduce((sum, t) => sum + parseFloat(t.saldo), 0))}</p>
          </div>
          <div className="table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th>Total</th>
                  <th>Abono</th>
                  <th>Saldo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistorial.map((transaccion) => (
                  <tr key={transaccion.id}>
                    <td>{formatDate(transaccion.fecha)}</td>
                    <td>{transaccion.concepto}</td>
                    <td className="amount">{formatCurrency(transaccion.cantidad_total)}</td>
                    <td className="payment">{formatCurrency(transaccion.abono)}</td>
                    <td className={transaccion.saldo > 0 ? 'pending' : 'paid'}>
                      {formatCurrency(transaccion.saldo)}
                    </td>
                    <td>
                      <span className={`status-badge ${transaccion.estado}`}>
                        {transaccion.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
      ) : (
        !error && historial.length === 0 && (
          <div className="empty-state">
            <p>No se encontró historial. Busca un cliente para comenzar.</p>
          </div>
        )
      )}

      {historial.length > 0 && filteredHistorial.length === 0 && (
        <div className="empty-state">
          <p>No hay datos que coincidan con los filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default HistorialCliente;