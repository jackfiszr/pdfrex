import pdfrex from "./deno.json" with { type: "json" };
import { expandGlobSync } from "@std/fs";
import { join } from "@std/path";
import { Command } from "@cliffy/command";
import { mergePdfs } from "./merge.ts";
import { splitPdf } from "./split.ts";
import { pdfToTxt } from "./totxt.ts";

type Options = {
  dir?: string;
  files?: string;
};

/**
 * Main function to set up and execute the CLI commands.
 *
 * Configures the `pdfrex` command with `merge`, `split` and `totext` subcommands,
 * each with options for directory, file selection, and output location.
 */
export function main() {
  new Command()
    .name("pdfrex")
    .version(pdfrex.version).meta("deno", Deno.version.deno)
    .description(`Command line tool to merge or split pdf files`)
    .action(function () {
      this.showHelp();
    })
    .command("merge", "Merge pdf files")
    .option("-d --dir <string>", "Directory to merge pdfs from")
    .option("-f --files <string>", "Files to merge (separated by a comma)")
    .option("-o --output <string>", "File path to write merged pdf to")
    .action(async (options) => {
      const files = parseOptions(options);
      if (files.length === 0) {
        console.log("No files to merge!");
        return;
      }
      await mergePdfs(files, options);
    })
    .command("split", "Split pdf files")
    .option("-d --dir <string>", "Directory to split pdfs from")
    .option("-f --files <string>", "Files to split (separated by a comma)")
    .option("-o --output-dir <string>", "Directory to output results to")
    .option("-p --prefix <string>", "Prefix of resulting files")
    .action(async (options) => {
      const files = parseOptions(options);
      if (files.length === 0) {
        console.log("No files to split!");
        return;
      }
      const all = files.map((file) => splitPdf(file, options));
      await Promise.all(all);
    })
    .command("totxt", "Convert pdf files to text")
    .option("-d --dir <string>", "Directory to convert pdfs from")
    .option("-f --files <string>", "Files to convert (separated by a comma)")
    .option("-o --output-dir <string>", "Directory to output text files to")
    .action(async (options) => {
      const files = parseOptions(options);
      if (files.length === 0) {
        console.log("No files to convert!");
        return;
      }
      const all = files.map((file) => pdfToTxt(file, options));
      await Promise.all(all);
    })
    .parse(Deno.args);
}

/**
 * Parses command-line options to determine files for merging or splitting.
 *
 * @param {Options} options - Options containing directory and file patterns.
 * @returns {string[]} - Array of file paths to process.
 */
function parseOptions(options: Options): string[] {
  const dir = options.dir || Deno.cwd();
  const files = options.files?.split(",");

  if (files !== undefined) {
    return files.map((file) => join(dir, file));
  }
  const glob = join(dir, "*.pdf");
  const entries = [...expandGlobSync(glob)];
  return entries.map((entry) => entry.path);
}
