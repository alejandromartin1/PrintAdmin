import React, { useState } from 'react';
import '../styles/entradasysalidas.css';

const RegistroFinanzas = () => {
  const [vista, setVista] = useState('entradas');
  const [entradas, setEntradas] = useState([]);
  const [salidas, setSalidas] = useState([]);

  const [nuevaEntrada, setNuevaEntrada] = useState({
    cliente: '',
    fecha: '',
    concepto: '',
    cantidad: '',
    tipo_pago: 'completo',
    abono: ''
  });

  const [nuevaSalida, setNuevaSalida] = useState({
    descripcion: '',
    fecha: '',
    cantidad: ''
  });

  const agregarEntrada = (e) => {
    e.preventDefault();
    const cantidad = parseFloat(nuevaEntrada.cantidad);
    const abono = nuevaEntrada.tipo_pago === 'abono' ? parseFloat(nuevaEntrada.abono) : cantidad;
    const saldo = cantidad - abono;

    const entrada = {
      id: Date.now(),
      ...nuevaEntrada,
      cantidad,
      abono,
      saldo
    };

    setEntradas([...entradas, entrada]);

    setNuevaEntrada({
      cliente: '',
      fecha: '',
      concepto: '',
      cantidad: '',
      tipo_pago: 'completo',
      abono: ''
    });
  };

  const agregarSalida = (e) => {
    e.preventDefault();
    const salida = {
      id: Date.now(),
      ...nuevaSalida,
      cantidad: parseFloat(nuevaSalida.cantidad)
    };

    setSalidas([...salidas, salida]);

    setNuevaSalida({ descripcion: '', fecha: '', cantidad: '' });
  };

  const pendientes = entradas.filter(e => e.saldo > 0);

  return (
    <div className="registro-container">
      <h2>Registros de la Imprenta</h2>

      <div className="tabs">
        <button className={vista === 'entradas' ? 'active' : ''} onClick={() => setVista('entradas')}>Entradas</button>
        <button className={vista === 'salidas' ? 'active' : ''} onClick={() => setVista('salidas')}>Salidas</button>
        <button className={vista === 'pendientes' ? 'active' : ''} onClick={() => setVista('pendientes')}>Pendientes</button>
      </div>

      <div className="vista">
        {vista === 'entradas' && (
          <>
            <form onSubmit={agregarEntrada} className="formulario">
              <h3>Agregar Entrada</h3>
              <input type="text" placeholder="Cliente" value={nuevaEntrada.cliente} onChange={e => setNuevaEntrada({ ...nuevaEntrada, cliente: e.target.value })} required />
              <input type="date" value={nuevaEntrada.fecha} onChange={e => setNuevaEntrada({ ...nuevaEntrada, fecha: e.target.value })} required />
              <input type="text" placeholder="Concepto" value={nuevaEntrada.concepto} onChange={e => setNuevaEntrada({ ...nuevaEntrada, concepto: e.target.value })} required />
              <input type="number" placeholder="Cantidad total" value={nuevaEntrada.cantidad} onChange={e => setNuevaEntrada({ ...nuevaEntrada, cantidad: e.target.value })} required />
              
              <select value={nuevaEntrada.tipo_pago} onChange={e => setNuevaEntrada({ ...nuevaEntrada, tipo_pago: e.target.value })}>
                <option value="completo">Pago completo</option>
                <option value="abono">Abono</option>
              </select>

              {nuevaEntrada.tipo_pago === 'abono' && (
                <input type="number" placeholder="Cantidad abonada" value={nuevaEntrada.abono} onChange={e => setNuevaEntrada({ ...nuevaEntrada, abono: e.target.value })} required />
              )}

              <button type="submit">Agregar Entrada</button>
            </form>

            <div className="tabla">
              <h3>Entradas</h3>
              {entradas.map(e => (
                <div key={e.id} className="card entrada">
                  <p><strong>Cliente:</strong> {e.cliente}</p>
                  <p><strong>Fecha:</strong> {e.fecha}</p>
                  <p><strong>Concepto:</strong> {e.concepto}</p>
                  <p><strong>Total:</strong> ${e.cantidad}</p>
                  <p><strong>Pago:</strong> {e.tipo_pago}</p>
                  <p><strong>Abono:</strong> ${e.abono}</p>
                  <p><strong>Saldo:</strong> ${e.saldo}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {vista === 'salidas' && (
          <>
            <form onSubmit={agregarSalida} className="formulario">
              <h3>Agregar Salida</h3>
              <input type="text" placeholder="Descripción" value={nuevaSalida.descripcion} onChange={e => setNuevaSalida({ ...nuevaSalida, descripcion: e.target.value })} required />
              <input type="date" value={nuevaSalida.fecha} onChange={e => setNuevaSalida({ ...nuevaSalida, fecha: e.target.value })} required />
              <input type="number" placeholder="Cantidad" value={nuevaSalida.cantidad} onChange={e => setNuevaSalida({ ...nuevaSalida, cantidad: e.target.value })} required />
              <button type="submit">Agregar Salida</button>
            </form>

            <div className="tabla">
              <h3>Salidas</h3>
              {salidas.map(s => (
                <div key={s.id} className="card salida">
                  <p><strong>Descripción:</strong> {s.descripcion}</p>
                  <p><strong>Fecha:</strong> {s.fecha}</p>
                  <p><strong>Cantidad:</strong> ${s.cantidad}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {vista === 'pendientes' && (
          <div className="tabla">
            <h3>Trabajos Pendientes</h3>
            {pendientes.length === 0 ? <p>No hay pendientes.</p> : pendientes.map(p => (
              <div key={p.id} className="card pendiente">
                <p><strong>Cliente:</strong> {p.cliente}</p>
                <p><strong>Concepto:</strong> {p.concepto}</p>
                <p><strong>Saldo pendiente:</strong> <span className="saldo">${p.saldo}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistroFinanzas;
