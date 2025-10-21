# LEAP DAY Microsite

LEAP DAY（閏日）の特別な一日を祝うミニサイトです。ユーザーがアクションを選択して参加することで、星空に星を灯すことができます。

## 機能

### 📱 ページ
- **`/leapday`** - メインページ（星空表示、星カウンター）
- **`/leapday/support`** - 応援フォーム（名前/メール/アクション選択/コメント）
- **`/leapday/dev/seed`** - 開発用データシードページ

### 🔌 API エンドポイント
- **`POST /api/leapday/star`** - 参加データを送信
- **`GET /api/leapday/stats`** - 参加者数の統計を取得
- **`GET /api/leapday/sky`** - 参加者数に基づく星空画像を生成
- **`POST /api/leapday/dev/seed`** - 開発用データシード

### 📊 データモデル

#### `leapday_actions`
- `id` (UUID) - 主キー
- `key` (TEXT) - アクション識別子（ユニーク）
- `label` (TEXT) - アクション表示名
- `phase` (TEXT) - フェーズ（'before' | 'day'）
- `created_at` (TIMESTAMP)

#### `leapday_participations`
- `id` (UUID) - 主キー
- `name` (TEXT) - 参加者名
- `email` (TEXT) - メールアドレス
- `action_key` (TEXT) - 選択されたアクション
- `comment` (TEXT) - コメント（任意）
- `created_at` (TIMESTAMP)

## セットアップ

### 1. 環境変数の設定
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. データベースのセットアップ
```sql
-- migrations/004_leapday_schema.sql を実行
```
このマイグレーションは以下を作成します：
- `leapday_actions` テーブル（アクション定義）
- `leapday_participations` テーブル（参加データ）
- Row Level Security (RLS) ポリシー（公開読み取り、匿名挿入許可）

### 3. データのシード
1. `/leapday/dev/seed` にアクセス
2. 「データをシードする」ボタンをクリック

## 使用方法

### 基本的な流れ
1. `/leapday` でメインページを表示
2. `/leapday/support` で応援フォームを表示
3. ユーザーが名前、メール、アクション、コメントを入力
4. 送信すると参加データが記録され、星カウンターが更新
5. 星空画像が参加者数に応じて更新

### アクション一覧
- **事前アクション**
  - `support_message`: LEAP DAYを応援する、コメントを送る
- **当日アクション**
  - `exchange_cards`: 隣の人と名刺交換する
  - `be_kind`: 優しい気持ちでいる
  - `pick_trash`: ゴミを拾う

## 技術仕様

### フロントエンド
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **SWR** (データフェッチング)
- **React Hook Form** (フォーム管理)

### バックエンド
- **Supabase** (データベース)
- **Server Actions** (データ操作)
- **API Routes** (エンドポイント)

### コンポーネント
- `StarCounter` - リアルタイム星カウンター
- `StarImage` - 動的星空画像
- `ActionList` - アクション選択リスト
- `SupportForm` - 応援フォーム

## 開発

### ローカル開発
```bash
npm run dev
```

### テスト
1. `/leapday/dev/seed` でデータをシード
2. `/leapday` でメインページを確認
3. `/leapday/support` でフォームをテスト
4. 送信後、星カウンターと星空画像の更新を確認

### デバッグ
- ブラウザの開発者ツールでコンソールログを確認
- Supabaseダッシュボードでデータベースの状態を確認
- API エンドポイントを直接テスト

## カスタマイズ

### 星空画像の調整
`/api/leapday/sky/route.ts` で以下を調整可能：
- 星の数: `Math.min(300, Math.floor(20 + total * 0.5))`
- 画像サイズ: `width="800" height="600"`
- 星の色やサイズ

### アクションの追加
`data/leapday_actions_seed.ts` に新しいアクションを追加：
```typescript
{
  key: 'new_action',
  label: '新しいアクション',
  phase: 'day' // または 'before'
}
```

### スタイリングの変更
Tailwind CSSクラスを使用してデザインを調整可能。

## トラブルシューティング

### よくある問題

1. **星空画像が表示されない**
   - API エンドポイントが正常に動作しているか確認
   - 画像のフォールバック処理を確認

2. **フォーム送信が失敗する**
   - 必須フィールドが入力されているか確認
   - API エンドポイントのエラーログを確認

3. **星カウンターが更新されない**
   - SWRの設定を確認
   - API レスポンスが正常か確認

4. **データベースエラー**
   - Supabaseの接続設定を確認
   - RLSポリシーが正しく設定されているか確認

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
