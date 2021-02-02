import { dirname, ensureDir, PDFDocument } from "./deps.ts";

export async function createPdf(pages: number = 1, filepath: string) {
  await ensureDir(dirname(filepath));
  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 30;
    page.drawText(`${i + 1}`, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
    });
  }
  const pdfBytes = await pdfDoc.save();
  await Deno.writeFile(filepath, pdfBytes);
}
