import { Uri, window, workspace } from 'vscode'
import { TextDecoder } from 'util'

import { TinkerTerminal } from '../terminal'
import { minifyPHPCode } from '../utils'

/**
 * 执行 uri 文件的代码
 *
 * @param uri 需要执行的文件 uri
 */
export async function run (uri: Uri): Promise<void> {
  if (uri == null) {
    // 设置 uri 为当前打开文档的 uri
    const editor = window.activeTextEditor
    if (editor != null) {
      uri = editor.document.uri
    }
  }

  try {
    // 保存文件内容
    workspace
      .textDocuments
      .find(doc => doc.uri.path === uri.path)
      ?.save()

    // 读取文件内容
    const data = await workspace.fs.readFile(uri)
    const code = minifyPHPCode(
      new TextDecoder().decode(data)
    )

    // 输入至 terminal 并且显示
    const terminal = await TinkerTerminal.instance(uri)
    await terminal.sendCode(code)
    terminal.show()
  } catch (e) {
    TinkerTerminal.dispose()
    await window.showInformationMessage(e.message)
  }
}
