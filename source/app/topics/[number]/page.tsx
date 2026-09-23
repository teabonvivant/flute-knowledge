import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, PageHero, SectionHeader } from "@/components/site/page-shell";
import { JournalShelf } from "@/components/site/journal";
import { getCsv, getPeople, getTopic, getTopics, personSummary, personEra } from "@/lib/data";
import { getTopicGuide, getTopicGuideSources } from "@/lib/topic-guides";
import { getRelatedPeopleForTopic } from "@/lib/topic-people";
import expansionData from "@/data/topic-expansions.json";
type Props={params:Promise<{number:string}>};
const expansions:Record<string,string[]>=expansionData;
export async function generateStaticParams(){return getTopics().map(t=>({number:t.number}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const t=getTopic((await params).number);return {title:t?.title??"知識主題",description:t?.description,...(t?{alternates:{canonical:`/topics/${t.number}`}}:{})}}
const images:Record<string,string>={"01":"stage","02":"reading","03":"history","04":"listening","05":"reading","06":"reading","07":"reading","08":"reading","09":"ensemble","10":"stage","11":"history","12":"history","13":"listening","14":"tone","15":"tone","16":"tone","17":"beginning","18":"rhythm","19":"tone","20":"ensemble","21":"rhythm","22":"reading","23":"daily","24":"stage","25":"daily","26":"instrument","27":"instrument","28":"history","29":"history","30":"reading"};
export default async function TopicPage({params}:Props){
 const topic=getTopic((await params).number);if(!topic)notFound();
 const guide=getTopicGuide(topic);const sources=getTopicGuideSources(guide);
 const people=getRelatedPeopleForTopic(topic,getPeople(),getCsv("person_topic_map.csv"));
 const list=getTopics();const index=list.findIndex(t=>t.number===topic.number);
 return <main><Breadcrumbs items={[{label:"首頁",href:"/"},{label:"知識主題",href:"/topics"},{label:topic.title}]}/>
 <PageHero eyebrow={`知識主題 ${topic.number} · ${guide.status}`} title={topic.title} description={topic.description} image={images[topic.number]||"reading"}/>
 <section className="section-band"><div className="content-wrap"><article className="topic-reading rounded-md border bg-card p-6 lg:p-10">
 <h2 className="font-serif text-3xl leading-snug text-primary">{guide.question}</h2><div className="article-prose mt-6">{guide.paragraphs.map(p=><p key={p}>{p}</p>)}</div>
 <h3 className="mt-9 font-serif text-2xl text-primary">把理解帶到實際音樂裏</h3><div className="article-prose mt-4">{expansions[topic.number]?.map(p=><p key={p}>{p}</p>)}</div>
 <div className="mt-8 grid gap-6 md:grid-cols-2"><div className="rounded-md bg-accent/45 p-5"><h3 className="font-serif text-xl text-primary">聆聽與觀察</h3><ul className="mt-3 list-disc space-y-3 pl-5 text-base leading-7">{guide.listenFor.map(t=><li key={t}>{t}</li>)}</ul></div><div className="rounded-md border p-5"><h3 className="font-serif text-xl text-primary">試着做一次</h3><ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-7">{guide.steps.map(t=><li key={t}>{t}</li>)}</ol></div></div>
 <p className="mt-6 text-base leading-8 text-muted-foreground">{guide.caution}</p>
 <div className="mt-8 border-t pt-6"><h3 className="font-serif text-xl text-primary">延伸閱讀</h3><ul className="mt-4 grid gap-3 md:grid-cols-2">{sources.map(s=><li key={s.id}><a href={s.url} target="_blank" rel="noreferrer" className="block rounded-md border p-4 text-sm leading-6 hover:border-primary"><strong className="text-primary">{s.label} ↗</strong><span className="mt-1 block text-muted-foreground">{s.scope}</span></a></li>)}</ul></div>
 </article></div></section>
 {people.length>0&&<section className="section-band section-band-pale"><div className="content-wrap"><SectionHeader eyebrow="人物閱讀" title="在演奏與教學中認識這個主題"/><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{people.map(p=><Link key={p.id} href={`/masters/${p.id}`} className="rounded-md border bg-card p-5"><p className="eyebrow">{personEra(p)}</p><h3 className="font-serif text-xl text-primary">{p.name_zh}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{personSummary(p)}</p></Link>)}</div></div></section>}
 <JournalShelf topics={[topic.number]} title="與這個主題一起讀"/>
 <nav className="content-wrap mb-12 flex flex-wrap justify-between gap-5 font-bold text-primary" aria-label="前後知識主題">{index>0?<Link href={`/topics/${list[index-1]!.number}`}>← {list[index-1]!.title}</Link>:<span/>}{index<list.length-1&&<Link href={`/topics/${list[index+1]!.number}`}>{list[index+1]!.title} →</Link>}</nav>
 </main>
}
