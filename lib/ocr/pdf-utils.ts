/**
 * PDFから画像への変換ユーティリティ
 * pdf.jsを使用してPDFをページごとにCanvasに描画し、Blob形式で出力
 */

import * as pdfjsLib from 'pdfjs-dist';

// pdf.jsのWorkerパスを設定
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * ページ情報
 */
export interface PageImage {
  pageNumber: number;
  blob: Blob;
  width: number;
  height: number;
}

/**
 * PDFファイルをページごとの画像に変換するジェネレータ
 * @param file PDFファイル
 * @param scale スケール（解像度）。デフォルトは2.0（高精度）
 */
export async function* convertPdfToImages(
  file: File,
  scale: number = 2.0
): AsyncGenerator<PageImage> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    // Canvasを作成
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context not available');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // ページをCanvasに描画
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    // BlobとしてCanvas内容を取得
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) {
          resolve(b);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/png');
    });

    yield {
      pageNumber: pageNum,
      blob,
      width: canvas.width,
      height: canvas.height,
    };

    // メモリ解放
    canvas.width = 0;
    canvas.height = 0;
  }
}

/**
 * PDFのページ数を取得
 * @param file PDFファイル
 * @returns ページ数
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  return pdf.numPages;
}
