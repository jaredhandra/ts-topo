// src/TypeMapProvider.ts
import * as vscode from 'vscode';
import { TypeAnalyzer } from './TypeAnalyzer';
import { TypeNode } from './TypeNode';

export class TypeMapProvider implements vscode.TreeDataProvider<TypeNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TypeNode | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private types: TypeNode[] = [];

  constructor(private analyzer: TypeAnalyzer) {}

  async loadTypes(): Promise<void> {
    const results = await this.analyzer.buildTypeMap();
    this.types = results.map(t => new TypeNode(t.name, vscode.TreeItemCollapsibleState.Collapsed));
  }

  async refresh(): Promise<void> {
    this.loadTypes();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TypeNode): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TypeNode): Promise<TypeNode[]> {
    if (!element) {
      // top-level types
      return this.types;
    }

    // children = references or related symbols
    const refNodes =
      element.location?.uri
        ? [
            new TypeNode('Example usage', vscode.TreeItemCollapsibleState.None, element.location)
          ]
        : [];
    return refNodes;
  }
}
