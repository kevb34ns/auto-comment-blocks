'use strict';

import { languages, commands, workspace, ExtensionContext, IndentAction, LanguageConfiguration } from 'vscode';

export function activate(context: ExtensionContext) {
    
    let langArray = Configuration.getConfiguration()
        .get<Array<string>>(Configuration.languagesSetting);

    langArray.forEach((lang) => {
        console.log(lang);
        let disposable = languages.setLanguageConfiguration(
            lang, Configuration.languageConfiguration);
        context.subscriptions.push(disposable);
    });

    commands.registerTextEditorCommand("auto-comment-blocks.break-single-line-block", (textEditor, edit, args) => {
        //TODO check if line is // or ///, and replace the line with an empty line; handle multi cursor(?) 
        //TODO need to add onCommand activation event to prevent annoying command not found warnings
        if (textEditor.document.languageId === 'c' || 
                textEditor.document.languageId === 'cpp') {
            
            if (textEditor.selection.isEmpty) {
                edit.insert(textEditor.selection.active, "\n");
            }
        }
    })   
}

export function deactivate() {
}

class Configuration {

    static extensionName: string = "auto-comment-blocks";

    static languagesSetting: string = "languages";

    static singleLineBlocksSetting: string = "single-line-blocks";
    
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
                // e.g. /*! | */
                beforeText: /^\s*\/\*\!(?!\/)([^\*]|\*(?!\/))*$/,
                afterText: /^\s*\*\/$/,
                action: { indentAction: IndentAction.IndentOutdent, appendText: ' * ' }
            }, {
                // e.g. /*! ...|
                beforeText: /^\s*\/\*\!(?!\/)([^\*]|\*(?!\/))*$/,
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
