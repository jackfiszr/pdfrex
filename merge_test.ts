import { mergeAll, mergePdfs } from "./merge.ts";
import { PDFDocument } from "pdf-lib";
import { ensureDirSync } from "@std/fs";
import { join } from "@std/path";
import { assertExists } from "@std/assert";

async function createTestPdfs(filenames: string[], directory: string) {
  ensureDirSync(directory);
  for (const filename of filenames) {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([400, 400]);
    const pdfBytes = await pdfDoc.save();
    Deno.writeFileSync(join(directory, filename), pdfBytes);
  }
}

Deno.test("mergeAll in current working directory", async () => {
  const filenames = ["test1.pdf", "test2.pdf"];
  await createTestPdfs(filenames, Deno.cwd());

  await mergeAll();
  assertExists(join(Deno.cwd(), "merged.pdf"), "merged.pdf not created in CWD");

  filenames.forEach((filename) => Deno.removeSync(join(Deno.cwd(), filename)));
  Deno.removeSync(join(Deno.cwd(), "merged.pdf"));
});

Deno.test("mergeAll with a specified directory", async () => {
  const testDir = join(Deno.cwd(), "test_pdfs");
  const filenames = ["test3.pdf", "test4.pdf"];
  await createTestPdfs(filenames, testDir);

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
  await createTestPdfs(filenames, specificDir);

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
