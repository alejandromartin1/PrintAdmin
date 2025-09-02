import { jsPDF } from "jspdf";

export const generarPDFHistorialCotizaciones = (
  cotizaciones,
  clienteInfo,
  formatDate,
  formatCurrency,
  logo
) => {
  const doc = new jsPDF();

  // === COLORES ELEGANTES ===
  const primaryColor = [180, 0, 0]; // Rojo elegante
  const secondaryColor = [80, 80, 80]; // Gris
  const lightGray = [245, 245, 245]; // Fondo alternado tablas
  const tableBorderColor = [200, 200, 200]; // Bordes sutiles

  // Márgenes
  const marginX = 20;
  let posY = 20;

  // === ENCABEZADO ROJO CON LOGO Y NOMBRE EMPRESA ===
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, "F");

  // Logo
  if (logo && typeof logo === "string") {
    try {
      doc.addImage(logo, "PNG", marginX, 8, 30, 22);
    } catch (error) {
      console.warn("Logo no válido para PDF:", error);
    }
  }

  // Nombre empresa
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "DISTRIBUIDORA Y SUMINISTROS RUZ S. DE R.L DE C.V",
    130,
    22,
    { align: "center" }
  );

  // === TITULO DE DOCUMENTO ===
  posY = 50;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text("Historial de Cotizaciones", 105, posY, { align: "center" });

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(65, posY + 2, 145, posY + 2);

  posY += 15;

  // === DATOS DEL CLIENTE ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text("Información del Cliente", marginX, posY);

  posY += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...secondaryColor);

  if (clienteInfo) {
    doc.text(`Cliente: ${clienteInfo.nombre} ${clienteInfo.apellido}`, marginX, posY);
    posY += 6;
    if (clienteInfo.numero_telefono) {
      doc.text(`Teléfono: ${clienteInfo.numero_telefono}`, marginX, posY);
      posY += 6;
    }
    if (clienteInfo.correo) {
      doc.text(`Email: ${clienteInfo.correo}`, marginX, posY);
      posY += 6;
    }
  }

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(marginX, posY + 2, 190, posY + 2);

  posY += 12;

  // === TABLA ===
  const headers = ["#", "Fecha", "Conceptos", "Subtotal", "IVA", "Total"];
  const numCols = headers.length;
  const tableWidth = 170; // ancho fijo de tabla (210 - 40 márgenes)
  const colWidth = tableWidth / numCols; // todas iguales
  const colWidths = new Array(numCols).fill(colWidth);
  const rowHeight = 6;

  // Encabezado
  doc.setFillColor(...primaryColor);
  doc.rect(marginX, posY - rowHeight, tableWidth, rowHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);

  let colX = marginX;
  headers.forEach((header, i) => {
    doc.text(header, colX + 2, posY - 1.5);
    colX += colWidths[i];
  });

  // Filas
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(40, 40, 40);
  posY += 1.5;

  cotizaciones.forEach((c, index) => {
    if (posY + rowHeight > 285) {
      doc.addPage();
      posY = 30;
    }

    // Fondo alternado
    if (index % 2 === 0) {
      doc.setFillColor(...lightGray);
      doc.rect(marginX, posY, tableWidth, rowHeight, "F");
    }

    // Bordes
    doc.setDrawColor(...tableBorderColor);
    doc.setLineWidth(0.2);
    doc.rect(marginX, posY, tableWidth, rowHeight);

    colX = marginX;

    // Número
    doc.text(String(index + 1), colX + 2, posY + 4);
    colX += colWidths[0];

    // Fecha
    doc.text(formatDate(c.fecha), colX + 2, posY + 4);
    colX += colWidths[1];

    // Conceptos
    const conceptos = c.conceptos
      ? c.conceptos.map(con => con.concepto).join(", ")
      : "—";
    const conceptosLines = doc.splitTextToSize(conceptos, colWidths[2] - 3);
    conceptosLines.forEach((line, i) => {
      doc.text(line, colX + 2, posY + 4 + i * 5);
    });
    colX += colWidths[2];

    // Subtotal
    doc.text(formatCurrency(c.subtotal), colX + 2, posY + 4);
    colX += colWidths[3];

    // IVA
    doc.text(formatCurrency(c.iva), colX + 2, posY + 4);
    colX += colWidths[4];

    // Total
    doc.text(formatCurrency(c.total), colX + 2, posY + 4);

    posY += Math.max(rowHeight, conceptosLines.length * 5);
  });

  // === FOOTER ===
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Documento generado por Distribuidora y Suministros RUZ S. DE R.L DE C.V",
    105,
    290,
    { align: "center" }
  );

  // === GUARDAR ===
  const nombreArchivo = clienteInfo
    ? `Cotizaciones_${clienteInfo.nombre}_${clienteInfo.apellido}.pdf`
    : `Cotizaciones.pdf`;

  doc.save(nombreArchivo);
};
