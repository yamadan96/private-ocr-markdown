以下に、**Webアプリ「ローカルOCR + PDF/画像 → Markdown整形（完全プライベート）」**の要件定義を、そのまま仕様書として使える粒度でまとめます。




要件定義：Private OCR to Markdown



1. 目的

PDF/画像（スクショ含む）からテキストを抽出し、Markdownとして再利用しやすい形に整形して出力する。
**外部サーバーへファイル/文字情報を送信しない（完全ローカル処理）**ことを最大の差別化要因とする。




2. 想定ユーザー

会社員/学生/研究者/エンジニア（議事録、資料、論文、請求書などを扱う）
外部AIに資料をアップロードできない（機密・個人情報・社内規定）
既存OCRの「テキストは取れるが整形が弱い」ことに不満がある層



3. 提供価値

プライベート：ファイルもOCR結果も外部送信なし
速い：ブラウザで完結（インストール不要）
使えるMarkdown：見出し/箇条書き/表/コードをそれっぽく整形
用途別テンプレ：議事録/請求書/論文などの出力形式に寄せる



4. スコープ



4.1 MVPでやること（必須）

入力：画像（png/jpg/webp）、PDF（複数ページ）
OCR：Tesseract.js（ブラウザ内）
PDF解析：pdf.js（ページレンダリング→OCR）
出力：Markdown（コピー・ダウンロード）
プライバシー：外部送信なしをUI上で明示
基本整形：

行/段落整形、不要な改行の抑制
見出し推定（フォントサイズの代替として、行長/記号/空行ルール）
箇条書き推定（・, -, *, 1. など）
コードブロック推定（等幅っぽい行/インデント/記号密度）
テンプレ切替（最低3種）：

議事録
論文
請求書/帳票（構造が強い系）



4.2 MVPでやらないこと（明確に除外）

生成AIによる要約/リライト（外部API不要の方針のため）
高精度な表復元（完全なセル構造復元は次フェーズ）
手書き文字の高精度対応（MVP外）
ユーザーアカウント/クラウド同期（有料版候補）



5. ユースケース（ユーザーストーリー）



US-01：スクショから議事録下書きを作りたい

ユーザーは画像をドラッグ&ドロップ
OCR→議事録テンプレに整形
MarkdownをコピペしてNotion/Docsへ貼る



US-02：PDF資料をMarkdown化して要約前処理に使いたい

ユーザーはPDFをアップロード
ページ範囲指定してOCR
Markdown一括出力して、自分のツール/LLMに投入（ローカル）



US-03：機密資料なので外部送信したくない

画面上に「外部送信しません」表示
ネットワーク通信なし（解析時）
ローカルにのみ保存（もしくは保存しない）



6. 機能要件



6.1 入力

画像アップロード：複数対応
PDFアップロード：複数ページ対応
ドラッグ&ドロップ対応
ページ/画像の並び替え（MVPでは任意）



6.2 OCR処理

言語：日本語 + 英語（切替）
進捗表示：ページ/枚数単位の進捗バー
中断/キャンセル：処理停止ボタン
品質オプション（MVP最小）：

解像度優先（遅い）
速度優先（速い）



6.3 整形（Markdown変換）

正規化

連続スペース/改行の整形
ハイフネーション/改行結合（英語PDFで頻出）
ブロック分類（推定）

見出し / 段落 / 箇条書き / コード / 表候補
表っぽい箇所の扱い（MVP）

罫線ではなく**列っぽさ（スペース・区切り記号・揃い）**で推定
推定成功時：Markdownテーブルに変換
失敗時：そのままプレーンテキストで保持（壊さない）



6.4 テンプレ機能

テンプレ選択で出力フォーマットが変わる

議事録：# 概要 / ## 決定事項 / ## TODO / ## 議論
論文：# Title / ## Abstract / ## Sections...（簡易）
請求書：# 発行元/宛先/明細など（抽出はルールベース）
テンプレごとの「推定ルール」を切替（例：議事録は箇条書きを優先）



6.5 出力

Markdownプレビュー（左：原文/右：整形済 など）
ワンクリックコピー
.md ダウンロード



7. 非機能要件



7.1 プライバシー/セキュリティ

ファイル/テキストを外部送信しない（必須）
分析用ログは「イベントのみ」か「完全オフ」（MVPはオフ推奨）
ローカル保存は明示選択式（デフォルト保存しない）



7.2 パフォーマンス

1枚画像：数秒〜十数秒を許容（端末依存）
PDF：ページ単位で逐次結果表示（待ち続けない）
メモリ：大PDFで落ちないようページ分割処理



7.3 対応環境

Chrome / Edge / Safari（最低限）
モバイルは閲覧中心（OCRは重いので注意書き）



7.4 UX要件

「外部送信しない」をファーストビューで明記
失敗しても“壊れた出力”にしない（プレーンへフォールバック）



8. 画面要件（MVP 3画面）

Home/Upload



アップロード、言語選択、テンプレ選択、開始ボタン



