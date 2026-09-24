import Link from "next/link"
import { CjkText } from "@/components/site/page-shell"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return <main><section className="section-band"><div className="content-wrap max-w-3xl"><p className="eyebrow">404</p><h1 className="display-title">找不到這個頁面</h1><p className="mt-5 font-sans leading-8 text-muted-foreground"><CjkText text="網址可能已更改或輸入有誤。你可以返回人物索引，或直接搜尋全站。" phrases={["搜尋全站"]} /></p><div className="mt-7 flex flex-wrap gap-3"><Button asChild><Link href="/">返回首頁</Link></Button><Button asChild variant="secondary"><Link href="/masters">人物索引</Link></Button><Button asChild variant="secondary"><Link href="/search">搜尋全站</Link></Button></div></div></section></main>
}
