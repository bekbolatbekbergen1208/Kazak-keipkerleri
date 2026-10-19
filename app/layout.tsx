import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./theme.css";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fffefa",
};
export const metadata: Metadata = {
  title: "Қазақ қаһармандары — Ер Төстік және оның достары",
  description:
    "Қазақ ертегілерінің кейіпкерлерін заманауи бейнеде таны. Ер Төстік, Желаяқ, Таусоғар, Сұңқаркөз, Саққұлақ және Көлтауысар.",
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
