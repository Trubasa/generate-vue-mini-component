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

      // 获取工作区根路径
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("请打开一个工作区进行操作");
        return;
      }

      const workspaceRoot = workspaceFolders[0].uri.fsPath;
      const templatesDir = path.join(
        workspaceRoot,
        "extensionVueMiniComponentTemplates"
      );

      // 检查模板目录是否存在
      if (!fs.existsSync(templatesDir)) {
        vscode.window.showErrorMessage(`模板目录不存在: ${templatesDir}`);
        return;
      }

      try {
        // 创建目录
        fs.mkdirSync(componentDir);

        // 获取模板文件列表
        const templateFiles = fs.readdirSync(templatesDir);

        // 创建文件
        templateFiles.forEach((templateFile) => {
          const ext = path.extname(templateFile);
          const filePath = path.join(componentDir, `${input}${ext}`);
          const templateContent = fs.readFileSync(
            path.join(templatesDir, templateFile),
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
