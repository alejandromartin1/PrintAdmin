import { jsPDF } from "jspdf";

export const generarPDFHistorial = (
  trabajosMes,
  clienteInfo,
  formatDate,
  formatCurrency,
  mesSeleccionado,
  anioSeleccionado,
  logo
) => {
  const doc = new jsPDF();

  const primerDiaMes = new Date(anioSeleccionado, mesSeleccionado, 1);
  const ultimoDiaMes = new Date(anioSeleccionado, mesSeleccionado + 1, 0);

  const nombreMes = primerDiaMes.toLocaleString('es-MX', { month: 'long' });
  const nombreAnio = anioSeleccionado;

  // Título principal con sombra y color azul elegante
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(7, 40, 85);
  doc.setTextColor(200, 200, 200);
  doc.text("DISTRIBUIDORA Y SUMINISTROS RUZ S. DE R.L DE C.V", 106, 19, { align: 'center' });
  doc.setTextColor(7, 40, 85);
  doc.text("DISTRIBUIDORA Y SUMINISTROS RUZ S. DE R.L DE C.V", 105, 18, { align: 'center' });

  // Logo
  if (logo && typeof logo === "string") {
    try {
      doc.addImage(logo, 'PNG', 20, 25, 32, 21);
    } catch (error) {
      console.warn("Logo no válido para agregar al PDF:", error);
    }
  }

  // Datos contacto en gris medio
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 90, 90);
  const rightMargin = 110;
  doc.text("Tel./Fax: (999)984-12-56", rightMargin, 28);
  doc.text("Dirección: Calle 66 No. 622-A x 85 y 87  Centro, Mérida, Yuc.", rightMargin, 36);
  doc.text("Correo: pabloruz7@hotmail.com / impresosruz@hotmail.com", rightMargin, 44);

  // Línea separadora suave
  doc.setDrawColor(180);
  doc.setLineWidth(0.5);
  doc.line(20, 56, 190, 56);

  // Título sección historial con sombra muy suave
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 35, 75);
  doc.setTextColor(210, 210, 210);
  doc.text("Historial de Trabajos", 106, 71, { align: 'center' });
  doc.setTextColor(10, 35, 75);
  doc.text("Historial de Trabajos", 105, 70, { align: 'center' });

  // Subtítulos: Periodo y Cliente
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(85, 85, 85);
  doc.text(`Periodo: ${nombreMes} ${nombreAnio} (${formatDate(primerDiaMes)} - ${formatDate(ultimoDiaMes)})`, 20, 82);
  if (clienteInfo) {
    doc.text(`Cliente: ${clienteInfo.nombre} ${clienteInfo.apellido}`, 190, 82, { align: 'right' });
  } else {
    doc.text(`Cliente: Desconocido`, 190, 82, { align: 'right' });
  }

  // Tabla: Encabezado con fondo azul oscuro y texto blanco
  const startX = 20;
  const startY = 100;
  const tableWidth = 180;

  doc.setFillColor(7, 40, 85); // azul oscuro
  doc.rect(startX, startY - 9, tableWidth, 12, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);

  // Posiciones X columnas ajustadas:
  const colPos = {
    numero: startX + 6,     // 26 mm
    fecha: startX + 18,     // 38 mm
    concepto: startX + 46,  // 66 mm
    total: startX + 121,    // 141 mm
    abono: startX + 143,    // 163 mm
    saldo: startX + 165     // 185 mm
  };

  const headers = [
    { text: "#", x: colPos.numero },
    { text: "Fecha", x: colPos.fecha },
    { text: "Concepto", x: colPos.concepto },
    { text: "Total", x: colPos.total },
    { text: "Abono", x: colPos.abono },
    { text: "Saldo", x: colPos.saldo },
  ];

  headers.forEach(header => {
    doc.text(header.text, header.x, startY);
  });

  // Líneas verticales sutiles para separar columnas
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  [
    colPos.numero - 6,
    colPos.fecha - 6,
    colPos.concepto - 6,
    colPos.total - 6,
    colPos.abono - 6,
    colPos.saldo - 6,
    startX + tableWidth
  ].forEach(xPos => {
    doc.line(xPos, startY - 9, xPos, startY + 14 + trabajosMes.length * 14);
  });

  // Línea fina bajo encabezado
  doc.setDrawColor(200);
  doc.setLineWidth(0.6);
  doc.line(startX, startY + 3, startX + tableWidth, startY + 3);

  // Filas con fondo alternado para legibilidad
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);

  trabajosMes.forEach((trabajo, index) => {
    let posY = startY + (index + 1) * 14;

    // Fondo fila alterna
    if (index % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(startX, posY - 10, tableWidth, 14, 'F');
    }

    const conceptoLines = doc.splitTextToSize(trabajo.concepto, 75);

    doc.text(String(index + 1), colPos.numero, posY);
    doc.text(formatDate(trabajo.fecha), colPos.fecha, posY);

    conceptoLines.forEach((line, i) => {
      doc.text(line, colPos.concepto, posY + i * 5);
    });

    const offsetY = conceptoLines.length > 1 ? (conceptoLines.length - 1) * 5 : 0;

    doc.text(formatCurrency(trabajo.cantidad_total), colPos.total, posY + offsetY);
    doc.text(formatCurrency(trabajo.abono), colPos.abono, posY + offsetY);
    doc.text(formatCurrency(trabajo.saldo), colPos.saldo, posY + offsetY);
  });

  // Línea final tabla
  const filasAlturaExtra = trabajosMes.reduce((acc, t) => {
    const lines = doc.splitTextToSize(t.concepto, 75).length;
    return acc + (lines > 1 ? (lines - 1) * 5 : 0);
  }, 0);

  const finalY = startY + trabajosMes.length * 14 + filasAlturaExtra + 6;
  doc.setDrawColor(200);
  doc.setLineWidth(0.8);
  doc.line(startX, finalY, startX + tableWidth, finalY);

  // Firma elegante
  doc.setFontSize(13);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(70, 90, 120);
  doc.text("Atentamente,", 105, finalY + 30, { align: 'center' });
  doc.setFontSize(14);
  doc.text("Pedro Pablo Ruz", 105, finalY + 42, { align: 'center' });

  // Footer pequeño
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text("Documento generado por Distribuidora y Suministros RUZ S. DE R.L DE C.V", 105, 290, { align: 'center' });

  // Guardar archivo
  const nombreArchivo = clienteInfo
    ? `Historial_${clienteInfo.nombre}_${clienteInfo.apellido}_${nombreMes}_${nombreAnio}.pdf`
    : `Historial_${nombreMes}_${nombreAnio}.pdf`;

  doc.save(nombreArchivo);
};
