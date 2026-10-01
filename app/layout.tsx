import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "QAZAQ HEROES — Ұлы Дала әлемі",
  description: "Өз қаһармандарыңды таны. Олардың тарихын ойна.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk">
      <body>{children}</body>
    </html>
  );
}
