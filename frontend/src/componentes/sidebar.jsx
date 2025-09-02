import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';
import logo from '../assets/RUZ.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faHandHoldingDollar,
  faChartLine,
  faAngleDown,
  faAngleUp,
  faClock,
  faUser,
  faUsers,
  faFileInvoice,
  faClockRotateLeft,
  faUserPlus,
  faWarehouse,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isFacturaOpen, setIsFacturaOpen] = useState(false);
  const [rol, setRol] = useState('');
  const [permisos, setPermisos] = useState([]);

  // Cargar rol y permisos del localStorage
  useEffect(() => {
    const rolUsuario = localStorage.getItem('rol');
    const permisosUsuario = localStorage.getItem('permisos');
    if (rolUsuario) setRol(rolUsuario);
    if (permisosUsuario) setPermisos(JSON.parse(permisosUsuario));
  }, []);

  const esAdmin = rol === 'Administrador';

  const toggleCliente = () => {
    setIsFacturaOpen(!isFacturaOpen);
  };

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="logo-container">
        <img src={logo} alt="Logo Empresa" className="logo" />
      </div>

      {/* NAVEGACIÓN */}
      <ul>
        {/* Inicio */}
        {(esAdmin || permisos.includes('ver_dashboard')) && (
          <li>
            <Link to="/dashboard">
              <FontAwesomeIcon icon={faHouse} /> Inicio
            </Link>
          </li>
        )}

        {/* Cotización */}
        {(esAdmin || permisos.includes('ver_cotizacion')) && (
          <li>
            <Link to="/cotizacion">
              <FontAwesomeIcon icon={faHandHoldingDollar} /> Cotización
            </Link>
          </li>
        )}

        {/* Clientes con submenú */}
        {(esAdmin || permisos.includes('ver_clientes')) && (
          <li className="factura">
            <div onClick={toggleCliente} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faUser} /> Clientes
              <FontAwesomeIcon
                icon={isFacturaOpen ? faAngleUp : faAngleDown}
                style={{ marginLeft: 'auto' }}
              />
            </div>
            {isFacturaOpen && (
              <ul className="submenu">
                {(esAdmin || permisos.includes('ver_agregar_cliente')) && (
                  <li>
                    <Link to="/clientes/agregarCliente">
                      <FontAwesomeIcon icon={faUserPlus} /> Agregar Cliente
                    </Link>
                  </li>
                )}
                {(esAdmin || permisos.includes('historial_clientes')) && (
                  <li>
                    <Link to="/clientes/historial">
                      <FontAwesomeIcon icon={faClockRotateLeft} /> Historial de clientes
                    </Link>
                  </li>
                )}
                {(esAdmin || permisos.includes('historial_cotizaciones')) && (
                  <li>
                    <Link to="/historial-cotizaciones">
                      <FontAwesomeIcon icon={faHandHoldingDollar} /> Historial de cotizaciones
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </li>
        )}

        {/* Pendientes */}
        {(esAdmin || permisos.includes('ver_pendientes')) && (
          <li>
            <Link to="/pendientes">
              <FontAwesomeIcon icon={faClock} /> Pendientes
            </Link>
          </li>
        )}

        {/* Gestión de roles (solo Admin) */}
        {esAdmin && (
          <li>
            <Link to="/roles">
              <FontAwesomeIcon icon={faUser} /> Gestión de Roles
            </Link>
          </li>
        )}

        {/* Inventario */}
        {(esAdmin || permisos.includes('ver_inventario')) && (
          <li>
            <Link to="/inventario">
              <FontAwesomeIcon icon={faWarehouse} /> Inventario
            </Link>
          </li>
        )}

        {/* Entradas y salidas */}
        {(esAdmin || permisos.includes('ver_movimientos')) && (
          <li>
            <Link to="/entradasYSalidas">
              <FontAwesomeIcon icon={faChartLine} /> Entradas y salidas
            </Link>
          </li>
        )}

        {/* Empleados */}
        {(esAdmin || permisos.includes('ver_empleados')) && (
          <li>
            <Link to="/empleados">
              <FontAwesomeIcon icon={faUsers} /> Empleados
            </Link>
          </li>
        )}

        {/* Pendientes por factura */}
        {(esAdmin || permisos.includes('ver_pendientes_factura')) && (
          <li>
            <Link to="/pendientes-factura">
              <FontAwesomeIcon icon={faFileInvoice} /> Pendientes por Factura
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
