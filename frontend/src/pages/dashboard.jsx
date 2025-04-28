import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarDays, 
  faMoneyBillTrendUp,
  faArrowUp,
  faArrowDown,
  faChartLine,
  faHistory
} from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const Dashboard = () => {
    const [data, setData] = useState({
        entradas: { diario: 0, semanal: 0, mensual: 0 },
        salidas: { diario: 0, semanal: 0, mensual: 0 },
        historico: [],
        gastos:[]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        start: format(subDays(new Date(), 7), 'yyyy-MM-dd'), 
        end: format(new Date(), 'yyyy-MM-dd')
    });
    const [user, setUser] = useState({ nombre: 'Usuario' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
              const token = localStorage.getItem('token');
              if (token) {
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                setUser(response.data);
              }
            } catch (error) {
              console.error('Error al obtener datos del usuario:', error);
            }
          };
          fetchUserData();
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Datos resumidos
                const endpoints = [
                    'entradas/resumen/diario',
                    'entradas/resumen/semanal',
                    'entradas/resumen/mensual',
                    'salidas/resumen/diario',
                    'salidas/resumen/semanal',
                    'salidas/resumen/mensual',
                    'entradas/todos',
                    'salidas/todos'
                ];

                const responses = await Promise.all(
                    endpoints.map(endpoint => 
                        axios.get(`http://localhost:5000/api/${endpoint}`)
                            .catch(err => {
                                console.error(`Error fetching ${endpoint}:`, err);
                                return { data: endpoint.includes('historico') || endpoint.includes('gastos') ? [] : 0 };
                                
                            })
                    )
                );

                setData({
                    entradas: {
                        diario: parseFloat(responses[0].data.diario) || 0,
                        semanal: parseFloat(responses[1].data.semanal) || 0,
                        mensual: parseFloat(responses[2].data.mensual) || 0
                    },
                    salidas: {
                        diario: parseFloat(responses[3].data.diario) || 0,
                        semanal: parseFloat(responses[4].data.semanal) || 0,
                        mensual: parseFloat(responses[5].data.mensual) || 0
                    },
                    historico: responses[6].data || [],
                    gastos: responses[7].data || []
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error al cargar los datos');
                setLoading(false);
            }
        };
        
        fetchData();

        // Actualizar datos cada 5 minutos
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, [dateRange]);

    const chartData = [
        { name: 'Diario', entradas: data.entradas.diario, salidas: data.salidas.diario },
        { name: 'Semanal', entradas: data.entradas.semanal, salidas: data.salidas.semanal },
        { name: 'Mensual', entradas: data.entradas.mensual, salidas: data.salidas.mensual }
    ];

    const balanceData = [
        { name: 'Diario', balance: data.entradas.diario - data.salidas.diario },
        { name: 'Semanal', balance: data.entradas.semanal - data.salidas.semanal },
        { name: 'Mensual', balance: data.entradas.mensual - data.salidas.mensual }
    ];

    const handleDateFilter = (range) => {
        if (range === 'semana') {
            setDateRange({
                start: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
                end: format(endOfWeek(new Date()), 'yyyy-MM-dd')
            });
        } else if (range === 'mes') {
            setDateRange({
                start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
                end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
            });
        } else {
            // 7 días por defecto
            setDateRange({
                start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
                end: format(new Date(), 'yyyy-MM-dd')
            });
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container loading">
                <div className="skeleton-loader">
                    <div className="skeleton-box"></div>
                    <div className="skeleton-box"></div>
                    <div className="skeleton-box"></div>
                    <div className="skeleton-chart"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="dashboard-container error">{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <div className='content'>
                <main className="main-content">
                <h1>Bienvenid@ "{user.nombre} {user.apellido}"</h1>
                    <div className="filters">
                        <button onClick={() => handleDateFilter('semana')}>
                            <FontAwesomeIcon icon={faCalendarAlt} /> Esta semana
                        </button>
                        <button onClick={() => handleDateFilter('mes')}>
                            <FontAwesomeIcon icon={faCalendarAlt} /> Este mes
                        </button>
                        <button onClick={() => handleDateFilter('7dias')}>
                            <FontAwesomeIcon icon={faCalendarAlt} /> Últimos 7 días
                        </button>
                    </div>
                    
                    <div className='stats-container'>
                        {/* Resumen de movimientos */}
                        <div className="stats">
                            {/* Caja Diaria */}
                            <div className="stat-box diario">
                                <h3><FontAwesomeIcon icon={faCalendarDays} /> Diario</h3>
                                <div className="metric">
                                    <span className="label">Entradas:</span>
                                    <span className="value positive">
                                        ${data.entradas.diario.toFixed(2)}
                                        <FontAwesomeIcon icon={faArrowUp} className="trend-icon" />
                                    </span>
                                </div>
                                <div className="metric">
                                    <span className="label">Salidas:</span>
                                    <span className="value negative">
                                        ${data.salidas.diario.toFixed(2)}
                                        <FontAwesomeIcon icon={faArrowDown} className="trend-icon" />
                                    </span>
                                </div>
                                <div className="metric balance">
                                    <span className="label">Balance:</span>
                                    <span className={`value ${(data.entradas.diario - data.salidas.diario) >= 0 ? 'positive' : 'negative'}`}>
                                        ${(data.entradas.diario - data.salidas.diario).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Caja Semanal */}
                            <div className="stat-box semanal">
                                <h3><FontAwesomeIcon icon={faCalendarDays} /> Semanal</h3>
                                <div className="metric">
                                    <span className="label">Entradas:</span>
                                    <span className="value positive">
                                        ${data.entradas.semanal.toFixed(2)}
                                        <FontAwesomeIcon icon={faArrowUp} className="trend-icon" />
                                    </span>
                                </div>
                                <div className="metric">
                                    <span className="label">Salidas:</span>
                                    <span className="value negative">
                                        ${data.salidas.semanal.toFixed(2)}
                                        <FontAwesomeIcon icon={faArrowDown} className="trend-icon" />
                                    </span>
                                </div>
                                <div className="metric balance">
                                    <span className="label">Balance:</span>
                                    <span className={`value ${(data.entradas.semanal - data.salidas.semanal) >= 0 ? 'positive' : 'negative'}`}>
                                        ${(data.entradas.semanal - data.salidas.semanal).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Caja Mensual */}
                            <div className="stat-box mensual">
                                <h3><FontAwesomeIcon icon={faCalendarDays} /> Mensual</h3>
                                <div className="metric">
                                    <span className="label">Entradas:</span>
                                    <span className="value positive">
                                        ${data.entradas.mensual.toFixed(2)}
                                        <FontAwesomeIcon icon={faArrowUp} className="trend-icon" />
                                    </span>
                                </div>
                                <div className="metric">
                                    <span className="label">Salidas:</span>
                                    <span className="value negative">
                                        ${data.salidas.mensual.toFixed(2)}
                                        <FontAwesomeIcon icon={faArrowDown} className="trend-icon" />
                                    </span>
                                </div>
                                <div className="metric balance">
                                    <span className="label">Balance:</span>
                                    <span className={`value ${(data.entradas.mensual - data.salidas.mensual) >= 0 ? 'positive' : 'negative'}`}>
                                        ${(data.entradas.mensual - data.salidas.mensual).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Gráficos */}
                    <div className="charts-container">
                        <div className="chart-card">
                            <h3><FontAwesomeIcon icon={faChartLine} /> Movimientos</h3>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                        <Legend />
                                        <Bar dataKey="entradas" fill="#149A07FF" name="Entradas" />
                                        <Bar dataKey="salidas" fill="#e74a3b" name="Salidas" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        <div className="chart-card">
                            <h3><FontAwesomeIcon icon={faMoneyBillTrendUp} /> Balance</h3>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={balanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                        <Legend />
                                        <Bar 
                                            dataKey="balance" 
                                            fill="#37C300FF" 
                                            name="Balance"
                                            label={{ position: 'top', formatter: (value) => `$${value.toFixed(2)}` }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    
                    {/* Histórico reciente */}
                    <div className="recent-history">
                        <h3><FontAwesomeIcon icon={faHistory} /> Movimientos Recientes</h3>
                        <div className="history-table">
                            <table>
                                <thead>
                                    <tr>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Concepto</th>
                                    <th>Cantidad</th>
                                    <th>Abono</th>
                                    <th>Saldo</th>
                                    <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    {data.historico.slice(0, 5).map((movimiento, index) => (
                                        <tr key={index}>
                                        <td>{movimiento.nombre} {movimiento.apellido}</td>
                                        <td>{new Date(movimiento.fecha).toLocaleDateString('es-ES')}</td>
                                        <td>{movimiento.concepto}</td>
                                        <td>${(movimiento.cantidad_total || 0).toLocaleString()}</td>
                                        <td>${(movimiento.abono || 0).toLocaleString()}</td>
                                        <td>${(movimiento.saldo || 0).toLocaleString()}</td>
                                        <td>
                                            <span className={`es-estado-badge ${movimiento.estado}`}>
                                            {movimiento.estado}
                                            </span>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <h3><FontAwesomeIcon icon={faHistory} /> Gastos Recientes</h3>
                        <div className="history-table">
                            <table>
                                <thead>
                                    <tr>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                    <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    {data.gastos.slice(0, 5).map((gastos, index) => (
                                        <tr key={index}>
                      <td>{new Date(gastos.fecha).toLocaleDateString('es-ES')}</td>
                                        <td>{gastos.descripcion}</td>
                                        <td>${(gastos.cantidad || 0).toLocaleString()}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;