import { Disposable, window } from 'vscode';
const Say = require('say');
const KEY = 'SUA_CHAVE_AZURE';
const Translator = require('mstranslator');
const client = new Translator(
  {
    api_key: KEY,
  },
  true,
);
const speak = (text: string, voice: string) =>
  new Promise(resolve => Say.speak(text, voice, 0.5, resolve));

const translate = params =>
  new Promise((resolve, reject) =>
    client.translate(params, (error: string, data: string) =>
      error ? reject(error as string) : resolve(data as string),
    ),
  );

export default class TradutorController {
  private _disposable: Disposable;
  private lastSelection: Date = new Date();
  private text: string = '';
  constructor() {
    let subscriptions: Disposable[] = [];
    window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
    this._verifySelection();
  }

  public dispose() {
    this._disposable.dispose();
  }

  private async _onEvent() {
    const editor = window.activeTextEditor;
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (selectedText === '') {
      return;
    }
    this.text = selectedText;
    this.lastSelection = new Date();
  }

  public async falar(selectedText) {
    const params = { text: selectedText, from: 'en', to: 'pt-br' };

    const text = await translate(params);
    await this.falarComAudio(selectedText, text as string);
  }
  async falarComAudio(textEn: string, traducao: string) {
    await speak('Oi Erick! a tradução para', 'Luciana');
    await speak(textEn, 'Victoria');
    await speak(`será traduzido em nosso idioma como ${traducao}`, 'Luciana');
  }
  private async _verifySelection() {
    setInterval(async () => {
      const lastSelection = this.lastSelection.getTime();
      const now = Date.now();
      const difference = now - lastSelection;
      const LIMIT = 1000;
      if (difference <= LIMIT || this.text === '') {
        return;
      }
      console.log('traduzindo...', this.text);
      const text = this.text;
      this.text = '';
      await this.falar(text);
    }, 500);
  }
}
