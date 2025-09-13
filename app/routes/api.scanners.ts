import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const loader = async (_: LoaderFunctionArgs) => {
  try {
    // scanimage -L コマンドを実行してスキャナーを検出
    const { stdout, stderr } = await execAsync("scanimage -L");
    
    if (stderr) {
      console.error('scanimage -L stderr:', stderr);
    }
    
    const scanners = [];
    
    if (stdout) {
      // scanimage -L の出力を解析
      // 例: device `pixma:MG6200_192.168.1.113' is a CANON Canon PIXMA MG6200 multi-function peripheral
      const lines = stdout.split('\n');
      for (const line of lines) {
        const deviceMatch = line.match(/device `([^']+)' is a (.+)/);
        if (deviceMatch) {
          const deviceName = deviceMatch[1];
          const description = deviceMatch[2];
          
          // デバイス名から表示用の名前を生成
          let displayName = deviceName;
          
          // pixma:MG6200_192.168.1.113 のような形式から MG6200 を抽出
          const pixmaMatch = deviceName.match(/pixma:([^_]+)/);
          if (pixmaMatch) {
            displayName = pixmaMatch[1];
          }
          
          scanners.push({
            value: deviceName,
            label: `${displayName} (${description})`,
            deviceName: deviceName,
            description: description
          });
        }
      }
    }
    
    // スキャナーが見つからない場合でも空の配列を返す
    return json({ scanners });
    
  } catch (error) {
    console.error('Error executing scanimage -L:', error);
    
    // エラーが発生した場合は空の配列を返す
    return json({ scanners: [] });
  }
};
