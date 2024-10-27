import { PDFDocument, type PDFPage } from "pdf-lib";
import { ensureDirSync, expandGlobSync } from "@std/fs";
import { basename, join } from "@std/path";

/**
 * Splits all PDF files in the current working directory.
 *
 * This function locates all PDF files in the current directory and splits
 * each one into individual pages, saving each page as a separate PDF.
 */
export async function splitAll() {
  const globString = join(Deno.cwd(), "*.pdf");

  for (const pdf of expandGlobSync(globString)) {
    await splitPdf(pdf.path);
  }
}

/**
 * Splits a PDF file into separate pages, saving each page as a new PDF.
 *
 * @param {string} sourceFilePath - The file path of the PDF to split.
 * @param {Object} [options] - Options for the split operation.
 * @param {string} [options.outputDir] - Directory to save the split PDFs. Defaults to a new directory with the same name as the source file.
 * @param {string} [options.prefix] - Prefix for the output file names. Defaults to the base name of the source file.
 *
 * @returns {Promise<void>} - Resolves when the PDF is split and files are saved.
 */
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
