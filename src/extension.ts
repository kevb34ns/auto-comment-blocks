'use strict';

import { languages, workspace, ExtensionContext, IndentAction, LanguageConfiguration } from 'vscode';

export function activate(context: ExtensionContext) {
    
    let langArray = Configuration.getConfiguration()
        .get<Array<string>>(Configuration.languagesSetting);

    langArray.forEach((lang) => {
        let disposable = languages.setLanguageConfiguration(
            lang, Configuration.languageConfiguration);
        context.subscriptions.push(disposable);
    });
}

export function deactivate() {
}

class Configuration {

    static extensionName: string = "auto-comment-blocks";

    static languagesSetting: string = "languages";
    
    static languageConfiguration: LanguageConfiguration = {

         onEnterRules: [
            {
                // e.g. /** | */
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                afterText: /^\s*\*\/$/,
                action: { indentAction: IndentAction.IndentOutdent, appendText: ' * ' }
            }, {
                // e.g. /** ...|
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                action: { indentAction: IndentAction.None, appendText: ' * ' }
            }, {
                // e.g.  * ...|
                beforeText: /^(\t|(\ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
                action: { indentAction: IndentAction.None, appendText: '* ' }
            }, {
                // e.g.  */|
                beforeText: /^(\t|(\ ))*\ \*\/\s*$/,
                action: { indentAction: IndentAction.None, removeText: 1 }
            },
            {
                // e.g.  *-----*/|
                beforeText: /^(\t|(\ ))*\ \*[^/]*\*\/\s*$/,
                action: { indentAction: IndentAction.None, removeText: 1 }
            }
        ]
    }

    static getConfiguration() {

        return workspace.getConfiguration(Configuration.extensionName);
    }
}
