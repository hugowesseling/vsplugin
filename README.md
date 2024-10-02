## How to compile

### Pre-requisites

Install npm and get ollama lib: <code>npm i ollama</code>

### Compile

In the main folder, run: <code>npm run compile</code>

### Run

- Open extension.ts
- Press F5 (A new vscode window is opened called [Extension Development Host])
- The console output is in the original window under DEBUG CONSOLE
- In the new window, select text, right click and chooose one of the new commands

### Create vscode installation package (.vsix)

In the main folder, run: <code> vsce package </code>