Process/Preview



進捗、原文（OCR結果）と整形Markdownのプレビュー、手動微修正（任意）



Export



Copy、Download、（将来）Notion/Docx export導線（MVPでは非搭載でもOK）



9. 成功指標（KPI）

OCR完了率（エラーなく出力まで行けた割合）
変換満足度（👍/👎の簡易）
コピー/ダウンロード率
リピート率（翌日/翌週に再利用）



10. 受け入れ基準（Acceptance Criteria）

画像1枚から日本語OCR→Markdownコピーまでが3クリック以内
PDFでページ範囲指定→逐次プレビュー表示できる
テンプレ切替で出力の章立てが変わる
ネットワークを遮断しても動作する（少なくともOCR/整形部分）
表推定が失敗しても、内容が欠落しない（フォールバック）



11. フェーズ計画（例）



Phase 1（〜2週間）：MVP公開

画像OCR → Markdown
PDFページOCR → Markdown
議事録テンプレ
コピー/ダウンロード



Phase 2（〜1ヶ月）：売れる形に寄せる

表推定の改善（表っぽい箇所だけ）
テンプレ追加（請求書/論文）
履歴（ローカル保存）



Phase 3（課金）

一括処理（大量PDF/画像）
同期（アカウント）
Notion/Docx export
テンプレマーケット

この要件定義をベースに、次はすぐ作れます。
**「MVPの画面遷移＋コンポーネント設計（Next.js）」**まで落としてほしい？それとも **「表推定・コード検出のルール案」**を先に詰める？



要件定義これでいい感じ？

非常に完成度が高く、実開発にそのまま移れるレベルの要件定義です。

特に「外部サーバーへ送信しない」という**プライバシーへの特化**と、生成AIを使わずに**ルールベースで整形する**という割り切りが、技術選定（Tesseract.js / pdf.js）と整合性が取れており、非常に現実的かつ需要がある構成だと感じます。

いくつか、実装前に詰めるとさらに品質が上がるポイントと、ご質問への回答をまとめました。

---

## 1. 要件定義へのフィードバック（ブラッシュアップ案）

### ① Tesseract.js の特性への対策

* **Web Worker の活用:** ブラウザ内OCRはCPU負荷が非常に高いため、UIがフリーズしないよう「Web Workerでの並列処理」を非機能要件に明示すると良いです。
* **データの局所性:** Tesseractの学習データ（traineddata）は数MB〜数十MBあります。初回読み込み時のキャッシュ戦略（IndexedDBなど）についても考慮があると、2回目以降のUXが爆速になります。

### ② 「表推定」の現実的な落とし所

* 要件にある「列っぽさ」の判定は、Tesseractから返ってくる各ワードの **`bbox`（座標情報）** を使うのが定石です。
* 「同じ行（y座標が近い）」かつ「x座標の開始位置が一定以上の隙間（空白）で空いている」場合に `|` で区切るロジックをPhase 1の設計段階で想定しておくと、コード化がスムーズです。

### ③ プレビューのUX

* OCR後のテキストは必ず誤字脱字が含まれます。「Markdownプレビュー」だけでなく、**「OCR結果を直接編集できるエディタ」**がPreview画面にないと、ユーザーは結局メモ帳にコピペして直す手間が発生してしまいます。

---

## 2. 次のステップ：どちらを先に詰めるべきか？

結論から言うと、**「表推定・コード検出のルール案（ロジック設計）」**を先に詰めることを強くおすすめします。

### 理由

1. **価値の核:** このアプリの価値は「ただのOCR」ではなく「使えるMarkdownに整える」点にあります。Next.jsの画面構成自体は標準的なもので済みますが、**「どういうデータ構造（JSON）を、どういうルールでMarkdown文字列に変換するか」**という変換エンジンがこのプロジェクトの心臓部（コアロジック）だからです。
2. **データ構造の決定:** ルールが決まると、Tesseractから取得すべき情報の粒度（単なるテキストか、座標情報を含むJSONか）が決まり、それがそのままコンポーネントのProps設計に反映されます。

---

## 今後の進め方のご提案

もしよろしければ、まずは**「変換エンジンのロジック設計」**を一緒に深掘りしませんか？

具体的には以下のような内容を定義したいと考えています。

* **ヒューリスティック・ルール案:**
* **見出し:** 前後の空行、文字数、末尾の記号による判定。
* **リスト:** 行頭の記号とインデント。
* **表:** 同一行内でのスペースの分布による判定ロジック。


* **テンプレ適用ロジック:**
* 「議事録」テンプレの場合、特定キーワード（日時、場所、出席者）をどう検知して `#` や `##` を振るか。



その後に、それらのロジックを組み込むための **「Next.js（App Router） + Tailwind CSS」による画面・コンポーネント設計** に進むのが最も効率的です。

**「変換ロジック（表・コード・見出し）」の深掘りから始めてよろしいでしょうか？**

承知いたしました。変換エンジンの核となる**「変換ロジック（ヒューリスティック・ルール）」**の設計から進めます。

