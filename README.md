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
- **UI/Design**: Tailwind CSS + Lucide React
- **Language**: TypeScript

## 使い方

1. **ファイルをアップロード**
   - 画像（PNG, JPG, WebP）またはPDFファイルをドラッグ&ドロップ
   - または「クリックしてファイルを選択」からアップロード

2. **設定を選択**
   - **認識言語**: 日本語+英語、日本語のみ、英語のみから選択
   - **出力形式**: 議事録、論文・レポート、請求書・帳票から選択

3. **OCR処理を開始**
   - 「OCR処理を開始」ボタンをクリック
   - 進捗がリアルタイムで表示されます

4. **結果をエクスポート**
   - 「Markdownをコピー」でクリップボードにコピー
   - 「ダウンロード (.md)」でファイルとして保存

## 開発環境

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:3000 を開く

# ビルド
npm run build

# 本番環境での起動
npm run start
```

## プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # メインページ
├── components/            # React コンポーネント
│   ├── layout/           # ヘッダーなどのレイアウト
│   ├── upload/           # ファイルアップロード関連
│   ├── processing/       # 処理進捗表示
│   ├── editor/           # Markdown プレビュー・エクスポート
│   └── shared/           # 共通コンポーネント
├── hooks/                 # カスタムフック
│   ├── useOcr.ts         # OCR処理
│   └── useMarkdown.ts    # Markdown変換
├── lib/                   # ユーティリティ・ロジック
│   ├── ocr/              # OCR処理関連
│   └── markdown/         # Markdown変換エンジン
└── store/                 # 状態管理（Zustand）
    ├── types.ts          # 型定義
    └── useAppStore.ts    # グローバルストア
```

## 主な機能

### OCR処理

- Tesseract.jsを使用したブラウザ内OCR
- Web Workerによる非ブロッキング処理
- ページごとの進捗表示
- キャンセル機能

### Markdown変換

- **座標ベース変換**: OCR結果の座標情報（Bounding Box）を活用
- **見出し検出**: 行高と前後の余白から見出しレベルを判定
- **箇条書き検出**: 行頭記号とインデントを解析
- **表検出**: 列の位置の揃いから表構造を推定
- **段落結合**: 行間と句読点から適切に段落を結合

### テンプレート

- **議事録**: 日時、場所、議題、決定事項などを自動強調
- **論文・レポート**: Abstract、Introduction、Methodなどの章立てを強調
- **請求書・帳票**: 発行元、宛先、明細、合計などを構造化

## プライバシーとセキュリティ

- ✅ すべての処理をブラウザ内で完結
- ✅ 外部サーバーへのデータ送信なし
- ✅ ネットワーク遮断状態でも動作（初回学習データ取得を除く）
- ✅ ローカルストレージへの保存は最小限

## 今後の予定

### Phase 2（UX強化）
- [ ] 表推定ロジックの改善
- [ ] ローカル履歴保存
- [ ] 手動編集機能の強化

### Phase 3（拡張機能）
- [ ] 一括処理（大量PDF/画像）
- [ ] Notion API連携
- [ ] カスタムテンプレート機能
- [ ] Docx export

## ライセンス

MIT
