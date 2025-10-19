# データベースマイグレーションガイド

## 概要

このプロジェクトでは、コミュニティモジュール機能の追加のためのデータベースマイグレーションが含まれています。

## マイグレーション内容

### 001_add_community_features.sql

以下の変更を含みます：

1. **organizationsテーブル**
   - `product`列を追加（`business` | `community`）
   - デフォルト値: `business`

2. **eventsテーブル**
   - `public_id`列を追加（公開用のユニークID）
   - 既存データには自動的にランダムなIDが設定されます

3. **公開スキャンRPC関数**
   - `add_action_and_star()`関数を追加
   - 匿名ユーザーでも実行可能

## 実行方法

### 1. 準備

データベース接続情報を確認してください：
- データベースURL
- 認証情報

### 2. マイグレーション実行

```bash
# コミュニティ機能のマイグレーションを実行
npm run migrate:community

# または、特定のマイグレーションファイルを指定
npm run migrate migrations/001_add_community_features.sql
```

### 3. 手動実行（psql使用の場合）

```bash
# PostgreSQLクライアントで直接実行
psql -d your_database -f migrations/001_add_community_features.sql
```

## 注意事項

- 本番環境で実行する前に、必ずバックアップを取ってください
- マイグレーション実行前に、既存データの整合性を確認してください
- `add_action_and_star`関数は匿名ユーザーでも実行可能なため、セキュリティに注意してください

## ロールバック

必要に応じて、以下のSQLでロールバックできます：

```sql
-- 関数を削除
DROP FUNCTION IF EXISTS public.add_action_and_star(text,text,int,jsonb);

-- 列を削除（データは失われます）
ALTER TABLE public.events DROP COLUMN IF EXISTS public_id;
ALTER TABLE public.organizations DROP COLUMN IF EXISTS product;
```

## トラブルシューティング

### よくあるエラー

1. **権限エラー**: データベースユーザーに適切な権限があるか確認
2. **制約エラー**: 既存データが新しい制約に違反していないか確認
3. **重複エラー**: `public_id`が重複していないか確認

### ログ確認

マイグレーション実行後は、以下を確認してください：
- エラーログ
- テーブル構造の変更
- 関数の作成状況
