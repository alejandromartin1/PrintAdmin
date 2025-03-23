import React from "react";
import '../styles/vistapreviacoti.css'

const VistaPrevia = ({ cotizaciones, cliente, exportarPDF }) => {
  return (
    <div className="vista-previa-container">
      <h3 className="vista-previa-title">Vista Previa de Cotización</h3>
      <table className="vista-previa-table">
        <thead>
          <tr>
            <th className="vista-previa-th">Concepto</th>
            <th className="vista-previa-th">Cantidad</th>
            <th className="vista-previa-th">Precio Unitario</th>
            <th className="vista-previa-th">Subtotal</th>
            <th className="vista-previa-th">IVA</th>
            <th className="vista-previa-th">Total</th>
          </tr>
        </thead>
        <tbody>
          {cotizaciones.map((prod, index) => (
            <tr key={index}>
              <td className="vista-previa-td">{prod.concepto}</td>
              <td className="vista-previa-td">{prod.cantidad}</td>
              <td className="vista-previa-td">${prod.precioUnitario}</td>
              <td className="vista-previa-td">${prod.subtotal}</td>
              <td className="vista-previa-td">
                {prod.iva ? `$${(prod.total - prod.subtotal).toFixed(2)}` : "0.00"}
              </td>
              <td className="vista-previa-td">${prod.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="vista-previa-button" onClick={exportarPDF}>
        Exportar a PDF
      </button>
    </div>
  );
};

export default VistaPrevia;
