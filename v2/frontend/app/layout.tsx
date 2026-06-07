import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AreaProvider } from "@/lib/AreaContext";
import { LocaleProvider } from "@/lib/LocaleContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Link from "next/link";
import PWAHandler from "@/components/PWAHandler";
import PushNotifier from "@/components/PushNotifier";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Telangana.live 2.0 | Civic Intelligence Portal",
  description: "Official hyper-local intelligence dashboard for Telangana citizens.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TL.live",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen`}>
        <LocaleProvider>
          <AreaProvider>
            <PWAHandler />
            <PushNotifier />
            
            {/* Sticky Professional Header */}
            <header className="sticky top-0 z-[100] w-full bg-white border-b border-slate-200 shadow-sm px-4 h-16 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <Link href="/" className="text-xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center text-xs">TL</span>
                    TELANGANA.LIVE
                  </Link>
                  <nav className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <Link href="/news" className="hover:text-slate-900 transition-colors">News</Link>
                     <Link href="/schemes" className="hover:text-slate-900 transition-colors">Schemes</Link>
                     <Link href="/public-works" className="hover:text-slate-900 transition-colors">Works</Link>
                  </nav>
               </div>
               <div className="flex items-center gap-4">
                  <LanguageSwitcher />
               </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
              {children}
            </main>

          </AreaProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
