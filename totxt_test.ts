import { pdfToTxt, toTxtAll } from "@jackfiszr/pdfrex";
import { assert } from "@std/assert";
import { existsSync } from "@std/fs";
import { join } from "@std/path";
import { createTestPdf } from "./test_utils.ts";

Deno.test("pdfToTxt should create a text file with extracted content", async () => {
  const testFilesDir = join(Deno.cwd(), "totext_test_files");
  await createTestPdf("test.pdf", testFilesDir);
  await pdfToTxt(join(testFilesDir, "test.pdf"), { outputDir: testFilesDir });
  const outputFilePath = join(testFilesDir, "test.txt");

  assert(existsSync(outputFilePath));
  Deno.removeSync(testFilesDir, { recursive: true });
});

Deno.test("toTxtAll should process all PDFs in a directory", async () => {
  const testFilesDir = join(Deno.cwd(), "totext_pdf_test_files");
  const testOutputDir = join(Deno.cwd(), "totext_txt_out_files");
  await createTestPdf(["test1.pdf", "test2.pdf"], testFilesDir);
  await toTxtAll({ dir: testFilesDir, outputDir: testOutputDir });

  assert(existsSync(join(testOutputDir, "test1.txt")));
  assert(existsSync(join(testOutputDir, "test2.txt")));
  Deno.removeSync(testFilesDir, { recursive: true });
  Deno.removeSync(testOutputDir, { recursive: true });
});
