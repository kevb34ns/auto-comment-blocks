'use strict';

import { ExtensionContext } from 'vscode';
import { Configuration } from './configuration';

let configuration = new Configuration();

export function activate(context: ExtensionContext) {
	
	configuration.configureCommentBlocks(context);
	configuration.registerCommands();
}

export function deactivate() {
  
}
