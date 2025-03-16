import { splitAll, splitPdf } from "@jackfiszr/pdfrex";
import { assertExists } from "@std/assert";
import { join } from "@std/path";
import { createTestPdf } from "./test_utils.ts";

Deno.test("splitPdf should create separate pages from a PDF", async () => {
  const testFilesDir = join(Deno.cwd(), "split_test_files");
  await createTestPdf("test.pdf", testFilesDir, 3);

  const outputDir = join(testFilesDir, "split_output");
  await splitPdf(join(testFilesDir, "test.pdf"), { outputDir });

  assertExists(join(outputDir, "test-1.pdf"));
  assertExists(join(outputDir, "test-2.pdf"));
  assertExists(join(outputDir, "test-3.pdf"));

  Deno.removeSync(testFilesDir, { recursive: true });
});

Deno.test("splitPdf should allow custom prefix for split files", async () => {
  const testFilesDir = join(Deno.cwd(), "split_test_files_prefix");
  await createTestPdf("test.pdf", testFilesDir, 2);

  const outputDir = join(testFilesDir, "split_output");
  await splitPdf(join(testFilesDir, "test.pdf"), { outputDir, prefix: "page" });

  assertExists(join(outputDir, "page-1.pdf"));
  assertExists(join(outputDir, "page-2.pdf"));

  Deno.removeSync(testFilesDir, { recursive: true });
});

Deno.test("splitAll should process all PDFs in a directory", async () => {
  const testFilesDir = join(Deno.cwd(), "split_all_test_files");
  await createTestPdf(["test1.pdf", "test2.pdf"], testFilesDir, 2);

  await splitAll({ dir: testFilesDir, outputDir: testFilesDir });

  assertExists(join(testFilesDir, "test1", "test1-1.pdf"));
  assertExists(join(testFilesDir, "test1", "test1-2.pdf"));
  assertExists(join(testFilesDir, "test2", "test2-1.pdf"));
  assertExists(join(testFilesDir, "test2", "test2-2.pdf"));

  Deno.removeSync(testFilesDir, { recursive: true });
});
