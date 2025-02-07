import type { Metadata } from "next";
import "./app.css";
import { appName } from "@/src/lib/constants";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import localFont from "next/font/local";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const runescapeFont = localFont({
  src: "../fonts/RuneScape-UF.woff2",
  display: "swap",
  // weight: "normal",
  style: "normal",
  variable: "--font-runescape",
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: appName,
  description: "OSRS Tile Packs for RuneLite...fill this in more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${runescapeFont.variable}`}>
      <body>
        <Header />
        <main className="container mx-auto p-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
