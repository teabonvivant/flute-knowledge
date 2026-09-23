import type { Metadata } from "next";
import Link from "next/link"
import { PageHero, PhraseTitle, SectionHeader } from "@/components/site/page-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { eraLabel, getPeople, personEra, personRegion, personRoles, personSummary } from "@/lib/data"

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }
function valueOf(value: string | string[] | undefined): string { return Array.isArray(value) ? value[0] ?? "" : value ?? "" }

export default async function MastersPage({ searchParams }: Props) {
  const params = await searchParams
  const query = valueOf(params["q"]).trim()
  const era = valueOf(params["era"])
  const people = getPeople()
  const eras = [...new Set(people.flatMap((person) => person.era ? [person.era] : []))].sort()
  const aliases:Record<string,string>={"柏林愛樂":"Berlin Philharmonic","巴黎音樂院":"Paris Conservatoire","倫敦交響樂團":"London Symphony","茱莉亞":"Juilliard","柯蒂斯":"Curtis"};
  const needle = (aliases[query]||query).toLocaleLowerCase("zh-Hant-HK")
  const filtered = people.filter((person) => (!needle || `${person.name_zh} ${person.name_en} ${personSummary(person)} ${personRegion(person)} ${personRoles(person)} ${person.country_region} ${person.roles} ${person.school_lineage} ${person.major_posts} ${person.core_topics}`.toLocaleLowerCase("zh-Hant-HK").includes(needle)) && (!era || person.era === era))
  return (
    <main>
      <PageHero eyebrow="一百位名家" title={<PhraseTitle parts={["一百位長笛家，", "按時代和職涯整理"]} />} description="演奏家、老師和製作者按時代、地區、學派、職位與曲目整理。記得中文名或英文姓氏都可以搜尋，也可以由一個年代慢慢認識。" image="performance" />
      <section className="section-band section-band-pale"><div className="content-wrap">
        <SectionHeader eyebrow="人物總覽" title="名字、地域、學派，記得哪一項便由哪一項找" />
        <form action="/masters" role="search" className="grid gap-3 rounded-md border bg-card p-4 md:grid-cols-[1fr_240px_auto]">
          <label className="grid gap-2 font-sans text-sm font-bold text-primary" htmlFor="flute-master-query">搜尋人物<Input id="flute-master-query" name="q" type="search" defaultValue={query} placeholder="例如：Boehm、法國、柏林愛樂" /></label>
          <label className="grid gap-2 font-sans text-sm font-bold text-primary" htmlFor="flute-era">時代<select id="flute-era" name="era" defaultValue={era} className="min-h-11 rounded-md border border-input bg-card px-3 font-sans font-normal"><option value="">全部時代</option>{eras.map((item) => <option key={item} value={item}>{eraLabel(item)}</option>)}</select></label>
          <Button type="submit" className="self-end">套用篩選</Button>
        </form>
        <p className="mt-4 font-sans text-sm font-bold text-muted-foreground" role="status" aria-live="polite">顯示 {filtered.length} / {people.length} 位人物{query || era ? <> · <Link href="/masters" className="text-primary underline underline-offset-4">清除條件</Link></> : null}</p>
        {filtered.length > 0 ? <div className="directory-grid">{filtered.map((person) => <Link key={person.id} href={`/masters/${person.id}`} className="group directory-card"><Badge>{personEra(person) || "人物檔案"}</Badge><h2 className="mt-4 font-serif text-xl font-medium text-primary group-hover:underline">{person.name_zh || person.name_en}</h2><p className="mt-1 font-sans text-sm text-muted-foreground">{person.name_en}</p><p className="mt-3 font-sans text-sm leading-6 text-muted-foreground">{personSummary(person)}</p></Link>)}</div> : <div className="mt-5 rounded-md border border-dashed bg-card p-6 font-sans text-muted-foreground">沒有相符人物。可改用英文姓氏或清除時代條件。</div>}
      </div></section>
    </main>
  )
}

export const metadata:Metadata={"title": "100 位長笛人物", "description": "閱讀 100 位長笛演奏家、教師與製作者的工作、師承、作品及可追查來源。", "alternates": {"canonical": "/masters"}};

