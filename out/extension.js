"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const ollama_1 = __importDefault(require("ollama"));
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('simpleOllamaExtension.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('simpleOllamaExtension.analyze', () => {
        doAnalyzeAction();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('simpleOllamaExtension.insert', () => {
        doInsertAction();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('simpleOllamaExtension.createfunc', () => {
        doCreateFuncAction();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('simpleOllamaExtension.userfunc', () => {
        doUserFuncAction();
    }));
}
exports.activate = activate;
function doInsertAction() {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor == undefined) {
            vscode.window.showInformationMessage('Can\'t find editor');
            return;
        }
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        //editor.edit(editBuilder => {
        //    editBuilder.insert(editor.selection.active, 'Hello there');
        //});
        const language = getLanguage();
        editor.edit(builder => builder.replace(selection, `${selectedText}\nLanguage: ${language}`));
    });
}
function getLanguage() {
    var _a;
    return (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.languageId;
}
function doAnalyzeAction() {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor == undefined) {
            vscode.window.showInformationMessage('Can\'t find editor');
            return;
        }
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        vscode.window.showInformationMessage(`The text is: ${selectedText}`);
        vscode.window.showInformationMessage('Calling ollama');
        const language = getLanguage();
        const content = `Please answer in a single sentence what you think of the following ${language} snippet: --- ${selectedText} ---`;
        const response = yield ollama_1.default.chat({
            model: 'llama3.2',
            messages: [{ role: 'user', content: content }],
        });
        console.log(response.message.content);
        vscode.window.showInformationMessage(`Response: ${response.message.content}`);
    });
}
function doCreateFuncAction() {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor == undefined) {
            vscode.window.showInformationMessage('Can\'t find editor');
            return;
        }
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        vscode.window.showInformationMessage('Calling ollama');
        const language = getLanguage();
        const content = `Create the function for this function definition, only output the ${language} code, nothing else: --- ${selectedText} ---`;
        const response = yield ollama_1.default.chat({
            model: 'llama3.2',
            messages: [{ role: 'user', content: content }],
        });
        console.log(response.message.content);
        vscode.window.showInformationMessage(`Ollama responded`);
        let funcbody = response.message.content;
        funcbody = funcbody.replace("/^(\`\`\`" + language + ")/", "");
        funcbody = funcbody.replace(/(\`\`\`)$/, "");
        funcbody = funcbody.trim();
        if (funcbody.startsWith(selectedText)) {
            funcbody = funcbody.slice(selectedText.length);
        }
        editor.edit(builder => builder.replace(selection, `${selectedText}\n${funcbody}`));
    });
}
function doUserFuncAction() {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor == undefined) {
            vscode.window.showInformationMessage('Can\'t find editor');
            return;
        }
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        const userInput = yield vscode.window.showInputBox({ placeHolder: 'Operation to perform on selection' });
        vscode.window.showInformationMessage('Calling ollama');
        const language = getLanguage();
        const content = `Perform the following operation on this ${language} code: ${userInput}. Only output the ${language} code, nothing else: --- ${selectedText} ---`;
        const response = yield ollama_1.default.chat({
            model: 'llama3.2',
            messages: [{ role: 'user', content: content }],
        });
        console.log(response.message.content);
        vscode.window.showInformationMessage(`Ollama responded`);
        let responseCode = response.message.content;
        responseCode = responseCode.replace("/^(\`\`\`" + language + ")/", "");
        //responseCode = responseCode.replace(/^(\`\`\`python)/,"")
        responseCode = responseCode.replace(/(\`\`\`)$/, "");
        responseCode = responseCode.trim();
        editor.edit(builder => builder.replace(selection, `${responseCode}`));
    });
}
function deactivate() { }
exports.deactivate = deactivate;
