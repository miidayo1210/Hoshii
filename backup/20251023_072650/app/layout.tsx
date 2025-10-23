import React from "react";
import type { Metadata } from "next";
// import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { NavBar } from "@/components/navbar";
import { FloatingBackground } from "@/components/FloatingBackground";

export const metadata: Metadata = {
  title: "Hoshii - Joyful Actions",
  description: "Make a positive impact with every action",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <AuthProvider>
          <FloatingBackground />
          <NavBar />
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}