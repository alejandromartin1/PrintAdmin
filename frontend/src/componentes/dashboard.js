import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import Grafic from '../componentes/grafics';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>Menú</h2>
                <ul>
                    <li><Link to="/facturacion">Facturación</Link></li>
                    <li><Link to="/cotizacion">Cotización</Link></li>
                    <li><Link to="/clientes">Clientes</Link></li>
                </ul>
            </aside>
            <main className="main-content">
                <h1>Dashboard</h1>
                <div className='income-chart-container'>
                    {/* Cuadros de ingresos */}
                <div className="stats">
                    <div className="stat-box">
                        <h3>Diario</h3>
                        <div className="number">$50</div> {/* modificarlo con consumo de api  */}
                    </div>
                    <div className="stat-box">
                        <h3>Semanal</h3>
                        <div className="number">$350</div> {/* modificarlo con consumo de api  */}
                    </div>
                    <div className="stat-box">
                        <h3>Mensual</h3>
                        <div className="number">$1500</div> {/* modificarlo con consumo de api  */}
                    </div>
                </div>
                    <Grafic />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
