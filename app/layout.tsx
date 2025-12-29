import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeSpec",
  description: "Where do you want to wake up?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
