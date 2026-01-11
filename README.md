# TypeScript Dependency Graph Builder

A command-line tool that analyzes TypeScript files and builds a dependency graph showing how modules depend on each other.

## Features

- Recursively scans directories for TypeScript and JavaScript files (.ts, .tsx, .js, .jsx)
- Parses import/export statements to build dependency relationships
- Outputs dependency graph to console
- Exports graph data to JSON format
- Supports relative imports resolution with .js extensions (ESM compatibility)
- Ignores node_modules and hidden directories

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Usage
```bash
node dist/index.js <directory>
```

### Export to JSON
```bash
node dist/index.js <directory> --json [output-file.json]
```

If no output file is specified, defaults to `dependencies.json`.

## Example

Given a project structure:
```
sample/
├── utils.ts
├── calculator.ts  # imports from utils.ts
└── main.ts        # imports from calculator.ts
```

Running the tool:
```bash
node dist/index.js sample
```

Output:
```
Dependency Graph:
=================
sample/calculator.ts:
  -> sample/utils.ts

sample/main.ts:
  -> sample/calculator.ts

sample/utils.ts:
```

## Development

### Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run directly with ts-node (development)
- `npm start` - Run compiled version

### Project Structure
- `src/index.ts` - Main application code
- `sample/` - Sample TypeScript files for testing
- `dist/` - Compiled JavaScript output

## API

The tool can also be used programmatically:

```typescript
import { TypeScriptDependencyBuilder } from './dist/index';

const builder = new TypeScriptDependencyBuilder();
const graph = builder.buildGraph('/path/to/project');
builder.printGraph();
builder.exportToJson('output.json');
