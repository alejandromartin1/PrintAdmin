import React, { useState, useEffect } from "react";
import axios from "axios";
import VistaPrevia from "../pages/vistapreviacoti";
import { generarPDF } from "../utils/pdfGenerator";
import styles from '../styles/Cotizacion.module.css';
import logo from '../assets/RUZ.png';
import Swal from 'sweetalert2';

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
  const [isLoading, setIsLoading] = useState(false);

  const permisosUsuario = JSON.parse(localStorage.getItem("permisos")) || [];
  const rol = localStorage.getItem("rol");
  const esAdmin = rol === "Administrador";

  // Cargar clientes
  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los clientes',
          confirmButtonColor: '#d33',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientes();
  }, []);

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newProducto = {
      ...producto,
      [name]: type === "checkbox" ? checked : value,
    };

    const cantidad = parseFloat(newProducto.cantidad) || 0;
    const precioUnitario = parseFloat(newProducto.precioUnitario) || 0;
    const subtotal = cantidad * precioUnitario;
    const iva = newProducto.iva ? subtotal * 0.16 : 0; 
    const total = subtotal + iva;

    setProducto({ 
      ...newProducto, 
      subtotal: subtotal.toFixed(2), 
      total: total.toFixed(2) 
    });
  };

  // Agregar producto
  const agregarProducto = async () => {
    if (!cliente) {
      Swal.fire({
        icon: 'warning',
        title: 'Cliente no seleccionado',
        text: 'Por favor, selecciona un cliente',
        confirmButtonColor: '#f0ad4e',
      });
      return;
    }

    if (!producto.cantidad || !producto.precioUnitario) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa cantidad y precio unitario',
        confirmButtonColor: '#f0ad4e',
      });
      return;
    }

    if (parseFloat(producto.cantidad) <= 0 || parseFloat(producto.precioUnitario) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Valores inválidos',
        text: 'La cantidad y el precio deben ser mayores a 0',
        confirmButtonColor: '#f0ad4e',
      });
      return;
    }

    const nuevoProducto = {
      concepto: producto.concepto,
      cantidad: parseFloat(producto.cantidad),
      precio_unitario: parseFloat(producto.precioUnitario),
      iva_porcentaje: producto.iva ? 16 : 0,
      total_final: parseFloat(producto.total)
    };

    const subtotal = nuevoProducto.cantidad * nuevoProducto.precio_unitario;
    const iva = producto.iva ? subtotal * 0.16 : 0;
    const total = subtotal + iva;

    try {
      setIsLoading(true);
      await axios.post("http://localhost:5000/api/cotizaciones/crear", {
        id_cliente: cliente,
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
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error al enviar la cotización:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar la cotización',
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar/ocultar vista previa
  const toggleVistaPrevia = () => {
    if (cotizaciones.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No hay productos',
        text: 'Agrega al menos un producto para ver la vista previa',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    setIsPreviewVisible(!isPreviewVisible);
  };

  // 🔹 INICIAR SESIÓN GMAIL (FALTABA ESTA FUNCIÓN)
   // 🔹 LOGIN con Gmail
  const iniciarSesionGmail = () => {
    const clientId = "79251556591-82p8lfapmnk56mo2q82ismu5a8sioml9.apps.googleusercontent.com";
    const scope = "https://www.googleapis.com/auth/gmail.send";
    const redirectUri = window.location.origin;

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  };

  // 🔹 Exportar solo a PDF (descargar)
  const handleExportarPDF = async () => {
    if (cotizaciones.length === 0) {
      return Swal.fire("No hay productos", "Agrega al menos un producto", "warning");
    }

    try {
      await generarPDF(cotizaciones, clienteNombre, logo, false); // false = descarga directa
      Swal.fire("Éxito", "PDF exportado correctamente", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo exportar el PDF", "error");
    }
  };

  // 🔹 Enviar cotización al correo con PDF adjunto
  const handleEnviarCorreo = async () => {
    if (cotizaciones.length === 0) {
      return Swal.fire("No hay productos", "Agrega al menos un producto", "warning");
    }

    const token = localStorage.getItem("gmailToken");
    if (!token) {
      iniciarSesionGmail();
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Enviar Cotización",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Para (correo)">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Asunto">`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          para: document.getElementById("swal-input1").value,
          asunto: document.getElementById("swal-input2").value,
        };
      },
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
    });

    if (!formValues) return;

    const { para, asunto } = formValues;
    const pdfBase64 = await generarPDF(cotizaciones, clienteNombre, logo, true); // true = retorna base64

    try {
      const mensaje =
        `To: ${para}\r\n` +
        `Subject: ${asunto}\r\n` +
        "Content-Type: multipart/mixed; boundary=foo_bar_baz\r\n\r\n" +
        "--foo_bar_baz\r\n" +
        "Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
        "Adjunto encontrarás la cotización.\r\n\r\n" +
        "--foo_bar_baz\r\n" +
        "Content-Type: application/pdf; name=cotizacion.pdf\r\n" +
        "Content-Disposition: attachment; filename=cotizacion.pdf\r\n" +
        "Content-Transfer-Encoding: base64\r\n\r\n" +
        pdfBase64 +
        "\r\n--foo_bar_baz--";

      const raw = btoa(unescape(encodeURIComponent(mensaje)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ raw }),
      });

      Swal.fire("Éxito", "Correo enviado con PDF adjunto", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo enviar el correo", "error");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Generar Cotización</h2>

      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Cliente:</label>
          <select
            className={styles.input}
            value={cliente}
            onChange={(e) => {
              const idSeleccionado = e.target.value;
              const clienteSeleccionado = clientes.find(c => c.id.toString() === idSeleccionado);

              setCliente(idSeleccionado);

              if (clienteSeleccionado) {
                setClienteNombre(`${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`);
              } else {
                setClienteNombre("");
              }
            }}
            disabled={isLoading}
          >
            <option value="" disabled>Seleccione un cliente</option>
            {clientes.map((cli) => (
              <option key={cli.id} value={cli.id}>
                {cli.nombre} {cli.apellido}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Concepto:</label>
          <input 
            className={styles.input} 
            type="text" 
            name="concepto" 
            value={producto.concepto} 
            onChange={handleChange}
            placeholder="Descripción del producto/servicio"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Cantidad:</label>
            <input 
              className={styles.input} 
              type="number" 
              name="cantidad" 
              value={producto.cantidad} 
              onChange={handleChange}
              min="1"
              step="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Precio Unitario ($):</label>
            <input 
              className={styles.input} 
              type="number" 
              name="precioUnitario" 
              value={producto.precioUnitario} 
              onChange={handleChange}
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.checkboxContainer}`}>
          <label className={styles.checkboxLabel}>
            <input 
              className={styles.checkbox} 
              type="checkbox" 
              name="iva" 
              checked={producto.iva} 
              onChange={handleChange}
            /> 
            <span>Incluir IVA (16%)</span>
          </label>
        </div>

        <div className={styles.totalContainer}>
          <h3 className={styles.total}>
            Total: <span>${producto.total}</span>
          </h3>
        </div>

        <div className={styles.actionButtons}>
          {(esAdmin || permisosUsuario.includes("crear_cotizacion")) && (
            <button 
              className={`${styles.button} ${styles.primary}`} 
              onClick={agregarProducto}
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Agregar Producto'}
            </button>
          )}

          {(esAdmin || permisosUsuario.includes("Ver_vista_previa")) && (
            <button 
              className={`${styles.button} ${styles.secondary}`} 
              onClick={toggleVistaPrevia}
            >
              {isPreviewVisible ? "Ocultar Vista Previa" : "Ver Vista Previa"}
            </button>
            
          )}
        </div>
      </div>

      <div className={`${styles.vistaPreviaWrapper} ${isPreviewVisible ? styles.visible : ""}`}>
      <VistaPrevia 
  cotizaciones={cotizaciones}
  cliente={clienteNombre}
  exportarPDF={handleExportarPDF}
  enviarCorreo={handleEnviarCorreo}
/>

           
          <button onClick={handleEnviarCorreo} style={{ background: "red", color: "white", padding: "8px 15px" }}>
            📧 Enviar por Correo (PDF)
          </button>
      </div>
    </div>
  );
};

export default Cotizacion;  