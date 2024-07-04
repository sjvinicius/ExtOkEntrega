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

    const config = vscode.workspace.getConfiguration();

    // Define a type for your configuration keys and values
    interface Configurations {
        '[php]': object;
        'php.codeLens.enabled': boolean;
        'php.inlayHints.parameters.enabled': boolean;
        "php.inlayHints.parameters.suppressNameMatchingValue": boolean;
        "php.inlayHints.types.return": boolean;
        "php.format.codeStyle": string;
        "php.format.rules.openBraceOnNewLineForFunctions": boolean;
        "php.format.rules.openBraceOnNewLineForBlocks": boolean;
        "openBraceOnNewLineForTypes": boolean;
        "php.format.rules.addCommaAfterLastArrayElement": boolean;
        "prettier.useTabs": boolean;
        "prettier.tabWidth": number;
        "prettier.quoteProps": string;
        "prettier.singleQuote": boolean;
        "php-cs-fixer.autoFixByBracket": boolean;
        "prettier.printWidth": number;
        "editor.rulers": Array<number>;
    }

    // Define your configuration keys and values
    const configurations: Configurations = {
        '[php]': {
            "editor.defaultFormatter": "DEVSENSE.phptools-vscode",
            "editor.tabSize": 4
        },
        'prettier.singleQuote': false,
        'php.codeLens.enabled': true,
        'php.inlayHints.parameters.enabled': false,
        "php.inlayHints.parameters.suppressNameMatchingValue": false,
        "php.inlayHints.types.return": false,
        "php.format.codeStyle": "PSR-12",
        "php.format.rules.openBraceOnNewLineForFunctions": true,
        "php.format.rules.openBraceOnNewLineForBlocks": false,
        "openBraceOnNewLineForTypes": true,
        "php.format.rules.addCommaAfterLastArrayElement": true,
        "prettier.useTabs": true,
        "prettier.tabWidth": 4,
        "prettier.quoteProps": "consistent",
        "php-cs-fixer.autoFixByBracket": true,
        "prettier.printWidth": 120,
        "editor.rulers": [
            80,
            120
        ],
    };

    function applyDefaultSettings() {
        (Object.keys(configurations) as (keyof Configurations)[]).forEach(key => {
            config.update(key, configurations[key], vscode.ConfigurationTarget.Global);
        });
    }

    applyDefaultSettings();

    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('extok')) {
            applyDefaultSettings();
        }
    });

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