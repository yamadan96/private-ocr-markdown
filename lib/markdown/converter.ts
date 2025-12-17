/**
 * Markdown変換エンジン
 * Tesseract.jsの座標データ（Bounding Box）を活用してMarkdownに変換
 */

import type { LineData } from '@/store/types';

type BlockType = 'text' | 'list' | 'code' | 'table' | 'heading';

/**
 * Markdown変換クラス
 */
export class MarkdownConverter {
  private avgLineHeight: number = 0;

  /**
   * 行データをMarkdownに変換
   * @param lines 行データの配列
   * @param templateType テンプレートタイプ（将来の拡張用）
   * @returns Markdown形式のテキスト
   */
  public convert(lines: LineData[], templateType?: string): string {
    if (lines.length === 0) {
      return '';
    }

    // 平均行高を計算
    this.avgLineHeight = this.calculateAvgHeight(lines);

    let markdown = '';
    let currentBlockType: BlockType = 'text';
    let tableBuffer: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const prevLine = i > 0 ? lines[i - 1] : null;
      const nextLine = i < lines.length - 1 ? lines[i + 1] : null;

      // 空行をスキップ
      if (line.text.trim().length === 0) {
        continue;
      }

      // 1. 見出し判定
      if (this.isHeading(line, prevLine, nextLine)) {
        // テーブルバッファをフラッシュ
        if (tableBuffer.length > 0) {
          markdown += this.flushTableBuffer(tableBuffer);
          tableBuffer = [];
        }

        const level = this.getHeadingLevel(line);
        markdown += `\n\n${'#'.repeat(level)} ${line.text}\n\n`;
        currentBlockType = 'heading';
        continue;
      }

      // 2. 箇条書き判定
      if (this.isListItem(line)) {
        // テーブルバッファをフラッシュ
        if (tableBuffer.length > 0) {
          markdown += this.flushTableBuffer(tableBuffer);
          tableBuffer = [];
        }

        markdown += `\n- ${this.cleanListText(line.text)}`;
        currentBlockType = 'list';
        continue;
      }

      // 3. コードブロック判定
      if (this.isCodeBlock(line)) {
        // テーブルバッファをフラッシュ
        if (tableBuffer.length > 0) {
          markdown += this.flushTableBuffer(tableBuffer);
          tableBuffer = [];
        }

        if (currentBlockType !== 'code') {
          markdown += '\n\n```\n';
        }
        markdown += line.text + '\n';
        currentBlockType = 'code';

        // 次の行がコードブロックでなければ閉じる
        if (!nextLine || !this.isCodeBlock(nextLine)) {
          markdown += '```\n\n';
          currentBlockType = 'text';
        }
        continue;
      }

      // 4. 表の判定
      if (this.isTableLine(line)) {
        tableBuffer.push(line.text);
        currentBlockType = 'table';
        continue;
      } else {
        // 表が終わった場合はフラッシュ
        if (tableBuffer.length > 0) {
          markdown += this.flushTableBuffer(tableBuffer);
          tableBuffer = [];
        }
      }

      // 5. 通常の段落
      if (this.shouldMergeWithPrev(line, prevLine)) {
        // 前の行と結合（改行なし）
        markdown += ' ' + line.text;
      } else {
        // 新しい段落として追加
        markdown += `\n\n${line.text}`;
      }
      currentBlockType = 'text';
    }

    // 最後にテーブルバッファをフラッシュ
    if (tableBuffer.length > 0) {
      markdown += this.flushTableBuffer(tableBuffer);
    }

