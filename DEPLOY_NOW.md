# 🚀 Vercelへのデプロイ - 今すぐ開始

プロジェクトのビルドは成功しました！以下の手順でVercelにデプロイできます。

## ✨ 今すぐデプロイする方法

### 方法1: Vercelダッシュボードから（推奨）

1. **GitHubにプッシュ**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Vercelでインポート**
   - [Vercel](https://vercel.com)にアクセス
   - GitHubでログイン
   - "Add New Project"をクリック
   - `hoshii`リポジトリを選択
   - "Import"をクリック

3. **環境変数を設定**（Settings > Environment Variables）
   
   以下の環境変数を追加してください：
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   RESEND_API_KEY=your-resend-api-key
   MAIL_FROM="Hoshii <noreply@yourdomain.com>"
   NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
   SECRET_BROADCAST_KEY=your-random-secret-key
   ```

4. **デプロイ！**
   - "Deploy"ボタンをクリック
   - 数分待つと完了

### 方法2: Vercel CLIから

```bash
# Vercel CLIをインストール
npm i -g vercel

# プロジェクトにログイン
vercel login

# デプロイ
vercel --prod
```

## ✅ デプロイ前に確認

- [x] ビルドが成功する（`npm run build`）
- [ ] 環境変数が準備できている
- [ ] Supabaseプロジェクトが作成されている
- [ ] Resendアカウントが作成されている

## 📚 詳細な手順

詳細は `VERCEL_DEPLOYMENT_GUIDE.md` を参照してください。

## 🎯 デプロイ後のチェックリスト

- [ ] ホームページが表示される
- [ ] ログインページが動作する
- [ ] ユーザー登録が動作する
- [ ] LEAP DAYページが表示される
- [ ] Supabaseとの接続が正常

## 🆘 トラブルシューティング

### ビルドエラーが出る場合
```bash
npm run build
```
でローカルでエラーを確認

### 環境変数エラーが出る場合
Vercelダッシュボードの Settings > Environment Variables で確認

### Supabase接続エラー
`.env.local`の設定を確認し、Vercelにも同様に設定

---

**準備完了！デプロイしましょう 🚀**

