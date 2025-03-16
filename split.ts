import { PDFDocument, type PDFPage } from "pdf-lib";
import { ensureDirSync, expandGlobSync } from "@std/fs";
import { basename, join } from "@std/path";

/**
 * Splits all PDF files in the specified directory.
 *
 * @param options - An object containing optional parameters.
 * @param options.dir - The directory to search for PDF files. Defaults to the current working directory.
 * @param options.outputDir - The directory to save the split PDF files. If not specified, the split files will be saved in the same directory as the original PDF files.
 * @returns A promise that resolves when all PDF files have been split.
 */
export async function splitAll(
  options: { dir?: string; outputDir?: string } = {},
) {
  const directory = options.dir || Deno.cwd();
  const globString = join(directory, "*.pdf");

  for (const pdf of expandGlobSync(globString)) {
    await splitPdf(pdf.path, { outputDir: options.outputDir });
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
