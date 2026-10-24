import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
import "./concept-common.css";
import "./concept.css";
import "./case-composition.css";
import "./layout-grid.css";
import { DesignMotion } from "./design-motion";
import { PageTransition } from "./page-transition";
import { SiteNav } from "./site-nav";
import "./mobile.css";
import "./hierarchy-experiment.css";
import "./mix-studies.css";
import "./contacts.css";
import "./type-system.css";
import "./case-reader.css";
import "./visual-case.css";
import "./motion-case.css";
import "./real-covers.css";
import "./portfolio-intro.css";
import "./settings-islands.css";
import "./media-loading.css";
import "./page-grid.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#131414",
};

export const metadata: Metadata = {
  title: "Никита Карнаухов — Studio / Product Designer",
  description:
    "Портфолио продуктового дизайнера Никиты Карнаухова: продуктовые интерфейсы, исследования и дизайн-системы.",
  icons: {
    icon: "/media/avatar-2026.png",
    shortcut: "/media/avatar-2026.png",
    apple: "/media/avatar-2026.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <DesignMotion />
        <PageTransition />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
