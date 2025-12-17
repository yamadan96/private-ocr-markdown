/**
 * 進捗バーコンポーネント
 */

'use client';

import { Loader2 } from 'lucide-react';
import type { OCRResult } from '@/store/types';

interface ProgressBarProps {
  results: OCRResult[];
}

export function ProgressBar({ results }: ProgressBarProps) {
  if (results.length === 0) {
    return null;
  }

  const completedCount = results.filter((r) => r.status === 'completed').length;
  const totalCount = results.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          処理中... ({completedCount} / {totalCount} ページ完了)
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="space-y-2">
        {results.map((result) => (
          <div
            key={result.pageNumber}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
          >
            <span className="text-sm text-gray-700 dark:text-gray-300">
              ページ {result.pageNumber}
            </span>
            <div className="flex items-center gap-2">
              {result.status === 'pending' && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  待機中
                </span>
              )}
              {result.status === 'rendering' && (
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  レンダリング中
                </span>
              )}
              {result.status === 'ocr' && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    OCR中 ({result.progress}%)
                  </span>
                </div>
              )}
              {result.status === 'converting' && (
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  変換中
                </span>
              )}
              {result.status === 'completed' && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  完了
                </span>
              )}
              {result.status === 'error' && (
                <span className="text-xs text-red-600 dark:text-red-400">
                  エラー
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
