import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Grafic = () => {
    // Estado para almacenar el tipo de gráfico seleccionado (diario, semanal, mensual)
    const [period, setPeriod] = useState('diario'); // valor inicial "diario"

    // Datos de ingresos para cada período
    const data = {
        diario: [
            { name: 'Lun', ingresos: 1600 },
            { name: 'Mar', ingresos: 700 },
            { name: 'Mié', ingresos: 400 },
            { name: 'Jue', ingresos: 900 },
            { name: 'Vie', ingresos: 1200 },
            { name: 'Sáb', ingresos: 800 },
            { name: 'Dom', ingresos: 1500 },
        ],
        semanal: [
            { name: 'Semana 1', ingresos: 3000 },
            { name: 'Semana 2', ingresos: 3500 },
            { name: 'Semana 3', ingresos: 2500 },
            { name: 'Semana 4', ingresos: 4000 },
        ],
        mensual: [
            { name: 'Enero', ingresos: 15000 },
            { name: 'Febrero', ingresos: 16000 },
            { name: 'Marzo', ingresos: 14000 },
            { name: 'Abril', ingresos: 17000 },
            { name: 'Mayo', ingresos: 18000 },
            { name: 'Junio', ingresos: 19000 },
            { name: 'Julio', ingresos: 20000 },
            { name: 'Agosto', ingresos: 50000 },
            { name: 'Septiembre', ingresos: 1000 },
            { name: 'Octubre', ingresos: 2500 },
            { name: 'Noviembre', ingresos: 20100 },
            { name: 'Diciembre', ingresos: 1500 },
        ],
    };

    // Función para cambiar entre los diferentes períodos
    const handleChangePeriod = (newPeriod) => {
        setPeriod(newPeriod);
    };

    // Sumar los ingresos del periodo seleccionado
    const sumIncomes = (period) => {
        return data[period].reduce((acc, item) => acc + item.ingresos, 0);
    };

    return (
        <div className="income-chart-container">
            {/* Botones para cambiar el período */}
            <div className="period-selector">
                <button onClick={() => handleChangePeriod('diario')}>Diario</button>
                <button onClick={() => handleChangePeriod('semanal')}>Semanal</button>
                <button onClick={() => handleChangePeriod('mensual')}>Mensual</button>
            </div>

            {/* Renderizamos el gráfico con los datos del período seleccionado */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data[period]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ingresos" stroke="#C82D2DFF" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>

            {/* Muestra los ingresos totales */}
            <div className="total-income">
                <h2>Total de Ingresos ({period.charAt(0).toUpperCase() + period.slice(1)})</h2>
                <p>${sumIncomes(period)}</p>
            </div>
        </div>
    );
};

export default Grafic;
