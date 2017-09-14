'use strict';

import { languages, commands, workspace, ExtensionContext, IndentAction, LanguageConfiguration, OnEnterRule, Disposable } from 'vscode';
import { Configuration } from './configuration';

let fs = require('fs');
let configuration = new Configuration();

export function activate(context: ExtensionContext) {
	
	configuration.configureCommentBlocks(context);
	configuration.registerCommands();
}

export function deactivate() {
  
}
