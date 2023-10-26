# honey-island-bot
[ハニーアイランド10000問](https://wandsbox125.web.app/puzzle-tools/hex-editor/10000.html?id=1)を解くためのLINE botです。スプレッドシートをDBとして使用しています。
URLを組み立てて返すのみであり、LINE botが上記サイトにリクエストを飛ばすことはありません。

## 準備
- LINEのコンソールからbotを作成・Messaging APIを有効化
- Google Apps Scriptプロジェクトを作成
- スプレッドシートを作成し、A列の1行目から順に1~10000までの数字を記載。シートIDをGoogle Apps Script側に記録。
- GCPと連携してログ・エラーを取得する (optional)

### 開発
- `npm install`
- ファイルを編集したら `clasp push` でGASに送信
- GASコンソール上でデプロイ
- LINEコンソールでWebhook URLを更新
