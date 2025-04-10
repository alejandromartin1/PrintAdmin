import { jsPDF } from "jspdf";

export const generarPDF = (cotizaciones, cliente, logo) => {
  const doc = new jsPDF();
  
    // Nombre de la imprenta centrado
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("DISTRIBUIDORA Y SUMINISTROS RUZ S. DE R.L DE C.V", 105, 15, { align: 'center' });
  
    // Logo alineado a la izquierda
    doc.addImage(logo, 'PNG', 20, 30, 32, 21);  // Logo alineado a la izquierda
  
    // Datos de la empresa alineados
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50); // Gris oscuro
    const rightMargin = 110; // Ajusta el margen derecho para que se alinee con el logo y el resto
    doc.text("Tel./Fax: (999)984-12-56", rightMargin, 30);
    doc.text("Dirección: Calle 66 No. 622-A x 85 y 87  Centro, Mérida, Yuc.", rightMargin, 40);
    doc.text("Correo: pabloruz7@hotmail.com / impresosruz@hotmail.com", rightMargin, 50);
  
    // Línea separadora
    doc.line(20, 55, 190, 55);  
    doc.setLineWidth(0.5);
  
    // Título de la cotización centrado
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Cotización", 105, 70, { align: 'center' });
  
    // Fecha y clienteÑ
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);  // Gris claro
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 80); // Fecha a la derecha
    doc.text(`Cliente: ${cliente || 'Desconocido'}`, 20, 80);  // Cliente a la izquierda
  
    // Crear tabla para los detalles de la cotización
    const startX = 20;
    const startY = 100;
    const tableWidth = 180;
  
    // Encabezado de la tabla
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Concepto", startX + 5, startY);  
    doc.text("Cantidad", startX + 50, startY);  
    doc.text("Precio Unitario", startX + 105, startY);  
    doc.text("Subtotal", startX + 140, startY);  
    doc.text("IVA", startX + 170, startY);  
    doc.text("Total", startX + 200, startY);  
  
    // Línea divisoria debajo del encabezado
    doc.line(startX, startY + 2, startX + tableWidth, startY + 2);
  
    // Insertar los productos en la tabla
    cotizaciones.forEach((producto, index) => {
      const posY = startY + (index + 1) * 15;
  
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
  
      const conceptoTexto = producto.concepto;
      const conceptoLines = doc.splitTextToSize(conceptoTexto, 45);
  
      let offsetY = 0;
      conceptoLines.forEach((line, lineIndex) => {
        doc.text(line, startX + 5, posY + offsetY);
        offsetY += 5;
      });
  
      const cantidadX = startX + 55;  
      doc.text(producto.cantidad, cantidadX, posY);
      doc.text(`$${producto.precioUnitario}`, startX + 105, posY);
      doc.text(`$${producto.subtotal}`, startX + 140, posY);
      doc.text(producto.iva ? `$${(producto.total - producto.subtotal).toFixed(2)}` : "0.00", startX + 170, posY);
      doc.text(`$${producto.total}`, startX + 200, posY);
    });
  
    // Línea divisoria después de la tabla de productos
    const finalY = startY + (cotizaciones.length + 1) * 15;
    doc.line(startX, finalY, startX + tableWidth, finalY);
  
    // Subtotal, IVA y Total abajo de la tabla
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Subtotal:", startX + 140, finalY + 10);
    doc.text("IVA (16%):", startX + 140, finalY + 20);
    doc.text("Total:", startX + 140, finalY + 30);
  
    // Colocar valores de Subtotal, IVA y Total
    doc.setFont('helvetica', 'normal');
    doc.text(`$${cotizaciones.reduce((acc, producto) => acc + parseFloat(producto.subtotal), 0).toFixed(2)}`, startX + 170, finalY + 10);
    doc.text(`$${cotizaciones.reduce((acc, producto) => acc + (producto.iva ? parseFloat(producto.total) - parseFloat(producto.subtotal) : 0), 0).toFixed(2)}`, startX + 170, finalY + 20);
    doc.text(`$${cotizaciones.reduce((acc, producto) => acc + parseFloat(producto.total), 0).toFixed(2)}`, startX + 170, finalY + 30);
  
    // Firma al final centrada
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text("Atentamente,", 105, finalY + 50, { align: 'center' });
    doc.text("Pedro Pablo Ruz", 105, finalY + 60, { align: 'center' });
  
    // Guardar el PDF con nombre personalizado
    doc.save(`Cotizacion_${cliente}.pdf`);
}