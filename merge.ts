import { expandGlobSync, join, PDFDocument, PDFPage } from "./deps.ts";

export async function mergeAll() {
  const globString = join(Deno.cwd(), "*.pdf");
  const pdfsToMerge = Array.from(expandGlobSync(globString)).map((entry) =>
    entry.path
  );
  await mergePdfs(pdfsToMerge);
}

export async function mergePdfs(pdfsToMerge: string[]) {
  const mergedPdf = await PDFDocument.create();
  for (const pdfPath of pdfsToMerge) {
    const pdfBytes = Deno.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices(),
    );
    copiedPages.forEach((page: PDFPage) => {
      mergedPdf.addPage(page);
    });
  }
  const mergedPdfFile = await mergedPdf.save();
  Deno.writeFileSync("merged_full.pdf", mergedPdfFile);
}

if (import.meta.main) mergeAll();
