import type { Metadata } from "next";
import { JournalShelf } from "@/components/site/journal"
import Link from "next/link"
import { PageHero, PhraseTitle, SectionHeader } from "@/components/site/page-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const items = [
  { title: "初學笛", test: "試低音 C 至中音 D 的輕起音、慢音階和弱奏；請老師走到房間另一端再聽一次。", sequence: "反應 → 音準 → 手形 → 機械 → 維修條件。", note: "型號名氣、開孔或閉孔，只是資料；學生的手形和學習環境才決定是否合用。", href: "/topics/26", linkLabel: "查看製作與聲學 →" },
  { title: "進階笛", test: "帶一段熟悉的音樂，測低音投射、高音音準、極弱反應、音色變化和快速換指。", sequence: "先用原配笛頭試奏；交叉比較前，由技師確認接合相容，每一輪只換一項。", note: "試笛現場誰吹得最大聲，往往不是長期的勝負。房間和聆聽距離要一致。", href: "/topics/26", linkLabel: "查看製作與聲學 →" },
  { title: "吹口", test: "比較輕起音、氣流阻力、弱奏回應、八度轉換和音準修正所需動作。", sequence: "先確認接合相容 → 同一笛身 → 同一樂段 → 記錄反應。", note: "吹口要配合你的氣流和管身，不是獨立、必然的升級答案。", href: "/topics/26", linkLabel: "查看吹口與管體原理 →" },
  { title: "材質", test: "未看材質資料前，先記低反應、音準、重量和動態；之後才核對銀含量、金屬、管壁和製作。", sequence: "聲音、手感、機械、維修分四欄記，不把所有差異都算到金屬頭上。", note: "材質會影響重量和製作選擇，卻不能單憑名稱預測音色或合適程度。", href: "/topics/26", linkLabel: "查看材質的判讀限制 →" },
  { title: "二手檢查", test: "逐鍵慢壓，檢查漏氣、墊片、鍵隙、管身凹痕、吹口塞位置和維修紀錄。", sequence: "外觀初檢 → 試吹 → 技師檢查 → 維修估價 → 再決定。", note: "賣家說明和一次試吹不足以判斷密封與長期維修成本。", href: "/topics/26", linkLabel: "查看製作、機械與聲學 →" },
  { title: "日常保養", test: "每次吹奏後分件除去管內水分，輕拭表面，讓墊片保持乾燥並妥善收納。", sequence: "拆笛 → 通布除濕 → 外部輕拭 → 乾爽收納。", note: "不要自行轉調整螺絲、拉彈簧、用不明清潔劑或把粉末留在墊片。", href: "https://www.yamaha.com/en/musical_instrument_guide/flute/maintenance/index.html", linkLabel: "核對官方保養步驟（另開視窗） →" }
] as const

const protocol = [
  { step: "1", title: "寫低你的使用情境", body: "程度、預算、手形、主要編制、常用場地、維修地點，以及預計用多少年。" },
  { step: "2", title: "控制比較條件", body: "同一房間、同一距離、同一樂段、相近休息時間；更換笛頭前先確認尺寸相容，每次只改一項。" },
  { step: "3", title: "由別人遠聽", body: "演奏者感到的阻力與房間聽到的投射不完全相同，兩種資料都要記。" },
  { step: "4", title: "預留冷靜期", body: "把筆記、錄音和技師意見帶走；價格較高或聲音較大，不等於長期較合適。" }
] as const

export default function InstrumentPage() {
  return (
    <main>
      <PageHero eyebrow="我想選笛／保養" title={<PhraseTitle parts={["試笛不能只看", "價錢和材質"]} />} description="試笛要聽聲音，也要看機械、手形、重量和維修條件。把比較方法固定下來，才不會在試笛室內被一個特別響的瞬間帶走。" image="instrument" />
      <section className="section-band"><div className="content-wrap"><SectionHeader eyebrow="選笛地圖" title={<PhraseTitle parts={["選笛要一併考慮", "手形、吹奏環境", "和長遠需要"]} />} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <Card key={item.title}><CardHeader><Badge>檢查項目</Badge><CardTitle>{item.title}</CardTitle></CardHeader><CardContent className="grid gap-4 font-sans text-sm leading-6 text-muted-foreground"><p><strong className="text-primary">怎樣試：</strong>{item.test}</p><p><strong className="text-primary">次序：</strong>{item.sequence}</p><p><strong className="text-wine">別單憑：</strong>{item.note}</p>{item.href.startsWith("https://") ? <a href={item.href} target="_blank" rel="noreferrer" className="font-bold text-primary underline underline-offset-4">{item.linkLabel}</a> : <Link href={item.href} className="font-bold text-primary underline underline-offset-4">{item.linkLabel}</Link>}</CardContent></Card>)}</div></div></section>
      <section className="section-band section-band-pale"><div className="content-wrap"><SectionHeader eyebrow="四步試笛" title="比較條件先固定，價錢和品牌留到最後看" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{protocol.map((item) => <Card key={item.step}><CardHeader><Badge>{item.step}</Badge><CardTitle>{item.title}</CardTitle></CardHeader><CardContent className="font-sans text-sm leading-7 text-muted-foreground">{item.body}</CardContent></Card>)}</div><div className="mt-7 grid gap-3 md:grid-cols-2"><a href="https://newt.phys.unsw.edu.au/jw/fluteacoustics.html" target="_blank" rel="noreferrer" className="rounded-md border bg-card p-4 font-sans text-sm leading-6 text-muted-foreground"><strong className="block text-primary">UNSW：長笛聲學（另開視窗）</strong><span className="mt-1 block">理解氣流、吹孔、音孔、共鳴和音準。</span></a><a href="https://www.yamaha.com/en/musical_instrument_guide/flute/maintenance/index.html" target="_blank" rel="noreferrer" className="rounded-md border bg-card p-4 font-sans text-sm leading-6 text-muted-foreground"><strong className="block text-primary">Yamaha：長笛保養（另開視窗）</strong><span className="mt-1 block">核對除濕、墊片和表面清潔步驟。</span></a></div></div></section>
    <JournalShelf category="instrument" title="笛盒內外，還有這些細節" /></main>
  )
}

export const metadata:Metadata={"title": "選笛與保養", "description": "認識長笛結構、笛頭、鍵系、試奏與日常保養，理解樂器如何配合自己的演奏。", "alternates": {"canonical": "/instrument"}};
