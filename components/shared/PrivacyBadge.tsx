/**
 * プライバシーバッジコンポーネント
 * 「外部送信なし」を強調表示
 */

import { Shield } from 'lucide-react';

export function PrivacyBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full border border-green-300 dark:border-green-700">
      <Shield className="w-5 h-5" />
      <span className="font-medium text-sm">完全ローカル処理 - 外部送信なし</span>
    </div>
  );
}
