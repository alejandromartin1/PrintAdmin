import React from 'react';
import '../styles/dashboard.css';
import Grafic from '../componentes/grafics';
import Sidebar from '../componentes/sidebar';
import Navbar from '../componentes/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faUsers} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
         <Sidebar/>
         <div className='content'>
            <Navbar username="Alejandro Martin"/> 
            <main className="main-content">
                <h1>Bienvenid@</h1>
                <div className='income-chart-container'>
                    {/* Cuadros de ingresos */}
                <div className="stats">
                    <div className="stat-box diario">
                        <h3><FontAwesomeIcon icon={faCalendarDays} />Diario</h3>
                        <div className="number">$50</div> {/* modificarlo con consumo de api  */}
                    </div>
                    <div className="stat-box semanal">
                        <h3><FontAwesomeIcon icon={faCalendarDays} />Semanal</h3>
                        <div className="number">$350</div> {/* modificarlo con consumo de api  */}
                    </div>
                    <div className="stat-box mensual">
                        <h3><FontAwesomeIcon icon={faCalendarDays} />Mensual</h3>
                        <div className="number">$1500</div> {/* modificarlo con consumo de api  */}
                    </div>
                    <div className="stat-box clientes">
                        <h3><FontAwesomeIcon icon={faUsers}/>Clientes</h3>
                        <div className="number">50</div> {/* modificarlo con consumo de api  */}
                    </div>
                </div>
                    <Grafic />
                </div>
            </main>
        </div>
    </div>
    );
};

export default Dashboard;
