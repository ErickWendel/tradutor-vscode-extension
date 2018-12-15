'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const say = require('say');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "translator" is now active!');

  context.subscriptions.push(new TradutorController());
}

// this method is called when your extension is deactivated
export function deactivate() {}

class TradutorController {
  constructor() {
    let subscriptions: vscode.Disposable[] = [];
    vscode.window.onDidChangeTextEditorSelection(
      this._onEvent,
      this,
      subscriptions,
    );
  }

  dispose() {}
  async _onEvent() {
    const speak = (text, voice) =>
      new Promise((resolve, reject) => say.speak(text, voice, resolve));

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (!selectedText) {
      return;
    }
    console.log('selectedTExt', selectedText);

    await speak(selectedText, 'Luciana');
    // await speak(selectedText, 'Alex');
  }
}
