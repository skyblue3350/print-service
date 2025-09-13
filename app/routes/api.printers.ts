import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const loader = async (_: LoaderFunctionArgs) => {
  try {
    // lpstat -p コマンドを実行して利用可能なプリンターを検出
    const { stdout, stderr } = await execAsync("lpstat -p");
    
    if (stderr) {
      console.error('lpstat -p stderr:', stderr);
    }
    
    const printers = [];
    
    if (stdout) {
      // lpstat -p の出力を解析
      // 例: printer MG6200 is idle.  enabled since Fri 13 Sep 2025 04:34:07 PM JST
      const lines = stdout.split('\n');
      for (const line of lines) {
        const printerMatch = line.match(/printer\s+(\S+)\s+(.+)/);
        if (printerMatch) {
          const printerName = printerMatch[1];
          const status = printerMatch[2];
          
          // プリンターの詳細情報を取得
          try {
            const { stdout: infoStdout } = await execAsync(`lpstat -l -p ${printerName}`);
            let description = printerName;
            
            // Description を抽出
            const descMatch = infoStdout.match(/Description:\s*(.+)/);
            if (descMatch) {
              description = descMatch[1].trim();
            }
            
            printers.push({
              value: printerName,
              label: `${printerName} (${description})`,
              name: printerName,
              status: status,
              description: description
            });
          } catch (infoError) {
            // 詳細情報の取得に失敗した場合でも基本情報は追加
            printers.push({
              value: printerName,
              label: printerName,
              name: printerName,
              status: status,
              description: printerName
            });
          }
        }
      }
    }
    
    // プリンターが見つからない場合でも空の配列を返す
    return json({ printers });
    
  } catch (error) {
    console.error('Error executing lpstat -p:', error);
    
    // エラーが発生した場合は空の配列を返す
    return json({ printers: [] });
  }
};