'use strict';

import { Disposable, ExtensionContext, IndentAction, LanguageConfiguration, OnEnterRule, commands, languages, workspace, } from 'vscode';

let fs = require('fs');

export class Configuration {
  
  private readonly extensionName: string = "auto-comment-blocks";
  private readonly languagesSetting: string = "languages";
  private readonly singleLineBlocksSetting: string = "singleLineBlocksEnabled";
  private readonly breakSingleLineBlockCommand: string = 
      "auto-comment-blocks.breakSingleLineBlock";
  private readonly singleLineConfigFile: string = __dirname +
      "/../../language-configuration/single-line-configuration.json";
  private readonly multiLineConfigFile: string = __dirname +
      "/../../language-configuration/multi-line-configuration.json";
  
  private languageConfiguration: LanguageConfiguration = {

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
    
  // TODO remove this
  private singleLineBlockEnterRules: Array<OnEnterRule> = [
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

  private singleLineBlocksMap: Map<string, string> = new Map();

  private getConfiguration() {

    return workspace.getConfiguration(this.extensionName);
  }

  private getMultiLineLanguages(): Array<string> {

    let multiLineConfig = JSON.parse(fs.readFileSync(
        this.multiLineConfigFile, 'utf-8'));
    return multiLineConfig["languages"];
  }

  private setMultiLineConfiguration(langId: string) {

    let config = this.languageConfiguration;
    return languages.setLanguageConfiguration(langId, config);
  }

  private configureMultiLineBlocks(context: ExtensionContext) {
    
    let langIdArray = this.getMultiLineLanguages();
    langIdArray.forEach((langId) => {
      let disposable = this.setMultiLineConfiguration(langId);
      context.subscriptions.push(disposable);
    })
  }

  private configureSingleLineBlocks() {

    let singleLineConfig: Object = JSON.parse(fs.readFileSync(
      this.singleLineConfigFile, 'utf-8'));
    let commentStyles = Object.keys(singleLineConfig);
    for (let key in commentStyles) {
      for (let langId in singleLineConfig[key]) {
        this.singleLineBlocksMap.set(langId, key);
      }
  
      // TODO get user-customized langIds for this key and add to the map
    }
  }

  configureCommentBlocks(context: ExtensionContext) {

    this.configureMultiLineBlocks(context);
    this.configureSingleLineBlocks();
  }

  registerCommands() {
    // TODO create new insert single line block command, check that the languageId is in the map (and not on the blacklist), and insert the mapped value into the document
  }
}