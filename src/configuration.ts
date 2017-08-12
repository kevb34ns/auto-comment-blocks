'use strict';

import { IndentAction, LanguageConfiguration, OnEnterRule, workspace } from 'vscode';

export class Configuration {
  
  static extensionName: string = "auto-comment-blocks";

  static languagesSetting: string = "languages";

  static singleLineBlocksSetting: string = "singleLineBlocksEnabled";

  static breakSingleLineBlockCommand: string = "auto-comment-blocks.breakSingleLineBlock";
  
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
    
  static singleLineBlockEnterRules: Array<OnEnterRule> = [
    {
      // e.g. // ...|
      beforeText: /^\s*\/\/(?!\/)/,
      action: { indentAction: IndentAction.None, appendText: '// '}
    },
    {
      // e.g. /// ...|
      beforeText: /^\s*\/\/\//,
      action: { indentAction: IndentAction.None, appendText: '/// '}
    }
  ]

  static getConfiguration() {

    return workspace.getConfiguration(Configuration.extensionName);
  }
}