ブラウザ上のOCR（Tesseract.js）は、単なるテキストだけでなく、各単語や行の**座標（Bounding Box）**を返してくれます。この座標情報をフル活用するのが、高精度なMarkdown変換の鍵です。

---

## 1. 入力データの前提

Tesseract.jsの `recognize` 結果から、以下の構造（Lineレベル）を抽出して処理の入力とします。

* **Text:** 行内の文字列
* **BBox:** `{ x0, y0, x1, y1 }` （左上と右下の座標）
* **Confidence:** 信頼度（低すぎる場合は整形を弱める判断材料）

---

## 2. 要素別：判定ロジック案

### ① 見出し（Headings）の推定

Tesseractはフォントサイズを正確に取れないことが多いため、**「行の高さ」と「周囲の余白」**で判定します。

| 判定対象 | ルール（ヒューリスティック） | Markdown化 |
| --- | --- | --- |
| **大見出し** | 1. ページ内の平均行高より1.5倍以上高い<br>

<br>2. 行が短く、前後に十分な垂直余白がある<br>

<br>3. 中央揃えに近い（x0とx1のバランス） | `# ` |
| **中見出し** | 1. 平均行高より1.2倍程度高い、または太字判定<br>

<br>2. 行頭が「第n章」「1.」などで始まる（正規表現） | `## ` |
| **小見出し** | 1. 行が短く、かつ次行との間に適度な空行がある<br>

<br>2. 末尾に句読点がない | `### ` |

### ② 箇条書き（Lists）の推定

行頭の記号と、複数行にわたる場合の**左端のインデント（x0座標）の揃い**をチェックします。

* **ルール:**
* 行頭が `・`, `*`, `-`, `1.`, `(1)` 等で始まる。
* 2行目以降の開始位置（x0）が、1行目の記号を除いたテキスト開始位置と一致していれば「同じリストアイテム」とみなして結合。
* インデント（x0）が右にズレている場合は、ネストされたリストとして処理。



### ③ コードブロック（Code Blocks）の推定

プログラミングコード特有の「文字の並び」を統計的に判定します。

* **ルール:**
1. **記号密度:** `{ }`, `( )`, `;`, `=>`, `$` などの記号が一定割合以上含まれる。
2. **インデントの深さ:** 行頭に半角スペースが4つ以上、またはタブ相当の空白（x0のズレ）がある。
3. **等幅フォント性:** 文字ごとの幅（(x1-x0) / 文字数）の分散が非常に小さい場合。



### ④ 表（Tables）の推定（最難関）

「罫線がない表」をどう見抜くかがポイントです。

* **垂直アライメント法:**
1. 同一行内にある「大きな空白」でテキストを分割（Cell候補）。
2. 上下の行で、その**空白の位置（x座標の範囲）が重なっている**かを確認。
3. 3行以上で同じ位置に「列の区切り」が存在すれば、そこをテーブル領域と断定。


* **フォールバック:**
* 列の数がバラバラでテーブルとして成立しない場合は、下手に壊さず「スペースを維持したプレーンテキスト」として出力。



---

## 3. テンプレートによる後処理（Post-processing）

ユーザーが選択したテンプレに応じて、抽出した構造をさらに加工します。

* **議事録テンプレ:**
* 「日時」「場所」「参加者」「決定事項」などのキーワードを検索。
* 見つかった場合、それらを自動的に `## 決定事項` のような強めの見出しに昇格させる。


* **請求書テンプレ:**
* 「合計金額」「￥」「税込」などの周辺にある数字を抽出し、Markdownのテーブル上部に「サマリー」として配置する。



---

## 4. 処理フロー図

---

## 5. ロジックの実装方針（エンジニア向け視点）

このロジックをJavaScriptで実装する際は、以下のような**パイプライン処理**にします。

```javascript
const markdown = pipe(
  extractLines(tesseractData), // 座標付き行データに変換
  identifyBlocks,              // 見出し、リスト、表などのブロック属性を付与
  mergeContext,                // 複数行に分かれた段落を結合
  applyTemplate(templateType), // テンプレ専用の調整
  renderMarkdown               // 文字列として出力
)(rawResult);

```

---

### 次のステップへの提案

このロジック案で「特にここを強化したい（例：表の判定をより厳密にしたい、など）」という部分はありますか？

もし問題なければ、次は**「このロジックを動かすためのNext.jsの画面遷移と、状態管理（OCR進捗をどう持つかなど）の設計」**に移りたいと思います。

**どちらを進めましょうか？**

* **A:** 表や箇条書きの判定ルールをさらに具体化（具体的な座標計算式など）
* **B:** Next.jsによる実装設計（コンポーネント構成・UI）へ進む

Next.js（App Router）をベースとした実装設計に進みます。
「完全ローカル処理」というUXを損なわないよう、**重い処理（OCR）をUIスレッドから切り離す設計**が肝になります。

---

## 1. 技術スタック案

