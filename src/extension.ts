import { 
	ExtensionContext, 
	languages, 
	CompletionItem, 
	CompletionItemKind, 
	SnippetString, 
	MarkdownString, 
	TextDocument,
	Position,
	Hover
} from 'vscode';
const vscode = require('vscode');
const functionDescriptions = require('./functions.json');

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

function createHoverContent(functionName: string): string | null {
    const functionInfo = functionDescriptions[functionName];
    if (!functionInfo) return null;

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

function provideHover(document: TextDocument, position: Position): Hover | undefined {
    const wordRange = document.getWordRangeAtPosition(position);
    const word = wordRange ? document.getText(wordRange) : "";

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
