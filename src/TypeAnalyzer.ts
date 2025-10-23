import ts from 'typescript';
import * as vscode from 'vscode';

export interface TypeMapNode {
  name: string;
  kind: string;
  file: string;
  references: vscode.Location[];
}

export class TypeAnalyzer {
  async buildTypeMap(): Promise<TypeMapNode[]> {
    const projectPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!projectPath) {return [];}

    const configPath = ts.findConfigFile(projectPath, ts.sys.fileExists, "tsconfig.json");
    console.log("Config Path:", configPath);
    if (!configPath) {throw new Error("tsconfig.json not found");}

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, projectPath);

    const program = ts.createProgram(config.fileNames, config.options);
    const checker = program.getTypeChecker();

    const nodes: TypeMapNode[] = [];

    for (const sourceFile of program.getSourceFiles()) {
      if (sourceFile.isDeclarationFile) {continue;}

      ts.forEachChild(sourceFile, (node) => {
        if (
          ts.isInterfaceDeclaration(node) ||
          ts.isTypeAliasDeclaration(node) ||
          ts.isClassDeclaration(node)
        ) {
          const symbol = checker.getSymbolAtLocation(node.name!);
          if (symbol) {
            const startPos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            const endPos = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
            const location = new vscode.Location(
              vscode.Uri.file(sourceFile.fileName),
              new vscode.Range(
                new vscode.Position(startPos.line, startPos.character),
                new vscode.Position(endPos.line, endPos.character)
              )
            );
            nodes.push({
              name: symbol.getName(),
              kind: ts.SyntaxKind[node.kind],
              file: sourceFile.fileName,
              references: [location]
            });
          }
        }
      });
    }

    return nodes;
  }
}