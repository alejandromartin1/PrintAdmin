import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Grafic = ({ entradas = {}, salidas = {} }) => {
    const [period, setPeriod] = useState('diario');

    // Datos de ejemplo para el gráfico
    const sampleData = {
        diario: [
            { name: 'Lun', entradas: entradas.diario * 0.8, salidas: salidas.diario * 0.7 },
            { name: 'Mar', entradas: entradas.diario * 0.9, salidas: salidas.diario * 0.6 },
            { name: 'Mié', entradas: entradas.diario * 1.1, salidas: salidas.diario * 0.9 },
            { name: 'Jue', entradas: entradas.diario * 0.7, salidas: salidas.diario * 1.2 },
            { name: 'Vie', entradas: entradas.diario * 1.3, salidas: salidas.diario * 0.8 },
            { name: 'Sáb', entradas: entradas.diario * 1.5, salidas: salidas.diario * 0.5 },
            { name: 'Dom', entradas: entradas.diario * 1.2, salidas: salidas.diario * 0.4 },
        ],
        semanal: [
            { name: 'Sem 1', entradas: entradas.semanal * 0.9, salidas: salidas.semanal * 0.8 },
            { name: 'Sem 2', entradas: entradas.semanal * 1.1, salidas: salidas.semanal * 1.2 },
            { name: 'Sem 3', entradas: entradas.semanal * 0.8, salidas: salidas.semanal * 0.7 },
            { name: 'Sem 4', entradas: entradas.semanal * 1.2, salidas: salidas.semanal * 1.1 },
        ],
        mensual: [
            { name: 'Ene', entradas: entradas.mensual * 0.8, salidas: salidas.mensual * 0.9 },
            { name: 'Feb', entradas: entradas.mensual * 1.1, salidas: salidas.mensual * 1.0 },
            { name: 'Mar', entradas: entradas.mensual * 0.9, salidas: salidas.mensual * 1.1 },
            { name: 'Abr', entradas: entradas.mensual * 1.2, salidas: salidas.mensual * 0.8 },
            { name: 'May', entradas: entradas.mensual * 1.0, salidas: salidas.mensual * 0.9 },
            { name: 'Jun', entradas: entradas.mensual * 1.3, salidas: salidas.mensual * 1.0 },
        ],
    };

    const handleChangePeriod = (newPeriod) => {
        setPeriod(newPeriod);
    };

    // Calcular totales basados en los datos del gráfico
    const totalEntradas = sampleData[period].reduce((sum, item) => sum + item.entradas, 0);
    const totalSalidas = sampleData[period].reduce((sum, item) => sum + item.salidas, 0);
    const balance = totalEntradas - totalSalidas;

    return (
        <div className="income-chart-container">
            <div className="period-selector">
                <button 
                    onClick={() => handleChangePeriod('diario')} 
                    className={period === 'diario' ? 'active' : ''}
                >
                    Diario
                </button>
                <button 
                    onClick={() => handleChangePeriod('semanal')}
                    className={period === 'semanal' ? 'active' : ''}
                >
                    Semanal
                </button>
                <button 
                    onClick={() => handleChangePeriod('mensual')}
                    className={period === 'mensual' ? 'active' : ''}
                >
                    Mensual
                </button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sampleData[period]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="entradas" 
                        stroke="#4CAF50" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="salidas" 
                        stroke="#F44336" 
                        strokeWidth={2} 
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="totals-container">
                <div className="total-box">
                    <h3>Total Entradas</h3>
                    <p className="entradas">${totalEntradas.toFixed(2)}</p>
                </div>
                <div className="total-box">
                    <h3>Total Salidas</h3>
                    <p className="salidas">${totalSalidas.toFixed(2)}</p>
                </div>
                <div className="total-box">
                    <h3>Balance</h3>
                    <p className={balance >= 0 ? 'positivo' : 'negativo'}>
                        ${balance.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Grafic;