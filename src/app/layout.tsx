import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdSpy Lite — Meta Ad Library Scraper & Competitor Research",
  description: "Browse, save, and analyze Facebook & Instagram ads from Meta Ad Library. Competitor research tool for digital marketers, agencies, and e-commerce sellers.",
  keywords: ["AdSpy", "Meta Ad Library", "Facebook ads", "Instagram ads", "competitor research", "ad spy tool", "marketing"],
  authors: [{ name: "AdSpy Lite" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AdSpy Lite — Meta Ad Library Scraper",
    description: "Save, organize, and analyze competitor Facebook & Instagram ads.",
    siteName: "AdSpy Lite",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var s=JSON.parse(localStorage.getItem('adspy-lite-store')||'{}');var t=(s.state&&s.state.theme)||'light';if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();` }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
          <SonnerToaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
