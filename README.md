# pdfrex

PDF manipulation module for Deno - split, merge, rotate, watermark, etc. (uses
pdf-lib library).

## Split pdf files in current directory

    deno run --unstable --allow-read --allow-write https://deno.land/x/pdfrex@v0.0.1/split.ts

or:

    import { splitAll, splitPdf } from "https://deno.land/x/pdfrex@v0.0.1/mod.ts";

    // split all pdfs in working dir
    splitAll();

    // specify file path
    splitPdf("/path/to/your/input_file.pdf");

## Merge pdf files in current directory

    deno run --unstable --allow-read --allow-write https://deno.land/x/pdfrex@v0.0.1/merge.ts

or:

    import { mergeAll, mergePdfs } from "https://deno.land/x/pdfrex@v0.0.1/mod.ts";

    // merge all pdfs in working dir
    mergeAll();

    // specify files to merge
    mergePdfs(["file1.pdf", "file2.pdf", "file3.pdf"]);
