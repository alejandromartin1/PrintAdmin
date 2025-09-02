// src/pages/Factura.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import '../styles/factura.css';

const FACTOR_IVA = 0.16; // 16% de IVA

const Factura = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const facturaRef = useRef();

  // Traer factura por ID
  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/entradas/${id}`);
        setFactura(res.data);
      } catch (err) {
        console.error("Error al cargar la factura:", err);
        setError("No se pudo cargar la factura. Verifica que el ID exista.");
      } finally {
        setLoading(false);
      }
    };
    fetchFactura();
  }, [id]);

  // Descargar factura en PDF
  const descargarPDF = async () => {
    if (!facturaRef.current) return;
    const doc = new jsPDF("p", "mm", "a4");
    const canvas = await html2canvas(facturaRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth() - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    doc.save(`Factura_${factura.id}.pdf`);
  };

  // Guardar factura en pendientes por facturar
  const guardarFactura = async () => {
    if (!factura) return;

    try {
      const cantidad_total = Number(factura.cantidad_total) || 0;

      const pendiente = {
        id_entrada: factura.id,
        nombre: factura.nombre || '',
        apellido: factura.apellido || '',
        concepto: factura.concepto || '',
        cantidad_total: cantidad_total,
        subtotal: cantidad_total,
        iva: parseFloat((cantidad_total * FACTOR_IVA).toFixed(2)),
        total: parseFloat((cantidad_total * (1 + FACTOR_IVA)).toFixed(2)),
        fecha: new Date() // ← Agregamos la fecha actual
      };

      await axios.post('http://localhost:5000/api/pendientes-factura', pendiente);

      Swal.fire({
        title: '¡Guardado!',
        text: 'La factura se ha agregado a Pendientes por Facturar.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      navigate('/pendientes-factura');

    } catch (err) {
      console.error('Error al guardar pendiente:', err.response ? err.response.data : err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar la factura. Revisa los datos enviados.',
        icon: 'error'
      });
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando factura...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>{error}</p>;
  if (!factura) return <p style={{ textAlign: 'center', marginTop: '50px' }}>No se encontró la factura.</p>;

  const cantidad_total = Number(factura.cantidad_total) || 0;
  const subtotal = cantidad_total;
  const iva = subtotal * FACTOR_IVA;
  const total = subtotal + iva;

  return (
    <div className="factura-wrapper">
      {/* BOTONES DESCARGAR Y GUARDAR */}
      <div className="boton-descargar">
        <button className="btn-pdf" onClick={descargarPDF}>Descargar PDF</button>
        <button className="btn-guardar" onClick={guardarFactura}>Guardar</button>
      </div>

      <div ref={facturaRef} className="factura-cuadro">
        <div className="factura-empresa">
          <h2>Distribuidora y Suministros RUZ S. de R.L. de C.V.</h2>
          <p>Mérida, Yucatán</p>
          <p>Tel: 9999841256</p>
          <p>Correo: impresos@hotmail.com</p>
        </div>

        <div className="factura-header">
          <h1>Factura #{factura.id}</h1>
        </div>

        <div className="factura-info">
          <p><span>Cliente:</span> {factura.nombre} {factura.apellido}</p>
          <p><span>Descripción:</span> {factura.concepto}</p>
        </div>

        <table className="factura-table">
          <thead>
            <tr>
              <th>Cantidad Total</th>
              <th>Subtotal</th>
              <th>IVA (16%)</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{cantidad_total}</td>
              <td>${subtotal.toFixed(2)}</td>
              <td>${iva.toFixed(2)}</td>
              <td>${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="factura-footer">
          &copy; {new Date().getFullYear()} Distribuidora y Suministros RUZ S. de R.L. de C.V.
        </div>
      </div>
    </div>
  );
};

export default Factura;
