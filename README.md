# Auto Comment Blocks

A simple VS Code extension for C, C++, C#, CSS/Sass, PHP, Java, and Groovy that ports VS Code's JavaScript block comment completion functionality.

## Usage
![Demo](https://raw.githubusercontent.com/kevinkyang/auto-comment-blocks/master/img/demo.gif)

### Javadoc-style comment blocks
Type `/**` to start a block comment, then hit the Enter key, and the extension will close the block. While inside the comment block, the extension will insert an asterisk at the start of every new line, and align the comment, respecting indentation.

### QDoc-style (Qt) comment blocks
Use `/*!` in C/C++ files to start a QDoc comment block.

### New: "single-line" block comments for C/C++
You must enable this feature explicitly (see 'Extension Settings'). Hit Enter on a line that begins with `//` or `///` to create a comment block where each line is a single-line comment. To break out of the comment block, press Shift+Enter (you can rebind this in the keyboard shortcut preferences).

## Feature requests
Currently, this extension supports C, C++, C#, CSS/Sass, PHP, Java, and Groovy. If you want to suggest a feature or request support for a specific language, please create an issue in the [repository](https://github.com/kevinkyang/auto-comment-blocks/issues). In the interest of keeping this extension simple and lightweight, some features may not be possible right now.

## Extension Settings

* `auto-comment-blocks.languages`: Comment completion will be enabled for the languages in this list.
* `auto-comment-blocks.singleLineBlocksEnabled`: For C/C++, this enables auto comment blocks for comments beginning with `//` or `///`. Press Shift+Enter to break the comment block. Disabled by default.

## Issues

* Sometimes the completion/aseterisk insertion doesn't work. The reason is still unknown. It may go away if you reload your workspace.
* Currently, VS Code only allows extensions to overwrite, instead of modify, existing language configurations. This means that this extension may clash with another extension that overwrites the same language configurations, causing one or both not to work. In that case, uninstalling this extension is the only option for now.

Please create an issue in the Github repository if you find any bugs or have questions/requests.

## Release Notes

### 0.3.0
- Add single-line blocks for C/C++ (disabled by default).
- Add comment completion for PHP files.