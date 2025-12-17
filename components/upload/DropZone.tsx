/**
 * ドラッグ&ドロップゾーンコンポーネント
 */

'use client';

import { useCallback, useState } from 'react';
import { Upload, FileImage, FileText } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function DropZone() {
  const [isDragActive, setIsDragActive] = useState(false);
  const addFiles = useAppStore((state) => state.addFiles);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        // 画像とPDFのみを許可
        const validFiles = files.filter(
          (file) =>
            file.type.startsWith('image/') || file.type === 'application/pdf'
        );
        if (validFiles.length > 0) {
          addFiles(validFiles);
        }
      }
    },
    [addFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        addFiles(Array.from(files));
      }
    },
    [addFiles]
  );

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
      }`}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*,application/pdf"
        multiple
        onChange={handleFileInput}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center gap-4"
      >
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
          <Upload className="w-12 h-12 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ファイルをドラッグ&ドロップ
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            または<span className="text-blue-600 dark:text-blue-400 underline">
              クリックしてファイルを選択
            </span>
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <FileImage className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              PNG, JPG, WebP
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">PDF</span>
          </div>
        </div>
      </label>
    </div>
  );
}
