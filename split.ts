import {
  basename,
  degrees,
  dlog,
  ensureDirSync,
  join,
  PDFDocument,
} from "./deps.ts";

const INVALID_FILES: string[] = [];

export async function splitPdfEveryTwoPages(
  sourceFilePath: string,
  outputDirPath: string,
): Promise<string[]> {
  const createdFilesPaths: string[] = [];
  let sourceFile: any;
  try {
    sourceFile = await PDFDocument.load(Deno.readFileSync(sourceFilePath));
    const byteArrays: Uint8Array[] = sourceFile.getPages().map(
      async (_: any, i: number) => {
        if (i % 2 == 0) {
          const doc = await PDFDocument.create();
          const pages = await doc.copyPages(sourceFile, [i, i + 1]);
          pages.forEach((page: any) => {
            const { width, height } = page.getSize();
            const rotationAngle = page.getRotation().angle;
            if (rotationAngle === 0 && width < height) {
              page.setRotation(degrees(90));
            }
            doc.addPage(page);
          });
          return await doc.save();
        }
      },
    ).filter((p: any, i: number) => i % 2 === 0);
    dlog({
      color: "yellow",
      title: "DZIELENIE",
      mainMsg: sourceFilePath,
      subMsg: `zawiera ${byteArrays.length} dokumentów`,
    });
    const filename = basename(sourceFilePath).replace(".pdf", "");
    await Promise.all(byteArrays).then((byteArray) => {
      byteArray.forEach(async (pdfBytes, i) => {
        ensureDirSync(outputDirPath);
        const outputFilePath = join(
          outputDirPath,
          `./${filename}-${i + 1}.pdf`,
        );
        Deno.writeFileSync(outputFilePath, pdfBytes);
        dlog({
          color: "gray",
          title: "UTWORZONO",
          mainMsg: outputFilePath,
        });
        createdFilesPaths.push(outputFilePath);
      });
    });
  } catch (error) {
    dlog({
      color: "red",
      title: "DZIELENIE",
      mainMsg: sourceFilePath,
      subMsg: error,
    });
  }
  if (createdFilesPaths.length === 0) {
    INVALID_FILES.push(basename(sourceFilePath));
  }
  return createdFilesPaths;
}
