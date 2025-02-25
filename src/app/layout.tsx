import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "../components/ui/sonner"
import "./globals.css";

const typestarOCR = localFont({
  src: "../fonts/Typestar-OCR.woff2",
  display: "swap",
  variable: "--font-typestar-ocr",
});

export const metadata: Metadata = {
  title: "RunDeck",
  description: "Cool as fuck dev dashboard",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <body className={`${typestarOCR.variable} antialiased dark`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
