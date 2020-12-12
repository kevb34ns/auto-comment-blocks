'use strict';

import { Disposable, ExtensionContext, IndentAction, LanguageConfiguration, OnEnterRule, TextEditor, TextEditorEdit, commands, languages, workspace, } from 'vscode';

import { Rules } from './rules';

let fs = require('fs');

export class Configuration {
  
  private readonly extensionName: string = "auto-comment-blocks";
  private readonly singleLineBlockCommand: string = 
      "auto-comment-blocks.singleLineBlock";
  private readonly singleLineConfigFile: string = __dirname +
      "/../../language-configuration/single-line-configuration.json";
  private readonly multiLineConfigFile: string = __dirname +
      "/../../language-configuration/multi-line-configuration.json";

  private readonly singleLineBlockOnEnter: string = "singleLineBlockOnEnter";
  private readonly slashStyleBlocks: string = "slashStyleBlocks";
  private readonly hashStyleBlocks: string = "hashStyleBlocks";
  private readonly semicolonStyleBlocks: string = "semicolonStyleBlocks";
  private readonly disabledLanguages: string = "disabledLanguages";

  private disabledLanguageList: string[] = 
      this.getConfiguration().get<string[]>(this.disabledLanguages);
  private singleLineBlocksMap: Map<string, string> = new Map();

  private getConfiguration() {

    return workspace.getConfiguration(this.extensionName);
  }

  private isLangIdDisabled(langId: string) {

    return this.disabledLanguageList.indexOf(langId) !== -1;
  }

  private getMultiLineLanguages(): Array<string> {

    let multiLineConfig = JSON.parse(fs.readFileSync(
        this.multiLineConfigFile, 'utf-8'));
    return multiLineConfig["languages"];
  }

  private setLanguageConfiguration(langId: string, 
                                   multiLine?: boolean, 
                                   singleLineStyle?: string): Disposable {

    var langConfig: LanguageConfiguration = { 
      onEnterRules: []
    };

    if (multiLine) {
      langConfig.onEnterRules =
          langConfig.onEnterRules.concat(Rules.multilineEnterRules);
    }

    let isOnEnter = this.getConfiguration().get<boolean>(
        this.singleLineBlockOnEnter);
    if (isOnEnter && singleLineStyle) {
      if (singleLineStyle === '//') {
        langConfig.onEnterRules =
            langConfig.onEnterRules.concat(Rules.slashEnterRules);
      } else if (singleLineStyle === '#') {
        langConfig.onEnterRules = 
            langConfig.onEnterRules.concat(Rules.hashEnterRules);
      } else if (singleLineStyle === ';') {
        langConfig.onEnterRules =
            langConfig.onEnterRules.concat(Rules.semicolonEnterRules);
      }
    }
    
    return languages.setLanguageConfiguration(langId, langConfig);
  }

  private getSingleLineLanguages() {

    let singleLineConfig: Object = JSON.parse(fs.readFileSync(
      this.singleLineConfigFile, 'utf-8'));
    let commentStyles = Object.keys(singleLineConfig);
    for (let key of commentStyles) {
      for (let langId of singleLineConfig[key]) {
        if (!this.isLangIdDisabled(langId)) {
          this.singleLineBlocksMap.set(langId, key);
        }
      }
    }
    
    // get user-customized langIds for this key and add to the map
    let customSlashLangs = 
        this.getConfiguration().get<string[]>(this.slashStyleBlocks);
    for (let langId of customSlashLangs) {
      if (langId && langId.length > 0) {
        this.singleLineBlocksMap.set(langId, '//');
      }
    }

    let customHashLangs = 
        this.getConfiguration().get<string[]>(this.hashStyleBlocks);
    for (let langId of customHashLangs) {
      if (langId && langId.length > 0) {
        this.singleLineBlocksMap.set(langId, '#');
      }
    }

    let customSemicolonLangs =
        this.getConfiguration().get<string[]>(this.semicolonStyleBlocks);
    for (let langId of customSemicolonLangs) {
      if (langId && langId.length > 0) {
        this.singleLineBlocksMap.set(langId, ';');
      }
    }
  }

  configureCommentBlocks(context: ExtensionContext) {

    this.getSingleLineLanguages();

    // set language configurations
    let multiLineLangs = this.getMultiLineLanguages();
    for (let [langId, style] of this.singleLineBlocksMap) {
      let multiLine = multiLineLangs.indexOf(langId) !== -1;
      let disposable = this.setLanguageConfiguration(langId, multiLine, style);
      context.subscriptions.push(disposable);
    }

    for (let langId of multiLineLangs) {
      if (!this.singleLineBlocksMap.has(langId) && 
          !this.isLangIdDisabled(langId)) {

        let disposable = this.setLanguageConfiguration(langId, true);
        context.subscriptions.push(disposable);
      }
    }
  }

  private handleSingleLineBlock(textEditor: TextEditor, edit: TextEditorEdit) {

    let langId = textEditor.document.languageId;
    var style = this.singleLineBlocksMap.get(langId);
    if (style && textEditor.selection.isEmpty) {
      let line = textEditor.document.lineAt(textEditor.selection.active);
      let isCommentLine = true;
      var indentRegex: RegExp;
      if (style === '//' && line.text.search(/^\s*\/\/\s*/) !== -1) {
        indentRegex = /\//;
        if (line.text.search(/^\s*\/\/\/\s*/) !== -1) {
          style = '///';
        }
        if (line.text.search(/^\s*\/\/!\s*/) !== -1) {
          style = '//!';
        }

      } else if (style === '#' && line.text.search(/^\s*#\s*/) !== -1) {
        indentRegex = /#/;

      } else if (style === ';' && line.text.search(/^\s*;\s*/) !== -1) {
        indentRegex = /;/;

      } else {
        isCommentLine = false;
      }

      if (!isCommentLine) {
        return;
      }

      var indentedNewLine = '\n' + 
          line.text.substring(0, line.text.search(indentRegex));
      let isOnEnter = this.getConfiguration().get<boolean>(
          this.singleLineBlockOnEnter);
      if (!isOnEnter) {
        indentedNewLine += style + ' ';
      }

      edit.insert(textEditor.selection.active, indentedNewLine);
    }
  }

  registerCommands() {

    commands.registerTextEditorCommand(this.singleLineBlockCommand,
        (textEditor, edit, args) => {
          this.handleSingleLineBlock(textEditor, edit);
        })
  }
}