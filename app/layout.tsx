
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BONIT AI",
  description: "Your intelligent AI workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
