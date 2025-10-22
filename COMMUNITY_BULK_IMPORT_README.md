# Hoshii for Community - プリセットアクションカード一括インポート機能

## 概要

Hoshii for Communityプラットフォームに、プリセットのアクションカードを一括でインポートする機能を実装しました。

## 機能詳細

### 🎯 主な機能
- **プリセットアクションカードの一括登録**: 16種類の環境・社会貢献・日常行動に関するアクションカードを自動登録
- **重複回避**: 既存のアクションカードと重複する場合は更新処理
- **自動コミュニティ作成**: 「Hoshii スターター」コミュニティを自動作成
- **タグ自動解析**: `#環境 #エコ #日常` 形式のタグを自動解析

### 📋 登録されるアクションカード
1. 🌱 マイボトルを持ち歩こう
2. 🛍 コンビニで袋を断る
3. 🚯 ごみを一つ拾う
4. 💚 寄付をしてみる
5. ✉ 誰かに「ありがとう」を伝える
6. 🌸 SNSで応援メッセージを投稿する
7. ☕ いつものお店に「ごちそうさま」を言う
8. 🚴 自転車で出かけよう
9. 🌼 花を一輪、育ててみよう
10. 🕊 落ちているペットボトルをリサイクルへ
11. 💬 「がんばってるね」を伝える
12. 📚 本を一冊、友だちにすすめる
13. 🍀 自分をほめる
14. 🏠 家の前を掃く
15. 👂 誰かの話を最後まで聞く
16. 🌏 地元の野菜を買う

## ファイル構成

```
├── data/community_actions_seed.ts          # プリセットデータ定義
├── server/community/bulkImport.ts          # 一括インポート処理（Server Action）
├── app/community/dev/import/page.tsx       # 開発ツールUI
├── app/api/community/dev/import/run/route.ts # API エンドポイント
└── lib/supabaseServer.ts                   # Supabaseサーバー接続ヘルパー
```

## 使用方法

### 1. 開発ツールページにアクセス
- URL: `http://localhost:3000/community/dev/import`
- サイドバーの「開発ツール」からもアクセス可能

### 2. 一括登録の実行
1. 「一括登録を実行する」ボタンをクリック
2. 処理結果がJSON形式で表示される

### 3. 処理結果の確認
```json
{
  "ok": true,
  "created": 16,    // 新規作成されたアクションカード数
  "updated": 0,     // 更新されたアクションカード数
  "skipped": 0      // スキップされたアクションカード数
}
```

## 技術仕様

### データベーススキーマ
```sql
-- communities テーブル
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  desc TEXT,
  cover_url TEXT,
  creator_id UUID,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- actions テーブル
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  desc TEXT,
  image_url TEXT,
  tags TEXT[],
  community_id UUID REFERENCES communities(id),
  stars_count INTEGER DEFAULT 0,
  creator_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 環境変数
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## セキュリティ

- **認証必須**: ログインユーザーのみがインポートを実行可能
- **重複回避**: タイトルベースで重複チェックを実装
- **エラーハンドリング**: 適切なエラーメッセージとログ出力

## 今後の拡張予定

- [ ] カスタムアクションカードのインポート機能
- [ ] CSV/Excelファイルからの一括インポート
- [ ] アクションカードの一括削除機能
- [ ] インポート履歴の管理
- [ ] カテゴリ別のプリセットパック

## トラブルシューティング

### よくあるエラー

1. **「ログインが必要です」エラー**
   - Supabaseの認証設定を確認
   - ユーザーがログインしていることを確認

2. **「insert error」エラー**
   - データベースのテーブル構造を確認
   - 必要なカラムが存在することを確認

3. **API エンドポイントが見つからない**
   - ファイルパスが正しいことを確認
   - Next.jsの開発サーバーが起動していることを確認

## 開発者向け情報

### 新しいプリセットアクションの追加
`data/community_actions_seed.ts` の `COMMUNITY_ACTIONS_SEED` 配列に新しいアクションを追加：

```typescript
{
  title: "🎯 新しいアクション",
  desc: "アクションの説明",
  tagsRaw: "#タグ1 #タグ2 #タグ3"
}
```

### カスタマイズポイント
- **コミュニティ名**: `server/community/bulkImport.ts` の `ensureSeedCommunity` 関数
- **タグ解析ロジック**: `parseTags` 関数
- **重複チェック**: タイトルベースの重複回避ロジック





