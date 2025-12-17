# Private OCR to Markdown - プロジェクトガイド

## プロジェクト概要

完全ローカル処理のOCR to Markdown変換アプリケーション。外部サーバーへのデータ送信なしで、PDF/画像からMarkdownへの高品質な変換を実現します。

## 技術スタック

- **Framework**: Next.js 14+ (App Router)
- **OCR Engine**: Tesseract.js (Web Worker使用)
- **PDF Library**: pdf.js
- **State Management**: Zustand
- **UI/Design**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── layout/            # Header, Sidebar
│   ├── upload/            # DropZone, FileList
│   ├── processing/        # ProgressBar, PageStatus
│   ├── editor/            # PreviewPane, MarkdownEditor, Toolbar
│   └── shared/            # PrivacyBadge等の共通コンポーネント
├── hooks/
│   ├── useOcr.ts          # OCR処理のロジック
│   └── useMarkdown.ts     # Markdown変換のロジック
├── lib/
│   ├── ocr/               # OCR処理の実装
│   ├── markdown/          # Markdown変換エンジン
│   └── utils/             # ユーティリティ関数
└── store/
    └── useAppStore.ts     # Zustand状態管理
```

## 核心ロジック

### 1. OCR処理フロー

```typescript
File → ArrayBuffer → Canvas (Blob) → OCR (BBox JSON) → Markdown Text
```

### 2. Markdown変換ロジック

Tesseract.jsの座標データ（Bounding Box）を活用したヒューリスティック変換：

- **見出し**: 行高の相対比較（平均の1.5倍以上）と前後の空行で判定
- **箇条書き**: 行頭記号とインデント（x0座標）で判定
- **表**: 同一行内の大きな空白と上下行の列位置の重なりで判定
- **段落結合**: 行末が句読点でなく、次行との距離が近い場合に結合

### 3. テンプレート機能

- **議事録**: 日時、議題、決定事項などのキーワード検出
- **論文**: 章立ての強調とコードブロック推定の強化
- **請求書**: 帳票形式の構造維持

## 開発ガイドライン

### コーディング規約

1. **TypeScript**: 厳格な型定義を使用
2. **コンポーネント**: Server ComponentsとClient Componentsを適切に分離
3. **スタイリング**: Tailwind CSSのユーティリティクラスを使用
4. **命名規則**:
   - コンポーネント: PascalCase
   - Hooks: use + PascalCase
   - Utils: camelCase

### 状態管理（Zustand）

```typescript
interface AppState {
  files: File[];
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number; // 0-100
  results: OCRResult[];
  template: 'minutes' | 'paper' | 'invoice';
  language: 'jpn' | 'eng';

  // Actions
  addFiles: (files: File[]) => void;
  startOcr: () => Promise<void>;
  updateMarkdown: (index: number, text: string) => void;
}
```

### パフォーマンス要件

- **Web Worker**: Tesseract.jsをWorkerで実行し、UIスレッドをブロックしない
- **逐次処理**: 大容量PDFは1ページずつ処理し、完了したページから表示
- **メモリ管理**: Canvasを適切に破棄し、メモリリークを防止
- **キャッシュ**: IndexedDBでOCR学習データ（traineddata）をキャッシュ

### プライバシー要件

- **外部送信なし**: すべての処理をブラウザ内で完結
- **ローカル保存**: ユーザーが明示的に選択した場合のみ
- **ネットワーク遮断**: オフライン状態でも完全動作

## 実装フェーズ

### Phase 1 (MVP)
- 画像（PNG/JPG/WebP）のOCR
- PDFの複数ページOCR
- 基本的なMarkdown変換（見出し、箇条書き）
- コピー・ダウンロード機能

### Phase 2 (UX強化)
- 表推定ロジックの改善
- テンプレート追加（請求書、論文）
- ローカル履歴保存
- 手動編集機能の強化

### Phase 3 (拡張)
- 一括処理（大量PDF/画像）
- Notion API連携
- カスタムテンプレート機能
- Docx export

## 重要な注意事項

1. **外部API不使用**: 生成AI（ChatGPT等）による要約/リライトは含めない
2. **完全ローカル**: ネットワーク通信を一切行わない（初回の学習データ取得を除く）
3. **フォールバック**: 推定失敗時は壊れた出力ではなくプレーンテキストへフォールバック
4. **進捗表示**: ユーザーを待たせる処理では必ず進捗を表示

## テストガイドライン

- **単体テスト**: 変換ロジックの各判定関数
- **統合テスト**: OCR → Markdown変換の一連の流れ
- **E2Eテスト**: ファイルアップロード → 処理 → エクスポートの完全フロー

## 参考資料

- [Tesseract.js Documentation](https://tesseract.projectnaptha.com/)
- [pdf.js Documentation](https://mozilla.github.io/pdf.js/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
