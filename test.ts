import { markPdf, mergePdfs, splitPdf } from "./mod.ts";
import { createPdf } from "./mock.ts";
const { test } = Deno;

await createPdf(100, "pdf/100_pages.pdf");

test({
  name: "splitPdf can split every one page",
  fn() {
    splitPdf("pdf/100_pages.pdf", "output");
  },
});

test({
  name: "splitPdf can split every n pages (input file page count % n === 0)",
  async fn() {
    await splitPdf("pdf/100_pages.pdf", "output", 5);
  },
});

test({
  name: "mergePdfs",
  async fn() {
    const files = Array.from(Deno.readDirSync("output")).filter((el: any) =>
      el.isFile
    ).map((file: any) => `./output/${file.name}`);
    await mergePdfs(files);
  },
});

test({
  name: "markPdf",
  async fn() {
    await markPdf("pdf/100_pages.pdf", "C O P Y");
  },
});
