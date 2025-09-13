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
### ローカル環境
```sh
npm install
npm run dev
```

### Docker環境
Docker環境での開発も可能です。ホットリロード機能付きで開発サーバーが起動します。

```sh
# 開発環境の起動（フォアグラウンド）
npm run docker:dev

# 開発環境の起動（バックグラウンド）
npm run docker:dev:daemon

# 本番環境の起動
npm run docker:prod

# コンテナの停止
npm run docker:stop

# コンテナとボリュームの完全削除
npm run docker:clean
```

**アクセス方法:**
- 開発環境: http://localhost:5173
- 本番環境: http://localhost:3000

**Docker環境の特徴:**
- ホットリロード機能により、ソースコードの変更が即座に反映されます
- Node.jsやnpmの環境構築が不要です
- ポートフォワーディングにより、ローカル環境と同様にアクセスできます

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
