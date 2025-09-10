# Internal Print Service

CUPS/SANEを使ったWeb印刷・スキャンサービス

## 技術スタック
- Remix (TypeScript)
- Mantine UI
- Playwright (E2E)
- Vitest (Component Test)

## エンドポイント
- `/` : トップページ
- `/print` : ファイルアップロード→印刷
- `/scan` : スキャン画像をbase64でimg表示

## 開発
```sh
npm install
npm run dev
```

## テスト
### コンポーネントテスト
```sh
npm run test
```
### E2Eテスト
```sh
npx playwright install
npm run test:e2e
```
