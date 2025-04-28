import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/pendientes.css';

const Pendientes = () => {
  const [eventosPendientes, setEventosPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPendientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/entradas/pendientes');
      const eventosFiltrados = response.data.filter(
        evento => evento.estado.toLowerCase() === 'pendiente'
      );
      setEventosPendientes(eventosFiltrados);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los eventos pendientes');
      console.error('Error fetching pendientes:', err);
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

  const confirmarPago = async (id, nombre) => {
    const result = await Swal.fire({
      title: 'Confirmar pago',
      html: `¿Estás seguro de marcar como pagado el evento de <b>${nombre}</b>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#e74c3c',
      confirmButtonText: 'Sí, marcar como pagado',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      await marcarComoPagado(id);
    }
  };

  const marcarComoPagado = async (id) => {
    try {
      setRefreshing(true);
      await axios.put(`http://localhost:5000/api/entradas/${id}/pagar`);
      
      // Actualización optimista del estado
      setEventosPendientes(prev => 
        prev.map(evento => 
          evento.id === id 
            ? { ...evento, estado: 'Pagado', saldo: 0 } 
            : evento
        )
      );
      
      Swal.fire({
        title: '¡Éxito!',
        text: 'El evento ha sido marcado como pagado',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error('Error al marcar como pagado:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo marcar como pagado. Intenta nuevamente.',
        icon: 'error'
      });
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loading && !refreshing) {
    return (
      <div className="pendientes__container pendientes__container--loading">
        <div className="pendientes__loading-spinner">
          <div className="pendientes__spinner"></div>
          <p className="pendientes__loading-text">Cargando pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pendientes__container">
      <header className='headerpendientes'>
      <div className="pendientes__header">
        <h2 className="pendientes__title">Pendientes</h2>
        <button 
          onClick={handleRefresh} 
          className="pendientes__refresh-button"
          disabled={refreshing}
        >
          {refreshing ? (
            <span className="pendientes__refresh-icon">↻</span>
          ) : (
            'Actualizar'
          )}
        </button>
      </div>
      </header>
      {error && (
        <div className="pendientes__error-message">
          <span className="pendientes__error-icon">⚠️</span> {error}
        </div>
      )}

      {eventosPendientes.length === 0 ? (
        <div className="pendientes__empty-state">
          <p className="pendientes__empty-text">No hay  pendientes</p>
        </div>
      ) : (
        <div className="pendientes__grid">
          {eventosPendientes.map((evento) => (
            <div key={evento.id} className="pendientes__card">
              <div className="pendientes__card-header">
                <h3 className="pendientes__client-name">
                  {evento.nombre} {evento.apellido}
                </h3>
                <span className={`pendientes__status pendientes__status--${evento.estado.toLowerCase()}`}>
                  {evento.estado}
                </span>
              </div>
              
              <div className="pendientes__card-body">
                <div className="pendientes__detail-row">
                  <span className="pendientes__detail-label">Concepto:</span>
                  <span className="pendientes__detail-value">{evento.concepto}</span>
                </div>
                
                <div className="pendientes__financial-section">
                  <div className="pendientes__detail-row">
                    <span className="pendientes__detail-label">Total:</span>
                    <span className="pendientes__detail-value pendientes__amount">
                      {formatCurrency(evento.cantidad_total)}
                    </span>
                  </div>
                  <div className="pendientes__detail-row">
                    <span className="pendientes__detail-label">Abono:</span>
                    <span className="pendientes__detail-value pendientes__payment">
                      {formatCurrency(evento.abono)}
                    </span>
                  </div>
                  <div className="pendientes__detail-row">
                    <span className="pendientes__detail-label">Saldo:</span>
                    <span className={`pendientes__detail-value pendientes__balance pendientes__balance--${evento.saldo > 0 ? 'pending' : 'paid'}`}>
                      {formatCurrency(evento.saldo)}
                    </span>
                  </div>
                </div>
                
                <div className="pendientes__detail-row">
                  <span className="pendientes__detail-label">Fecha:</span>
                  <span className="pendientes__detail-value">
                    {new Date(evento.fecha).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              
              <div className="pendientes__card-footer">
                <button 
                  className="pendientes__action-button pendientes__action-button--primary" 
                  onClick={() => confirmarPago(evento.id, `${evento.nombre} ${evento.apellido}`)}
                  disabled={refreshing}
                >
                  Marcar como Pagado
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pendientes;