# Extensão de Padronização de Códigos

## Descrição
A extensão de Padronização de Códigos é uma ferramenta desenvolvida pelos desenvolvedores da empresa Stil Soluções para auxiliar na padronização da utilização de determinados códigos. Com essa extensão, você poderá agilizar o processo de codificação, reduzir erros e manter um estilo de código consistente em toda a equipe.

## Recursos Principais
- *New* **Padronização Automática**: A extensão realiza a formatação automática do código de acordo com as regras de estilo definidas.
- **Atalhos Personalizados**: Foram adicionados atalhos personalizados para agilizar a utilização dos recursos da extensão.

## Instalação
1. Abra o Visual Studio Code.
2. Vá para a aba de extensões (ícone de quebra-cabeça no menu lateral esquerdo).
3. Pesquise por "Ok Entrega" na barra de busca.
4. Clique em "Instalar" ao lado da extensão oferecida pelo Autor "Vinicius Silva de Jesus".
5. Aguarde a instalação e, em seguida, clique em "Reload" para ativar a extensão.
6. Pesquise por "Package Ext OK Entrega" na barra de busca.
7. Clique em "Instalar" ao lado da extensão oferecida pelo Autor "Vinicius Silva de Jesus".
8. Aguarde a instalação e, em seguida, clique em "Reload" para ativar a extensão.

## Configuração
A extensão de Padronização de Códigos oferece algumas opções de configuração para personalização. Para acessar as configurações, siga os passos abaixo:

1. Clique em "Preferences" (Preferências) no menu principal do Visual Studio Code.
2. Selecione "Settings" (Configurações) no menu suspenso.
3. Na janela de configurações, procure por "Padronização de Códigos".
4. Aqui você poderá ajustar as configurações conforme suas preferências.

## Atalhos Personalizados
A extensão de Padronização de Códigos disponibiliza os seguintes atalhos personalizados para facilitar a utilização:

- *New* **Alt+Shift+F**: Formata o código de acordo com as regras de estilo definidas pela extensão.

A extensão de atalhos personalizados disponibiliza os seguintes atalhos personalizados para facilitar a utilização:

- escreva o prefixo "ok" em arquivos PHP ou JavaScript e pressione **Ctrl+Space**

## Tutorial de Utilização

### Passo 1: Instalação e Configuração
Siga as instruções descritas nas seções de "Instalação" e "Configuração" acima para instalar e configurar a extensão corretamente.

### Passo 2: *New* Formatação Automática do Código
Para formatar automaticamente o código de acordo com as regras de estilo definidas pela extensão, siga os passos abaixo:

1. Selecione o trecho de código que deseja formatar ou deixe o cursor em uma linha do arquivo que deseja formatar por completo.
2. Pressione o atalho **Ctrl+Shift+F**.
3. Observe que o código será automaticamente formatado de acordo com as regras de estilo definidas.

## Exemplos

### Javascript!
<img src="https://github.com/sjvinicius/ExtOkEntrega/blob/main/documentation/assets/JS.gif?raw=true" alt="Utilização dos snippets Javascript">


### PHP (Class)
<img src="https://github.com/sjvinicius/ExtOkEntrega/blob/main/documentation/assets/PHP.gif?raw=true" alt="Utilização dos snippets PHP">

### Configurações Definidas de Formatação (USER SETTINGS JSON)

```json
{
    "[php]": {
        "editor.defaultFormatter": "DEVSENSE.phptools-vscode",
        "editor.tabSize": 4
    },
    "prettier.singleQuote": false,
    "php.inlayHints.parameters.enabled": false,
    "php.inlayHints.parameters.suppressNameMatchingValue": false,
    "php.inlayHints.types.return": false,
    "php.format.codeStyle": "PSR-12",
    "php.format.rules.openBraceOnNewLineForFunctions": true,
    "php.format.rules.openBraceOnNewLineForBlocks": false,
    "php.format.rules.addCommaAfterLastArrayElement": true,
    "prettier.useTabs": true,
    "prettier.tabWidth": 4,
    "prettier.quoteProps": "consistent",
    "php-cs-fixer.autoFixByBracket": true,
    "prettier.printWidth": 120,
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "php.codeLens.enabled": true
}
```

## Suporte e Contribuição
Se você encontrar algum problema com a extensão ou tiver sugestões de melhorias, por favor, abra uma nova issue no repositório oficial da extensão https://github.com/sjvinicius/ExtOkEntrega ou envie um e-mail para [jesus@okentrega.com.br](mailto:jesus@okentrega.com.br).

Contribuições para a extensão são bem-vindas! Sinta-se à vontade para enviar pull requests com correções de bugs, novos recursos ou melhorias de documentação.

## Licença
Esta extensão é licenciada sob a MIT License. Consulte o arquivo [LICENSE.md](https://github.com/sjvinicius/ExtOkEntrega/blob/main/LICENSE.md) para obter mais informações sobre os direitos e restrições dessa licença.

## Agradecimentos
Gostaríamos de agradecer aos desenvolvedores que contribuíram para o desenvolvimento desta extensão: Henrique Cecatto e Rafael Cecatto. Seus esforços foram fundamentais para tornar essa ferramenta uma realidade.
