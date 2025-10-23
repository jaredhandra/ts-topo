// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TypeAnalyzer } from './TypeAnalyzer';
import { TypeMapProvider } from './TypeMapProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// const provider = new TypeMapViewProvider(context.extensionUri);
  	const analyzer = new TypeAnalyzer();
	const treeDataProvider = new TypeMapProvider(analyzer);

	console.log('Congratulations, your extension "ts-topo" is now active!');
	
	// Initialize the tree data
	await treeDataProvider.loadTypes();
	
	const treeView = vscode.window.createTreeView('tsTopoTreeView', { treeDataProvider: treeDataProvider });
	context.subscriptions.push(treeView);

	context.subscriptions.push(
    	vscode.commands.registerCommand('ts-topo.refresh', async () => {
      	const nodes = await analyzer.buildTypeMap();
      	// provider.update(nodes);
		treeDataProvider.refresh();
      	vscode.window.showInformationMessage(`Indexed ${nodes.length} types`);
    })
  );

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('ts-topo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Poop ppppo from ts-topo!');
	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(
		vscode.commands.registerCommand('ts-topo.openView', async () => {
			await treeDataProvider.loadTypes();
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
