import React, { useState } from 'react';
import '../styles/crearFactura.css';
import { Link } from 'react-router-dom';
import Sidebar from '../componentes/sidebar';
import Navbar from '../componentes/navbar';


const CrearFactura = () => {
  const [cliente, setCliente] = useState('');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [facturaCreada, setFacturaCreada] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí se podría enviar la factura a una API para guardarla en la base de datos
    console.log('Factura creada', { cliente, producto, cantidad, precio });

    // Simulamos que la factura se ha creado correctamente
    setFacturaCreada(true);
  };

  return (
    <div className="Factura-container">
      <Sidebar/>
        <div className='content'>
          <Navbar username="Alejandro Martin"/> 
            <main className='main-content'>
              <div className='crear-factura'>
                <h2>Crear Factura</h2>
                  {facturaCreada ? (
                <div>
                  <h3>Factura creada con éxito!</h3>
                  <Link to="/facturacion/historial">Ver Historial de Facturas</Link>
                </div>
                ) : (
                <form onSubmit={handleSubmit}>

                  <div className="form-group">
                    <label htmlFor="cliente">Nombre del Cliente:</label>
                    <input
                      type="text"
                      id="cliente"
                      value={cliente}
                      onChange={(e) => setCliente(e.target.value)}
                      required/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="producto">Producto:</label>
                    <input
                      type="text"
                      id="producto"
                      value={producto}
                      onChange={(e) => setProducto(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cantidad">Cantidad:</label>
                    <input
                      type="number"
                      id="cantidad"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="precio">Precio Unitario:</label>
                    <input
                      type="number"
                      id="precio"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      required
                    />
                  </div>

                    <div className="form-group">
                      <button type="submit">Crear Factura</button>
                    </div>
                  </form>
                )}
              </div>
            </main>
          </div>
      </div>
  );
};

export default CrearFactura;
