import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AuthButton } from "@/components/auth/AuthButton";
import { FloatingBackground } from "@/components/FloatingBackground";

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
        <AuthProvider>
          <main className="min-h-screen relative">
            {/* 動く背景要素 */}
            <FloatingBackground />
            
            {/* 認証ボタン */}
            <div className="fixed top-4 right-4 z-50">
              <AuthButton />
            </div>
            
            {/* メインコンテンツ */}
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}