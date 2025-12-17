# Private OCR to Markdown

完全ローカル処理のOCR to Markdown変換アプリケーション

## 特徴

- **完全プライベート**: ファイルやOCR結果を外部サーバーに送信しません
- **高速**: ブラウザ内で完結（インストール不要）
- **使えるMarkdown**: 見出し、箇条書き、表、コードブロックを自動整形
- **テンプレート対応**: 議事録、論文、請求書などの用途別出力形式

## 技術スタック

- **Framework**: Next.js 14+ (App Router)
- **OCR Engine**: Tesseract.js
- **PDF Library**: pdf.js
- **State Management**: Zustand
- **UI/Design**: Tailwind CSS + shadcn/ui

## 開発環境

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## ライセンス

MIT
