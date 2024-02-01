import { ExtensionContext, languages, CompletionItem, CompletionItemKind, SnippetString, MarkdownString } from 'vscode';
import vscode = require('vscode');
import path = require('path');
import fs = require('fs');
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

// Interface para representar informações sobre uma função personalizada
interface CustomFunctionInfo {
  description: string;
  parameters: { name: string; description: string }[];
}

// Mapeamento de funções personalizadas para informações relevantes
const customFunctionInfo: Record<string, CustomFunctionInfo> = loadCustomFunctionInfo();

export function activate(context: vscode.ExtensionContext) {
	// Carrega os snippets
	const snippetFiles = ['php.json','javascript.json'];

	for (const file of snippetFiles) {
		const snippets = require(`../snippets/${file}`);
		const languageId = file.split('.')[0];

		// Registra os snippets para a linguagem
		registerSnippets(snippets, languageId, context);
	}

	let disposable = vscode.languages.registerHoverProvider('php', {
		provideHover(document, position, token) {
		  // Obter a palavra no local do cursor
		  const wordRange = document.getWordRangeAtPosition(position);
		  const currentWord = wordRange ? document.getText(wordRange) : '';
	 
		  // Verificar se a palavra é uma função personalizada
		  if (isCustomFunction(currentWord)) {
		    const functionInfo = customFunctionInfo[currentWord];
	 
		    if (functionInfo) {
			 // Construir a string de documentação com informações sobre a função e parâmetros
			 const hoverText = `**${currentWord}**\n\n${functionInfo.description}\n\n`;
	 
			 if (functionInfo.parameters.length > 0) {
			   const parametersText = functionInfo.parameters
				.map((param) => `* \`${param.name}\`: ${param.description}`)
				.join('\n');
			   return new vscode.Hover(new vscode.MarkdownString(hoverText + parametersText));
			 } else {
			   return new vscode.Hover(new vscode.MarkdownString(hoverText));
			 }
		    }
		  }
	 
		  return undefined; // Nenhum hover fornecido para a palavra atual
		},
	   });
	 
	   context.subscriptions.push(disposable);
}

function registerSnippets(snippets: any, languageId: string, context: vscode.ExtensionContext) {

	// Registra os snippets para a linguagem
	const provider = {
		provideCompletionItems() {
			const completionItems = Object.keys(snippets).map((label) => {
				
				const snippet = snippets[label];
				const completionItem = new vscode.CompletionItem(snippet.prefix, vscode.CompletionItemKind.Snippet);
				completionItem.insertText = new vscode.SnippetString(snippet.body.join('\n'));
				completionItem.documentation = new vscode.MarkdownString(snippet.description);
				return completionItem;
			});
			return completionItems;
		},
	};

	// Registra o provedor de snippets
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(languageId, provider)
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
		this.insertText = new vscode.SnippetString(body.join('\n'));
		this.documentation = new vscode.MarkdownString('Snippetmd');
	}
}

// Método para carregar informações das funções personalizadas a partir de um arquivo JSON
function loadCustomFunctionInfo(): Record<string, CustomFunctionInfo> {
	try {
	  const extensionPath = vscode.extensions.getExtension('seuNome.suaExtensao')?.extensionPath || '';
	  const filePath = path.join(extensionPath, 'customFunctionInfo.json');
	  const fileContent = fs.readFileSync(filePath, 'utf-8');
	  return JSON.parse(fileContent);
	} catch (error) {
	  console.error('Erro ao carregar informações das funções personalizadas:', error);
	  return {};
	}
   }
   
   // Método de verificação simples para funções personalizadas
   function isCustomFunction(word: string): boolean {
	return Object.keys(customFunctionInfo).includes(word);
   }
