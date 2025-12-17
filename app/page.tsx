'use client';

import { Header } from '@/components/layout/Header';
import { DropZone } from '@/components/upload/DropZone';
import { ProgressBar } from '@/components/processing/ProgressBar';
import { MarkdownPreview } from '@/components/editor/MarkdownPreview';
import { ExportButtons } from '@/components/editor/ExportButtons';
import { useAppStore } from '@/store/useAppStore';
import { useOcr } from '@/hooks/useOcr';
import { Settings } from 'lucide-react';

export default function Home() {
  const { files, template, language, setTemplate, setLanguage, isProcessing } =
    useAppStore();
  const { startProcessing, cancelProcessing } = useOcr();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 設定セクション */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                設定
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* 言語選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  認識言語
                </label>
                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as 'jpn' | 'eng' | 'jpn+eng')
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={isProcessing}
                >
                  <option value="jpn+eng">日本語 + 英語</option>
                  <option value="jpn">日本語のみ</option>
                  <option value="eng">英語のみ</option>
                </select>
              </div>

              {/* テンプレート選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  出力形式
                </label>
                <select
                  value={template}
                  onChange={(e) =>
                    setTemplate(e.target.value as 'minutes' | 'paper' | 'invoice')
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={isProcessing}
                >
                  <option value="minutes">議事録</option>
                  <option value="paper">論文・レポート</option>
                  <option value="invoice">請求書・帳票</option>
                </select>
              </div>
            </div>
          </div>

          {/* アップロードセクション */}
          {files.length === 0 ? (
            <DropZone />
          ) : (
            <div className="space-y-4">
              {/* ファイルリスト */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  アップロード済みファイル ({files.length})
                </h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {file.file.name}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {file.type === 'pdf' ? 'PDF' : '画像'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 処理ボタン */}
              <div className="flex gap-4">
                {!isProcessing ? (
                  <button
                    onClick={startProcessing}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    OCR処理を開始
                  </button>
                ) : (
                  <button
                    onClick={cancelProcessing}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                  >
                    処理をキャンセル
                  </button>
                )}
                <button
                  onClick={() => useAppStore.getState().clearFiles()}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-md transition-colors"
                  disabled={isProcessing}
                >
                  クリア
                </button>
              </div>

              {/* 進捗表示 */}
              {files.some((f) => f.results.length > 0) && (
                <>
                  <ProgressBar results={files.flatMap((f) => f.results)} />
                  <MarkdownPreview results={files.flatMap((f) => f.results)} />
                  <ExportButtons results={files.flatMap((f) => f.results)} />
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
