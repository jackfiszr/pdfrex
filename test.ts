import { markPdf, mergePdfs, splitPdf } from "./mod.ts";
import { createPdf } from "./mock.ts";
const { test } = Deno;

await createPdf(100, "pdf/100_pages.pdf");

test({
  name: "splitPdf",
  fn() {
    splitPdf("pdf/100_pages.pdf", "output", 2);
  },
});

test({
  name: "mergePdfs",
  async fn() {
    const files = Array.from(Deno.readDirSync("output")).filter((el: any) =>
      el.isFile
    ).map((file: any) => `./output/${file.name}`);
    const pdfBytes = await mergePdfs(files);
    Deno.writeFileSync("./output/merged.pdf", pdfBytes);
  },
});

test({
  name: "markPdf",
  async fn() {
    const pdfBytes = await markPdf("pdf/100_pages.pdf", "C O P Y");
    Deno.writeFileSync("./pdf/marked.pdf", pdfBytes);
  },
});
