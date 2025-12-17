/**
 * Markdown変換のためのReact Hook
 */

'use client';

import { useCallback } from 'react';
import { MarkdownConverter } from '@/lib/markdown/converter';
import { applyTemplate } from '@/lib/markdown/templates';
import type { LineData, TemplateType } from '@/store/types';

/**
 * Markdown変換を管理するカスタムフック
 */
export function useMarkdown() {
  /**
   * 行データをMarkdownに変換
   * @param lines 行データの配列
   * @param templateType テンプレートタイプ
   * @returns Markdown形式のテキスト
   */
  const convertToMarkdown = useCallback(
    (lines: LineData[], templateType: TemplateType = 'minutes'): string => {
      if (!lines || lines.length === 0) {
        return '';
      }

      try {
        // Markdown変換エンジンを使用
        const converter = new MarkdownConverter();
        let markdown = converter.convert(lines);

        // テンプレートを適用
        markdown = applyTemplate(markdown, templateType);

        return markdown;
      } catch (error) {
        console.error('Markdown conversion error:', error);
        // エラー時はプレーンテキストにフォールバック
        return lines.map((line) => line.text).join('\n');
      }
    },
    []
  );

  /**
   * Markdownをクリップボードにコピー
   * @param markdown Markdownテキスト
   */
  const copyToClipboard = useCallback(async (markdown: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(markdown);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  /**
   * Markdownをファイルとしてダウンロード
   * @param markdown Markdownテキスト
   * @param filename ファイル名
   */
  const downloadMarkdown = useCallback((markdown: string, filename: string = 'output.md') => {
    try {
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download markdown:', error);
    }
  }, []);

  return {
    convertToMarkdown,
    copyToClipboard,
    downloadMarkdown,
  };
}