* **Framework:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS + shadcn/ui（開発効率と美観の両立）
* **Icons:** Lucide React
* **State Management:** Zustand（シンプルかつ高速な状態共有）
* **Worker:** Tesseract.js (Web Worker形式)
* **PDF Library:** pdf.js (Canvasレンダリング用)

---

## 2. コンポーネント構成（階層構造）

```text
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # 「外部送信なし」のバッジ、GitHubリンク
│   │   └── Sidebar.tsx      # 設定（言語、テンプレ、解像度）
│   ├── upload/
│   │   ├── DropZone.tsx     # ファイル受付、バリデーション
│   │   └── FileList.tsx     # アップロード済みリスト
│   ├── processing/
│   │   ├── ProgressBar.tsx  # 全体進捗 
│   │   └── PageStatus.tsx   # ページごとの処理状態
│   ├── editor/
│   │   ├── PreviewPane.tsx  # 原文画像 or テキストの表示
│   │   ├── MarkdownEditor.tsx # 整形結果のエディタ（Monaco等）
│   │   └── Toolbar.tsx      # コピー、ダウンロード、再整形ボタン
│   └── shared/
│       └── PrivacyBadge.tsx # 「Local Only」を強調するUIパーツ
├── hooks/
│   ├── useOcr.ts            # Tesseract.jsのWorker管理ロジック
│   └── useMarkdown.ts       # 前回決めた「変換ロジック」の呼び出し
└── store/
    └── useAppStore.ts       # 全体の状態管理（Files, Status, Markdown）

```

---

## 3. 状態管理（Zustand）の設計

処理の「今どこ？」をユーザーに伝えるためのステート設計です。

```typescript
interface AppState {
  files: File[];
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number; // 0-100
  results: OCRResult[]; // 各ページのテキストと座標データ
  template: 'minutes' | 'paper' | 'invoice';
  language: 'jpn' | 'eng';
  
  // Actions
  addFiles: (files: File[]) => void;
  startOcr: () => Promise<void>;
  updateMarkdown: (index: number, text: string) => void;
}

```

---

## 4. OCR実行ロジックのポイント（Web Worker）

メインスレッドを止めないために、`createWorker` を適切に管理します。

```typescript
// useOcr.ts のイメージ
import { createWorker } from 'tesseract.js';

const runOcr = async (image: string, lang: string) => {
  const worker = await createWorker(lang, 1, {
    workerPath: '/workers/tesseract-worker.min.js', // ローカルに配置
    corePath: '/workers/tesseract-core.wasm.js',
    logger: m => console.log(m) // 進捗取得
  });
  
  // 座標情報(blocks)を含めて取得
  const { data } = await worker.recognize(image, { output: { blocks: true } });
  await worker.terminate();
  return data;
};

```

---

## 5. 画面遷移フロー（UX設計）

1. **Home (Upload):**
* 巨大なドロップゾーン。「ブラウザ外にデータは出ません」という安心感を出すために、ブラウザのNetworkタブが動いていないことを示すインジケータがあっても面白いかもしれません。


2. **Processing:**
* PDFの場合、1ページずつCanvasに描画 → OCRを繰り返します。
* **逐次表示:** 全ページ終わるのを待たず、1ページ目が終わった瞬間にプレビューで見れるようにします（待ち時間の体感短縮）。


3. **Review & Export:**
* 左側に「認識した行」をハイライト表示した画像、右側にMarkdown。
* 右側で修正するとリアルタイムでMarkdownプレビューが反映される。



---

## 6. UIデザインのポイント（エンジニア向け）

* **Dark Mode対応:** プログラマーが好むため必須。
* **Monospace Font:** Markdown編集エリアは `Fira Code` や `JetBrains Mono` などの等幅フォントを使用。
* **差分表示:** OCR結果（ベタ打ち）と整形後Markdownをトグルで切り替えられるようにする。

---

### 次のステップ

これで全体の「器（Next.js）」と「ロジック（変換エンジン）」が繋がりました。
開発に着手するにあたって、**「最も実装が難しい部分」**から具体化しませんか？

1. **PDF/画像処理のコア:** `pdf.js` でページを画像化し、`Tesseract.js` に渡すための一連のユーティリティ関数の詳細設計。
2. **変換エンジンのコード化:** 前回決めた「座標ベースの見出し・リスト判定」を具体的にどうコード（TypeScript）で書くかのプロトタイプ作成。

どちらの詳細を詰めたいですか？あるいは、さっそくディレクトリ構造を作って実装を開始しますか？

「1. PDF/画像処理のコア」の詳細設計に入ります。
ここでの目標は、**「ブラウザのメモリを使い果たさず、いかにスムーズにPDFを画像化してOCRに回すか」**というパイプラインの構築です。

---

## 1. 処理パイプラインの全体像

