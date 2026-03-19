import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export interface QuoteExportData {
  products: { name: string; description: string; unitCost: number; weightKg: number; quantity: number }[];
  productsTotal: number;
  markupPercent: number;
  markupAmount: number;
  subtotal: number;
  labourIsPercent: boolean;
  labourValue: number;
  labourCost: number;
  originStr: string;
  destStr: string;
  distanceKm: number;
  weight: number;
  shippingCost: number;
  finalPrice: number;
}

const fmt = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);

export const exportQuoteToPDF = (data: QuoteExportData) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Price Quote", 14, 22);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32);

  const productRows = data.products.map((p) => [
    `${p.name}${p.description ? `\n(${p.description})` : ""}`,
    p.quantity.toString(),
    `${p.weightKg}kg`,
    fmt(p.unitCost),
    fmt(p.unitCost * p.quantity),
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Product", "Qty", "Weight", "Unit Cost", "Subtotal"]],
    body: productRows,
    theme: "striped",
    headStyles: { fillColor: [245, 158, 11] }, // Amber 500
  });

  const finalY = (doc as any).lastAutoTable.finalY || 40;

  autoTable(doc, {
    startY: finalY + 10,
    body: [
      ["Products Total", fmt(data.productsTotal)],
      [`Markup (${data.markupPercent}%)`, fmt(data.markupAmount)],
      ["Products + Markup", fmt(data.subtotal)],
      [
        `Labour ${data.labourIsPercent ? `(${data.labourValue}%)` : "(Flat)"}`,
        fmt(data.labourCost),
      ],
      ["Shipping", fmt(data.shippingCost)],
    ],
    theme: "plain",
    styles: { halign: "right" },
    columnStyles: { 0: { fontStyle: "bold" } },
  });

  const summaryY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Shipping Details:", 14, summaryY);
  doc.text(`From: ${data.originStr || "N/A"}`, 14, summaryY + 6);
  doc.text(`To: ${data.destStr || "N/A"}`, 14, summaryY + 12);
  doc.text(`Distance: ~${data.distanceKm.toLocaleString()} km`, 14, summaryY + 18);
  doc.text(`Weight: ${data.weight} kg`, 14, summaryY + 24);

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(`Final Selling Price: ${fmt(data.finalPrice)}`, 14, summaryY + 40);

  doc.save("Price_Quote.pdf");
};

export const exportQuoteToExcel = (data: QuoteExportData) => {
  const wb = XLSX.utils.book_new();

  // Products Sheet
  const productData = data.products.map((p) => ({
    "Product Name": p.name || "Unnamed Item",
    Description: p.description || "",
    "Unit Weight (kg)": p.weightKg,
    Quantity: p.quantity,
    "Unit Cost (ZAR)": p.unitCost,
    "Subtotal (ZAR)": p.unitCost * p.quantity,
  }));

  const ws1 = XLSX.utils.json_to_sheet(productData);
  XLSX.utils.book_append_sheet(wb, ws1, "Products");

  // Summary Sheet
  const summaryData = [
    { Item: "Products Total", Value: data.productsTotal },
    { Item: `Markup (${data.markupPercent}%)`, Value: data.markupAmount },
    { Item: "Products + Markup", Value: data.subtotal },
    {
      Item: `Labour ${data.labourIsPercent ? `(${data.labourValue}%)` : "(Flat)"}`,
      Value: data.labourCost,
    },
    { Item: "Shipping", Value: data.shippingCost },
    { Item: "Final Selling Price", Value: data.finalPrice },
    { Item: "", Value: "" },
    { Item: "Shipping Details", Value: "" },
    { Item: "From", Value: data.originStr },
    { Item: "To", Value: data.destStr },
    { Item: "Distance (km)", Value: data.distanceKm },
    { Item: "Weight (kg)", Value: data.weight },
  ];

  const ws2 = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws2, "Summary");

  XLSX.writeFile(wb, "Price_Quote.xlsx");
};
