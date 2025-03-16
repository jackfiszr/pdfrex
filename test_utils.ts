import { PDFDocument } from "pdf-lib";
import { ensureDirSync } from "@std/fs";
import { join } from "@std/path";

/**
 * Creates one or multiple test PDFs with a specified number of pages.
 *
 * @param {string | string[]} filenames - A single filename or an array of filenames.
 * @param {string} [directory] - Directory to save the PDFs. Defaults to the current directory.
 * @param {number} [numPages] - Number of pages in each PDF. Defaults to 1.
 *
 * @returns {Promise<void>} - Resolves when all PDFs are created.
 */
export async function createTestPdf(
  filenames: string | string[],
  directory: string = Deno.cwd(),
  numPages: number = 1,
): Promise<void> {
  ensureDirSync(directory);
  const files = Array.isArray(filenames) ? filenames : [filenames];

  for (const filename of files) {
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < numPages; i++) {
      pdfDoc.addPage();
    }
    const pdfBytes = await pdfDoc.save();
    await Deno.writeFile(join(directory, filename), pdfBytes);
  }
}
