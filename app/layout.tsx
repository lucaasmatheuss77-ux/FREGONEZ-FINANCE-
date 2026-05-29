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
  themeColor: "#F2EDE3",
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
              color: "#0E1A0A",
              border: "1px solid rgba(27, 58, 27, 0.15)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(27, 58, 27, 0.10)",
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
