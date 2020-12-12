'use strict';

import { IndentAction, OnEnterRule } from 'vscode';

export class Rules {

  static readonly multilineEnterRules: OnEnterRule[] = [
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

  static readonly slashEnterRules: OnEnterRule[] = [
    {
      // e.g. // ...|
      beforeText: /^\s*\/\/(?!\/)/,
      action: { indentAction: IndentAction.None, appendText: '// '}
    },
    {
      // e.g. /// ...|
      beforeText: /^\s*\/\/\//,
      action: { indentAction: IndentAction.None, appendText: '/// '}
    },{ 
      // e.g. //! ...|
      beforeText: /^\s*\/\/!/,
      action: { indentAction: IndentAction.None, appendText: '//! '}
    }
  ]

  static readonly hashEnterRules: OnEnterRule[] = [
    {
      // e.g. # ...|
      beforeText: /^\s*#/,
      action: { indentAction: IndentAction.None, appendText: '# '}
    }
  ]

  static readonly semicolonEnterRules: OnEnterRule[] = [
    {
      // e.g. ; ...|
      beforeText: /^\s*;/,
      action: { indentAction: IndentAction.None, appendText: '; '}
    }
  ]
}