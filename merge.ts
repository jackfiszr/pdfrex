import { PDFDocument } from "./deps.ts";

export async function mergePdfs(pdfsToMerge: string[]) {
  const mergedPdf = await PDFDocument.create();
  for (const pdfPath of pdfsToMerge) {
    const pdfBytes = Deno.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    if (pdfDoc.getPageCount() === 2) {
      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices(),
      );
      copiedPages.forEach((page: any) => {
        mergedPdf.addPage(page);
      });
    }
  }
  const mergedPdfFile = await mergedPdf.save();
  Deno.writeFileSync("./output/merged.pdf", mergedPdfFile);
}
