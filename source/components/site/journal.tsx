import Link from 'next/link';
import { articles, editorialArticles, getCategory, type Article } from '@/lib/journal';

export function ArticleCard({article,compact=false}:{article:Article;compact?:boolean}) {
 const category=getCategory(article.category);
 return <article className={compact?"journal-card journal-card-compact":"journal-card"}>
  {!compact && <Link className="journal-card-image" href={`/blog/${article.slug}`} tabIndex={-1} aria-hidden="true"><img src={`/images/journal/${category.image}.webp`} alt="" width={768} height={512} loading="lazy" /></Link>}
  <div className="journal-card-copy"><p className="journal-meta">{category.title} <span>·</span> 約 {article.minutes} 分鐘</p><h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3><p className="journal-excerpt">{article.excerpt}</p><Link className="journal-read" href={`/blog/${article.slug}`} aria-label={`閱讀：${article.title}`}>閱讀全文</Link></div>
 </article>
}

export function JournalShelf({category,title='從這裏繼續讀',topics}:{category?:string;title?:string;topics?:string[]}){
 const picks=(category?articles:editorialArticles).filter(a=>category?a.category===category:topics?a.topics.some(t=>topics.includes(t)):true).slice(0,3);
 if(!picks.length)return null;
 return <section className="section-band journal-shelf"><div className="content-wrap"><div className="journal-section-title"><h2>{title}</h2><Link href={category?`/blog?category=${category}`:'/blog'}>閱讀全部文章</Link></div><div className="journal-shelf-grid">{picks.map(a=><ArticleCard key={a.slug} article={a}/>)}</div></div></section>
}
