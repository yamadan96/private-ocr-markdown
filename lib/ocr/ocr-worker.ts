/**
 * Tesseract.jsを使用したOCR処理
 */

import { createWorker, type Worker } from 'tesseract.js';
import type { LineData } from '@/store/types';

/**
 * OCRオプション
 */
export interface OcrOptions {
  language: string;
  onProgress?: (progress: number) => void;
}

/**
 * Tesseract.jsワーカーインスタンス（シングルトン）
 */
let worker: Worker | null = null;

/**
 * ワーカーを初期化または取得
 * @param language 認識言語
 */
async function getOrCreateWorker(language: string): Promise<Worker> {
  if (worker) {
    return worker;
  }

  worker = await createWorker(language, 1, {
    workerPath: '/tesseract/worker.min.js',
    corePath: '/tesseract/tesseract-core-simd-lstm.wasm.js',
    logger: (m) => {
      if (m.status === 'recognizing text') {
        // 進捗ログをコンソールに出力（デバッグ用）
        console.log(`OCR Progress: ${Math.round((m.progress || 0) * 100)}%`);
      }
    },
  });

  return worker;
}

/**
 * ワーカーを終了
 */
export async function terminateWorker(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}

/**
 * OCR処理を実行
 * @param imageSource 画像（Blob, File, またはDataURL）
 * @param options OCRオプション
 * @returns 行データの配列
 */
export async function processOcr(
  imageSource: Blob | File | string,
  options: OcrOptions
): Promise<LineData[]> {
  console.log('processOcr: Starting with language:', options.language);

  try {
    console.log('processOcr: Getting or creating worker...');
    const w = await getOrCreateWorker(options.language);
    console.log('processOcr: Worker ready, starting recognition...');

    // OCR実行
    const result = await w.recognize(imageSource);
    console.log('processOcr: Recognition complete, processing results...');
    console.log('processOcr: result.data:', result.data);

    // 進捗コールバック
    if (options.onProgress) {
      options.onProgress(100);
    }

    // 行データに変換
    const lines: LineData[] = [];

    if (result.data.lines && result.data.lines.length > 0) {
      console.log('processOcr: Found', result.data.lines.length, 'lines');
      for (const line of result.data.lines) {
        lines.push({
          text: line.text.trim(),
          bbox: {
            x0: line.bbox.x0,
            y0: line.bbox.y0,
            x1: line.bbox.x1,
            y1: line.bbox.y1,
          },
          lineHeight: line.bbox.y1 - line.bbox.y0,
          confidence: line.confidence,
        });
      }
    } else {
      console.warn('processOcr: No lines found in result');
    }

    console.log('processOcr: Returning', lines.length, 'lines');
    return lines;
  } catch (error) {
    console.error('processOcr: Error during OCR:', error);
    throw error;
  }
}

/**
 * 簡易OCR（テキストのみ取得）
 * @param imageSource 画像（Blob, File, またはDataURL）
 * @param options OCRオプション
 * @returns 認識されたテキスト
 */
export async function processOcrSimple(
  imageSource: Blob | File | string,
  options: OcrOptions
): Promise<string> {
  const w = await getOrCreateWorker(options.language);

  const result = await w.recognize(imageSource);

  if (options.onProgress) {
    options.onProgress(100);
  }

  return result.data.text;
}
