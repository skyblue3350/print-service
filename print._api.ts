import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { exec } from "child_process";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return json({ message: "ファイルが選択されていません" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const tmpPath = path.join("/tmp", file.name);
  await writeFile(tmpPath, buffer);
  return new Promise((resolve) => {
    exec(`lp '${tmpPath}'`, async (err) => {
      await unlink(tmpPath);
      if (err) {
        resolve(json({ message: "印刷に失敗しました" }, { status: 500 }));
      } else {
        resolve(json({ message: "印刷を開始しました" }));
      }
    });
  });
};
