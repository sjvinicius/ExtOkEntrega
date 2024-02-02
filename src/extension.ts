// import { ExtensionContext, languages, CompletionItem, CompletionItemKind, SnippetString, MarkdownString } from 'vscode';
import vscode = require('vscode');

const defaultVariableValues: Record<string, string> = {
    "okDevUserId": '${9999:okDevUserId}',
    "okHmlUserId": '${9999:okHmlUserId}',
    "okProdUserId": '${9999:okProdUserId}'
    // Adicione outras variáveis aqui
};

export function activate(context: vscode.ExtensionContext) {

    // Carrega os snippets
    const snippetFiles = ['php', 'javascript']; // Não inclua a extensão do arquivo

    for (const file of snippetFiles) {
        const json = require(`../snippets/${file}.json`);
        const languageId = file;

        // Registra os snippets para a linguagem
        registerSnippets(json, languageId, context);
    }

}


function registerSnippets(snippets: any, languageId: string, context: vscode.ExtensionContext) {
    const provider = {
        provideCompletionItems() {

            const okDevUserId: string | undefined = vscode.workspace.getConfiguration().get('okDevUserId');
            const okHmlUserId: string | undefined = vscode.workspace.getConfiguration().get('okHmlUserId');
            const okProdUserId: string | undefined = vscode.workspace.getConfiguration().get('okProdUserId');

            // Adicione outras variáveis configuráveis aqui
            const variableValues: Record<string, string> = {
                "okDevUserId": okDevUserId || defaultVariableValues['okDevUserId'],
                "okHmlUserId": okHmlUserId || defaultVariableValues['okHmlUserId'],
                "okProdUserId": okProdUserId || defaultVariableValues['okProdUserId'],
                // Adicione outras variáveis aqui
            };


            const completionItems = Object.keys(snippets).map((label) => {
                const snippet = snippets[label];
                const modifiedBody = replaceVariablesInSnippetBody(snippet.body.join('\n'), variableValues);

                const completionItem = new vscode.CompletionItem(snippet.prefix, vscode.CompletionItemKind.Snippet);
                completionItem.insertText = new vscode.SnippetString(modifiedBody);
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

    return provider;
}
function replaceVariablesInSnippetBody(snippetBody: string, variableValues: Record<string, string>): string {
    // Usa uma expressão regular para procurar variáveis configuráveis no formato ${1:variavel}
    const variableRegex = /\$\{(\d+:\w+)\}/g;
    // Substitui todas as instâncias das variáveis no corpo do snippet
    const replacedSnippetBody = snippetBody.replace(variableRegex, (match, variableKey) => {
        // Verifica se a variável existe no objeto de valores
        if (variableKey.match(/:\s*(\w+)/)[1] && variableValues.hasOwnProperty(variableKey.match(/:\s*(\w+)/)[1])) {
            return variableValues[variableKey.match(/:\s*(\w+)/)[1]];
        }
        // Se a variável não estiver configurada, mantém o texto original
        return match;
    });

    return replacedSnippetBody;
}