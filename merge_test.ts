import { mergeAll, mergePdfs } from "@jackfiszr/pdfrex";
import { join } from "@std/path";
import { assertExists } from "@std/assert";
import { createTestPdf } from "./test_utils.ts";

Deno.test("mergeAll in current working directory", async () => {
  const filenames = ["test1.pdf", "test2.pdf"];
  await createTestPdf(filenames);

  await mergeAll();
  assertExists(join(Deno.cwd(), "merged.pdf"), "merged.pdf not created in CWD");

  filenames.forEach((filename) => Deno.removeSync(join(Deno.cwd(), filename)));
  Deno.removeSync(join(Deno.cwd(), "merged.pdf"));
});

Deno.test("mergeAll with a specified directory", async () => {
  const testDir = join(Deno.cwd(), "merge_test_pdfs");
  const filenames = ["test3.pdf", "test4.pdf"];
  await createTestPdf(filenames, testDir);

  await mergeAll({ dir: testDir });
  assertExists(
    join(testDir, "merged.pdf"),
    "merged.pdf not created in specified directory",
  );

  Deno.removeSync(testDir, { recursive: true });
});

Deno.test("mergePdfs with specific files", async () => {
  const specificDir = join(Deno.cwd(), "specific_pdfs");
  const filenames = ["specific1.pdf", "specific2.pdf"];
  await createTestPdf(filenames, specificDir);

  await mergePdfs(
    filenames.map((filename) => join(specificDir, filename)),
    { output: join(specificDir, "result.pdf") },
  );
  assertExists(
    join(specificDir, "result.pdf"),
    "result.pdf not created in specified directory",
  );

  Deno.removeSync(specificDir, { recursive: true });
});
