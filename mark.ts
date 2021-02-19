import { degrees, PDFDocument, rgb } from "./deps.ts";

export async function markPdf(pdfPath: string, text: string) {
  const existingPdfBytes = Deno.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont("Helvetica");
  const fontSize = 100;
  const pages = pdfDoc.getPages();
  pages.forEach((page: any) => {
    const rotationAngle = page.getRotation().angle;
    const { width, height } = page.getSize();
    const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
    const diagonalTextDims = textWidth / Math.sqrt(2);
    const textShift = diagonalTextDims / 2;
    let x = width / 2 - textShift;
    let y = height / 2 + textShift;
    if (rotationAngle === 90) {
      y = height / 2 - textShift;
    }
    if (rotationAngle === 270) {
      x = width / 2 + textShift;
    }
    page.drawText(text, {
      x: x,
      y: y,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(-45 + rotationAngle),
      opacity: 0.5,
    });
  });
  const pdfBytes = await pdfDoc.save();
  Deno.writeFileSync("./pdf/marked.pdf", pdfBytes);
}
