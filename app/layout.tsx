import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Private OCR to Markdown",
  description: "完全ローカル処理のOCR to Markdown変換アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
