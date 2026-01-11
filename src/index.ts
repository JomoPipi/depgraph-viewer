#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

interface DependencyGraph {
  [file: string]: string[];
}

class TypeScriptDependencyBuilder {
  private graph: DependencyGraph = {};
  private rootDir: string = "";

  buildGraph(rootDir: string): DependencyGraph {
    this.rootDir = path.resolve(rootDir);
    const tsFiles = this.findTsFiles(rootDir);
    tsFiles.forEach((file) => {
      this.graph[file] = this.extractDependencies(file);
    });
    return this.graph;
  }

  private findTsFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !item.startsWith(".") &&
        item !== "node_modules"
      ) {
        files.push(...this.findTsFiles(fullPath));
      } else if (
        stat.isFile() &&
        (item.endsWith(".ts") ||
          item.endsWith(".tsx") ||
          item.endsWith(".js") ||
          item.endsWith(".jsx"))
      ) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private extractDependencies(filePath: string): string[] {
    const sourceFile = ts.createSourceFile(
      filePath,
      fs.readFileSync(filePath, "utf-8"),
      ts.ScriptTarget.Latest,
      true
    );

    const dependencies: string[] = [];

    const visit = (node: ts.Node) => {
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
          const moduleName = node.moduleSpecifier.text;
          if (this.isRelativeImport(moduleName)) {
            const resolvedPath = this.resolveImportPath(filePath, moduleName);
            if (resolvedPath) {
              dependencies.push(resolvedPath);
            }
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return dependencies;
  }

  private isRelativeImport(moduleName: string): boolean {
    return moduleName.startsWith("./") || moduleName.startsWith("../");
  }

  private resolveImportPath(
    fromFile: string,
    importPath: string
  ): string | null {
    const fromDir = path.dirname(fromFile);

    // If importPath already has an extension, try it directly
    if (path.extname(importPath)) {
      const resolvedPath = path.resolve(fromDir, importPath);
      if (fs.existsSync(resolvedPath)) {
        return resolvedPath;
      }
      // Also try without the extension (in case .js maps to .ts)
      const withoutExt = resolvedPath.replace(/\.[^.]+$/, "");
      const extensions = [".ts", ".tsx", ".d.ts", ".js", ".jsx"];
      for (const ext of extensions) {
        const fileWithExt = withoutExt + ext;
        if (fs.existsSync(fileWithExt)) {
          return fileWithExt;
        }
      }
    } else {
      // No extension in import, try various extensions
      const resolvedPath = path.resolve(fromDir, importPath);
      const extensions = [".ts", ".tsx", ".d.ts", ".js", ".jsx"];
      for (const ext of extensions) {
        const fileWithExt = resolvedPath + ext;
        if (fs.existsSync(fileWithExt)) {
          return fileWithExt;
        }

        const indexFile = path.join(resolvedPath, "index" + ext);
        if (fs.existsSync(indexFile)) {
          return indexFile;
        }
      }
    }

    return null;
  }

  printGraph(): void {
    console.log("Dependency Graph:");
    console.log("=================");
    for (const [file, deps] of Object.entries(this.graph)) {
      console.log(`${path.relative(this.rootDir, file)}:`);
      deps.forEach((dep) => {
        console.log(`  -> ${path.relative(this.rootDir, dep)}`);
      });
      console.log();
    }
  }

  exportToJson(outputPath: string): void {
    // Create a relative path version of the graph
    const relativeGraph: DependencyGraph = {};
    for (const [file, deps] of Object.entries(this.graph)) {
      const relativeFile = path.relative(this.rootDir, file);
      relativeGraph[relativeFile] = deps.map((dep) =>
        path.relative(this.rootDir, dep)
      );
    }
    fs.writeFileSync(outputPath, JSON.stringify(relativeGraph, null, 2));
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Usage: ts-dependency-builder <directory>");
    process.exit(1);
  }

  const rootDir = path.resolve(args[0]);
  const builder = new TypeScriptDependencyBuilder();
  const graph = builder.buildGraph(rootDir);

  builder.printGraph();

  // Export to JSON if requested
  if (args.includes("--json")) {
    const outputPath = args[args.indexOf("--json") + 1] || "dependencies.json";
    builder.exportToJson(outputPath);
    console.log(`Graph exported to ${outputPath}`);
  }
}

if (require.main === module) {
  main();
}

export { TypeScriptDependencyBuilder };
