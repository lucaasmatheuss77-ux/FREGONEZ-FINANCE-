import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/Navigation/BottomNav";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Lucas Fregonez Agenda",
  description: "Sistema de gestão pessoal — agenda, tarefas e finanças",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "LF Agenda" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A0A14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased animated-bg min-h-screen pb-20">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(15,15,30,0.95)",
              color: "#E2E8F0",
              border: "1px solid rgba(124,58,237,0.3)",
              backdropFilter: "blur(20px)",
              borderRadius: "12px",
            },
          }}
        />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
