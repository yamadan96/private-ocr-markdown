/**
 * ヘッダーコンポーネント
 */

import { FileText } from 'lucide-react';
import { PrivacyBadge } from '@/components/shared/PrivacyBadge';

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Private OCR to Markdown
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                完全ローカル処理のOCR変換
              </p>
            </div>
          </div>
          <PrivacyBadge />
        </div>
      </div>
    </header>
  );
}
