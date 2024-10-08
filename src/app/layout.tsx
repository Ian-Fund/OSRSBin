import type { Metadata } from "next";
import "./app.css";
import { appName } from "@/lib/constants";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: appName,
  description: "OSRS Tile Packs for RuneLite...fill this in more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container mx-auto p-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
