// src/TypeNode.ts
import * as vscode from 'vscode';

export class TypeNode extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly location?: vscode.Location
  ) {
    super(label, collapsibleState);

    if (location) {
      this.command = {
        command: 'vscode.open',
        title: 'Open Type',
        arguments: [location.uri, { selection: location.range }]
      };
    }
  }
}
