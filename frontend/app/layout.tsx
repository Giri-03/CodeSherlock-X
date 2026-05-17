import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CodeSherlock X — AI Repository Intelligence",
  description:
    "Analyze any GitHub repository with AI. Get architecture insights, PR reviews, auto-generated docs, and technical debt analysis in seconds.",
  keywords: [
    "AI",
    "code analysis",
    "repository",
    "GitHub",
    "engineering",
    "documentation",
  ],
  icons: {
    icon: [
      { url: "/branding/codesherlockx-icon.png", type: "image/png" },
    ],
    shortcut: "/branding/codesherlockx-icon.png",
    apple: "/branding/codesherlockx-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}