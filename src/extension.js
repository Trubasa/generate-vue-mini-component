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
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function activate(context) {
    console.log("Congratulations, your extension is now active!");
    let disposable = vscode.commands.registerCommand("extension.createMiniProgramComponent", async (uri) => {
        const input = await vscode.window.showInputBox({
            prompt: "请输入小程序 component 的名称",
            placeHolder: "component-name",
        });
        if (!input) {
            vscode.window.showErrorMessage("未输入名称");
            return;
        }
        const componentDir = path.join(uri.fsPath, input);
        if (fs.existsSync(componentDir)) {
            vscode.window.showErrorMessage("目录已存在");
            return;
        }
        try {
            // 创建目录
            fs.mkdirSync(componentDir);
            // 创建文件
            const tsPath = path.join(componentDir, `${input}.ts`);
            const htmlPath = path.join(componentDir, `${input}.html`);
            const cssPath = path.join(componentDir, `${input}.css`);
            const jsonPath = path.join(componentDir, `${input}.json`);
            fs.writeFileSync(tsPath, `// ${input}.ts`, { encoding: "utf8" });
            fs.writeFileSync(htmlPath, `<!-- ${input}.html -->`, {
                encoding: "utf8",
            });
            fs.writeFileSync(cssPath, `/* ${input}.css */`, { encoding: "utf8" });
            fs.writeFileSync(jsonPath, JSON.stringify({ component: true }, null, 2), { encoding: "utf8" });
            vscode.window.showInformationMessage(`成功创建小程序 component: ${input}`);
        }
        catch (err) {
            vscode.window.showErrorMessage(`创建小程序 component 失败: ${err}`);
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map