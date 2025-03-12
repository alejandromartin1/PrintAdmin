import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/historialFactura.css';
import Sidebar from '../componentes/sidebar';
import Navbar from '../componentes/navbar';

const HistorialFacturas = () => {
  // Estado para almacenar las facturas (puedes reemplazarlo con datos de una API)
  const [facturas, setFacturas] = useState([]);

  // Simulando carga de datos (esto podría ser un fetch a tu API)
  useEffect(() => {
    const facturasEjemplo = [
      { id: 1, cliente: 'Juan Pérez', producto: 'Laptop', cantidad: 1, precio: 15000, fecha: '2024-03-12' },
      { id: 2, cliente: 'María Gómez', producto: 'Teclado', cantidad: 2, precio: 500, fecha: '2024-03-11' },
      { id: 3, cliente: 'Carlos Ramírez', producto: 'Mouse', cantidad: 1, precio: 300, fecha: '2024-03-10' }
    ];
    setFacturas(facturasEjemplo);
  }, []);

  return (
    // Aquí va el código JSX
    <div className='historial-container'>
    <Sidebar/>
      <div className='content'>
        <Navbar username="Alejandro Martin"/>
      <div className="historial-facturas">
        <h2>Historial de Facturas</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {facturas.length > 0 ? (
              facturas.map((factura) => (
                <tr key={factura.id}>
                  <td>{factura.id}</td>
                  <td>{factura.cliente}</td>
                  <td>{factura.producto}</td>
                  <td>{factura.cantidad}</td>
                  <td>${factura.precio}</td>
                  <td>{factura.fecha}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay facturas registradas</td>
              </tr>
            )}
          </tbody>
        </table>
        <Link to="/facturacion/crearFactura" className="btn-nueva">Crear Nueva Factura</Link>
        </div>
      </div>
    </div>
  );
};

export default HistorialFacturas;
