import type { Metadata } from "next";
import { JournalShelf } from "@/components/site/journal"
import Link from "next/link"
import { PageHero, PhraseTitle, SectionHeader } from "@/components/site/page-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const cards = [
  { title: "長音", time: "8 分鐘", task: "低、中、高音域各選一音。每個音輕起、維持、自然收尾，然後做一次漸強漸弱。", listen: "音頭有沒有先漏氣、音高中心會否移動、弱奏是否仍有核心。", check: "三個音區的反應可以預計；力度改變時，嘴唇沒有咬緊，肩膀也沒有抬起。", avoid: "秒數長不代表聲音好，吹得更響也不一定更集中。", href: "/topics/15" },
  { title: "音階與指法", time: "10 分鐘", task: "只練一個調，連奏、分組和吐音各一次；標出兩組最容易漏鍵或搶拍的換指。", listen: "每個經過音是否存在，拇指、小指和手腕有沒有因難點固定。", check: "在三個相差不大的速度保持同樣節拍、音準和指距。", avoid: "不要每次由頭衝到尾；先修兩音連接，再放回整條音階。", href: "/topics/21" },
  { title: "吐音", time: "8 分鐘", task: "同一節奏先用連奏，之後加入輕單吐。練雙吐時，把前、後舌分開錄，平衡了才交替。", listen: "音頭前有沒有爆氣、後舌會否較短、氣流是否在每個音之間停住。", check: "音頭清楚，音值仍完整；換一個速度，拍子和前後舌的音色仍接近。", avoid: "清晰不應靠喉部壓迫，也不要把整段時間花在追逐單音極速。", href: "/topics/18" },
  { title: "音色", time: "12 分鐘", task: "選一條弱奏樂句，唱出方向；用三個很小的氣流角度變化，找出最自由而有核心的一個。", listen: "音色一變，音準、反應和樂句方向是否也跟着變？不要只記明或暗。", check: "弱奏仍能起音，跨音區不會突然變空；放回樂句後，高點比單吹長音更清楚。", avoid: "沒有一個外形固定的『漂亮口型』。近距離錄音，也代替不了場地中的投射。", href: "/topics/15" },
  { title: "音準", time: "10 分鐘", task: "暖笛後校準 A，再關掉讀數完成八度、五度和三度；最後放入實際和弦。", listen: "先說出偏差方向和差拍速度，再選氣流、下顎或替代指法作最小修正。", check: "修正後音色、動態和身體自由仍在，並能在合奏角色中重複。", avoid: "不要大幅滾入滾出，只為令調音器顯示置中。", href: "/topics/20" },
  { title: "樂句", time: "15 分鐘", task: "在旋律上圈出和聲高點、落點、重音和換氣。唱一次，只吹骨幹音一次，再還原全句。", listen: "力度或時間的高點是否來得太早？呼吸有沒有切斷語意？合作聲部何時接話？", check: "聽者說得出句子往哪裏去；重複句的改變有理由，不是習慣性漸強。", avoid: "一個長髮夾不是樂句分析，照抄一張錄音也不是讀譜。", href: "/topics/22" }
] as const

const diagnoses = [
  { symptom: "第一個音常先漏氣", test: "拿走舌頭和手指難度，只吹舒適中音三次。", next: "先核對氣流與吹孔，再進入口型與發音原理。", href: "/topics/17" },
  { symptom: "高音愈吹愈尖薄", test: "保持音量接近，由中音轉八度，只改氣流速度。", next: "檢查音色目標和吹氣路徑，不以更大壓力代替。", href: "/topics/15" },
  { symptom: "吐音清楚但旋律碎裂", test: "錄同一句連奏與輕單吐，對齊每個音值。", next: "先恢復連續氣流，再選符合句法的音頭。", href: "/topics/18" },
  { symptom: "長音準，入曲便走音", test: "在原和弦與力度下持續該音，先聽其他聲部。", next: "由和聲角色、溫度和力度重新判斷音準。", href: "/topics/20" },
  { symptom: "音階中間多出雜音", test: "關掉吐音，以極慢速度錄影最差的兩音連接。", next: "檢查鍵的同步、手指距離和替代指法。", href: "/topics/21" },
  { symptom: "每句到尾都沒有氣", test: "先唱出高點和落點，標記句首放氣量與換氣位置。", next: "重分氣量與句法，不以吸得最滿作唯一答案。", href: "/topics/16" }
] as const

export default function PracticePage() {
  return (
    <main>
      <PageHero eyebrow="我想練得更好" title={<PhraseTitle parts={["每天集中處理", "一個聲音問題"]} />} description="每張卡只集中處理一個聲音問題，並列出做法、聆聽重點和完成標準。練到預定時間仍未改善，便停下來找原因，免得反覆練錯。" image="practice" />
      <section className="section-band"><div className="content-wrap"><SectionHeader eyebrow="每日練習卡" title="揀一個問題練，錄下來，再決定是否需要多做一遍" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <Card key={card.title}><CardHeader><Badge>{card.time}</Badge><CardTitle>{card.title}</CardTitle></CardHeader><CardContent className="grid gap-4 font-sans text-sm leading-6 text-muted-foreground"><p>{card.task}</p><p><strong className="text-primary">要聽：</strong>{card.listen}</p><p><strong className="text-primary">做到甚麼：</strong>{card.check}</p><p><strong className="text-wine">要避開：</strong>{card.avoid}</p><Link href={card.href} className="font-bold text-primary underline underline-offset-4">讀相關主題 →</Link></CardContent></Card>)}</div></div></section>
      <section className="section-band section-band-pale"><div className="content-wrap"><SectionHeader eyebrow="小診斷" title="同一個失誤，可以用一個小測試查出由哪裏開始" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{diagnoses.map((item) => <Card key={item.symptom}><CardHeader><Badge>聽見問題</Badge><CardTitle>{item.symptom}</CardTitle></CardHeader><CardContent className="grid gap-4 font-sans text-sm leading-6 text-muted-foreground"><p><strong className="text-primary">做個測試：</strong>{item.test}</p><p><strong className="text-primary">接着處理：</strong>{item.next}</p><Link href={item.href} className="font-bold text-primary underline underline-offset-4">打開診斷內容 →</Link></CardContent></Card>)}</div></div></section>
    <JournalShelf category="daily" title="練習室裏的十篇札記" /></main>
  )
}

export const metadata:Metadata={"title": "每日長笛練習", "description": "安排音色、發音、節奏、音準與換指練習，用可聽見的改變建立每天的練習方向。", "alternates": {"canonical": "/practice"}};
