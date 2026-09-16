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
```

## 3D Visualization

The tool includes a 3D web-based visualizer for exploring dependency graphs interactively.

### Running the Visualizer

```bash
# First, generate dependencies.json from your project
node dist/index.js /path/to/project --json

# Then start the visualizer
npm run visualize
```

This will start a local web server and open the 3D visualization in your browser.

### Visualization Features

- **3D Hierarchical Layout**: Files organized by directory structure in true 3D space
- **Directory Spheres**: Large colored spheres at directory centers with labels
- **File Labels**: Hover over nodes to show individual file names
- **Interactive Camera**: Rotate, zoom, and pan with mouse controls
- **Color-Coded Modules**: Each directory has a distinct color scheme
- **Color-Coded Files**: Different colors for different file types (.ts, .js, .tsx, .jsx)
- **Clickable Nodes**: Click on nodes to highlight them and see detailed information
- **Real-time Edges**: Dependency connections update dynamically as nodes move
- **Statistics Display**: Shows total files and dependencies count

### Controls

- **Mouse**: Left-click and drag to rotate camera
- **Scroll Wheel**: Zoom in/out
- **Right-click**: Pan the view
- **Click Nodes**: Select and highlight individual files
- **Ctrl+I**: Toggle all labels on/off (labels start hidden)
