import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-shell";
import { getPeople,getTopics,personSummary } from "@/lib/data";
import { researchDefinitions } from "@/lib/data/research";
import { articles,getCategory } from "@/lib/journal";
import topicExpansions from "@/data/topic-expansions.json";
import careers from "@/data/person-careers.json";
import personNotes from "@/data/person-editorial.json";
import {getTopicGuide} from "@/lib/topic-guides";
import glossary from "@/data/glossary.json";
export const metadata:Metadata={title:"全站搜尋",description:"搜尋長笛人物、100 篇長笛誌、知識主題、詞彙與研究資料。",robots:{index:false,follow:true}};
const value=(v:string|string[]|undefined)=>Array.isArray(v)?v[0]||"":v||"";
type Props={searchParams:Promise<Record<string,string|string[]|undefined>>};
export default async function SearchPage({searchParams}:Props){
 const params=await searchParams;const q=value(params.q).trim();const needle=q.toLocaleLowerCase("zh-Hant-HK");
 const items=[
 ...getPeople().map(p=>({kind:"人物",title:p.name_zh||p.name_en,detail:p.name_en+" · "+personSummary(p),href:`/masters/${p.id}`,keywords:`${p.name_en} ${p.name_zh} ${p.school_lineage} ${p.major_posts} ${p.core_topics} ${personSummary(p)} ${((careers as Record<string,string[]>)[p.id]||[]).join(' ')} ${(personNotes as Record<string,string>)[p.id]||''}`})),
 ...getTopics().map(t=>({kind:"知識主題",title:t.title,detail:t.description,href:`/topics/${t.number}`,keywords:t.description+" "+JSON.stringify(getTopicGuide(t))+" "+((topicExpansions as Record<string,string[]>)[t.number]||[]).join(" ")})),
 ...articles.map(a=>({kind:"長笛誌",title:a.title,detail:getCategory(a.category).title+" · "+a.excerpt,href:`/blog/${a.slug}`,keywords:a.sections.flatMap(s=>[s.heading,...s.paragraphs]).join(" ")})),
 ...glossary.map(t=>({kind:"詞彙",title:t.term,detail:t.description,href:`/glossary#${t.id}`,keywords:t.en+" "+t.description})),
 ...Object.entries(researchDefinitions).map(([slug,d])=>({kind:"研究資料",title:d.title,detail:d.description,href:`/research/${slug}`,keywords:d.description})),
 ...[["開始學長笛","/learn","初學、兒童、成人及重拾長笛的學習路線"],["每日練習","/practice","音色、吐音、音準、節奏與指法"],["選笛與保養","/instrument","開孔、閉孔、笛頭、清潔及維修"],["聆聽路線","/listen","錄音、作品與版本比較"],["長笛文化","/culture","歷史、學派與跨文化閱讀"]].map(([title,href,detail])=>({kind:"學習路線",title:title!,href:href!,detail:detail!,keywords:detail!}))];
 const found=needle?items.filter(i=>(i.title+" "+i.keywords).toLocaleLowerCase("zh-Hant-HK").includes(needle)):[];
 const pages=Math.max(1,Math.ceil(found.length/20));const requested=Number(value(params.page));const page=Number.isInteger(requested)?Math.min(pages,Math.max(1,requested)):1;
 const href=(n:number)=>`/search?q=${encodeURIComponent(q)}&page=${n}`;
 return <main><PageHero eyebrow="全站搜尋" title="從一個名字，或一個聲音問題開始" description="人物、文章、知識主題與詞彙，都可以在這裏找到。" image="reading"/>
 <section className="section-band section-band-pale"><div className="content-wrap"><form action="/search" role="search" className="site-search"><label htmlFor="site-q">搜尋全站</label><div><input id="site-q" name="q" type="search" defaultValue={q} placeholder="例如：音準、換氣、Boehm"/><button type="submit">搜尋</button></div></form>
 <p className="my-6 font-bold text-primary" role="status">{q?`「${q}」找到 ${found.length} 項結果`:'輸入人名、作品或正在關心的問題。'}</p>
 <div className="grid gap-4 md:grid-cols-2">{found.slice((page-1)*20,page*20).map(i=><Link key={i.href} href={i.href} className="rounded-md border bg-card p-6 hover:border-primary"><p className="eyebrow">{i.kind}</p><h2 className="font-serif text-2xl text-primary">{i.title}</h2><p className="mt-3 text-base leading-7 text-muted-foreground">{i.detail}</p></Link>)}</div>
 {q&&!found.length&&<p className="rounded-md border bg-card p-6 leading-8">沒有相符結果。試試英文姓氏或較短的關鍵字，也可以從 <Link href="/topics" className="underline">知識主題</Link> 或 <Link href="/blog" className="underline">長笛誌</Link> 開始。</p>}
 {pages>1&&<nav className="journal-pagination" aria-label="搜尋結果分頁">{page>1&&<Link href={href(page-1)}>← 上一頁</Link>}<span>第 {page} / {pages} 頁</span>{page<pages&&<Link href={href(page+1)}>下一頁 →</Link>}</nav>}
 </div></section></main>
}
