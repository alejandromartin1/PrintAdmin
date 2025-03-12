import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';
import logo from '../assets/RUZ.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faHandHoldingDollar, faUsers, faFileInvoiceDollar, faChartLine} from '@fortawesome/free-solid-svg-icons';


const sidebar = () => {
  return (
<aside className='sidebar'>
    <div className="logo-container">
        <img src={logo} alt="Logo Empresa"  className='logo'/>
    </div>
    <ul>
        <li><Link to="/dashboard"><FontAwesomeIcon icon={faHouse}/>Inicio</Link></li>
        <li><Link to="/cotizacion"><FontAwesomeIcon icon={faHandHoldingDollar}/>Cotización</Link></li>
        <li><Link to="/clientes"><FontAwesomeIcon icon={faUsers}/>Clientes</Link></li>
        <li><Link to="/entradasYSalidas"><FontAwesomeIcon icon={faChartLine} />Entradas y salidas</Link></li>
        <li><Link to="/facturacion"><FontAwesomeIcon icon={faFileInvoiceDollar} />Facturación</Link></li>
    </ul>
</aside>
  );
};

export default sidebar


