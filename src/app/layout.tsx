import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const typestarOCR = localFont({
  src: '../fonts/Typestar-OCR.woff2', 
  display: 'swap',
  variable: '--font-typestar-ocr',
});

export const metadata: Metadata = {
  title: "Dev Dashboard",
  description: "Cool as fuck dev dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${typestarOCR.variable} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