1. **File Input**: `input[type="file"]` または `Drag & Drop` で取得。
2. **Dispatcher**: ファイル形式（PDFか画像か）を判定。
3. **PDF Renderer (pdf.js)**: PDFを1ページずつループし、Canvasに描画。
4. **Image Optimizer**: Canvasから画像データ（Blob/DataURL）を取得し、必要に応じてリサイズやグレースケール化。
5. **OCR Runner (Tesseract.js)**: Workerにデータを投げ、座標付きテキストデータを取得。

---

## 2. PDFから画像への変換ロジック (pdf.js)

PDFはベクターデータであるため、OCRにかける前に「どの程度の解像度でラスタライズ（画像化）するか」が精度を左右します。

* **解像度設定 (DPI)**:
* 標準（速い）: 150 DPI
* 高精度（遅い）: 300 DPI (OCRにはこちらが推奨)


* **メモリ対策**:
* 全ページ一気に画像化するとタブがクラッシュするため、**Generator（ジェネレータ関数）**を使って「1ページずつ処理しては渡す」方式を採用します。



### 実装イメージ（ユーティリティ関数）

```typescript
// pdf-utils.ts
import * as pdfjs from 'pdfjs-dist';

export async function* convertPdfToImages(file: File, scale = 2.0) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context!, viewport }).promise;
    
    // メモリ効率のためBlobとして出力
    const blob = await new Promise<Blob>((resolve) => 
      canvas.toBlob((b) => resolve(b!), 'image/png')
    );
    
    yield { pageNumber: i, blob, width: canvas.width, height: canvas.height };
    
    // Canvasを明示的に解放
    canvas.width = 0;
    canvas.height = 0;
  }
}

```

---

## 3. OCR実行ロジック (Tesseract.js)

Tesseract.jsの初期化（Workerの作成）は重いため、**Workerを使い回す（シングルトンまたはプール制）**のが鉄則です。

* **Worker管理**: 処理開始時に1つ作成し、全ページ終わるまで `terminate()` しない。
* **取得データ**: `hOCR` や単なるテキストではなく、**`blocks` (座標情報付きデータ)** を要求するように設定します。

### 実装イメージ

```typescript
// ocr-utils.ts
import { createWorker } from 'tesseract.js';

let worker: Tesseract.Worker | null = null;

async function getWorker(lang: string) {
  if (worker) return worker;
  worker = await createWorker(lang);
  return worker;
}

export async function processOcr(imageSource: Blob | File) {
  const w = await getWorker('jpn+eng'); // 日本語と英語の混合
  
  // 座標情報を含む詳細な結果を取得
  const { data } = await w.recognize(imageSource, {
    output: { blocks: true } 
  });
  
  return data.blocks; // これをMarkdown変換エンジンに渡す
}

```

---

## 4. 課題：巨大PDFへの対応（非機能要件の充足）

ユーザーが50枚、100枚といったPDFを入れた場合、直列処理だと時間がかかりすぎます。

* **並列化の検討**:
* ブラウザのCPUコア数に合わせて `WorkerPool` を作り、2〜3ページずつ並列でOCRを回すと速度が劇的に向上します（Tesseract.jsには標準で `Scheduler` というプール機能があります）。


* **逐次プレビュー**:
* 「全ページ完了まで待つ」のではなく、1ページ終わるごとに `AppState` の `results` 配列を更新し、UI側にMarkdownを即座に表示させていきます。



---

## 次のステップ：この「変換パイプライン」を画面（UI）にどう繋ぐか

ここまでで「ファイル → 画像 → 構造化データ」までの流れが固まりました。
次は、この重い処理をバックグラウンドで走らせつつ、ユーザーに**「進捗をリアルタイムで見せるUI」**の実装設計に進んでよろしいでしょうか？

それとも、**「取得した blocks データから Markdown を生成する具体的な変換コード（TypeScript）」**のプロトタイプを詳しく見ますか？

**A:** UI側の実装設計（進捗管理・キャンセル処理など）
**B:** 変換エンジン（blocks → Markdown）の具体的なロジックコード実装


UI側の実装設計、特にユーザーを待たせる「重い処理」をいかにストレスなく見せるかという**UXと状態管理の設計**に焦点を当てます。

---

## 1. ステート設計（Zustand）

「今どのページを処理しているか」「全体で何％か」を管理するために、各ファイル/ページごとのステータスを細かく定義します。

```typescript
type ProcessStatus = 'pending' | 'rendering' | 'ocr' | 'converting' | 'completed' | 'error';

interface PageResult {
  pageNumber: number;
  status: ProcessStatus;
  progress: number; // 0-100 (Tesseractの進捗)
  rawText?: string;
  markdown?: string;
  error?: string;
}

interface OcrStore {
  queue: PageResult[];
  isProcessing: boolean;
  cancelRequested: boolean;
  
  // Actions
  startProcessing: (files: File[]) => Promise<void>;
  cancelProcessing: () => void;
  updatePage: (pageNumber: number, updates: Partial<PageResult>) => void;
}

```

---

## 2. 進捗管理とキャンセル処理のロジック

`Tesseract.js` の `Scheduler` を使うと、複数Workerを並列で回せますが、キャンセル処理には少し工夫が必要です。

