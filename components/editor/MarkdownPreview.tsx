/**
 * Markdownプレビューコンポーネント
 */

'use client';

import type { OCRResult } from '@/store/types';
import { FileText } from 'lucide-react';

interface MarkdownPreviewProps {
  results: OCRResult[];
}

export function MarkdownPreview({ results }: MarkdownPreviewProps) {
  const completedResults = results.filter((r) => r.status === 'completed' && r.markdown);

  if (completedResults.length === 0) {
    return null;
  }

  // 全ページのMarkdownを結合
  const combinedMarkdown = completedResults
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((r) => r.markdown)
    .join('\n\n---\n\n');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Markdown出力
        </h3>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 max-h-96 overflow-y-auto">
        <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-mono">
          {combinedMarkdown}
        </pre>
      </div>
    </div>
  );
}
