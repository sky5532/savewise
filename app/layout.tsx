import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaveWise",
  description: "Make saving feel achievable.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}