import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/pendientesPorFacturar.css'; 

const PendientesFactura = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchPendientes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pendientes-factura/');
      console.log("📌 Facturas pendientes:", res.data);
      setFacturas(res.data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los pendientes por facturar');
      console.error("Error en fetchPendientes:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPendientes();
  };

  const marcarComoFacturado = async (id) => {
    const result = await Swal.fire({
      title: 'Confirmar',
      text: '¿Deseas marcar esta factura como facturada?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#e74c3c',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/pendientes-factura/${id}/facturado`);
        setFacturas(prev => prev.filter(f => f.id !== id));
        Swal.fire('¡Listo!', 'Factura marcada como facturada', 'success');
      } catch (err) {
        console.error("Error en marcarComoFacturado:", err);
        Swal.fire('Error', 'No se pudo actualizar la factura', 'error');
      }
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  const formatDate = (fecha) => {
    const d = new Date(fecha);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
  };

  if (loading && !refreshing) return <p style={{ textAlign:'center', marginTop:'50px' }}>Cargando pendientes por facturar...</p>;
  if (error) return <p style={{ textAlign:'center', color:'red', marginTop:'50px' }}>{error}</p>;
  if (facturas.length === 0) return <p style={{ textAlign:'center', marginTop:'50px' }}>No hay facturas pendientes por facturar.</p>;

  return (
    <div className="pf__container">
      <div className="pf__header">
        <h2 className="pf__title">Pendientes por Facturar</h2>
        <button 
          className="pf__refresh-button" 
          onClick={handleRefresh} 
          disabled={refreshing}
        >
          {refreshing ? '↻ Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <div className="pf__grid">
        {facturas.map(f => (
          <div key={f.id} className="pf__card">
            <div className="pf__card-header">
              <h3 className="pf__client-name">{f.nombre} {f.apellido}</h3>
              <span className="pf__status pf__status--pending">Pendiente</span>
            </div>

            <div className="pf__card-body">
              <div className="pf__detail-row">
                <span className="pf__detail-label">Fecha:</span>
                <span className="pf__detail-value">{formatDate(f.fecha)}</span>
              </div>
              <div className="pf__detail-row">
                <span className="pf__detail-label">Concepto:</span>
                <span className="pf__detail-value">{f.concepto}</span>
              </div>
              <div className="pf__detail-row">
                <span className="pf__detail-label">Subtotal:</span>
                <span className="pf__detail-value pf__value-subtotal">{formatCurrency(f.subtotal)}</span>
              </div>
              <div className="pf__detail-row">
                <span className="pf__detail-label">IVA (16%):</span>
                <span className="pf__detail-value pf__value-iva">{formatCurrency(f.iva)}</span>
              </div>
              <div className="pf__detail-row">
                <span className="pf__detail-label">Total:</span>
                <span className="pf__detail-value pf__value-total">{formatCurrency(f.total)}</span>
              </div>
            </div>

            <div className="pf__card-footer">
              <button 
                className="pf__action-button"
                onClick={() => marcarComoFacturado(f.id)}
              >
                Marcar como Facturado
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendientesFactura;
