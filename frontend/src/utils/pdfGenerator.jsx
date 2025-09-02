import { jsPDF } from "jspdf";

export const generarPDF = (cotizaciones, cliente, logo, returnBase64 = false) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const rowHeight = 10;

  // -----------------------------
  // Barra superior elegante
  // -----------------------------
  doc.setFillColor(102, 0, 0); // rojo más oscuro
  doc.rect(0, 0, pageWidth, 14, "F");

  // -----------------------------
  // Encabezado corporativo
  // -----------------------------
  doc.setFontSize(20);
  doc.setFont("times", "bold");
  doc.setTextColor(102, 0, 0);
  doc.text("DISTRIBUIDORA Y SUMINISTROS RUZ S. DE R.L DE C.V", pageWidth / 2, 28, { align: "center" });

  // -----------------------------
  // Logo y contacto mejorado
  // -----------------------------
  const infoStartY = 60; // subimos la sección un poco
  const infoSpacing = 6;

  // Logo a la izquierda
  if (logo) {
    doc.addImage(logo, "PNG", margin, infoStartY - 10, 45, 35);
  }

  // Información de contacto a la derecha
  doc.setFontSize(9);
  doc.setFont("times", "normal");
  doc.setTextColor(50, 50, 50);

  const contactX = pageWidth - margin;
  doc.text("Tel./Fax: (999)984-12-56", contactX, infoStartY, { align: "right" });
  doc.text("Dirección: Calle 66 No. 622-A x 85 y 87, Centro, Mérida, Yuc.", contactX, infoStartY + infoSpacing, { align: "right" });
  doc.text("Correo: pabloruz7@hotmail.com / impresosruz@hotmail.com", contactX, infoStartY + infoSpacing * 2, { align: "right" });

  // Línea separadora más arriba y elegante
  doc.setDrawColor(180);
  doc.setLineWidth(0.8);
  doc.line(margin, infoStartY + infoSpacing * 2 + 4, pageWidth - margin, infoStartY + infoSpacing * 2 + 4);

  // -----------------------------
  // Título Cotización formal
  // -----------------------------
  doc.setFontSize(18);
  doc.setFont("times", "bold");
  doc.setTextColor(102, 0, 0);
  doc.text("COTIZACIÓN", pageWidth / 2, infoStartY + 40, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, infoStartY + 53);
  doc.text(`Cliente: ${cliente || "Desconocido"}`, pageWidth - margin, infoStartY + 53, { align: "right" });

  // -----------------------------
  // Tabla de productos formal
  // -----------------------------
  const startY = infoStartY + 68;

  const colWidths = [40, 25, 35, 25, 20, 25]; // Concepto, Cant, Precio Unit, Subtotal, IVA, Total
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const tableStartX = (pageWidth - tableWidth) / 2;

  const headers = ["Concepto", "Cantidad", "Precio Unitario", "Subtotal", "IVA", "Total"];

  // Encabezado de tabla
  doc.setFillColor(102, 0, 0);
  doc.rect(tableStartX, startY - rowHeight + 2, tableWidth, rowHeight, "F");
  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.setTextColor(255, 255, 255);

  const colX = colWidths.reduce((acc, w, i) => {
    if (i === 0) acc.push(tableStartX);
    else acc.push(acc[i - 1] + colWidths[i - 1]);
    return acc;
  }, []);

  headers.forEach((text, i) => {
    const align = i === 0 ? "left" : "right";
    const offset = align === "left" ? 2 : colWidths[i] - 2;
    doc.text(text, colX[i] + offset, startY, { align });
  });

  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(tableStartX, startY + 1, tableStartX + tableWidth, startY + 1);

  // Filas de productos
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.setTextColor(40, 40, 40);

  cotizaciones.forEach((p, i) => {
    const posY = startY + (i + 1) * rowHeight;

    if (i % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(tableStartX, posY - rowHeight + 2, tableWidth, rowHeight, "F");
    }

    const concepto = p.concepto.length > 25 ? p.concepto.substring(0, 22) + "..." : p.concepto;
    const values = [
      concepto,
      String(p.cantidad),
      `$${p.precioUnitario}`,
      `$${p.subtotal}`,
      p.iva ? `$${(p.total - p.subtotal).toFixed(2)}` : "0.00",
      `$${p.total}`
    ];

    values.forEach((val, idx) => {
      const align = idx === 0 ? "left" : "right";
      const offset = align === "left" ? 2 : colWidths[idx] - 2;
      doc.text(val, colX[idx] + offset, posY, { align });
    });
  });

  const finalY = startY + (cotizaciones.length + 1) * rowHeight + 6;

  // Totales
  const subtotal = cotizaciones.reduce((acc, p) => acc + parseFloat(p.subtotal), 0);
  const iva = cotizaciones.reduce((acc, p) => acc + (p.iva ? parseFloat(p.total) - parseFloat(p.subtotal) : 0), 0);
  const total = cotizaciones.reduce((acc, p) => acc + parseFloat(p.total), 0);

  doc.setFillColor(245, 245, 245);
  doc.rect(colX[4] - 2, finalY + 6, colWidths[4] + colWidths[5] + 4, 25, "F");

  doc.setFontSize(11);
  doc.setFont("times", "bold");
  doc.setTextColor(102, 0, 0);
  doc.text("Subtotal:", colX[4] + colWidths[4] - 2, finalY + 12, { align: "right" });
  doc.text("IVA (16%):", colX[4] + colWidths[4] - 2, finalY + 20, { align: "right" });
  doc.text("Total:", colX[4] + colWidths[4] - 2, finalY + 28, { align: "right" });

  doc.setFont("times", "normal");
  doc.setTextColor(40, 40, 40);
  doc.text(`$${subtotal.toFixed(2)}`, colX[5] + colWidths[5] - 2, finalY + 12, { align: "right" });
  doc.text(`$${iva.toFixed(2)}`, colX[5] + colWidths[5] - 2, finalY + 20, { align: "right" });
  doc.text(`$${total.toFixed(2)}`, colX[5] + colWidths[5] - 2, finalY + 28, { align: "right" });

  // Firma elegante
  doc.setFontSize(12);
  doc.setFont("times", "italic");
  doc.setTextColor(60, 0, 0);
  doc.text("Atentamente,", pageWidth / 2, finalY + 50, { align: "center" });
  doc.setFontSize(13);
  doc.setFont("times", "bolditalic");
  doc.text("Pedro Pablo Ruz", pageWidth / 2, finalY + 60, { align: "center" });

  // Footer profesional
  doc.setFontSize(8);
  doc.setFont("times", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Documento generado por Distribuidora y Suministros RUZ S. DE R.L DE C.V", pageWidth / 2, pageHeight - 10, { align: "center" });

  if (returnBase64) return doc.output("datauristring").split(",")[1];
  else doc.save(`Cotizacion_${cliente}.pdf`);
};
