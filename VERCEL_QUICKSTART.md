# 🚀 Vercel クイックデプロイガイド

このプロジェクトをVercelで実運用するための最短手順です。

## ⚡ 5分でデプロイ！

### Step 1: Vercelでプロジェクト作成 (2分)

1. [Vercel](https://vercel.com) にアクセス → サインアップ/ログイン
2. **Add New Project** をクリック
3. GitHubリポジトリから `hoshii` を選択
4. **Import** をクリック

### Step 2: 環境変数を設定 (2分)

Vercelダッシュボードで以下の環境変数を設定：

```
# Supabase設定（必須）
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend設定（必須）
RESEND_API_KEY = re_xxxxx
MAIL_FROM = "Hoshii <noreply@example.com>"

# アプリURL（必須）
NEXT_PUBLIC_BASE_URL = https://hoshii.vercel.app (後で更新)

# 秘密鍵（必須）
SECRET_BROADCAST_KEY = random-string-here
```

**設定場所**: Settings → Environment Variables

⚠️ **重要**: Production, Preview, Development すべてに設定してください

### Step 3: デプロイ実行 (1分)

1. **Deploy** ボタンをクリック
2. ビルド完了まで待機（1-3分）

✅ 完了！ https://your-app.vercel.app でアクセス可能

### Step 4: 本番URLの更新

デプロイ後、生成されたURLで `NEXT_PUBLIC_BASE_URL` を更新し、Redeployします。

## 📋 環境変数の取得方法

### Supabase設定

1. https://app.supabase.com にアクセス
2. プロジェクトを選択
3. **Settings** → **API** をクリック
4. 次の値をコピー：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`

### Resend APIキー

1. https://resend.com にアクセス
2. **API Keys** をクリック
3. 新しいAPIキーを作成
4. キーをコピー

### 秘密鍵の生成

```bash
openssl rand -base64 32
```

または、単純なランダム文字列でも構いません。

## ✅ 動作確認チェックリスト

デプロイ後、以下を確認：

- [ ] トップページが表示される
- [ ] ログインページ (`/auth/login`)
- [ ] ユーザー登録
- [ ] ホームページ (`/home`)
- [ ] LEAP DAYページ (`/leapday`)

## 🆘 トラブルシューティング

### ビルドエラー

```bash
# ローカルで確認
npm run build
```

### 環境変数エラー

- すべての環境変数が設定されているか確認
- 値を再確認（余分なスペースがないか）

### Supabase接続エラー

- `NEXT_PUBLIC_SUPABASE_URL` が正しいか確認
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しいか確認

## 📖 詳細な手順

より詳細な手順が必要な場合は、以下を参照：

- [DEPLOY_NOW.md](./DEPLOY_NOW.md) - 完全なデプロイガイド
- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - 詳細な手順
- [README.md](./README.md) - プロジェクト概要

## 🎉 完了！

これで実運用環境が整いました。

**運用開始**:
- URL: https://your-app.vercel.app
- 管理: https://vercel.com/dashboard
- ログ: ダッシュボード → Settings → Logs

---

🙋‍♂️ **サポート**: 問題が発生した場合は、Vercelダッシュボードのログを確認してください。

