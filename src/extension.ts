import { ExtensionContext, languages, CompletionItem, CompletionItemKind, SnippetString, MarkdownString } from 'vscode';
import vscode = require('vscode');
// import * as functionDescriptions from '../descriptions/funcDescript.json';

interface FunctionDescriptions {
	[key: string]: {
	    title: string;
	    description: string;
	    params: { name: string; description: string; }[];
	};
 }
 
 const functionDescriptions: FunctionDescriptions = {
     minhaFuncao: {
          title: "Minha Função",
          description: "Esta função realiza uma tarefa importante.",
          params: [
               {
                    name: "parametro1",
                    description: "O primeiro parâmetro."
               },
               {
                    name: "parametro2",
                    description: "O segundo parâmetro."
               }
          ]
     },
     outraFuncao: {
          title: "Outra Função",
          description: "Essa função lida com outro aspecto do programa.",
          params: [
               {
                    name: "parametro1",
                    description: "O primeiro parâmetro."
               }
          ]
     }
};

export function activate(context: ExtensionContext) {
	// Carrega os snippets
	const snippetFiles = ['php.json','javascript.json'];

	for (const file of snippetFiles) {
		const snippets = require(`../snippets/${file}`);
		const languageId = file.split('.')[0];

		// Registra os snippets para a linguagem
		registerSnippets(snippets, languageId, context);
	}

	const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: 'file', language: 'javascript' },
        {
            provideHover
        }
    );

	context.subscriptions.push(hoverProvider);
}

function registerSnippets(snippets: any, languageId: string, context: ExtensionContext) {

	// Registra os snippets para a linguagem
	const provider = {
		provideCompletionItems() {
			const completionItems = Object.keys(snippets).map((label) => {
				
				const snippet = snippets[label];
				const completionItem = new CompletionItem(snippet.prefix, CompletionItemKind.Snippet);
				completionItem.insertText = new SnippetString(snippet.body.join('\n'));
				completionItem.documentation = new MarkdownString(snippet.description);
				return completionItem;
			});
			return completionItems;
		},
	};

	// Registra o provedor de snippets
	context.subscriptions.push(
		languages.registerCompletionItemProvider(languageId, provider)
	);
}

function createHoverContent(functionName: string) {

	const functionInfo = functionDescriptions[functionName];
	if (!functionInfo) {return null};
 
	let hoverContent = `**${functionInfo.title}**\n\n`;
	hoverContent += `${functionInfo.description}\n\n`;
 
	if (functionInfo.params && functionInfo.params.length > 0) {
	    hoverContent += "**Parâmetros:**\n\n";
	    for (const param of functionInfo.params) {
		   hoverContent += `- *${param.name}*: ${param.description}\n`;
	    }
	}
 
	return hoverContent;
}

function provideHover(document: vscode.TextDocument, position: vscode.Position) {
    const wordRange = document.getWordRangeAtPosition(position);
    const word = document.getText(wordRange);

    const hoverContent = createHoverContent(word);
    if (hoverContent) {
		return new vscode.Hover(hoverContent);
    }
}

class SnippetCompletionItem extends CompletionItem {
	constructor(prefix: string, body: string[]) {
		super(prefix);
		this.insertText = new SnippetString(body.join('\n'));
		this.documentation = new MarkdownString('Snippetmd');
	}
}
