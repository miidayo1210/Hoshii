# Supabase設定手順

## 1. Supabaseプロジェクトの作成

1. [https://supabase.com](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでログイン
4. 「New Project」をクリック
5. プロジェクト名を入力（例：`hoshii-platform`）
6. データベースパスワードを設定
7. リージョンを選択（Asia Northeast (Tokyo) 推奨）
8. 「Create new project」をクリック

## 2. 環境変数の取得

1. プロジェクトダッシュボードで「Settings」→「API」をクリック
2. 以下の値をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 4. データベーススキーマの実行

1. Supabaseダッシュボードで「SQL Editor」をクリック
2. `supabase/schema.sql` の内容をコピー&ペースト
3. 「Run」をクリックしてスキーマを実行

## 5. 認証設定

1. 「Authentication」→「Settings」をクリック
2. 「Site URL」に `http://localhost:3000` を設定
3. 「Redirect URLs」に以下を追加：
   - `http://localhost:3000/auth/login`
   - `http://localhost:3000/skies`

## 6. 動作確認

1. 開発サーバーを再起動：
   ```bash
   npm run dev
   ```

2. 以下のページをテスト：
   - `http://localhost:3000` - トップページ
   - `http://localhost:3000/auth/login` - ログイン/新規登録
   - `http://localhost:3000/skies` - 星空一覧（ログイン後）
   - `http://localhost:3000/leapday` - Leapday（ログイン後）

## トラブルシューティング

### エラー: "supabaseUrl is required"
- `.env.local` ファイルが正しく作成されているか確認
- 環境変数の値が正しいか確認
- 開発サーバーを再起動

### 認証が動作しない
- Supabaseの認証設定を確認
- Site URLとRedirect URLsが正しく設定されているか確認

### データベースエラー
- `supabase/schema.sql` が正しく実行されているか確認
- Supabaseのログを確認



## 1. Supabaseプロジェクトの作成

1. [https://supabase.com](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでログイン
4. 「New Project」をクリック
5. プロジェクト名を入力（例：`hoshii-platform`）
6. データベースパスワードを設定
7. リージョンを選択（Asia Northeast (Tokyo) 推奨）
8. 「Create new project」をクリック

## 2. 環境変数の取得

1. プロジェクトダッシュボードで「Settings」→「API」をクリック
2. 以下の値をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 4. データベーススキーマの実行

1. Supabaseダッシュボードで「SQL Editor」をクリック
2. `supabase/schema.sql` の内容をコピー&ペースト
3. 「Run」をクリックしてスキーマを実行

## 5. 認証設定

1. 「Authentication」→「Settings」をクリック
2. 「Site URL」に `http://localhost:3000` を設定
3. 「Redirect URLs」に以下を追加：
   - `http://localhost:3000/auth/login`
   - `http://localhost:3000/skies`

## 6. 動作確認

1. 開発サーバーを再起動：
   ```bash
   npm run dev
   ```

2. 以下のページをテスト：
   - `http://localhost:3000` - トップページ
   - `http://localhost:3000/auth/login` - ログイン/新規登録
   - `http://localhost:3000/skies` - 星空一覧（ログイン後）
   - `http://localhost:3000/leapday` - Leapday（ログイン後）

## トラブルシューティング

### エラー: "supabaseUrl is required"
- `.env.local` ファイルが正しく作成されているか確認
- 環境変数の値が正しいか確認
- 開発サーバーを再起動

### 認証が動作しない
- Supabaseの認証設定を確認
- Site URLとRedirect URLsが正しく設定されているか確認

### データベースエラー
- `supabase/schema.sql` が正しく実行されているか確認
- Supabaseのログを確認


