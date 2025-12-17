/**
 * 画像前処理ユーティリティ
 * OCR精度向上のための画像最適化
 */

/**
 * 画像をグレースケールに変換
 * @param blob 元の画像Blob
 * @returns グレースケール化されたBlob
 */
export async function convertToGrayscale(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // 画像を描画
      ctx.drawImage(img, 0, 0);

      // ピクセルデータを取得してグレースケール化
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = gray; // R
        data[i + 1] = gray; // G
        data[i + 2] = gray; // B
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((b) => {
        URL.revokeObjectURL(url);
        if (b) {
          resolve(b);
        } else {
          reject(new Error('Failed to convert to blob'));
        }
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 画像をリサイズ
 * @param blob 元の画像Blob
 * @param maxWidth 最大幅
 * @param maxHeight 最大高さ
 * @returns リサイズされたBlob
 */
export async function resizeImage(
  blob: Blob,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // アスペクト比を維持してリサイズ
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((b) => {
        URL.revokeObjectURL(url);
        if (b) {
          resolve(b);
        } else {
          reject(new Error('Failed to convert to blob'));
        }
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * BlobをDataURLに変換
 * @param blob Blob
 * @returns DataURL文字列
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
