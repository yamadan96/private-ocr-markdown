/**
 * テンプレート適用ロジック
 * テンプレートごとにMarkdown出力を調整
 */

import type { TemplateType } from '@/store/types';

/**
 * テンプレートを適用してMarkdownを変換
 * @param markdown 元のMarkdown
 * @param templateType テンプレートタイプ
 * @returns テンプレート適用後のMarkdown
 */
export function applyTemplate(markdown: string, templateType: TemplateType): string {
  switch (templateType) {
    case 'minutes':
      return applyMinutesTemplate(markdown);
    case 'paper':
      return applyPaperTemplate(markdown);
    case 'invoice':
      return applyInvoiceTemplate(markdown);
    default:
      return markdown;
  }
}

/**
 * 議事録テンプレートを適用
 */
function applyMinutesTemplate(markdown: string): string {
  let result = markdown;

  // 日時、場所、参加者などのキーワードを強調
  result = result
    .replace(/^(日時|日付|Date)[:：\s]/gm, '## 📅 日時\n')
    .replace(/^(場所|Location)[:：\s]/gm, '## 📍 場所\n')
    .replace(/^(参加者|出席者|Attendees)[:：\s]/gm, '## 👥 参加者\n')
    .replace(/^(議題|Agenda)[:：\s]/gm, '## 📝 議題\n')
    .replace(/^(決定事項|Decisions)[:：\s]/gm, '## ✅ 決定事項\n')
    .replace(/^(TODO|To Do|やること)[:：\s]/gm, '## 📋 TODO\n')
    .replace(/^(議論|Discussion)[:：\s]/gm, '## 💬 議論\n')
    .replace(/^(次回|Next)[:：\s]/gm, '## ⏭️ 次回\n');

  return result;
}

/**
 * 論文テンプレートを適用
 */
function applyPaperTemplate(markdown: string): string {
  let result = markdown;

  // 論文構造のキーワードを強調
  result = result
    .replace(/^(Abstract|概要|要約)[:：\s]/gm, '## Abstract\n')
    .replace(/^(Introduction|はじめに|序論)[:：\s]/gm, '## 1. Introduction\n')
    .replace(/^(Background|背景)[:：\s]/gm, '## 2. Background\n')
    .replace(/^(Method|手法|方法)[:：\s]/gm, '## 3. Method\n')
    .replace(/^(Results|結果)[:：\s]/gm, '## 4. Results\n')
    .replace(/^(Discussion|考察)[:：\s]/gm, '## 5. Discussion\n')
    .replace(/^(Conclusion|結論)[:：\s]/gm, '## 6. Conclusion\n')
    .replace(/^(References?|参考文献)[:：\s]/gm, '## References\n');

  return result;
}

/**
 * 請求書テンプレートを適用
 */
function applyInvoiceTemplate(markdown: string): string {
  let result = markdown;

  // 請求書特有のキーワードを強調
  result = result
    .replace(/^(請求書|Invoice)[:：\s]/gm, '# 📄 請求書\n\n')
    .replace(/^(発行日|Date)[:：\s]/gm, '**発行日**: ')
    .replace(/^(請求番号|Invoice No)[:：\s]/gm, '**請求番号**: ')
    .replace(/^(宛先|To|御中)[:：\s]/gm, '## 📮 宛先\n')
    .replace(/^(発行元|From)[:：\s]/gm, '## 🏢 発行元\n')
    .replace(/^(明細|Items|内訳)[:：\s]/gm, '## 📊 明細\n')
    .replace(/^(合計|Total|小計|Subtotal)[:：\s]/gm, '## 💰 合計\n')
    .replace(/^(備考|Notes)[:：\s]/gm, '## 📝 備考\n');

  return result;
}

/**
 * テンプレートの説明を取得
 * @param templateType テンプレートタイプ
 * @returns テンプレートの説明
 */
export function getTemplateDescription(templateType: TemplateType): string {
  switch (templateType) {
    case 'minutes':
      return '会議の議事録形式。日時、場所、参加者、議題、決定事項などを自動整形します。';
    case 'paper':
      return '論文・レポート形式。Abstract、Introduction、Method、Resultsなどの章立てを強調します。';
    case 'invoice':
      return '請求書・帳票形式。発行元、宛先、明細、合計などを構造化して出力します。';
    default:
      return '標準形式';
  }
}
