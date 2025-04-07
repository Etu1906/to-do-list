import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ma Liste de Tâches",
  description: "Application de gestion de tâches simple et efficace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex">
          <aside className="hidden md:block w-80 border-r border-gray-200">
            <Sidebar />
          </aside>
          <main className="flex-1 min-h-screen bg-white">{children}</main>
        </div>
      </body>
    </html>
  );
}
