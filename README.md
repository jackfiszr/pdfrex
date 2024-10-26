# pdfrex

PDF manipulation module for Deno - split, merge, rotate, watermark, etc. (uses
[pdf-lib](https://github.com/Hopding/pdf-lib) library).

## Install

    deno install --allow-read --allow-write -n pdfrex https://deno.land/x/pdfrex@v0.0.2/mod.ts

This adds the command line tool `pdfrex` with two subcommands `split` and
`merge`.

### Merge

    Usage: pdfrex merge

    Description:

        Merge pdf files

    Options:

        -h, --help              - Show this help.
        -d, --dir     <string>  - Directory to merge pdfs from
        -f, --files   <string>  - Files to merge (separated by a comma)
        -o, --output  <string>  - File path to write merged pdf to

### Split

    Usage: pdfrex split

    Description:

        Split pdf files

    Options:

        -h, --help                  - Show this help.
        -d, --dir         <string>  - Directory to split pdfs from
        -f, --files       <string>  - Files to split (separated by a comma)
        -o, --output-dir  <string>  - Directory to output results to
        -p, --prefix      <string>  - Prefix of resulting files

## Split pdf files in current directory

    deno run --allow-read --allow-write https://deno.land/x/pdfrex@v0.0.2/split.ts

or:

    import { splitAll, splitPdf } from "https://deno.land/x/pdfrex@v0.0.2/mod.ts";

    // split all pdfs in working dir
    splitAll();

    // specify file path
    splitPdf("/path/to/your/input_file.pdf");

## Merge pdf files in current directory

    deno run --allow-read --allow-write https://deno.land/x/pdfrex@v0.0.2/merge.ts

or:

    import { mergeAll, mergePdfs } from "https://deno.land/x/pdfrex@v0.0.2/mod.ts";

    // merge all pdfs in working dir
    mergeAll();

    // specify files to merge
    mergePdfs(["file1.pdf", "file2.pdf", "file3.pdf"]);
