import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {articles,getArticle,getCategory,journalSources,relatedArticles} from '@/lib/journal';
import {getTopic} from '@/lib/data';
import {Breadcrumbs} from '@/components/site/page-shell';
import {ArticleCard} from '@/components/site/journal';
type Props={params:Promise<{slug:string}>};
export async function generateStaticParams(){return articles.map(a=>({slug:a.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const a=getArticle((await params).slug);return a?{title:a.title,description:a.excerpt,alternates:{canonical:`/blog/${a.slug}`},openGraph:{type:'article',title:a.title,description:a.excerpt}}:{title:'文章不存在'}}
export default async function ArticlePage({params}:Props){
 const a=getArticle((await params).slug);if(!a)notFound();const c=getCategory(a.category);const related=relatedArticles(a);
 const schema={'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.excerpt,inLanguage:'zh-Hant-HK',datePublished:a.published,dateModified:a.published,author:{'@type':'Organization',name:'Flute Atlas'},mainEntityOfPage:`https://flute-atlas-hk.teabonvivant.chatgpt.site/blog/${a.slug}`};
 return <main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
 <Breadcrumbs items={[{label:'首頁',href:'/'},{label:'長笛誌',href:'/blog'},{label:c.title,href:`/blog?category=${c.slug}`},{label:a.title}]}/>
 <article className="journal-article"><div className="journal-opening"><header className="journal-article-head"><h1>{a.title}</h1><div className="journal-byline"><span>Flute Atlas</span><time dateTime={a.published}>2026 年 9 月 22 日</time><span>約 {a.minutes} 分鐘</span></div><p className="journal-deck">{a.excerpt}</p></header>
 <figure className="journal-cover"><img src={`/images/journal/${c.image}.webp`} alt={c.alt} width={1536} height={1024} fetchPriority="high"/><figcaption>{c.title} · {c.description}</figcaption></figure>
 </div><div className="journal-reading-grid"><aside className="journal-toc"><h2>文章目錄</h2><ol>{a.sections.filter(s=>s.heading).map((s,i)=><li key={s.heading}><a href={`#section-${i+1}`}>{s.heading}</a></li>)}</ol><Link href={`/blog?category=${c.slug}`}>更多{c.title}文章</Link></aside><div className="journal-body">
 {a.sections.slice(1).map((s,i)=><div key={s.heading}><section id={`section-${i+1}`}><h2>{s.heading}</h2>{s.paragraphs.map(p=><p key={p}>{p}</p>)}</section>{i===1&&<figure className="journal-diagram"><a href={`/images/diagrams/${a.slug}.svg`} target="_blank" rel="noreferrer" aria-label={`放大圖解：${a.diagram.caption}`}><img src={`/images/diagrams/${a.slug}.svg`} alt={a.diagram.nodes.map(n=>`${n.label}：${n.detail}`).join('；')} width={600} height={660} loading="lazy"/></a><figcaption>{a.diagram.caption}</figcaption></figure>}</div>)}
 <div className="journal-reading-links"><h2>延伸閱讀</h2><ul>{a.topics.map(n=>{const t=getTopic(n);return t?<li key={n}><Link href={`/topics/${n}`}>{t.title}</Link></li>:null})}{a.sourceIds.map(id=>{const s=journalSources.find(s=>s.id===id);return s?<li key={id}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></li>:null})}</ul></div>
 </div></div></article>
 <section className="section-band section-band-pale"><div className="content-wrap"><div className="journal-section-title"><h2 className="font-serif text-3xl text-primary">接着讀</h2><Link href="/blog">全部文章 →</Link></div><div className="journal-grid">{related.map(article=><ArticleCard key={article.slug} article={article} compact/>)}</div><nav className="journal-prev-next" aria-label="文章順序">{articles[articles.indexOf(a)-1]&&<Link href={`/blog/${articles[articles.indexOf(a)-1]!.slug}`}>← 上一篇：{articles[articles.indexOf(a)-1]!.title}</Link>}{articles[articles.indexOf(a)+1]&&<Link href={`/blog/${articles[articles.indexOf(a)+1]!.slug}`}>下一篇：{articles[articles.indexOf(a)+1]!.title} →</Link>}</nav></div></section>
 </main>
}

