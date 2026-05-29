import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/Navigation/BottomNav";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Lucas Fregonez Agenda",
  description: "Gestão pessoal — agenda, tarefas e finanças",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "LF Agenda" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F7F4EF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased animated-bg min-h-screen pb-24">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#1C1A17",
              border: "1px solid rgba(0, 0, 0, 0.10)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
              fontSize: "14px",
              fontWeight: "500",
            },
          }}
        />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
