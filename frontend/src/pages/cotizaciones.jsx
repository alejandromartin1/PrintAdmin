// Cotizacion.js
import React, { useState } from "react";
import VistaPrevia from "../pages/vistapreviacoti";
import { generarPDF } from "../utils/pdfGenerator";
import '../styles/cotizaciones.css';
import logo from '../assets/RUZ.png';

const Cotizacion = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [producto, setProducto] = useState({
    concepto: "",
    cantidad: "",
    precioUnitario: "",
    iva: false,
    total: "0.00",
    subtotal: "0.00",
  });
  const [cliente, setCliente] = useState("");  
  const [isPreviewVisible, setIsPreviewVisible] = useState(false); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({
      ...producto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleClienteChange = (e) => {
    setCliente(e.target.value); 
  };

  const calcularTotal = () => {
    let subtotal =
      parseFloat(producto.cantidad || 0) * parseFloat(producto.precioUnitario || 0);
    let iva = producto.iva ? subtotal * 0.16 : 0; 
    let total = subtotal + iva;
    setProducto({ ...producto, subtotal: subtotal.toFixed(2), total: total.toFixed(2) });
  };

  const agregarProducto = () => {
    if (cliente) {  
      setCotizaciones([...cotizaciones, { ...producto, cliente }]);
      setProducto({
        concepto: "",
        cantidad: "",
        precioUnitario: "",
        iva: false,
        total: "0.00",
        subtotal: "0.00",
      });
    } else {
      alert("Por favor, ingrese el nombre del cliente.");
    }
  };

  const toggleVistaPrevia = () => {
    setIsPreviewVisible(!isPreviewVisible); // Alterna entre true y false
  };

  const exportarPDF = () => {
    generarPDF(cotizaciones, cliente, logo);
    // Después de exportar el PDF, reinicia los estados
    setCotizaciones([]); // Borra las cotizaciones
    setProducto({
      concepto: "",
      cantidad: "",
      precioUnitario: "",
      iva: false,
      total: "0.00",
      subtotal: "0.00",
    }); // Borra el formulario de producto
    setCliente(""); // Borra el cliente
  };
  return (
    <div className="cotizacion-container">
      <h2 className="cotizacion-title">Cotización</h2>
      
      <label className="cotizacion-label">Cliente:</label>
      <input className="cotizacion-input" type="text" value={cliente} onChange={handleClienteChange} />

      <label className="cotizacion-label">Concepto:</label>
      <input className="cotizacion-input" type="text" name="concepto" value={producto.concepto} onChange={handleChange} />

      <label className="cotizacion-label">Cantidad:</label>
      <input className="cotizacion-input" type="number" name="cantidad" value={producto.cantidad} onChange={handleChange} onBlur={calcularTotal} />

      <label className="cotizacion-label">Precio Unitario:</label>
      <input className="cotizacion-input" type="number" name="precioUnitario" value={producto.precioUnitario} onChange={handleChange} onBlur={calcularTotal} />

      <label className="cotizacion-checkbox-label">
        <input className="cotizacion-checkbox" type="checkbox" name="iva" checked={producto.iva} onChange={handleChange} onBlur={calcularTotal} /> Incluir IVA (16%)
      </label>

      <h3 className="cotizacion-total">Total: ${producto.total}</h3>

      <div className="cotizacion-buttons-container">
        <button className="cotizacion-button" onClick={agregarProducto}>Agregar Producto</button>
        <button className="cotizacion-button" onClick={toggleVistaPrevia}>
          {isPreviewVisible ? "Cerrar Vista Previa" : "Ver Vista Previa"}
        </button>
      </div>
      {isPreviewVisible && (
        <VistaPrevia 
          cotizaciones={cotizaciones}
          cliente={cliente}
          exportarPDF={exportarPDF}
        />
      )}
    </div>
  );
};


export default Cotizacion;
