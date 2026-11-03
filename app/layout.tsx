import AccountPresence from "@/components/game/AccountPresence";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./theme.css";
import "./glass.css";
import "./gameplay.css";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f1f4fb",
};
export const metadata: Metadata = {
  title: "Қазақ қаһармандары — Ертегілер мен ойындар",
  description:
    "3-сыныпқа арналған дыбысталған «Ер Төстік» анимациялық ертегісі, ұлттық ойындар және білім тапсырмалары. Өз қаһарманыңды таңдап, ойнап үйрен.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk">
      <body>
        <svg
          width="0"
          height="0"
          aria-hidden="true"
          focusable="false"
          style={{ position: "absolute", pointerEvents: "none" }}
        >
          <defs>
            <filter
              id="glass-art-cutout"
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -5 -5 -5 0 14"
                result="keyed"
              />
              <feComposite in="keyed" in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
        </svg>
        <AccountPresence />
        {children}
      </body>
    </html>
  );
}
