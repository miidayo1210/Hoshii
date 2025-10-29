# Vercel デプロイメントガイド

HoshiiプロジェクトをVercelで実運用環境にデプロイするための完全ガイドです。

## 📋 前提条件

- GitHubリポジトリにコードがプッシュされていること
- Supabaseプロジェクトが作成されていること
- Resendアカウントが作成されていること

## 🚀 デプロイ手順

### 1. Vercelアカウントの作成

1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでサインアップ/ログイン
3. 「Add New Project」をクリック

### 2. プロジェクトのインポート

1. GitHubリポジトリから`hoshii`を選択
2. 「Import」をクリック
3. フレームワークは自動検出されます（Next.js）

### 3. 環境変数の設定

プロジェクトの設定画面で以下の環境変数を追加してください：

#### 必須環境変数

| 変数名 | 説明 | 取得場所 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseのURL | Supabase Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名キー | Supabase Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseサービスロールキー | Supabase Settings > API |
| `RESEND_API_KEY` | Resend APIキー | Resend Dashboard > API Keys |
| `MAIL_FROM` | 送信元メールアドレス | `"Hoshii <noreply@yourdomain.com>"` |
| `NEXT_PUBLIC_BASE_URL` | 本番URL | デプロイ後のURL（例: `https://hoshii.vercel.app`） |
| `SECRET_BROADCAST_KEY` | 管理者用秘密鍵 | 任意のランダム文字列 |

### 4. 環境変数の設定方法

1. Vercelダッシュボードで「Settings」→「Environment Variables」をクリック
2. 各環境変数を追加（Production, Preview, Developmentすべてで設定）
3. 「Save」をクリック

### 5. デプロイの実行

1. 「Deploy」ボタンをクリック
2. ビルドが自動的に開始されます
3. 完了まで待機（通常1-3分）

### 6. デプロイ後の確認

#### ✅ 動作確認チェックリスト

- [ ] ホームページが正しく表示される
- [ ] ログイン機能が動作する（`/auth/login`）
- [ ] ユーザー登録が動作する（`/auth/register`）
- [ ] LEAP DAYメインページが表示される（`/leapday`）
- [ ] メンバーページが表示される（`/leapday/member/[slug]`）
- [ ] メール送信機能が動作する
- [ ] Supabaseとの接続が正常

#### 🔧 本番URLの更新

デプロイ後、以下のコマンドでBase URLを更新します：

```bash
# Vercel CLIでインストール済みの場合
vercel env add NEXT_PUBLIC_BASE_URL production

# またはVercelダッシュボードから更新
# Settings > Environment Variables > NEXT_PUBLIC_BASE_URLを編集
```

### 7. カスタムドメインの設定（オプション）

1. 「Settings」→「Domains」をクリック
2. カスタムドメインを追加（例: `hoshii.jp`）
3. DNS設定を指示に従って更新
4. SSL証明書は自動で発行されます

## 📦 継続的デプロイ

### 自動デプロイの設定

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

## 🔒 セキュリティチェックリスト

- [x] `.env.local`ファイルは`.gitignore`に含まれている
- [x] 本番環境の環境変数は正しく設定されている
- [x] SupabaseのRLSポリシーが有効化されている
- [x] 機密情報（Service Role Key）はクライアント側に露出していない
- [x] HTTPSが有効化されている（自動）

## 🌍 環境別設定

### Production（本番環境）

```env
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
```

### Preview（プレビュー環境）

```env
NEXT_PUBLIC_BASE_URL=https://your-preview-url.vercel.app
```

### Development（開発環境）

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🐛 トラブルシューティング

### ビルドエラーの解決

```bash
# ローカルでビルドしてエラーを確認
npm run build

# TypeScriptエラーの確認
npm run lint
```

### 環境変数が読み込まれない

1. Vercelダッシュボードで環境変数が設定されているか確認
2. 本番環境を選択しているか確認
3. 再デプロイを実行

### Supabase接続エラー

1. `NEXT_PUBLIC_SUPABASE_URL`が正しいか確認
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`が正しいか確認
3. Supabaseプロジェクトが有効か確認
4. RLSポリシーが適切に設定されているか確認

### メール送信エラー

1. `RESEND_API_KEY`が正しく設定されているか確認
2. `MAIL_FROM`の形式が正しいか確認（`"名前 <email@domain.com>"`）
3. Resendダッシュボードでメール送信ログを確認

## 📊 モニタリング

### Vercel Analytics

1. Vercelダッシュボードで「Analytics」タブを確認
2. ビューやエラーをリアルタイムで監視

### Logsの確認

```bash
# Vercel CLIでログを確認
vercel logs [deployment-url]
```

## 🔄 ロールバック

問題が発生した場合：

1. Vercelダッシュボードで「Deployments」をクリック
2. 正常に動作していたデプロイを選択
3. 三点メニューから「Promote to Production」をクリック

## 📝 デプロイメントチェックリスト

デプロイ前：
- [ ] すべての環境変数が設定されている
- [ ] データベースマイグレーションが完了している
- [ ] ローカルで`npm run build`が成功する
- [ ] Gitにコミットされている

デプロイ後：
- [ ] ホームページが表示される
- [ ] 認証機能が動作する
- [ ] メール送信が動作する
- [ ] Supabaseとの接続が正常
- [ ] モバイル表示が正常

## 🎉 完了

デプロイが完了したら、以下を確認してください：

1. **URL**: https://your-project.vercel.app
2. **ステータス**: Vercelダッシュボードで確認
3. **機能テスト**: 主要機能の動作確認

## 📞 サポート

問題が発生した場合：
1. Vercelのログを確認
2. Supabaseダッシュボードでエラーログを確認
3. [Vercel Documentation](https://vercel.com/docs)を参照

---

**🎯 実運用準備完了！**
良い製品運用を！

