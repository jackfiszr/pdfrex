# pdfrex

[![JSR](https://jsr.io/badges/@jackfiszr/pdfrex)](https://jsr.io/@jackfiszr/pdfrex)
[![JSR Score](https://jsr.io/badges/@jackfiszr/pdfrex/score)](https://jsr.io/@jackfiszr/pdfrex)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/jackfiszr/pdfrex)](https://github.com/jackfiszr/pdfrex/pulse)
[![GitHub last commit](https://img.shields.io/github/last-commit/jackfiszr/pdfrex)](https://github.com/jackfiszr/pdfrex/commits/main)
[![GitHub](https://img.shields.io/github/license/jackfiszr/pdfrex)](https://github.com/jackfiszr/pdfrex/blob/main/LICENSE)

**`pdfrex`** is a command-line tool and Deno module for manipulating PDF files.
It offers functionality to split, merge, extract text, and perform other PDF
operations, making it a versatile tool for managing PDFs programmatically.
`pdfrex` is built using the [`pdf-lib`](https://pdf-lib.js.org/) and
[`PDF.js`](https://mozilla.github.io/pdf.js/) libraries, ensuring efficient and
high-quality PDF manipulation.

## Features

- **Merge PDFs**: Combine multiple PDFs into one.
- **Split PDFs**: Separate a PDF into individual pages.
- **Extract text**: Convert PDFs to text files.
- **Flexible CLI**: Easily execute PDF operations from the command line.
- **Programmatic Use**: Import `pdfrex` functions directly in Deno projects.

## Installation

To install `pdfrex` as a CLI tool, run:

```bash
deno install --global --allow-read --allow-write jsr:@jackfiszr/pdfrex@0.0.7
```

This command installs `pdfrex` globally, enabling the `pdfrex` command with
`merge` and `split` subcommands.

### Permissions

Since `pdfrex` reads and writes files, it requires the following permissions:

- `--allow-read` for reading PDF files.
- `--allow-write` for writing merged, split, or extracted text files.

## Usage

### General CLI Usage

```bash
pdfrex <command> [options]
```

### Commands

- **`merge`**: Combines multiple PDF files into a single document.
- **`split`**: Divides a PDF document into individual pages.
- **`totxt`**: Extracts text from PDFs and saves it as text files.

### Merge

Combine multiple PDF files into one.

#### CLI Usage

```bash
pdfrex merge -d <directory> -f <file1,file2,...> -o <output-file>
```

#### Options

- `-d, --dir <string>`: Directory to search for PDF files to merge (defaults to
  the current directory).
- `-f, --files <string>`: Specific files to merge (comma-separated).
- `-o, --output <string>`: File path for the output merged PDF (defaults to
  `merged.pdf` in the current directory).

#### Examples

1. **Merge all PDFs in a directory**:

   ```bash
   pdfrex merge -d ./pdfs -o combined.pdf
   ```

2. **Merge specific files**:

   ```bash
   pdfrex merge -f file1.pdf,file2.pdf,file3.pdf -o result.pdf
   ```

### Split

Split a PDF into individual pages.

#### CLI Usage

```bash
pdfrex split -d <directory> -f <file1,file2,...> -o <output-dir> -p <prefix>
```

#### Options

- `-d, --dir <string>`: Directory to search for PDF files to split (defaults to
  the current directory).
- `-f, --files <string>`: Specific files to split (comma-separated).
- `-o, --output-dir <string>`: Directory to save the split PDF pages (default
  creates a new directory named after the source file).
- `-p, --prefix <string>`: Prefix for naming split files (default is the source
  file name).

#### Examples

1. **Split all PDFs in a directory**:

   ```bash
   pdfrex split -d ./pdfs -o ./split_pdfs
   ```

2. **Split a specific file with a custom prefix**:

   ```bash
   pdfrex split -f my_document.pdf -o ./output -p page
   ```

## Programmatic Usage

Import `pdfrex` functions in your Deno project to perform PDF operations
directly.

### Merge PDFs

```typescript
import { mergeAll, mergePdfs } from "jsr:@jackfiszr/pdfrex@0.0.7";

// Merge all PDFs in the current directory
await mergeAll();

// Merge all PDFs in a specified directory
await mergeAll({ dir: "./my_pdfs" });

// Merge specific files with a custom output path
await mergePdfs(["file1.pdf", "file2.pdf", "file3.pdf"], {
  output: "combined.pdf",
});
```

### Split PDFs

```typescript
import { splitAll, splitPdf } from "jsr:@jackfiszr/pdfrex@0.0.7";

// Split all PDFs in the current directory
await splitAll();

// Split all PDFs in a specified directory
await splitAll({ dir: "./my_pdfs" });

// Split a specific PDF
await splitPdf("document.pdf", { outputDir: "./pages", prefix: "page" });
```

### Extract Text

Convert PDF files to text files.

#### CLI Usage

```bash
pdfrex totxt -d <directory> -f <file1,file2,...> -o <output-dir>
```

#### Options

- `-d, --dir <string>`: Directory to search for PDF files to extract text from
  (defaults to the current directory).
- `-f, --files <string>`: Specific files to extract text from (comma-separated).
- `-o, --output-dir <string>`: Directory to save the extracted text files
  (default is the same as the source PDF location).

#### Examples

1. **Extract text from all PDFs in a directory**:

   ```bash
   pdfrex totxt -d ./pdfs -o ./texts
   ```

2. **Extract text from a specific PDF**:

   ```bash
   pdfrex totxt -f document.pdf -o ./output
   ```

## Programmatic Usage

Import `pdfrex` functions in your Deno project to perform PDF operations
directly.

### Extract Text from PDFs

```typescript
import { pdfToTxt, toTxtAll } from "jsr:@jackfiszr/pdfrex@0.0.7";

// Extract text from all PDFs in the current directory
await toTxtAll();

// Extract text from a specific PDF
await pdfToTxt("document.pdf", { outputDir: "./texts" });
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out
the [issue tracker](https://github.com/jackfiszr/pdfrex/issues) and contribute.

## License

GNU GENERAL PUBLIC LICENSE 3.0
