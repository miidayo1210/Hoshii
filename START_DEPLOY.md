# 🚀 Vercel実運用デプロイ - 開始手順

このガイドに従って、HoshiiプロジェクトをVercelで実運用環境にデプロイできます。

## 📖 ドキュメント一覧

1. **[VERCEL_QUICKSTART.md](./VERCEL_QUICKSTART.md)** - 5分でデプロイする最短手順
2. **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** - 詳細なデプロイガイド
3. **[環境変数リスト.md](./環境変数リスト.md)** - 必要な環境変数の一覧
4. **[DEPLOYMENT_CHECKLIST_VERCEL.md](./DEPLOYMENT_CHECKLIST_VERCEL.md)** - デプロイ前チェックリスト

## 🎯 すぐに始める

### 最速デプロイ（CLI使用）

```bash
# 1. Vercel CLIをインストール
npm i -g vercel

# 2. ログイン
vercel login

# 3. デプロイ（初回）
vercel

# 4. 本番環境にデプロイ
vercel --prod
```

その後、Vercelダッシュボードで環境変数を設定してください。

### スクリプトを使用

```bash
# 実行権限を付与（初回のみ）
chmod +x deploy.sh

# デプロイスクリプトを実行
./deploy.sh
```

## 📋 必須の準備

### 1. Supabaseプロジェクト

- [ ] Supabaseアカウント作成
- [ ] プロジェクト作成
- [ ] スキーマ実行（`supabase/schema.sql`）
- [ ] APIキーを取得

詳細: [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)

### 2. Resendアカウント

- [ ] Resendアカウント作成
- [ ] APIキーを取得
- [ ] メール送信元アドレスを設定

### 3. 環境変数の準備

必要な環境変数:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
MAIL_FROM
NEXT_PUBLIC_BASE_URL
SECRET_BROADCAST_KEY
```

詳細: [環境変数リスト.md](./環境変数リスト.md)

## 🌐 Vercelダッシュボードでの設定

### Step 1: プロジェクト作成

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. Add New Project → `hoshii` を選択
4. Import をクリック

### Step 2: 環境変数設定

Settings → Environment Variables で以下を追加:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `MAIL_FROM`
- `NEXT_PUBLIC_BASE_URL` (後で更新)
- `SECRET_BROADCAST_KEY`

⚠️ **重要**: Production, Preview, Development すべてに設定

### Step 3: デプロイ

1. Deploy ボタンをクリック
2. ビルド完了を待機
3. デプロイURLをコピー

### Step 4: 本番URL更新

1. デプロイURLで `NEXT_PUBLIC_BASE_URL` を更新
2. Redeploy を実行

## ✅ デプロイ後確認

以下のURLにアクセスして動作確認:

- [ ] トップページ: `/`
- [ ] ログイン: `/auth/login`
- [ ] ホーム: `/home`
- [ ] LEAP DAY: `/leapday`

## 🆘 トラブルシューティング

### ビルドエラー

```bash
npm run build
npm run lint
```

### 環境変数エラー

- Vercelダッシュボードで再確認
- 環境（Production/Preview）を確認
- 再デプロイ

### Supabase接続エラー

- URL と API キーが正しいか確認
- RLSポリシーを確認
- Supabaseダッシュボードでログを確認

詳細は各ドキュメントを参照してください。

## 📞 サポート

問題が発生した場合:

1. Vercelダッシュボードのログを確認
2. Supabaseダッシュボードのログを確認
3. 各ガイドドキュメントを参照

---

🎉 **デプロイ成功！運用開始！**

