# pdfrex

**`pdfrex`** is a command-line tool and Deno module for manipulating PDF files.
It offers functionality to split, merge, and perform other PDF operations,
making it a versatile tool for managing PDFs programmatically. `pdfrex` is built
using the [`pdf-lib`](https://github.com/Hopding/pdf-lib) library, ensuring
efficient and high-quality PDF manipulation.

## Features

- **Merge PDFs**: Combine multiple PDFs into one.
- **Split PDFs**: Separate a PDF into individual pages.
- **Flexible CLI**: Easily execute PDF operations from the command line.
- **Programmatic Use**: Import `pdfrex` functions directly in Deno (or Node)
  projects.

## Installation

To install `pdfrex` as a CLI tool, run:

```bash
deno install --global --allow-read --allow-write jsr:@jackfiszr/pdfrex@0.0.5
```

This command installs `pdfrex` globally, enabling the `pdfrex` command with
`merge` and `split` subcommands.

### Permissions

Since `pdfrex` reads and writes files, it requires the following permissions:

- `--allow-read` for reading PDF files.
- `--allow-write` for writing merged or split PDF files.

## Usage

### General CLI Usage

```bash
pdfrex <command> [options]
```

### Commands

- **`merge`**: Combines multiple PDF files into a single document.
- **`split`**: Divides a PDF document into individual pages.

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
import { mergeAll, mergePdfs } from "jsr:@jackfiszr/pdfrex@0.0.5";

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
import { splitAll, splitPdf } from "jsr:@jackfiszr/pdfrex@0.0.5";

// Split all PDFs in the current directory
await splitAll();

// Split a specific PDF
await splitPdf("document.pdf", { outputDir: "./pages", prefix: "page" });
```

### Adding to a Node.js project

```bash
npx jsr add @jackfiszr/pdfrex@0.0.5
```

```javascript
import { mergePdfs, splitPdf } from "@jackfiszr/pdfrex@0.0.5";
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out
the [issue tracker](https://github.com/jackfiszr/pdfrex/issues) and contribute.

## License

GNU GENERAL PUBLIC LICENSE 3.0