### 処理のコントローラー（Hook）のイメージ

```typescript
// hooks/useOcrProcessor.ts
export const useOcrProcessor = () => {
  const store = useAppStore();

  const process = async (files: File[]) => {
    store.setIsProcessing(true);
    
    for (const file of files) {
      // 1. PDFから画像ジェネレータを取得
      const pageGenerator = convertPdfToImages(file);
      
      for await (const { pageNumber, blob } of pageGenerator) {
        // キャンセルチェック
        if (useAppStore.getState().cancelRequested) break;

        store.updatePage(pageNumber, { status: 'ocr' });

        try {
          // Tesseractに投入（進捗の監視付き）
          const result = await worker.recognize(blob, {}, {
            onProgress: (m) => {
              if (m.status === 'recognizing text') {
                store.updatePage(pageNumber, { progress: Math.round(m.progress * 100) });
              }
            }
          });

          // Markdown変換エンジンの呼び出し
          const markdown = convertToMarkdown(result.data.blocks);
          store.updatePage(pageNumber, { status: 'completed', markdown });
          
        } catch (e) {
          store.updatePage(pageNumber, { status: 'error', error: '解析失敗' });
        }
      }
    }
    store.setIsProcessing(false);
  };

  return { process };
};

```

---

## 3. UI/UX コンポーネントの設計

### ① プログレス・ダッシュボード

一括アップロードした際、各ページが「テトリス」のように埋まっていく感覚を提供します。

* **全体進捗バー:** `完了ページ数 / 全ページ数` をヘッダー付近に固定。
* **逐次プレビューカード:** * 処理が終わったページから順次、カード形式でMarkdownのプレビューを表示。
* 処理中のカードには「OCR解析中... (80%)」のようなスピナーと進捗率を表示。



### ② キャンセルボタンとガード

* **即時停止:** キャンセルボタンが押されたら、現在実行中のWorkerのPromiseを破棄し、キューをクリアします。
* **離脱ガード:** 処理中にブラウザのタブを閉じようとした場合、「処理が中断されます」というアラートを出す（`beforeunload` イベント）。

---

## 4. エラーハンドリングの工夫

ローカル処理特有の課題（メモリ不足など）への対策です。

* **ページ単位のフォールバック:** * 特定のページが重すぎてエラーになっても、他のページの処理は継続させる。
* エラーになったページには「再試行」ボタンを表示。


* **メモリ警告:** * PDFのページ数が100枚を超えるような場合、「メモリを大量に消費するため、数回に分けて実行することをお勧めします」といったトースト通知を出す。

---

## 5. 実装の優先順位

まずは「1枚の画像」から始め、次に「PDFの逐次処理」へと広げるのがスムーズです。

1. **静的UI作成:** shadcn/ui 等で「アップロード」「進捗リスト」「プレビュー」の枠組みを作る。
2. **単一OCR接続:** 1枚の画像を投げ、進捗率が `0% -> 100%` になるのをUIで確認。
3. **PDF逐次処理:** ジェネレータ関数を使い、1ページずつUIが更新されるように繋ぎ込む。

---

### 次のステップ

これで「裏側の処理をどうUIで見せるか」の設計が固まりました。
いよいよ、このプロジェクトの**「一番の付加価値」**である変換ロジックを作り込みませんか？

**「B: 変換エンジン（blocks → Markdown）の具体的なロジックコード実装」**

に進んで、実際に Tesseract から返ってくる座標データを使って、どうやって `# 見出し` や `| Table |` を組み立てるかのTypeScriptコードを書きましょう。よろしいでしょうか？

変換エンジンの核心部分、**「Tesseractの座標データ（blocks）を解析してMarkdownを生成するロジック」**の実装設計に入ります。

ここでは、Tesseract.jsが提供する `data.blocks`（段落 > 行 > 単語 の階層構造）を読み解き、ヒューリスティック（経験則）に基づいて構造化するコードのプロトタイプを作成します。

---

## 1. 入力データの構造（再確認）

Tesseractから返ってくる `Block` オブジェクトには、以下の情報が含まれています。

* `text`: そのブロックの文字列
* `bbox`: `{ x0, y0, x1, y1 }`（座標）
* `blocktype`: 段落か、表か、画像か（Tesseract標準の判定。精度は中程度）

---

## 2. 変換エンジンの実装（TypeScript）

このエンジンを `MarkdownConverter` クラスとして設計します。