    return markdown.trim();
  }

  /**
   * 見出しかどうかを判定
   */
  private isHeading(
    line: LineData,
    prevLine: LineData | null,
    nextLine: LineData | null
  ): boolean {
    // ルール1: 平均より1.5倍以上大きい
    const isLarge = line.lineHeight > this.avgLineHeight * 1.5;

    // ルール2: 短い行かつ末尾に句読点がない
    const isShort = line.text.length < 30;
    const noPunctuation = !/[。．.？！\?,!]$/.test(line.text);

    // ルール3: 前後に空白がある（y座標の差が大きい）
    const hasSpaceBefore =
      !prevLine || line.bbox.y0 - prevLine.bbox.y1 > this.avgLineHeight * 0.8;
    const hasSpaceAfter =
      !nextLine || nextLine.bbox.y0 - line.bbox.y1 > this.avgLineHeight * 0.8;

    return (isLarge || (isShort && noPunctuation)) && hasSpaceBefore && hasSpaceAfter;
  }

  /**
   * 見出しのレベルを取得
   */
  private getHeadingLevel(line: LineData): number {
    // 行高に基づいてレベルを決定
    const ratio = line.lineHeight / this.avgLineHeight;

    if (ratio >= 2.0) return 1; // # 見出し1
    if (ratio >= 1.5) return 2; // ## 見出し2
    return 3; // ### 見出し3
  }

  /**
   * 箇条書きかどうかを判定
   */
  private isListItem(line: LineData): boolean {
    return /^[・\-*※●○◆◇■□]/.test(line.text.trim()) || /^\d+[\.\)]/.test(line.text.trim());
  }

  /**
   * コードブロックかどうかを判定
   */
  private isCodeBlock(line: LineData): boolean {
    // ルール1: 記号密度が高い
    const symbolCount = (line.text.match(/[{}()\[\];=<>+\-*\/\\|]/g) || []).length;
    const symbolDensity = symbolCount / line.text.length;

    // ルール2: インデントがある
    const hasIndent = /^[ \t]{4,}/.test(line.text);

    return symbolDensity > 0.2 || hasIndent;
  }

  /**
   * 表の行かどうかを判定
   */
  private isTableLine(line: LineData): boolean {
    // 連続する2つ以上の大きな空白（全角スペース2つ分以上）があれば列とみなす
    const columns = line.text.split(/\s{2,}/);
    return columns.length >= 2 && columns.every((col) => col.trim().length > 0);
  }

  /**
   * 前の行と結合すべきかを判定
   */
  private shouldMergeWithPrev(line: LineData, prevLine: LineData | null): boolean {
    if (!prevLine) return false;

    // 垂直距離が近い
    const distY = line.bbox.y0 - prevLine.bbox.y1;
    const isClose = distY < line.lineHeight * 0.5;

    // 前の行が句読点で終わっていない
    const noPunctuation = !/[。．.？！\?,!]$/.test(prevLine.text);

    return isClose && noPunctuation;
  }

  /**
   * テーブルバッファをMarkdownテーブルに変換
   */
  private flushTableBuffer(buffer: string[]): string {
    if (buffer.length === 0) return '';

    let markdown = '\n\n';

    // ヘッダー行
    const headerCols = buffer[0].split(/\s{2,}/).map((col) => col.trim());
    markdown += '| ' + headerCols.join(' | ') + ' |\n';

    // 区切り行
    markdown += '| ' + headerCols.map(() => '---').join(' | ') + ' |\n';

    // データ行
    for (let i = 1; i < buffer.length; i++) {
      const cols = buffer[i].split(/\s{2,}/).map((col) => col.trim());
      markdown += '| ' + cols.join(' | ') + ' |\n';
    }

    markdown += '\n';
    return markdown;
  }

  /**
   * 箇条書きのテキストをクリーンアップ
   */
  private cleanListText(text: string): string {
    return text.replace(/^[・\-*※●○◆◇■□\d+[\.\)]\s*/, '').trim();
  }

  /**
   * 平均行高を計算
   */
  private calculateAvgHeight(lines: LineData[]): number {
    if (lines.length === 0) return 0;
    const total = lines.reduce((sum, line) => sum + line.lineHeight, 0);
    return total / lines.length;
  }
}
