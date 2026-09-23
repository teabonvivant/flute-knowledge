import type { Metadata } from "next";
import { JournalShelf } from "@/components/site/journal"
import Link from "next/link"
import { CjkText, SectionHeader } from "@/components/site/page-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPeople, getTopics, personSummary, personEra } from "@/lib/data"

const entrances = [
  { title: "我想慢慢讀", href: "/blog", text: "一百篇長笛誌，從第一堂課、日常練習，讀到舞台與音樂生活。" },
  { title: "我想查知識", href: "/topics", text: "三十個專題，連起技巧、曲目、樂器聲學與長笛文化。" },
  { title: "我想開始學", href: "/learn", text: "先吹穩一個音，再把呼吸、手指和短旋律慢慢接起來。" },
  { title: "我想練得更好", href: "/practice", text: "每張練習卡只處理一個問題，按自己的狀態安排短段練習。" },
  { title: "我想聽好音樂", href: "/listen", text: "由一張錄音開始，學會比較年代、學派與演奏選擇。" },
  { title: "我想認識名家", href: "/masters", text: "一百位演奏家、老師與製作者，連同師承和錄音一起看。" },
  { title: "我想選笛保養", href: "/instrument", text: "試反應、音準與手感，也計清機械狀態和日後維修。" },
  { title: "我想深入研究", href: "/research", text: "人物、文獻、錄音、師承和來源，按問題逐層查下去。" }
] as const

export default function HomePage() {
  const featuredIds = new Set(["FM001", "FM002", "FM007", "FM012", "FM020", "FM026", "FM066", "FM069"])
  const featured = getPeople().filter(person=>featuredIds.has(person.id))
  const topics=getTopics()
  return <main className="home-page">
    <section className="home-opening content-wrap">
      <div className="home-cover">
        <img src="/images/design/quiet-headjoint.webp" alt="自然光落在木桌上的銀色長笛笛頭、亞麻布與翻開的樂譜。" width={1774} height={887} decoding="async" fetchPriority="high"/>
        <div className="home-cover-type"><h1>長笛知識館</h1><p>長笛圖書館<br/>練習室<br/>研究資料館</p></div>
      </div>
      <div className="home-introduction">
        <p className="home-hero-description"><CjkText text="從第一個音，到第一張值得細聽的唱片，再走進一百位長笛人物的學派、錄音與文獻。今天想學、想練、想聽，揀一件事做就好。"/></p>
        <div className="hero-actions"><Link href="/blog">閱讀長笛誌</Link><Link href="/learn">開始第一課</Link><Link href="/search">搜尋人物與主題</Link></div>
      </div>
    </section>
    <JournalShelf title="長笛誌：讓音樂走進日常"/>
    <section className="section-band section-band-pale"><div className="content-wrap">
      <SectionHeader eyebrow="從這裏出發" title="你今天來到這裏，最想做哪一件事？"/>
      <form action="/search" role="search" className="home-search"><label htmlFor="home-search">已有名字或問題？直接搜尋<Input id="home-search" name="q" type="search" placeholder="例如：Boehm、音色、保養"/></label><Button type="submit">搜尋全站</Button></form>
      <div className="entrance-grid">{entrances.map(item=><Link key={item.href} href={item.href} className="entrance-link"><div><h2>{item.title}</h2><p>{item.text}</p></div><span className="entrance-action">打開路線</span></Link>)}</div>
    </div></section>
    <section className="section-band"><div className="content-wrap">
      <SectionHeader eyebrow="名家精選" title="八位人物，連起長笛史的演奏與教學"/>
      <div className="home-people">{featured.map(person=><article key={person.id}><p className="person-era">{personEra(person)}</p><h3><Link href={`/masters/${person.id}`}>{person.name_zh||person.name_en}</Link></h3><p className="person-name-en">{person.name_en}</p><p className="person-summary">{personSummary(person)}</p></article>)}</div>
      <Button asChild variant="secondary" className="mt-8"><Link href="/masters">搜尋全部一百位人物</Link></Button>
    </div></section>
    <section className="section-band section-band-pale"><div className="content-wrap">
      <SectionHeader eyebrow="知識主題" title="三十個專題，從基本功讀到長笛文化"/>
      <div className="home-topics">{topics.slice(0,6).map(topic=><Link href={`/topics/${topic.number}`} key={topic.number}><span className="topic-number">主題 {topic.number}</span><h3>{topic.title}</h3><p>{topic.description}</p></Link>)}</div>
      <Button asChild variant="secondary" className="mt-8"><Link href="/topics">查看全部主題</Link></Button>
    </div></section>
  </main>
}
export const metadata:Metadata={"title": "Flute Atlas 長笛知識館", "description": "100 篇長笛誌、100 位長笛人物、30 個知識主題。由學習、練習與聆聽，走進長笛的聲音和文化。", "alternates": {"canonical": "/"}};