```typescript
type BBox = { x0: number; y0: number; x1: number; y1: number };

interface LineData {
  text: string;
  bbox: BBox;
  lineHeight: number;
  isBold?: boolean; // Tesseractのconfidenceやfont情報から推測
}

export class MarkdownConverter {
  private avgLineHeight = 0;

  // メイン関数：Tesseractの全ブロックを処理
  public convert(blocks: any[], template: string): string {
    const lines = this.extractLines(blocks);
    this.avgLineHeight = this.calculateAvgHeight(lines);

    let markdown = "";
    let currentBlockType: 'text' | 'list' | 'code' | 'table' = 'text';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const prevLine = lines[i - 1];

      // 1. 見出し判定 (Heading)
      if (this.isHeading(line)) {
        markdown += `\n\n# ${line.text}\n\n`;
        continue;
      }

      // 2. 箇条書き判定 (List)
      if (this.isListItem(line)) {
        markdown += `\n* ${this.cleanListText(line.text)}`;
        continue;
      }

      // 3. 表の判定（簡易版：列のズレで判定）
      if (this.isTableLine(line)) {
        // 前の行が表でなければヘッダーを追加
        if (currentBlockType !== 'table') {
          markdown += `\n\n| ${this.formatTableCell(line.text)} |\n| --- |`;
          currentBlockType = 'table';
        } else {
          markdown += `\n| ${this.formatTableCell(line.text)} |`;
        }
        continue;
      }

      // 4. 通常の段落（結合処理）
      if (this.shouldMergeWithPrev(line, prevLine)) {
        markdown += line.text; // 前の行とつなげる
      } else {
        markdown += `\n\n${line.text}`;
      }
      currentBlockType = 'text';
    }

    return markdown.trim();
  }

  // --- 判定ロジック群 ---

  private isHeading(line: LineData): boolean {
    // ルール1: 平均より1.5倍以上大きい
    const isLarge = line.lineHeight > this.avgLineHeight * 1.5;
    // ルール2: 短い行かつ末尾に句読点がない
    const isShort = line.text.length < 20 && !/[。．.？！]$/.test(line.text);
    return isLarge && isShort;
  }

  private isListItem(line: LineData): boolean {
    // 行頭が箇条書き記号っぽいか
    return /^[・\-*※]/.test(line.text.trim()) || /^\d+[\.\)]/.test(line.text.trim());
  }

  private isTableLine(line: LineData): boolean {
    // 連続する2つ以上の大きな空白（全角スペース2つ分以上）があれば「列」とみなす
    const columns = line.text.split(/\s{2,}/);
    return columns.length >= 2;
  }

  private shouldMergeWithPrev(line: LineData, prev: LineData): boolean {
    if (!prev) return false;
    // 前の行のx1（右端）がページの右の方まで届いていれば、文章が続いている可能性が高い
    const distY = line.bbox.y0 - prev.bbox.y1;
    return distY < line.lineHeight * 0.5; // 行間が狭ければ結合
  }

  // --- 補助関数 ---

  private extractLines(blocks: any[]): LineData[] {
    // Tesseractの階層から行(lines)だけをフラットに抽出
    const lines: LineData[] = [];
    blocks.forEach(block => {
      block.paragraphs?.forEach((para: any) => {
        para.lines?.forEach((line: any) => {
          lines.push({
            text: line.text.trim(),
            bbox: line.bbox,
            lineHeight: line.bbox.y1 - line.bbox.y0
          });
        });
      });
    });
    return lines;
  }

  private calculateAvgHeight(lines: LineData[]): number {
    if (lines.length === 0) return 0;
    const total = lines.reduce((sum, line) => sum + line.lineHeight, 0);
    return total / lines.length;
  }

  private formatTableCell(text: string): string {
    return text.trim().replace(/\s{2,}/g, ' | ');
  }

  private cleanListText(text: string): string {
    return text.replace(/^[・\-*※\d+[\.\)]\s*/, '');
  }
}

```

---

## 3. このロジックのポイント

### ① 行高による相対的な判定

固定のフォントサイズが取れないため、ページ全体の「平均行高」を算出し、それとの比較で **# 見出し** を決めるのが最も安定します。

### ② 文章の結合（Merge Logic）

OCRはしばしば「1つの段落」を「複数の行ブロック」に分割してしまいます。

* 前の行との垂直距離（y座標の差）が近い
* 前の行が句読点で終わっていない
これらの条件で `\n` を入れずに結合することで、Markdownとしてコピペした後の再利用性が劇的に向上します。

### ③ 表の「列」抽出

`line.text.split(/\s{2,}/)` を使っています。OCR結果で文字と文字の間に大きな空白がある場合、それは「意図的な列」である確率が高いため、それを `|`（パイプ）で置換してMarkdownテーブル化します。

---

## 4. テンプレートによる微調整

例えば「議事録テンプレート」が選択されている場合、上記ロジックの後に以下のようなキーワード置換をかけます。

```typescript
if (template === 'minutes') {
  markdown = markdown
    .replace(/^日時[:：]/m, '## 📅 日時')
    .replace(/^場所[:：]/m, '## 📍 場所')
    .replace(/^議題[:：]/m, '## 📝 議題');
}

