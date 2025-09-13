import type { ActionFunctionArgs } from "@remix-run/node";
import { exec } from "child_process";
import { readFile, unlink } from "fs/promises";
import path from "path";

export const action = async (_: ActionFunctionArgs) => {
  const tmpPath = path.join("/tmp", `scan_${Date.now()}.png`);
  return new Promise((resolve) => {
    exec(`scanimage --device-name MG6200 --format=png --resolution 100 > '${tmpPath}'`, async (err) => {
      if (err) {
        console.error('scanimage error:', err);
        resolve(new Response("スキャンに失敗しました", { status: 500 }));
        return;
      }
      try {
        const img = await readFile(tmpPath);
        await unlink(tmpPath);
        resolve(new Response(new Uint8Array(img), {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Content-Length': img.length.toString(),
          },
        }));
      } catch (e) {
        console.error('file read/unlink error:', e);
        resolve(new Response("ファイル処理に失敗しました", { status: 500 }));
      }
    });
  });
};
