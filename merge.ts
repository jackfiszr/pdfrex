import { expandGlobSync } from "@std/fs";
import { join } from "@std/path";
import { PDFDocument, type PDFPage } from "pdf-lib";

/**
 * Merges all PDF files in the specified directory or the current working directory.
 *
 * @param {Object} [options] - Options for the merge operation.
 * @param {string} [options.dir] - Directory path to search for PDF files. Defaults to the current working directory.
 * @param {string} [options.output] - Path for the output merged PDF file. Defaults to "merged.pdf" in the specified or current directory.
 *
 * @returns {Promise<void>} - Resolves when the merging is complete and the file is saved.
 */
export async function mergeAll(
  options: { dir?: string; output?: string } = {},
) {
  const directory = options.dir || Deno.cwd();
  const outputFilePath = options.output || join(directory, "merged.pdf");

  const globString = join(directory, "*.pdf");
  const pdfsToMerge = Array.from(expandGlobSync(globString)).map(
    (entry) => entry.path,
  );

  await mergePdfs(pdfsToMerge, { output: outputFilePath });
}

/**
 * Merges an array of PDF files into a single PDF document.
 *
 * @param {string[]} pdfsToMerge - Array of file paths for the PDFs to merge.
 * @param {Object} [options] - Options for the merge operation.
 * @param {string} [options.output] - Path for the output merged PDF file. Defaults to "merged.pdf" in the current directory.
 *
 * @returns {Promise<void>} - Resolves when the merging is complete and the file is saved.
 */
export async function mergePdfs(
  pdfsToMerge: string[],
  options?: {
    output?: string;
  },
) {
  const mergedPdf = await PDFDocument.create();
  const outputFilePath = options?.output || join(Deno.cwd(), "merged.pdf");

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

  Deno.writeFileSync(outputFilePath, mergedPdfFile);
}
