# 環境変数設定ガイド

## 📋 概要
LEAP DAYサイトを本格運用するために、SupabaseとResendの環境変数を設定する必要があります。

## 🚀 手順

### 1. Supabaseプロジェクトの作成
1. [Supabase](https://supabase.com)にアクセス
2. アカウントを作成/ログイン
3. 「New Project」をクリック
4. プロジェクト名を入力（例：`hoshii-leapday`）
5. データベースパスワードを設定
6. リージョンを選択（推奨：`ap-northeast-1` - 東京）
7. 「Create new project」をクリック

### 2. API設定の取得
1. プロジェクトダッシュボードで「Settings」→「API」をクリック
2. 以下の情報をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Resendアカウントの設定
1. [Resend](https://resend.com)にアクセス
2. アカウントを作成/ログイン
3. 「API Keys」でAPIキーを作成
4. APIキーをコピー（`re_xxxxxxxxxxxxxxxxxxxxxxxxx`）

### 4. 環境変数ファイルの作成
プロジェクトルートに`.env.local`ファイルを作成：

```bash
# ターミナルで実行
touch .env.local
```

### 5. 環境変数の設定
`.env.local`ファイルに以下を記入：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend Email Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
MAIL_FROM="LEAP DAY <noreply@yourdomain.com>"

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional: Admin broadcast key (random strong string)
SECRET_BROADCAST_KEY=your-secret-broadcast-key-here
```

**⚠️ 重要**: 各値の部分を実際の値に置き換えてください。

### 6. データベーススキーマの適用
1. Supabaseダッシュボードで「SQL Editor」をクリック
2. 「New query」をクリック
3. `migrations/004_leapday_schema.sql`の内容をコピー&ペースト
4. 「Run」をクリックして実行

### 7. 動作確認
```bash
# 開発サーバーを再起動
npm run dev
```

以下のURLにアクセスして動作確認：
- `/leapday` - メインページ
- `/leapday/support` - 応援フォーム
- `/leapday/dev/seed` - データシード

## 📧 メール送信機能

### 参加時メール
- 参加者がメールアドレスを入力すると、自動的にお礼メールが送信されます
- メールには星座カード（PNG）が添付されます
- PNG、SVG、PDF、ホームページへのリンクが含まれます

### 管理者向け一括送信
```bash
# 全参加者にPDFレポートを送信
curl -X POST "http://localhost:3000/api/leapday/admin/broadcast-report?key=YOUR_SECRET_KEY"
```

## 🔧 トラブルシューティング

### 環境変数が読み込まれない場合
1. `.env.local`ファイルがプロジェクトルートにあるか確認
2. 開発サーバーを再起動
3. ファイル名が正確か確認（`.env.local`）

### Supabase接続エラーの場合
1. URLとキーが正確か確認
2. Supabaseプロジェクトが有効か確認
3. ネットワーク接続を確認

### メール送信エラーの場合
1. `RESEND_API_KEY`が正しく設定されているか確認
2. `MAIL_FROM`の形式が正しいか確認（`"名前 <email@domain.com>"`）
3. Resendアカウントが有効か確認

### データベースエラーの場合
1. SQLマイグレーションが正常に実行されたか確認
2. RLSポリシーが正しく設定されているか確認
3. Supabaseダッシュボードでテーブルが作成されているか確認

## 📝 本番環境での設定

### Vercelデプロイの場合
1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」→「Environment Variables」をクリック
3. 以下の環境変数を追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `MAIL_FROM`
   - `NEXT_PUBLIC_BASE_URL` (本番URL)
   - `SECRET_BROADCAST_KEY` (オプション)

### その他のホスティングサービス
各サービスの環境変数設定方法に従って、上記の環境変数を設定してください。

## 🔒 セキュリティ注意事項

- `.env.local`ファイルは`.gitignore`に含まれているため、Gitにコミットされません
- 本番環境では適切な環境変数管理を行ってください
- Supabaseのanon keyは公開されても問題ありませんが、service role keyは絶対に公開しないでください
- `SECRET_BROADCAST_KEY`は推測困難な文字列に設定してください

## 📞 サポート

設定で問題が発生した場合：
1. コンソールログを確認
2. Supabaseダッシュボードでエラーログを確認
3. Resendダッシュボードでメール送信ログを確認
4. このガイドのトラブルシューティングを参照
