import type { Metadata } from "next";
import Link from "next/link"
import { PageHero, PhraseTitle, SectionHeader } from "@/components/site/page-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getTopics } from "@/lib/data"
import { getTopicGuide } from "@/lib/topic-guides"

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }
const groups = [
  ["人物與資料", 1, 5], ["教材與曲目", 6, 10], ["歷史與當代", 11, 14],
  ["發音與音樂", 15, 22], ["教學與職涯", 23, 25], ["樂器與文化", 26, 30]
] as const
function valueOf(value: string | string[] | undefined): string { return Array.isArray(value) ? value[0] ?? "" : value ?? "" }
function groupFor(number: string): string { const value = Number(number); return groups.find(([, start, end]) => value >= start && value <= end)?.[0] ?? "其他" }

export default async function TopicsPage({ searchParams }: Props) {
  const params = await searchParams
  const query = valueOf(params["q"]).trim()
  const group = valueOf(params["group"])
  const topics = getTopics()
  const needle = query.toLocaleLowerCase("zh-Hant-HK")
  const filtered = topics.filter((topic) => {
    const guide = getTopicGuide(topic)
    const searchable = `${topic.title} ${topic.description} ${guide.question} ${guide.listenFor.join(" ")}`.toLocaleLowerCase("zh-Hant-HK")
    return (!needle || searchable.includes(needle)) && (!group || groupFor(topic.number) === group)
  })
  return (
    <main>
      <PageHero eyebrow="三十個知識主題" title={<PhraseTitle parts={["帶着一個問題來，", "找到一個可用的答案"]} />} description="三十個主題分成六組。你可以按關鍵字或用途收窄範圍，毋須逐張卡查看。" image="research" />
      <section className="section-band section-band-pale"><div className="content-wrap">
        <SectionHeader eyebrow="主題索引" title="你此刻最想弄清楚哪一個長笛問題？" />
        <form action="/topics" role="search" className="grid gap-3 rounded-md border bg-card p-4 md:grid-cols-[1fr_240px_auto]">
          <label className="grid gap-2 font-sans text-sm font-bold text-primary" htmlFor="topic-query">搜尋主題<Input id="topic-query" name="q" type="search" defaultValue={query} placeholder="例如：音色、Boehm、保養" /></label>
          <label className="grid gap-2 font-sans text-sm font-bold text-primary" htmlFor="topic-group">知識群組<select id="topic-group" name="group" defaultValue={group} className="min-h-11 rounded-md border border-input bg-card px-3 font-sans font-normal"><option value="">全部群組</option>{groups.map(([label]) => <option key={label} value={label}>{label}</option>)}</select></label>
          <Button type="submit" className="self-end">套用篩選</Button>
        </form>
        <p className="mt-4 font-sans text-sm font-bold text-muted-foreground" role="status" aria-live="polite">顯示 {filtered.length} / {topics.length} 個主題{query || group ? <> · <Link href="/topics" className="text-primary underline underline-offset-4">清除條件</Link></> : null}</p>
        {filtered.length > 0 ? <div className="directory-grid topic-directory">{filtered.map((topic) => { const guide = getTopicGuide(topic); return <Link key={topic.number} href={`/topics/${topic.number}`} className="group directory-card"><div className="flex flex-wrap gap-2"><Badge>主題 {topic.number}</Badge><Badge variant="outline">{groupFor(topic.number)}</Badge></div><h2 className="mt-4 font-serif text-xl font-medium text-primary group-hover:underline">{topic.title}</h2><p className="mt-3 font-sans text-sm leading-6 text-muted-foreground">{topic.description}</p><p className="mt-4 border-t pt-4 font-sans text-sm font-bold leading-6 text-primary">這一課要問：{guide.question}</p></Link> })}</div> : <div className="mt-5 rounded-md border border-dashed bg-card p-6 font-sans text-muted-foreground">沒有相符主題。可縮短關鍵字或清除群組條件。</div>}
      </div></section>
    </main>
  )
}

export const metadata:Metadata={"title": "30 個長笛知識主題", "description": "按音色、呼吸、樂句、教學、樂器與文化等 30 個主題，連接文章、人物和文獻。", "alternates": {"canonical": "/topics"}};

