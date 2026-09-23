import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs,PageHero,SectionHeader } from "@/components/site/page-shell";
import { JournalShelf } from "@/components/site/journal";
import { getCsv,getPeople,getPerson,personEra,personRegion,personRoles,personSelectionBasis,personSummary,personTopics } from "@/lib/data";
import careersData from "@/data/person-careers.json";
const careers:Record<string,string[]>=careersData;
import notesData from "@/data/person-editorial.json";
const notes:Record<string,string>=notesData;
const relation:Record<string,string>={student_of:"曾向其學習",student:"曾指導學生",influenced_by:"受到影響"};
const topicNumber:Record<string,string>={"短笛演奏":"27","歷史演奏法":"11","當代曲目與擴展技法":"13","爵士與跨界演奏":"29","長笛聲學與製作":"26","樂團演奏與試演":"09","長笛教學法":"23","音色與口型":"15","吐音與發音":"18","呼吸與氣息":"16","音準":"20","室內樂":"07","學派與師承":"03","獨奏曲目與錄音":"04","作曲與作品":"07","音樂修辭與裝飾奏":"22","音樂文化與專業發展":"28"};
type Props={params:Promise<{id:string}>};
export async function generateStaticParams(){return getPeople().map(p=>({id:p.id}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const p=getPerson((await params).id);return {title:p?`${p.name_zh} / ${p.name_en}`:"長笛人物",description:p?personSummary(p):"",...(p?{alternates:{canonical:`/masters/${p.id}`}}:{})}}
function careerText(value:string){return value.replaceAll('assistant principal flute','助理首席長笛').replaceAll('principal piccolo','首席短笛').replaceAll('co-principal flute','聯合首席長笛').replaceAll('principal flute','首席長笛').replaceAll('assistant professor','助理教授').replaceAll('professor','教授').replaceAll('teaching','教學').replaceAll('formerly','曾任').replaceAll('previously','曾任').replaceAll('former ','曾任 ').replaceAll('international soloist','國際獨奏').replaceAll('international masterclasses','國際大師班').replaceAll('piccolo','短笛');}
export default async function PersonPage({params}:Props){
 const person=getPerson((await params).id);if(!person)notFound();const people=getPeople();const index=people.findIndex(p=>p.id===person.id);
 const topics=personTopics(person);const numbers=[...new Set(topics.map(t=>topicNumber[t]).filter((n):n is string=>Boolean(n)))];
 const lineage=getCsv("lineage_links.csv").filter(r=>r.person_id===person.id);
 const sources=getCsv("person_sources.csv").filter(r=>r.person_id===person.id&&r.url).sort((a,b)=>Number(b.source_type==="official_biography")-Number(a.source_type==="official_biography"));
 const uniqueSources=[...new Map(sources.map(r=>[r.url,r])).values()];
 const bibliographyIds=new Set(getCsv("person_bibliography_map.csv").filter(r=>r.person_id===person.id).map(r=>r.bib_id));
 const books=getCsv("bibliography_seeds.csv").filter(r=>bibliographyIds.has(r.bib_id));
 const recordings=getCsv("recording_catalog_seed.csv").filter(r=>r.person_id===person.id);
 const historical=["Baroque","19th century","late 19th century"].includes(person.era);
 return <main><Breadcrumbs items={[{label:"首頁",href:"/"},{label:"長笛人物",href:"/masters"},{label:person.name_zh||person.name_en}]}/>
 <PageHero eyebrow={personEra(person)} title={person.name_zh||person.name_en} description={`${person.name_en} · ${personRegion(person)}${person.life_dates?` · ${person.life_dates.replace(/[-–]$/," 年生").replaceAll("-","–")}`:""}`} image={historical?"history":"stage"}/>
 <section className="section-band"><div className="content-wrap grid gap-8 lg:grid-cols-[1.2fr_.8fr]"><article className="rounded-md border bg-card p-7 lg:p-9"><p className="eyebrow">人物與工作</p><h2 className="font-serif text-3xl text-primary">演奏、教學與傳承</h2><div className="article-prose mt-5"><p>{notes[person.id]||personSelectionBasis(person)}</p></div>
 <h3 className="mt-7 font-serif text-xl text-primary">演奏與教學經歷</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-8 text-muted-foreground">{(careers[person.id]||person.major_posts.split(';').filter(Boolean)).map(p=><li key={p}>{careerText(p.trim())}</li>)}</ul>
 <h3 className="mt-7 font-serif text-xl text-primary">閱讀重點</h3><div className="mt-4 flex flex-wrap gap-3">{topics.map(t=><Link key={t} href={`/topics/${topicNumber[t]||"01"}`} className="rounded-full border px-4 py-2 text-sm font-bold text-primary">{t}</Link>)}</div></article>
 <aside className="rounded-md border bg-accent/25 p-7"><h2 className="font-serif text-2xl text-primary">人物座標</h2><dl className="mt-5 grid gap-5 text-base leading-7"><div><dt className="font-bold text-primary">專業領域</dt><dd>{personRoles(person)}</dd></div><div><dt className="font-bold text-primary">活動時代</dt><dd>{personEra(person)}</dd></div><div><dt className="font-bold text-primary">地域</dt><dd>{personRegion(person)}</dd></div></dl>{lineage.length>0&&<><h3 className="mt-8 border-t pt-6 font-serif text-xl text-primary">師承與交流</h3><ul className="mt-4 space-y-3 text-sm leading-7">{lineage.map(r=>{const related=people.find(p=>p.name_en===r.related_name);return <li key={r.lineage_id}><span className="block text-muted-foreground">{relation[r.relationship_type]||r.relationship_type}</span>{related?<Link href={`/masters/${related.id}`} className="font-bold text-primary underline underline-offset-4">{related.name_zh} · {r.related_name}</Link>:<strong>{r.related_name}</strong>}{r.url&&<a href={r.url} target="_blank" rel="noreferrer" className="ml-3 text-wine underline" aria-label={`${r.related_name} 關係來源`}>來源 ↗</a>}</li>})}</ul></>}</aside></div></section>
 {books.length>0&&<section className="section-band section-band-pale"><div className="content-wrap"><SectionHeader eyebrow="書目與文章" title="由著作、訪談與教學材料繼續讀"/><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{books.map(b=><a key={b.bib_id} href={b.url} target="_blank" rel="noreferrer" className="rounded-md border bg-card p-6"><h3 className="font-serif text-xl leading-7 text-primary">{b.title} ↗</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{b.author_year}</p></a>)}</div></div></section>}
 {recordings.length>0&&<section className="section-band"><div className="content-wrap"><SectionHeader eyebrow="作品與錄音" title="在不同發行與版本之間聆聽"><p>由曲目目錄走向完整作品、合作音樂家與演出署名。</p></SectionHeader><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{recordings.slice(0,12).map(r=><a key={r.recording_id} href={r.url} target="_blank" rel="noreferrer" className="rounded-md border bg-card p-5"><h3 className="font-serif text-xl leading-7 text-primary">{r.title} ↗</h3>{r.first_release_date&&<p className="mt-3 text-sm text-muted-foreground">首次發行 · {r.first_release_date}</p>}</a>)}</div>{recordings.length>12&&<p className="mt-5"><Link href="/research/recordings" className="font-bold text-primary underline">查看完整作品與錄音目錄 →</Link></p>}</div></section>}
 <section className="section-band section-band-pale"><div className="content-wrap"><SectionHeader eyebrow="資料來源" title="人物、機構與文獻入口"/><ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{uniqueSources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="block h-full rounded-md border bg-card p-5 text-sm leading-7 text-primary"><strong>{s.source_title||new URL(s.url).hostname} ↗</strong><span className="mt-2 block text-muted-foreground">{new URL(s.url).hostname.replace(/^www\./,"")}</span></a></li>)}</ul></div></section>
 <JournalShelf topics={numbers.length?numbers:["01"]} title="由人物走向練習與聆聽"/>
 <nav aria-label="前後人物" className="content-wrap mb-12 flex flex-wrap justify-between gap-5 font-bold text-primary">{index>0?<Link href={`/masters/${people[index-1]!.id}`}>← {people[index-1]!.name_zh}</Link>:<span/>}{index<people.length-1&&<Link href={`/masters/${people[index+1]!.id}`}>{people[index+1]!.name_zh} →</Link>}</nav>
 </main>
}
