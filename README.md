# Auto Comment Blocks

A simple extension for C, C++, C#, and Java that ports VS Code's JavaScript block comment completion functionality.

## Usage

Type `/**` to start a block comment, then hit the Enter key, and the extension will close the block. While inside the comment block, the extension will insert an asterisk at the start of every new line, and align the comment, respecting indentation.

Currently, this extension supports C, C++, C#, and Java. Support for other languages with the same comment syntax can be added upon request, if possible.

## Extension Settings

There is one setting for this extension:

* `auto-comment-blocks.languages`: Comment completion will be enabled for the languages in this list. 

## Issues

Currently, VS Code only allows extensions to overwrite, instead of modify, existing language configurations. This means that this extension may clash with another extension that overwrites the same language configurations, causing one or both not to work. In that case, uninstalling this extension is the only option for now.

Please create an issue in the Github repository if you find any bugs or have questions/requests.

## Release Notes

### 0.0.1

Initial Release.