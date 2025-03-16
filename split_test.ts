import { assertExists } from "@std/assert";
import { join } from "@std/path";
import { splitPdf } from "./split.ts";
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
