/**
 * エクスポートボタンコンポーネント
 */

'use client';

import { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { useMarkdown } from '@/hooks/useMarkdown';
import type { OCRResult } from '@/store/types';

interface ExportButtonsProps {
  results: OCRResult[];
}

export function ExportButtons({ results }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { copyToClipboard, downloadMarkdown } = useMarkdown();

  const completedResults = results.filter((r) => r.status === 'completed' && r.markdown);

  if (completedResults.length === 0) {
    return null;
  }

  // 全ページのMarkdownを結合
  const combinedMarkdown = completedResults
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((r) => r.markdown)
    .join('\n\n---\n\n');

  const handleCopy = async () => {
    const success = await copyToClipboard(combinedMarkdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadMarkdown(combinedMarkdown, 'output.md');
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleCopy}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            コピーしました！
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            Markdownをコピー
          </>
        )}
      </button>
      <button
        onClick={handleDownload}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
      >
        <Download className="w-5 h-5" />
        ダウンロード (.md)
      </button>
    </div>
  );
}
