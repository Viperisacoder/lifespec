import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { AppHeader } from "@/app/components/AppHeader";

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
      <body style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <AuthProvider>
          <AppHeader />
          <main className="pt-20">
            {children}
          </main>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
