import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D_CertVault - AI Certificate Management",
  description: "Upload Once. Showcase Everywhere.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}