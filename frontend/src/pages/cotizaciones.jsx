import React, { useState, useEffect } from "react";
import axios from "axios";
import VistaPrevia from "../pages/vistapreviacoti";
import { generarPDF } from "../utils/pdfGenerator";
import '../styles/cotizaciones.css';
import logo from '../assets/RUZ.png';
import Swal from 'sweetalert2'

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
  const [clienteNombre, setClienteNombre] = useState("");
  const [clientes, setClientes] = useState([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false); 


  // Cargar la lista de clientes desde la API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    fetchClientes();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newProducto = {
      ...producto,
      [name]: type === "checkbox" ? checked : value,
    };

    // Calcula el total en tiempo real
    let subtotal = parseFloat(newProducto.cantidad || 0) * parseFloat(newProducto.precioUnitario || 0);
    let iva = newProducto.iva ? subtotal * 0.16 : 0; 
    let total = subtotal + iva;

    setProducto({ ...newProducto, subtotal: subtotal.toFixed(2), total: total.toFixed(2) });
  };


const agregarProducto = async () => {
  if (!cliente || !producto.cantidad || !producto.precioUnitario) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos del producto',
      confirmButtonColor: '#f0ad4e',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  // Crea una copia del producto actual con total numérico
  const nuevoProducto = {
    concepto: producto.concepto,
    cantidad: parseFloat(producto.cantidad),
    precio_unitario: parseFloat(producto.precioUnitario),
    iva_porcentaje: producto.iva ? 16 : 0,
    total_final: parseFloat(producto.total)
  };
  if (parseFloat(producto.cantidad) <= 0 || parseFloat(producto.precioUnitario) <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Valores inválidos',
      text: 'La cantidad y el precio deben ser mayores a 0.',
      confirmButtonColor: '#f0ad4e',
      confirmButtonText: 'Entendido'
    });
    return;
  }
  
  const subtotal = nuevoProducto.cantidad * nuevoProducto.precio_unitario;
  const iva = producto.iva ? subtotal * 0.16 : 0;
  const total = subtotal + iva;

  try {
    await axios.post("http://localhost:5000/api/cotizaciones/crear", {
      id_cliente: cliente,  // Asegúrate de que este sea un ID numérico
      conceptos: [nuevoProducto],
      subtotal,
      iva,
      total
    });

    setCotizaciones([...cotizaciones, { ...producto, cliente }]);
    setProducto({
      concepto: "",
      cantidad: "",
      precioUnitario: "",
      iva: false,
      total: "0.00",
      subtotal: "0.00",
    });

    Swal.fire({
      icon: 'success',
      title: '¡Cotización creada!',
      text: 'Se ha enviado exitosamente al servidor.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });    
  } catch (error) {
    console.error("Error al enviar la cotización:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al enviar la cotización.',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Cerrar'
    });
    
  }
};

  const toggleVistaPrevia = () => {
    setIsPreviewVisible(!isPreviewVisible); // Alterna entre true y false
  };

  const exportarPDF = () => {
    generarPDF(cotizaciones, clienteNombre, logo);
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
    setClienteNombre("");
  };

  return (
    <div className="cotizacion-container">
      <h2 className="cotizacion-title">Cotización</h2>
      
      <label className="cotizacion-label">Cliente:</label>
      <select
      className="cotizacion-input"
      value={cliente}
      onChange={(e) => {
        const idSeleccionado = e.target.value;
        const clienteSeleccionado = clientes.find(c => c.id.toString() === idSeleccionado);
    
        setCliente(idSeleccionado);
    
        if (clienteSeleccionado) {
          setClienteNombre(`${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`);
        } else {
          setClienteNombre(""); // Evita error si no se encuentra el cliente
        }
      }}
    >
      <option value="" disabled>Seleccione un cliente</option>
      {clientes.map((cli) => (
        <option key={cli.id} value={cli.id}>
          {cli.nombre} {cli.apellido}
        </option>
      ))}
    </select>


      <label className="cotizacion-label">Concepto:</label>
      <input className="cotizacion-input" type="text" name="concepto" value={producto.concepto} onChange={handleChange} />

      <div className="cotizacion-row">
    <div className="cotizacion-field">
      <label className="cotizacion-label">Cantidad:</label>
      <input className="cotizacion-input" type="number" name="cantidad" value={producto.cantidad} onChange={handleChange} />
    </div>
    <div className="cotizacion-field">
      <label className="cotizacion-label">Precio Unitario:</label>
      <input className="cotizacion-input" type="number" name="precioUnitario" value={producto.precioUnitario} onChange={handleChange} />
    </div>
   </div>
      <label className="cotizacion-checkbox-label">
        <input className="cotizacion-checkbox" type="checkbox" name="iva" checked={producto.iva} onChange={handleChange}/> Incluir IVA (16%)
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
