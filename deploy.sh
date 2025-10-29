#!/bin/bash

# Hoshii Project - Vercel Deployment Script
# このスクリプトは Vercel CLI を使用してデプロイを実行します

set -e

echo "🚀 Hoshii Project - Vercel Deployment"
echo "======================================="
echo ""

# カラーバインド
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# チェック関数
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 がインストールされていません${NC}"
        echo "インストール方法: $2"
        exit 1
    fi
}

# 前提条件チェック
echo "📋 前提条件をチェック中..."
echo ""

check_command "node" "https://nodejs.org/ からインストール"
check_command "npm" "https://nodejs.org/ からインストール"

echo -e "${GREEN}✅ 前提条件OK${NC}"
echo ""

# ビルド確認
echo "🔨 ローカルビルドを実行中..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ ビルド成功${NC}"
else
    echo -e "${RED}❌ ビルドエラー${NC}"
    exit 1
fi

echo ""

# Vercel CLIの確認
echo "📦 Vercel CLIをチェック中..."
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLIがインストールされていません。インストールしますか? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        npm install -g vercel
    else
        echo "Vercel CLIが必要です。手動でインストールしてください: npm i -g vercel"
        exit 1
    fi
fi

echo ""

# デプロイの実行
echo "🚀 Vercelにデプロイしますか? (y/n)"
read -r response

if [ "$response" != "y" ]; then
    echo "デプロイをキャンセルしました"
    exit 0
fi

echo ""
echo "デプロイ環境を選択してください:"
echo "1) Production (本番環境)"
echo "2) Preview (プレビュー環境)"
echo "3) Cancel"
read -r env_choice

case $env_choice in
    1)
        echo "本番環境にデプロイします..."
        vercel --prod
        ;;
    2)
        echo "プレビュー環境にデプロイします..."
        vercel
        ;;
    *)
        echo "デプロイをキャンセルしました"
        exit 0
        ;;
esac

echo ""
echo -e "${GREEN}✅ デプロイ完了！${NC}"
echo ""
echo "次のステップ:"
echo "1. Vercelダッシュボードで環境変数を設定"
echo "2. デプロイURLを確認"
echo "3. 動作テストを実行"
echo ""
echo "詳細は DEPLOY_NOW.md を参照してください"

