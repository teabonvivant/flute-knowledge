"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main><section className="section-band"><div className="content-wrap max-w-3xl"><p className="eyebrow">頁面暫時未能載入</p><h1 className="display-title">資料仍然在，可以再試一次</h1><p className="mt-5 font-sans leading-8 text-muted-foreground">這可能是短暫連線問題。重新載入不會改動資料；亦可先返回首頁或搜尋人物與主題。</p><div className="mt-7 flex flex-wrap gap-3"><Button type="button" onClick={reset}>再試一次</Button><Button asChild variant="secondary"><Link href="/">返回首頁</Link></Button><Button asChild variant="secondary"><Link href="/search">搜尋全站</Link></Button></div></div></section></main>
}
