import { pdfText } from "@pdf/pdftext";
import { ensureDir, existsSync, expandGlobSync } from "@std/fs";
import { basename, dirname, join } from "@std/path";

/**
 * Converts all PDF files in the specified directory or the current working directory to text files.
 *
 * @param {Object} [options] - Options for the conversion operation.
 * @param {string} [options.dir] - Directory path to search for PDF files. Defaults to the current working directory.
 * @param {string} [options.outputDir] - Directory to save the extracted text files. Defaults to the same directory as the PDFs.
 *
 * @returns {Promise<void>} - Resolves when all PDF files have been processed.
 */
export async function toTxtAll(
  options: { dir?: string; outputDir?: string } = {},
): Promise<void> {
  const directory = options.dir || Deno.cwd();
  const outputDirectory = options.outputDir || directory;
  const globString = join(directory, "*.pdf");

  for (const pdf of expandGlobSync(globString)) {
    await pdfToTxt(pdf.path, { outputDir: outputDirectory });
  }
}

/**
 * Converts a PDF file to a text file.
 *
 * @param {string} pdfFilePath - The path to the PDF file to be converted.
 * @param {Object} [options] - Options for the conversion operation.
 * @param {string} [options.outputDir] - Directory to save the extracted text file. Defaults to the same directory as the input PDF.
 *
 * @returns {Promise<void>} - Resolves when the text extraction is complete and the file is saved.
 */
export async function pdfToTxt(
  pdfFilePath: string,
  options?: { outputDir?: string },
): Promise<void> {
  const outputDirectory = options?.outputDir || dirname(pdfFilePath);
  const txtFilePath = join(
    outputDirectory,
    basename(pdfFilePath).replace(".pdf", ".txt"),
  );

  if (!existsSync(txtFilePath)) {
    const pdfBuffer = await Deno.readFile(pdfFilePath);
    const pages = await pdfText(pdfBuffer.buffer);
    const extractedText = Object.values(pages).join("\n");
    await ensureDir(outputDirectory);
    await Deno.writeTextFile(txtFilePath, extractedText);
  }
}
