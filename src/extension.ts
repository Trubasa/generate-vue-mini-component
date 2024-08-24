import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log("Congratulations, your extension is now active!");

  let disposable = vscode.commands.registerCommand(
    "extension.createMiniProgramComponent",
    async (uri: vscode.Uri) => {
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

        const templatesDir = path.join(__dirname, "templates");

        // 创建文件
        const filesToCreate = [
          { ext: "ts", templateFile: "component.ts" },
          { ext: "html", templateFile: "component.html" },
          { ext: "css", templateFile: "component.css" },
          { ext: "json", templateFile: "component.json" },
        ];

        filesToCreate.forEach((file) => {
          const filePath = path.join(componentDir, `${input}.${file.ext}`);
          const templateContent = fs.readFileSync(
            path.join(templatesDir, file.templateFile),
            "utf8"
          );
          const fileContent = templateContent.replace(/componentName/g, input);
          fs.writeFileSync(filePath, fileContent, { encoding: "utf8" });
        });

        vscode.window.showInformationMessage(
          `成功创建小程序 component: ${input}`
        );
      } catch (err) {
        vscode.window.showErrorMessage(`创建小程序 component 失败: ${err}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
