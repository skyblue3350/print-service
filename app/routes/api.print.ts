import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { exec } from "child_process";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const printer = formData.get("printer") as string;
    
    if (!file || typeof file === "string") {
      console.error('No file provided or file is string');
      return json({ message: "ファイルが選択されていません" }, { status: 400 });
    }

    if (!printer) {
      console.error('No printer specified');
      return json({ message: "プリンターが指定されていません" }, { status: 400 });
    }
    
    console.log('Print request received for file:', file.name, 'printer:', printer);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const tmpPath = path.join("/tmp", `print_${Date.now()}_${file.name}`);
    
    await writeFile(tmpPath, buffer);
    console.log('File written to:', tmpPath);
    
    return new Promise((resolve) => {
      // 指定されたプリンターで印刷
      exec(`lp -d '${printer}' '${tmpPath}'`, async (err) => {
        try {
          await unlink(tmpPath);
          console.log('Temp file cleaned up:', tmpPath);
        } catch (unlinkErr) {
          console.error('Failed to cleanup temp file:', unlinkErr);
        }
        
        if (err) {
          console.error('Print command error:', err);
          resolve(json({ message: "印刷に失敗しました" }, { status: 500 }));
        } else {
          console.log('Print job submitted successfully to printer:', printer);
          resolve(json({ message: `プリンター「${printer}」で印刷を開始しました` }));
        }
      });
    });
  } catch (e) {
    console.error('Print API error:', e);
    return json({ message: "ファイル処理に失敗しました" }, { status: 500 });
  }
};
