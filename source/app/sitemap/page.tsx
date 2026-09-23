import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-shell";
import { getTopics,getPeople } from "@/lib/data";
import { articles,journalCategories } from "@/lib/journal";
import { researchDefinitions } from "@/lib/data/research";
export const metadata:Metadata={title:"網站導覽",description:"完整瀏覽長笛誌、知識主題、人物、研究資料與學習路線。",alternates:{canonical:"/sitemap"}};
export default function Sitemap(){return <main><PageHero eyebrow="網站導覽" title="一張可以慢慢走的長笛地圖" description="從學習路線開始，也可以直接走進一篇文章、一位人物，或一個正在關心的題目。" image="reading"/><div className="content-wrap py-12 sitemap-sections">
<section><h2>學習與查閱</h2><div className="sitemap-links">{[["開始學","/learn"],["練習","/practice"],["聆聽","/listen"],["選笛與保養","/instrument"],["文化","/culture"],["長笛詞彙","/glossary"],["關於知識館","/about"],["全站搜尋","/search"]].map(([l,h])=><Link key={h} href={h!}>{l}</Link>)}</div></section>
<section><h2>長笛誌 · 100 篇</h2><div className="grid gap-8 md:grid-cols-2">{journalCategories.map(c=><div key={c.slug}><h3><Link href={`/blog?category=${c.slug}`}>{c.title} →</Link></h3><ul>{articles.filter(a=>a.category===c.slug).map(a=><li key={a.slug}><Link href={`/blog/${a.slug}`}>{a.title}</Link></li>)}</ul></div>)}</div></section>
<section><h2>30 個知識主題</h2><div className="sitemap-links">{getTopics().map(t=><Link key={t.number} href={`/topics/${t.number}`}>{t.number} · {t.title}</Link>)}</div></section>
<section><h2>100 位長笛人物</h2><div className="sitemap-links">{getPeople().map(p=><Link key={p.id} href={`/masters/${p.id}`}>{p.name_zh} <span className="text-sm text-muted-foreground">{p.name_en}</span></Link>)}</div></section>
<section><h2>研究資料與下載</h2><div className="sitemap-links">{Object.entries(researchDefinitions).map(([s,d])=><Link key={s} href={`/research/${s}`}>{d.title}</Link>)}</div></section>
</div></main>}
