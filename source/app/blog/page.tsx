import type {Metadata} from 'next';
import Link from 'next/link';
import {articles,editorialArticles,journalCategories} from '@/lib/journal';
import {ArticleCard} from '@/components/site/journal';
import {Breadcrumbs} from '@/components/site/page-shell';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
export const metadata:Metadata={title:'長笛誌｜一百篇學習與聆聽文章',description:'由初遇長笛、聲音細節、節奏讀譜，到合奏、樂器文化與舞台。每篇附主題插畫及練習圖解。',alternates:{canonical:'/blog'}};
type Params=Record<string,string|string[]|undefined>;
const value=(v:Params[string])=>Array.isArray(v)?v[0]??'':v??'';
export default async function BlogPage({searchParams}:{searchParams:Promise<Params>}){
 const params=await searchParams;
 const q=value(params.q).trim(); const requested=value(params.category);
 const category=journalCategories.find(c=>c.slug===requested);
 const matches=(category?articles:editorialArticles).filter(a=>(!category||a.category===category.slug)&&(!q||`${a.title} ${a.excerpt} ${a.sections.flatMap(s=>s.paragraphs).join(' ')}`.toLocaleLowerCase().includes(q.toLocaleLowerCase())));
 const count=Math.ceil(matches.length/12);const page=Math.min(Math.max(1,Number.parseInt(value(params.page))||1),Math.max(1,count));
 const pageHref=(n:number)=>{const p=new URLSearchParams();if(category)p.set('category',category.slug);if(q)p.set('q',q);if(n>1)p.set('page',String(n));return '/blog'+(p.size?'?'+p:'')};
 return <main><Breadcrumbs items={[{label:'首頁',href:'/'},{label:'長笛誌'}]}/><header className="journal-index-head content-wrap"><div><h1>長笛誌</h1><p className="journal-index-intro">練習室裏的一口氣，唱片裏的一句話。<br/>把長笛的技術、日常與文化，慢慢讀進耳朵。</p><div className="journal-index-rule"><span>{articles.length} 篇文章</span><span>{journalCategories.length} 個閱讀主題</span></div></div><figure><img src="/images/journal/reading.webp" alt="燈光照着樂譜與長笛的閱讀桌。" width={1536} height={1024} fetchPriority="high"/></figure></header>
 <section className="content-wrap pb-20"><nav className="journal-categories" aria-label="博客分類"><Link href="/blog" aria-current={!category?'page':undefined}>全部文章</Link>{journalCategories.map(c=><Link key={c.slug} href={`/blog?category=${c.slug}`} aria-current={c.slug===category?.slug?'page':undefined}>{c.title}</Link>)}</nav>
 <form action="/blog" role="search" className="journal-search">{category&&<input type="hidden" name="category" value={category.slug}/>}<label htmlFor="journal-search" className="sr-only">搜尋博客文章</label><Input id="journal-search" type="search" name="q" defaultValue={q} placeholder="搜尋文章、技巧或一個練習問題"/><Button type="submit">搜尋文章</Button></form>
 <div className="journal-results"><h2>{category?.title??'所有文章'}</h2><p>{q?`「${q}」· `:''}{matches.length} 篇{count>1?` · 第 ${page} / ${count} 頁`:''}</p></div>
 {category&&<p className="mb-8 font-sans text-muted-foreground">{category.description}</p>}
 {matches.length?<div className={page===1&&!category&&!q?"journal-grid journal-grid-featured":"journal-grid"}>{matches.slice((page-1)*12,page*12).map(a=><ArticleCard key={a.slug} article={a}/>)}</div>:<div className="journal-empty"><h3>沒有相符文章</h3><p>試試較短的關鍵字，或選擇上方的閱讀主題。</p><Link href="/blog">查看全部文章</Link></div>}
 {count>1&&<nav className="journal-pagination" aria-label="博客分頁">{page>1&&<Link rel="prev" href={pageHref(page-1)}>上一頁</Link>}{Array.from({length:count},(_,i)=><Link key={i} href={pageHref(i+1)} aria-label={`第 ${i+1} 頁`} aria-current={page===i+1?'page':undefined}>{i+1}</Link>)}{page<count&&<Link rel="next" href={pageHref(page+1)}>下一頁</Link>}</nav>}
 </section></main>
}

