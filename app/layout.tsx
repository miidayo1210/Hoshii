import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hoshii - Joyful Actions",
  description: "Make a positive impact with every action",
  manifest: "/manifest.json",
  themeColor: "#a855f7",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hoshii",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen pb-20">
          {children}
        </main>
        <NavBar />
      </body>
    </html>
  );
}


