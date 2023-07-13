import { ExtensionContext, languages, CompletionItem, CompletionItemKind, SnippetString, MarkdownString } from 'vscode';

export function activate(context: ExtensionContext) {
	// Carrega os snippets
	const snippetFiles = ['php.json','javascript.json'];

	for (const file of snippetFiles) {
		const snippets = require(`../snippets/${file}`);
		const languageId = file.split('.')[0];

		// Registra os snippets para a linguagem
		registerSnippets(snippets, languageId, context);
	}
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

class SnippetCompletionItem extends CompletionItem {
	constructor(prefix: string, body: string[]) {
		super(prefix);
		this.insertText = new SnippetString(body.join('\n'));
		this.documentation = new MarkdownString('Snippetmd');
	}
}
