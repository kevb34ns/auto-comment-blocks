'use strict';

import { languages, commands, workspace, ExtensionContext, IndentAction, LanguageConfiguration, OnEnterRule } from 'vscode';

export function activate(context: ExtensionContext) {
    
    let langArray = Configuration.getConfiguration()
        .get<Array<string>>(Configuration.languagesSetting);

    langArray.forEach((lang) => {
        let config= Configuration.languageConfiguration;
        if ((lang === 'c' || lang === 'cpp') &&
                Configuration.getConfiguration().get<Boolean>(Configuration.singleLineBlocksSetting)) {

            config.onEnterRules = config.onEnterRules.concat(Configuration.singleLineBlockEnterRules);
        }

        let disposable = languages.setLanguageConfiguration(lang, config);

        context.subscriptions.push(disposable);
    });

    commands.registerTextEditorCommand("auto-comment-blocks.break-single-line-block", (textEditor, edit, args) => {
        if (Configuration.getConfiguration().get<Boolean>
                (Configuration.singleLineBlocksSetting) &&
                (textEditor.document.languageId === 'c' || 
                textEditor.document.languageId === 'cpp') &&
                textEditor.selection.isEmpty) {
            
            let line = textEditor.document.lineAt(textEditor.selection.active);

            if (line.text.search(/^\s*\/\/\/\s*/) !== -1 ||
                line.text.search(/^\s*\/\/\s*/) !== -1) {
                
        //      TODO handle indentation on newline
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
    

    //TODO '//' regex has to check that there are no more '/'s following it
    static singleLineBlockEnterRules: Array<OnEnterRule> = [
        {
            beforeText: /^\s*\/\//,
            action: { indentAction: IndentAction.None, appendText: '// '}
        },
        {
            beforeText: /^\s*\/\/\//,
            action: { indentAction: IndentAction.None, appendText: '/// '}
        }
    ]

    static getConfiguration() {

        return workspace.getConfiguration(Configuration.extensionName);
    }
}
