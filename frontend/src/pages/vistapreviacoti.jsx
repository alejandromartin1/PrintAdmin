import React from "react";
import styles from '../styles/VistaPrevia.module.css';

const VistaPrevia = ({ cotizaciones, cliente, exportarPDF }) => {
  // Calcular totales generales
  const subtotalGeneral = cotizaciones.reduce((sum, prod) => sum + parseFloat(prod.subtotal), 0);
  const ivaGeneral = cotizaciones.reduce((sum, prod) => sum + (prod.iva ? parseFloat(prod.total) - parseFloat(prod.subtotal) : 0), 0);
  const totalGeneral = subtotalGeneral + ivaGeneral;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Vista Previa de Cotización</h3>
        {cliente && <p className={styles.client}>Cliente: {cliente}</p>}
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.tableE}>
          <thead>
            <tr>
              <th className={styles.thH}>Concepto</th>
              <th className={styles.thH}>Cantidad</th>
              <th className={styles.thH}>P. Unitario</th>
              <th className={styles.thH}>Subtotal</th>
              <th className={styles.thH}>IVA</th>
              <th className={styles.thH}>Total</th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.map((prod, index) => (
              <tr key={index} className={styles.tr}>
                <td className={styles.td}>{prod.concepto || "-"}</td>
                <td className={styles.tdNumber}>{prod.cantidad}</td>
                <td className={styles.tdNumber}>${parseFloat(prod.precioUnitario).toFixed(2)}</td>
                <td className={styles.tdNumber}>${parseFloat(prod.subtotal).toFixed(2)}</td>
                <td className={styles.tdNumber}>
                  {prod.iva ? `$${(parseFloat(prod.total) - parseFloat(prod.subtotal)).toFixed(2)}` : "$0.00"}
                </td>
                <td className={styles.tdNumber}>${parseFloat(prod.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={styles.tfootTr}>
              <td className={styles.tfootTd} colSpan="3">Total General</td>
              <td className={styles.tfootTd}>${subtotalGeneral.toFixed(2)}</td>
              <td className={styles.tfootTd}>${ivaGeneral.toFixed(2)}</td>
              <td className={styles.tfootTd}>${totalGeneral.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className={styles.actions}>
        <button className={styles.button} onClick={exportarPDF}>
          Exportar a PDF
          <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VistaPrevia;