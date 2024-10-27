import { PDFDocument, type PDFPage } from "pdf-lib";
import { ensureDirSync, expandGlobSync } from "@std/fs";
import { basename, join } from "@std/path";

export async function splitAll() {
  const globString = join(Deno.cwd(), "*.pdf");

  for (const pdf of expandGlobSync(globString)) {
    await splitPdf(pdf.path);
  }
}

export async function splitPdf(
  sourceFilePath: string,
  options?: { outputDir?: string; prefix?: string },
) {
  const sourceFile = await PDFDocument.load(Deno.readFileSync(sourceFilePath));
  const filename = basename(sourceFilePath).replace(".pdf", "");
  const outputDir = options?.outputDir || join(Deno.cwd(), filename);
  const prefix = options?.prefix ? options?.prefix : filename;

  const byteArrays: Promise<Uint8Array>[] = sourceFile
    .getPages()
    .map(async (_: PDFPage, index: number) => {
      const doc = await PDFDocument.create();
      const [page] = await doc.copyPages(sourceFile, [index]);
      doc.addPage(page);
      return doc.save();
    });
  await Promise.all(byteArrays).then((byteArray) => {
    byteArray.forEach((pdfBytes, i) => {
      ensureDirSync(outputDir);
      const outputFilePath = join(outputDir, `${prefix}-${i + 1}.pdf`);
      Deno.writeFileSync(outputFilePath, pdfBytes);
    });
  });
}
