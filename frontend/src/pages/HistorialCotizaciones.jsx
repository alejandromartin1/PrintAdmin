import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/HistorialCotizaciones.css';
import { useParams } from 'react-router-dom';
import { generarPDFHistorialCotizaciones } from '../utils/historialCotizacionesPDF';
import logo from '../assets/RUZ.png';


const HistorialCotizaciones = () => {
  const { clienteId: paramClienteId } = useParams();
  const [clienteId, setClienteId] = useState('');
  const [clientes, setClientes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [clienteInfo, setClienteInfo] = useState(null);
  const suggestionsRef = useRef(null);
  

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (paramClienteId && clientes.length > 0) {
      const id = parseInt(paramClienteId);
      setClienteId(id);
      const cliente = clientes.find(c => c.id === id);
      if (cliente) setClienteInfo(cliente);
      buscarCotizacionesPorId(id);
    }
  }, [paramClienteId, clientes]);

  const handleClickOutside = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

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

  const selectCliente = (cliente) => {
    setClienteId(cliente.id);
    setClienteInfo(cliente);
    setSuggestions([]);
  };

  const buscarCotizacionesPorId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cotizaciones/cliente/${id}`);
      setCotizaciones(response.data);
      if (response.data.length > 0) {
        Swal.fire({
          icon: 'success',
          title: 'Historial cargado',
          text: `Se encontraron ${response.data.length} cotizaciones`,
          showConfirmButton: false,
          timer: 1300
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Sin resultados',
          text: 'No se encontraron cotizaciones para este cliente',
          confirmButtonColor: '#db3434'
        });
      }
    } catch (err) {
      console.error('Error al obtener cotizaciones:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'No se pudo obtener el historial',
        confirmButtonColor: '#db3434'
      });
    }
  };

  const buscarHistorial = () => {
    if (!clienteId) {
      Swal.fire({
        icon: 'warning',
        title: 'Cliente requerido',
        text: 'Por favor selecciona un cliente para buscar su historial',
        confirmButtonColor: '#db3434'
      });
      return;
    }
    buscarCotizacionesPorId(clienteId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  return (
    <div className="historial-container">
      <header className='headerhistorial'>
        <h2 className='title-historial'>Historial de Cotizaciones</h2>
      </header>

      <div className="search-section">
        <div className="autocomplete" ref={suggestionsRef}>
          <input
            type="text"
            value={typeof clienteId === 'number' ? clientes.find(c => c.id === clienteId)?.nombre || clienteId : clienteId}
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
        <button onClick={buscarHistorial} className="search-button">
          Buscar Historial
        </button>
      </div>

      {clienteInfo && (
        <div className="cliente-info">
          <h3>{clienteInfo.nombre} {clienteInfo.apellido}</h3>
          <div className="cliente-details">
            {clienteInfo.numero_telefono && <p><strong>Teléfono:</strong> {clienteInfo.numero_telefono}</p>}
            {clienteInfo.correo && <p><strong>Email:</strong> {clienteInfo.correo}</p>}
          </div>
        </div>
      )}
{cotizaciones.length > 0 && (
  <div className="export-section">
    <button
      onClick={() =>
        generarPDFHistorialCotizaciones(
          cotizaciones,
          clienteInfo,
          formatDate,
          formatCurrency,
          logo
        )
      }
      className="export-button pdf"
    >
      Exportar a PDF
    </button>
  </div>
)}

      {cotizaciones.length > 0 && (
        <div className="table-container">
          <table className="historial-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Conceptos</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map((c) => (
                <tr key={c.id}>
                  <td>{formatDate(c.fecha)}</td>
                  <td>{c.conceptos ? c.conceptos.map(con => con.concepto).join(', ') : '—'}</td>
                  <td>{formatCurrency(c.subtotal)}</td>
                  <td>{formatCurrency(c.iva)}</td>
                  <td>{formatCurrency(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistorialCotizaciones;