```

---

## 次のステップ：実装への移行

これで主要な設計図（要件・UI・コアロジック）がすべて揃いました！

いよいよコードを書き始める段階ですが、**「最初のプロトタイプ（MVP）」**として、以下の中からどれから着手したいですか？

1. **「変換エンジン・サンドボックス」の作成**:
認識済みJSONデータを食わせると、右側にMarkdownが出るロジックのテスト環境を作る。
2. **「OCR + Next.js 基礎」の構築**:
画像をアップロードして、Tesseract.jsで文字が出るまでの画面フローを作る。
3. **「shadcn/ui によるデザイン実装」**:
まずは見た目から。ダークモード対応の洗練されたUIを構築する。

どれから始めましょう？あるいは、ここまでの設計で気になる点はありますか？


これまで詳細に詰め上げてきた**「ローカル完結型 OCR to Markdown 変換アプリ」**の要件定義と設計案を、開発のマスタープランとして一冊の仕様書形式にまとめました。

---

# 🚀 プロジェクト仕様書：Private OCR to Markdown

## 1. プロジェクト概要

### 1.1 目的

PDFや画像からテキストを抽出し、外部サーバーへ一切データを送信せず（完全ローカル）、再利用性の高いMarkdown形式へ整形して出力する。

### 1.2 ターゲット

* 機密情報を扱うため外部AI（ChatGPT等）に資料を投げられないビジネスマン
* 論文や技術資料をNotion等に素早くまとめたい学生・研究者
* 高いセキュリティ要件を持つ企業環境での利用

---

## 2. 技術スタック

| カテゴリ | 選定技術 | 役割 |
| --- | --- | --- |
| **Framework** | **Next.js 14+ (App Router)** | UIおよびアプリケーション基盤 |
| **OCR Engine** | **Tesseract.js** | ブラウザ内での文字認識（Web Worker使用） |
| **PDF Library** | **pdf.js** | PDFのレンダリングおよび画像化 |
| **State** | **Zustand** | 処理進捗・変換結果のグローバル管理 |
| **UI/Design** | **Tailwind CSS + shadcn/ui** | モダンでクリーンな編集画面の構築 |
| **Storage** | **IndexedDB (Local)** | OCR学習データ（traineddata）のキャッシュ |

---

## 3. 機能要件 (MVP)

### 3.1 入力・解析

* **マルチ形式対応:** PNG, JPG, WebP, 複数ページPDF。
* **ページ選択:** PDFのうち特定のページのみを処理対象に指定可能。
* **ローカル処理:** `pdf.js` で画像化 → `Tesseract.js` で解析のパイプライン。

### 3.2 Markdown変換エンジン（核心ロジック）

Tesseractの座標データ（Bounding Box）を用いた**ヒューリスティック変換**:

* **見出し:** 平均行高の1.5倍以上 ＝ `#`、1.2倍 ＝ `##` と推定。
* **リスト:** 行頭記号（・, -, 1.）とインデントの深さ（x0座標）で判定。
* **テーブル:** 同一行内の「大きな空白」と、上下行の「列位置の重なり」から `|` 区切りを生成。
* **段落結合:** 行末が句読点でなく、次行との距離が近い場合にテキストを結合。

### 3.3 テンプレート機能

* **議事録:** 「日時」「議題」等のキーワードを自動で大見出し化。
* **論文:** 章立てを強調し、コードブロック推定を強化。
* **請求書:** 帳票形式の構造を維持したMarkdownテーブル出力。

---

## 4. 画面・UX設計

### 4.1 構成

1. **Home/Upload:** ドラッグ&ドロップ、言語選択、プライバシー宣言の表示。
2. **Processing:** ページごとの進捗バー、逐次プレビュー（終わったページから表示）。
3. **Editor/Export:** 左側に「原文画像（ハイライト付）」、右側に「Markdownエディタ」の2画面構成。

### 4.2 非機能要件

* **完全オフライン動作:** ネットワークを遮断しても動作することを保証。
* **パフォーマンス:** Web Workerにより、解析中もUIがフリーズしない。
* **メモリ管理:** 大容量PDFの場合、1ページずつCanvasを破棄しクラッシュを防止。

---

## 5. 処理フロー

1. **変換フロー:** `File` → `ArrayBuffer` → `Canvas (Blob)` → `OCR (BBox JSON)` → `Markdown Text`
2. **状態管理:** Zustandが `files[]`, `progress`, `results[]` を一元管理し、各コンポーネントがリアクティブに反応。

---

## 6. フェーズ計画

* **Phase 1 (MVP):** 画像・PDFの基本OCR ＋ 見出し・リストの自動整形 ＋ コピペ機能。
* **Phase 2 (UX強化):** 表推定ロジックのブラッシュアップ ＋ ローカル履歴保存。
* **Phase 3 (拡張):** Notion API連携 ＋ 独自テンプレートのカスタム機能。

---

これで、**「何を」「何で」「どう作るか」**が完全に言語化されました。

ここから実際の開発に着手するにあたり、まずは**プロジェクトの雛形（ディレクトリ構造と `package.json`）の作成**から始めますか？それとも、**特定のコンポーネント（例えば、座標解析クラスの実装）**を深掘りしますか？

**「次はこれをやってほしい」という指示をいただけますか？**


