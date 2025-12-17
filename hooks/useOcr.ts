/**
 * OCR処理のためのReact Hook
 */

'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { convertPdfToImages, getPdfPageCount } from '@/lib/ocr/pdf-utils';
import { processOcr } from '@/lib/ocr/ocr-worker';
import { blobToDataURL } from '@/lib/ocr/image-processor';

/**
 * OCR処理を管理するカスタムフック
 */
export function useOcr() {
  const {
    files,
    language,
    isProcessing,
    cancelRequested,
    setIsProcessing,
    setCancelRequested,
    updateFileResult,
  } = useAppStore();

  /**
   * ファイルのOCR処理を開始
   */
  const startProcessing = useCallback(async () => {
    if (files.length === 0) {
      console.warn('No files to process');
      return;
    }

    setIsProcessing(true);
    setCancelRequested(false);

    try {
      for (const fileInfo of files) {
        // キャンセルチェック
        if (useAppStore.getState().cancelRequested) {
          console.log('Processing cancelled');
          break;
        }

        if (fileInfo.type === 'pdf') {
          // PDF処理
          await processPdfFile(fileInfo);
        } else {
          // 画像処理
          await processImageFile(fileInfo);
        }
      }
    } catch (error) {
      console.error('OCR processing error:', error);
    } finally {
      setIsProcessing(false);
      setCancelRequested(false);
    }
  }, [files, language, setIsProcessing, setCancelRequested]);

  /**
   * PDF処理
   */
  const processPdfFile = useCallback(
    async (fileInfo: ReturnType<typeof useAppStore.getState>['files'][0]) => {
      try {
        // ページ数を取得
        const pageCount = await getPdfPageCount(fileInfo.file);

        // ページごとに処理
        for await (const { pageNumber, blob } of convertPdfToImages(
          fileInfo.file,
          2.0 // 高精度
        )) {
          // キャンセルチェック
          if (useAppStore.getState().cancelRequested) {
            break;
          }

          // ステータス更新：OCR開始
          updateFileResult(fileInfo.id, pageNumber, {
            status: 'ocr',
            progress: 0,
          });

          // プレビュー用の画像URLを生成
          const imageUrl = await blobToDataURL(blob);

          // OCR実行
          const lines = await processOcr(blob, {
            language,
            onProgress: (progress) => {
              updateFileResult(fileInfo.id, pageNumber, {
                progress: Math.round(progress),
              });
            },
          });

          // 結果を更新
          const rawText = lines.map((line) => line.text).join('\n');
          updateFileResult(fileInfo.id, pageNumber, {
            status: 'converting',
            progress: 100,
            rawText,
            lines,
            imageUrl,
          });

          // Markdown変換は後で実装
          // 現時点ではrawTextをそのまま使用
          updateFileResult(fileInfo.id, pageNumber, {
            status: 'completed',
            markdown: rawText,
          });
        }
      } catch (error) {
        console.error(`Error processing PDF page:`, error);
        updateFileResult(fileInfo.id, 1, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
    [language, updateFileResult]
  );

  /**
   * 画像処理
   */
  const processImageFile = useCallback(
    async (fileInfo: ReturnType<typeof useAppStore.getState>['files'][0]) => {
      try {
        const pageNumber = 1;

        // ステータス更新：OCR開始
        updateFileResult(fileInfo.id, pageNumber, {
          status: 'ocr',
          progress: 0,
        });

        // プレビュー用の画像URLを生成
        const imageUrl = await blobToDataURL(fileInfo.file);

        // OCR実行
        const lines = await processOcr(fileInfo.file, {
          language,
          onProgress: (progress) => {
            updateFileResult(fileInfo.id, pageNumber, {
              progress: Math.round(progress),
            });
          },
        });

        // 結果を更新
        const rawText = lines.map((line) => line.text).join('\n');
        updateFileResult(fileInfo.id, pageNumber, {
          status: 'converting',
          progress: 100,
          rawText,
          lines,
          imageUrl,
        });

        // Markdown変換は後で実装
        // 現時点ではrawTextをそのまま使用
        updateFileResult(fileInfo.id, pageNumber, {
          status: 'completed',
          markdown: rawText,
        });
      } catch (error) {
        console.error(`Error processing image:`, error);
        updateFileResult(fileInfo.id, 1, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
    [language, updateFileResult]
  );

  /**
   * 処理をキャンセル
   */
  const cancelProcessing = useCallback(() => {
    setCancelRequested(true);
  }, [setCancelRequested]);

  return {
    startProcessing,
    cancelProcessing,
    isProcessing,
  };
}
