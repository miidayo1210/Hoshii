/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        hoshii: {
          green: "#8BC89E",    // 森の緑
          green2: "#B8DBC5",   // 若葉
          mint: "#E1F2E8",     // ミント
          earth: "#D4A574",    // 大地
          sky: "#A8D5E2",      // 空
          sand: "#F5E6D3",     // 砂浜
          ink: "#2C3E3D",      // 深い森
        },
        community: {
          purple: "#8B5CF6",   // コミュニティ紫
          purple2: "#A78BFA",  // ライト紫
          lavender: "#DDD6FE", // ラベンダー
          violet: "#EDE9FE",   // バイオレット
          indigo: "#6366F1",   // インディゴ
          blue: "#3B82F6",     // ブルー
          teal: "#14B8A6",     // ティール
          emerald: "#10B981",  // エメラルド
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 6px 20px rgba(0,0,0,0.06)",
        card: "0 12px 28px rgba(0,0,0,0.08)",
      },
      fontSize: {
        base: "16.5px",
        lg: "18px",
      },
    },