# 🚀 Vercel実運用デプロイガイド

このプロジェクトをVercelで実運用するための完全な手順です。

## 📋 事前準備チェックリスト

### ✅ 必須アカウント
- [ ] GitHub アカウント（コードがプッシュ済み）
- [ ] Vercel アカウント（https://vercel.com）
- [ ] Supabase プロジェクト作成済み
- [ ] Resend アカウント作成済み

### ✅ データベース準備
- [ ] Supabaseにデータベーススキーマを実行済み
- [ ] テーブルが作成されている

## 🔑 Step 1: 環境変数の準備

### 1-1. Supabaseの設定情報を取得

1. [Supabase Dashboard](https://app.supabase.com) にアクセス
2. プロジェクトを選択
3. **Settings** → **API** をクリック
4. 以下の値をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ 機密情報

### 1-2. ResendのAPIキーを取得

1. [Resend Dashboard](https://resend.com) にアクセス
2. **API Keys** をクリック
3. 新しいAPIキーを作成
4. キーをコピー（表示されないので注意）

### 1-3. メール送信元アドレスの設定

`MAIL_FROM` には以下の形式で設定：
```
Hoshii <noreply@yourdomain.com>
```

または：
```
フルヤ建商のもり <noreply@furya.com>
```

### 1-4. 秘密鍵の生成

管理機能用の秘密鍵を生成：

```bash
openssl rand -base64 32
```

または単純なランダム文字列でも可能。

## 🚀 Step 2: Vercelにデプロイ

### 2-1. Vercelプロジェクトの作成

1. [Vercel](https://vercel.com) にアクセス
2. GitHubアカウントでサインアップ/ログイン
3. **Add New Project** をクリック
4. GitHubリポジトリから `hoshii` を選択
5. **Import** をクリック

### 2-2. 環境変数の設定

1. プロジェクト設定画面で、以下の環境変数を追加：

```
NEXT_PUBLIC_SUPABASE_URL = (Supabase URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY = (Supabase Anon Key)
SUPABASE_SERVICE_ROLE_KEY = (Supabase Service Role Key)
RESEND_API_KEY = (Resend API Key)
MAIL_FROM = "Hoshii <noreply@yourdomain.com>"
NEXT_PUBLIC_BASE_URL = https://hoshii.vercel.app (後で更新)
SECRET_BROADCAST_KEY = (生成した秘密鍵)
```

2. 各環境変数を **Production**, **Preview**, **Development** すべてに設定
3. **Save** をクリック

⚠️ **重要**: 
- `SUPABASE_SERVICE_ROLE_KEY` は機密情報です。公開しないでください
- Vercel上で設定するので、`.env.local`ファイルは不要

### 2-3. デプロイ実行

1. **Deploy** ボタンをクリック
2. ビルドが完了するまで待機（1-3分）
3. デプロイURLが表示される

### 2-4. 本番URLの更新

デプロイ後、生成されたURLに合わせて `NEXT_PUBLIC_BASE_URL` を更新：

1. Vercelダッシュボードで **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_BASE_URL` をクリック
3. 実際のデプロイURLに変更（例: `https://hoshii-abc123.vercel.app`）
4. **Save**
5. **Redeploy** をクリック

## ✅ Step 3: 動作確認

### 3-1. 基本動作チェック

以下を順番に確認：

- [ ] トップページが表示される
- [ ] ログインページが表示される（`/auth/login`）
- [ ] ユーザー登録が動作する
- [ ] ホームページが表示される（`/home`）
- [ ] LEAP DAYメインページが表示される（`/leapday`）

### 3-2. 機能テスト

- [ ] メンバーページが表示される（`/leapday/member/[slug]`）
- [ ] メール送信機能が動作する
- [ ] Supabaseとの接続が正常
- [ ] データの保存・取得が正常に動作

### 3-3. モバイル確認

- [ ] スマートフォンでアクセス
- [ ] レスポンシブ表示が正常
- [ ] PWAとしてインストール可能

## 🌐 Step 4: カスタムドメイン設定（オプション）

### 4-1. ドメインの追加

1. Vercelダッシュボードで **Settings** → **Domains**
2. カスタムドメインを追加（例: `hoshii.jp`）
3. DNSの設定指示に従う

### 4-2. DNS設定の例

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com.

Type: A
Name: @
Value: 76.76.21.21
```

### 4-3. SSL証明書

- 自動で発行されます
- 証明書の発行には数分〜数時間かかる場合があります

## 🔄 Step 5: 継続的デプロイ設定

### 自動デプロイ

- **Production**: `main`ブランチへのマージで自動デプロイ
- **Preview**: プルリクエストごとに自動プレビュー作成

### 手動デプロイ

```bash
# Vercel CLIのインストール
npm i -g vercel

# プロジェクトにログイン
vercel login

# プロジェクトをリンク
vercel link

# 本番環境にデプロイ
vercel --prod
```

## 📊 Step 6: モニタリング設定

### 6-1. Vercel Analytics

1. Vercelダッシュボードで **Analytics** タブを確認
2. ビューやエラーをリアルタイムで監視

### 6-2. ログの確認

```bash
# Vercel CLIでログを確認
vercel logs [deployment-url]
```

### 6-3. エラーアラート

1. **Settings** → **Notifications** を設定
2. エラーが発生したときにメール通知を受け取る

## 🔧 Step 7: トラブルシューティング

### ビルドエラー

```bash
# ローカルで確認
npm run build

# TypeScriptエラーの確認
npm run lint
```

### 環境変数エラー

- すべての環境変数が設定されているか確認
- 値をコピー&ペーストした際の余分なスペースを削除
- 再デプロイを実行

### Supabase接続エラー

1. `NEXT_PUBLIC_SUPABASE_URL` が正しいか確認
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しいか確認
3. Supabaseプロジェクトが有効か確認
4. RLSポリシーが適切に設定されているか確認

### メール送信エラー

1. `RESEND_API_KEY` が正しく設定されているか確認
2. `MAIL_FROM` の形式が正しいか確認（`"名前 <email@domain.com>"`）
3. Resendダッシュボードで送信ログを確認

## 🎯 完了！

これで実運用環境が整いました。

**運用中のチェックポイント**:
- 定期的にログを確認
- ユーザーからのフィードバックを収集
- パフォーマンスを監視
- セキュリティアップデートを適用

**デプロイURL**: https://your-app.vercel.app

**管理ページ**: https://vercel.com/dashboard

---

🙋‍♂️ **サポート**: 問題が発生した場合は、VercelのログとSupabaseのログを確認してください。
