import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';
import logo from '../assets/RUZ.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faHandHoldingDollar, faUsers, faFileInvoiceDollar, faChartLine, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isFacturaOpen, setIsFacturaOpen] = useState(false);

  const toggleFactura = () => {
    setIsFacturaOpen(!isFacturaOpen);
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Logo Empresa" className="logo" />
      </div>
      <ul>
        <li><Link to="/dashboard"><FontAwesomeIcon icon={faHouse} /> Inicio</Link></li>
        <li><Link to="/cotizacion"><FontAwesomeIcon icon={faHandHoldingDollar} /> Cotización</Link></li>
        <li><Link to="/clientes"><FontAwesomeIcon icon={faUsers} /> Clientes</Link></li>
        <li><Link to="/entradasYSalidas"><FontAwesomeIcon icon={faChartLine} /> Entradas y salidas</Link></li>
        <li className="factura">
          <div onClick={toggleFactura} style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faFileInvoiceDollar} /> Facturación 
            <FontAwesomeIcon icon={isFacturaOpen ? faAngleUp : faAngleDown} style={{ marginLeft: 'auto' }} />
          </div>
          {isFacturaOpen && (
            <ul className="submenu">
              <li><Link to="/facturacion/crearFactura">Nueva Factura</Link></li>
              <li><Link to="/facturacion/historial">Historial de Facturas</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
