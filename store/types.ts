/**
 * アプリケーション全体で使用する型定義
 */

// 処理ステータス
export type ProcessStatus = 'pending' | 'rendering' | 'ocr' | 'converting' | 'completed' | 'error';

// テンプレートタイプ
export type TemplateType = 'minutes' | 'paper' | 'invoice';

// 言語タイプ
export type LanguageType = 'jpn' | 'eng' | 'jpn+eng';

// バウンディングボックス（座標情報）
export interface BBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

// 行データ
export interface LineData {
  text: string;
  bbox: BBox;
  lineHeight: number;
  confidence?: number;
}

// OCR結果（ページごと）
export interface OCRResult {
  pageNumber: number;
  status: ProcessStatus;
  progress: number; // 0-100
  rawText?: string;
  lines?: LineData[];
  markdown?: string;
  error?: string;
  imageUrl?: string; // プレビュー用の画像URL
}

// ファイル情報
export interface FileInfo {
  id: string;
  file: File;
  type: 'image' | 'pdf';
  pageCount: number;
  results: OCRResult[];
}
