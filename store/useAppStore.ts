import { create } from 'zustand';
import type { FileInfo, TemplateType, LanguageType } from './types';

/**
 * アプリケーション全体の状態を管理するZustandストア
 */
interface AppState {
  // 状態
  files: FileInfo[];
  currentFileId: string | null;
  template: TemplateType;
  language: LanguageType;
  isProcessing: boolean;
  cancelRequested: boolean;

  // アクション
  addFiles: (files: File[]) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  setCurrentFile: (fileId: string | null) => void;
  setTemplate: (template: TemplateType) => void;
  setLanguage: (language: LanguageType) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setCancelRequested: (cancelRequested: boolean) => void;
  updateFileResult: (fileId: string, pageNumber: number, updates: Partial<FileInfo['results'][0]>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 初期状態
  files: [],
  currentFileId: null,
  template: 'minutes',
  language: 'jpn+eng',
  isProcessing: false,
  cancelRequested: false,

  // アクション実装
  addFiles: (newFiles: File[]) => {
    set((state) => {
      const fileInfos: FileInfo[] = newFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        pageCount: file.type.includes('pdf') ? 0 : 1, // PDFのページ数は後で更新
        results: [],
      }));
      return { files: [...state.files, ...fileInfos] };
    });
  },

  removeFile: (fileId: string) => {
    set((state) => ({
      files: state.files.filter((f) => f.id !== fileId),
      currentFileId: state.currentFileId === fileId ? null : state.currentFileId,
    }));
  },

  clearFiles: () => {
    set({ files: [], currentFileId: null });
  },

  setCurrentFile: (fileId: string | null) => {
    set({ currentFileId: fileId });
  },

  setTemplate: (template: TemplateType) => {
    set({ template });
  },

  setLanguage: (language: LanguageType) => {
    set({ language });
  },

  setIsProcessing: (isProcessing: boolean) => {
    set({ isProcessing });
  },

  setCancelRequested: (cancelRequested: boolean) => {
    set({ cancelRequested });
  },

  updateFileResult: (fileId: string, pageNumber: number, updates: Partial<FileInfo['results'][0]>) => {
    set((state) => ({
      files: state.files.map((file) => {
        if (file.id !== fileId) return file;

        const resultIndex = file.results.findIndex((r) => r.pageNumber === pageNumber);
        if (resultIndex === -1) {
          // 新しい結果を追加
          return {
            ...file,
            results: [
              ...file.results,
              {
                pageNumber,
                status: 'pending',
                progress: 0,
                ...updates,
              },
            ],
          };
        }

        // 既存の結果を更新
        const newResults = [...file.results];
        newResults[resultIndex] = {
          ...newResults[resultIndex],
          ...updates,
        };

        return {
          ...file,
          results: newResults,
        };
      }),
    }));
  },
}));
