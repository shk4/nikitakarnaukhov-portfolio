import type { Metadata, Viewport } from "next";
import "@fontsource-variable/onest";
import "./globals.css";
import "./concept-common.css";
import "./concept.css";
import "./case-composition.css";
import "./layout-grid.css";
import { DesignMotion } from "./design-motion";
import { PageTransition } from "./page-transition";
import { MediaLoading } from "./media-loading";
import { SiteEffects } from "./site-effects";
import { SiteNav } from "./site-nav";
import "./mobile.css";
import "./hierarchy-experiment.css";
import "./studies.css";
import "./mix-studies.css";
import "./contacts.css";
import "./type-system.css";
import "./case-reader.css";
import "./visual-case.css";
import "./motion-case.css";

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
        <SiteEffects />
        <DesignMotion />
        <PageTransition />
        <MediaLoading />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
