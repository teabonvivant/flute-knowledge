import type { Metadata } from "next"
import type { ReactNode } from "react"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import "./globals.css"


export const metadata: Metadata = {
  metadataBase: new URL("https://flute-atlas-hk.teabonvivant.chatgpt.site"),
  title: { default: "Flute Atlas 長笛知識館", template: "%s | Flute Atlas" },
  description: "100 篇長笛誌、100 位長笛人物及 30 個知識主題。從入門、練習、合奏與聆聽，走向樂器、作品和文獻。",
  openGraph: { title: "Flute Atlas 長笛知識館", description: "學長笛、練長笛，也把人物、錄音與文獻查清楚。" }
}

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return <html lang="zh-Hant-HK" suppressHydrationWarning><head><link rel="icon" href="/favicon.svg" type="image/svg+xml" /><link rel="preload" href="/fonts/NotoSerifTC.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/NotoSansTC.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><script dangerouslySetInnerHTML={{__html:'try{var t=localStorage.getItem("flute-atlas-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}'}}/></head><body><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-card focus:px-4 focus:py-3 focus:font-sans focus:font-bold focus:text-primary focus:shadow-soft">跳至主要內容</a><SiteHeader /><div id="main-content" tabIndex={-1}>{children}</div><SiteFooter /></body></html>
}
