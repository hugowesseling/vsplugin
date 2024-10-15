import * as vscode from 'vscode';
import ollama from 'ollama'


export function activate(context: vscode.ExtensionContext) {
    /*
    context.subscriptions.push(vscode.commands.registerCommand('simpleOllamaExtension.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World')
    }))

    context.subscriptions.push(vscode.commands.registerCommand('simpleOllamaExtension.insert', () => {
        doInsertAction();
    }))
    */

    context.subscriptions.push(vscode.commands.registerCommand('simpleOllamaExtension.analyze', () => {
        doAnalyzeAction();
    }))

    context.subscriptions.push(vscode.commands.registerCommand('simpleOllamaExtension.createfunc', () => {
        doCreateFuncAction();
    }))

    context.subscriptions.push(vscode.commands.registerCommand('simpleOllamaExtension.userfunc', () => {
        doUserFuncAction();
    }))
}

/*async function doInsertAction() {
    const editor = vscode.window.activeTextEditor;
    if (editor == undefined) {
        vscode.window.showInformationMessage('Can\'t find editor')
        return
    }
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    //editor.edit(editBuilder => {
    //    editBuilder.insert(editor.selection.active, 'Hello there');
    //});
    const language = getLanguage()

    editor.edit(builder => builder.replace(selection, `${selectedText}\nLanguage: ${language}`))
}*/

function getLanguage() {
    return vscode.window.activeTextEditor?.document.languageId;
}

async function doAnalyzeAction() {
    const editor = vscode.window.activeTextEditor;
    if (editor == undefined) {
        vscode.window.showInformationMessage('Can\'t find editor')
        return
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    const userInput = await vscode.window.showInputBox({placeHolder: 'Enter a question or leave empty:'})

    //vscode.window.showInformationMessage(`The text is: ${selectedText}`);
    //vscode.window.showInformationMessage(`The user question is: ${userInput}`);
    
    const language = getLanguage()
    let content = `Please answer in a single sentence what you think of the following ${language} snippet: --- ${selectedText} ---`
    if(selectedText === "")
    {
        content = `Please answer in a single sentence "${userInput}" ---`
    }else
    if(userInput !== "")
    {
        content = `Please answer in a single sentence "${userInput}" about the following ${language} snippet: --- ${selectedText} ---`
    }
    
    vscode.window.showInformationMessage(`Calling ollama with content: ${content}`)
    const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'user', content: content }],
    })
    console.log(response.message.content)
    vscode.window.showInformationMessage(`Response: ${response.message.content}`)
}

async function doCreateFuncAction() {
    const editor = vscode.window.activeTextEditor;
    if (editor == undefined) {
        vscode.window.showInformationMessage('Can\'t find editor')
        return
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    
    const language = getLanguage()
    const content = `Create the function for this function definition, only output the ${language} code, nothing else: --- ${selectedText} ---`
    vscode.window.showInformationMessage(`Calling ollama with content: ${content}`)
    const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'user', content: content }],
    })
    console.log(response.message.content)
    vscode.window.showInformationMessage(`Ollama responded`)
    let funcbody = response.message.content
    funcbody = funcbody.replace("/^(\`\`\`"+language+")/","")
    funcbody = funcbody.replace(/(\`\`\`)$/,"")
    funcbody = funcbody.trim()
    if(funcbody.startsWith(selectedText)) {
        funcbody = funcbody.slice(selectedText.length)
    }
    editor.edit(builder => builder.replace(selection, `${selectedText}\n${funcbody}`))
}


async function doUserFuncAction() {
    const editor = vscode.window.activeTextEditor;
    if (editor == undefined) {
        vscode.window.showInformationMessage('Can\'t find editor')
        return
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    const userInput = await vscode.window.showInputBox({placeHolder: 'Operation to perform on selection'})
    
    vscode.window.showInformationMessage('Calling ollama')
    const language = getLanguage()
    const content = `Perform the following operation on this ${language} code: ${userInput}. Only output the ${language} code, nothing else: --- ${selectedText} ---`
    const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'user', content: content }],
    })
    console.log(response.message.content)
    vscode.window.showInformationMessage(`Ollama responded`)
    let responseCode = response.message.content
    responseCode = responseCode.replace("/^(\`\`\`"+language+")/","")
    //responseCode = responseCode.replace(/^(\`\`\`python)/,"")
    responseCode = responseCode.replace(/(\`\`\`)$/,"")
    responseCode = responseCode.trim()
    editor.edit(builder => builder.replace(selection, `${responseCode}`))
}

export function deactivate() {}
