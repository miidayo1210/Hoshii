# ✅ Vercel デプロイ前チェックリスト

HoshiiプロジェクトをVercelにデプロイする前に確認するチェックリストです。

## 📋 前提条件

### ✅ アカウント準備

- [ ] GitHubアカウント
  - リポジトリURL: `https://github.com/your-username/hoshii`
  - コードがプッシュされている

- [ ] Vercelアカウント
  - URL: https://vercel.com
  - GitHubアカウントと連携済み

- [ ] Supabaseプロジェクト
  - プロジェクト作成済み
  - データベーススキーマ実行済み
  - APIキーを取得済み

- [ ] Resendアカウント
  - アカウント作成済み
  - APIキーを取得済み

## 🔧 環境変数の準備

### ✅ Supabase環境変数

- [ ] `NEXT_PUBLIC_SUPABASE_URL` を取得
  - 場所: Supabase Settings > API > Project URL
  - 形式: `https://xxx.supabase.co`

- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` を取得
  - 場所: Supabase Settings > API > anon public
  - 形式: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

- [ ] `SUPABASE_SERVICE_ROLE_KEY` を取得
  - 場所: Supabase Settings > API > service_role
  - ⚠️ **機密情報**: 公開しないこと

### ✅ Resend環境変数

- [ ] `RESEND_API_KEY` を取得
  - 場所: Resend Dashboard > API Keys
  - 形式: `re_xxxxx`

- [ ] `MAIL_FROM` を設定
  - 形式: `"Hoshii <noreply@yourdomain.com>"`
  - 例: `"フルヤ建商のもり <noreply@furya.com>"`

### ✅ アプリケーション環境変数

- [ ] `NEXT_PUBLIC_BASE_URL` を準備
  - 初回: `https://hoshii.vercel.app` (仮)
  - デプロイ後に実際のURLに更新

- [ ] `SECRET_BROADCAST_KEY` を生成
  - 生成方法: `openssl rand -base64 32`
  - またはランダムな文字列

## 🗄️ データベース準備

### ✅ Supabaseスキーマ実行

- [ ] `supabase/schema.sql` を実行済み
- [ ] テーブルが作成されている
  - `users`
  - `profiles`
  - `actions`
  - `events`
  - その他のテーブル

### ✅ テストデータ（必要に応じて）

- [ ] テストユーザーが作成されている
- [ ] サンプルデータが投入されている

## 🏗️ ビルド確認

### ✅ ローカルビルド

```bash
# ビルドを実行
npm run build

# エラーがないか確認
npm run lint
```

- [ ] ビルドが成功する
- [ ] TypeScriptエラーがない
- [ ] Lintエラーがない
- [ ] 警告は許容範囲内

## 🚀 Vercelデプロイ

### Step 1: プロジェクト作成

- [ ] Vercelダッシュボードにアクセス
- [ ] Add New Project をクリック
- [ ] GitHubリポジトリから `hoshii` を選択
- [ ] Import をクリック

### Step 2: 環境変数設定

- [ ] Settings → Environment Variables に移動
- [ ] 以下の環境変数を追加：

```
NEXT_PUBLIC_SUPABASE_URL = [取得した値]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [取得した値]
SUPABASE_SERVICE_ROLE_KEY = [取得した値]
RESEND_API_KEY = [取得した値]
MAIL_FROM = "Hoshii <noreply@yourdomain.com>"
NEXT_PUBLIC_BASE_URL = https://hoshii.vercel.app
SECRET_BROADCAST_KEY = [生成した値]
```

- [ ] Production に設定
- [ ] Preview に設定
- [ ] Development に設定
- [ ] Save をクリック

### Step 3: デプロイ実行

- [ ] Deploy ボタンをクリック
- [ ] ビルドログを監視
- [ ] エラーがないか確認
- [ ] デプロイURLが生成される

### Step 4: 本番URLの更新

- [ ] デプロイURLをコピー
- [ ] `NEXT_PUBLIC_BASE_URL` を更新
- [ ] Redeploy を実行

## ✅ デプロイ後チェック

### 基本動作確認

- [ ] トップページが表示される (`/`)
- [ ] ログインページが表示される (`/auth/login`)
- [ ] ユーザー登録ページが表示される (`/auth/register`)
- [ ] ホームページが表示される (`/home`)
- [ ] LEAP DAYメインページが表示される (`/leapday`)

### 認証機能確認

- [ ] 新規ユーザー登録ができる
- [ ] 既存ユーザーログインができる
- [ ] ログアウトができる
- [ ] セッション管理が正しい

### 機能確認

- [ ] メンバーページが表示される
- [ ] メール送信が動作する
- [ ] Supabaseとの接続が正常
- [ ] データの保存・取得が正常

### モバイル確認

- [ ] スマートフォンでアクセス
- [ ] レスポンシブ表示が正常
- [ ] PWAとしてインストール可能

## 📊 モニタリング設定

### Vercel Analytics

- [ ] Analyticsタブを確認
- [ ] ページビューが記録されている
- [ ] エラーがないか確認

### ログ監視

- [ ] Settings → Logs でログを確認
- [ ] エラーログがないか確認
- [ ] アプリケーションログを確認

### アラート設定

- [ ] Settings → Notifications を設定
- [ ] エラー発生時にメール通知を受け取る

## 🎯 完了！

すべてのチェック項目が完了したら、実運用環境の準備が整いました。

### 次のステップ

1. **運用監視**: Vercelダッシュボードで定期的にログを確認
2. **ユーザーフィードバック**: ユーザーからのフィードバックを収集
3. **パフォーマンス**: Analyticsでパフォーマンスを監視
4. **セキュリティ**: 定期的にセキュリティアップデートを適用

### 役立つリンク

- Vercelダッシュボード: https://vercel.com/dashboard
- Supabaseダッシュボード: https://app.supabase.com
- Resendダッシュボード: https://resend.com
- デプロイURL: https://your-app.vercel.app

---

🎉 **デプロイ成功！**

