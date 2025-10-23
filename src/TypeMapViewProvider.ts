// src/TypeMapViewProvider.ts
import * as vscode from 'vscode';
import { TypeMapNode } from './TypeAnalyzer';

export class TypeMapViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'tsTopoMapView';
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(view: vscode.WebviewView) {
    this._view = view;
    view.webview.options = { enableScripts: true };
    view.webview.html = this._getHtml();
  }

  update(types: TypeMapNode[]) {
    this._view?.webview.postMessage({ type: 'update', payload: types });
  }

  private _getHtml(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: var(--vscode-font-family); padding: 1rem; }
          .node { margin-bottom: 0.5rem; }
        </style>
      </head>
      <body>
        <h3>Type Map</h3>
        <div id="map"></div>
        <script>
          const vscode = acquireVsCodeApi();
          window.addEventListener('message', (event) => {
            const { type, payload } = event.data;
            if (type === 'update') {
              document.getElementById('map').innerHTML =
                payload.map(t => '<div class="node">' + t.name + ' (' + t.kind + ')</div>').join('');
            }
          });
        </script>
      </body>
      </html>`;
  }
}
