#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * マイグレーション実行スクリプト
 * 使用方法: node scripts/run-migration.js [migration-file]
 */

function main() {
  const migrationFile = process.argv[2];
  
  if (!migrationFile) {
    console.error('使用方法: node scripts/run-migration.js <migration-file>');
    console.error('例: node scripts/run-migration.js migrations/001_add_community_features.sql');
    process.exit(1);
  }

  const migrationPath = path.resolve(migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`マイグレーションファイルが見つかりません: ${migrationPath}`);
    process.exit(1);
  }

  console.log(`マイグレーション実行中: ${migrationPath}`);
  
  try {
    // Supabase CLIを使用してマイグレーションを実行
    // 注意: 実際のデータベース接続情報に応じて調整してください
    const command = `supabase db reset --db-url "your-database-url" --file "${migrationPath}"`;
    
    console.log('実行コマンド:', command);
    console.log('⚠️  実際に実行する前に、データベースURLを設定してください');
    
    // 実際の実行は以下のコマンドをアンコメントしてください
    // execSync(command, { stdio: 'inherit' });
    
    console.log('✅ マイグレーション準備完了');
    console.log('実際の実行には、データベース接続情報を設定してからコマンドのコメントアウトを外してください');
    
  } catch (error) {
    console.error('マイグレーション実行エラー:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
