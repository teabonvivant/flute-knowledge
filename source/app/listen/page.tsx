import type { Metadata } from "next";
import { JournalShelf } from "@/components/site/journal"
import Link from "next/link"
import { PageHero, PhraseTitle, SectionHeader } from "@/components/site/page-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const routes = [
  { title: "第一次細聽長笛錄音", focus: "跟着呼吸、音頭和持續音，聽一句旋律怎樣往前走。", first: "完整聽一遍，不寫評論；第二遍只記三個時間點。", compare: "把兩個版本調至相近的主觀音量，才比較速度、音頭和句法。", boundary: "母帶、咪高峰和串流音量都會改變音色，差異未必全來自演奏者。", href: "/topics/04" },
  { title: "學派與師承", focus: "由師承、院校、樂器與錄音年代理解傳承，國籍形容詞暫時放下。", first: "找同一作品、年代相近的兩位演奏者，只寫耳朵確實聽到的差異。", compare: "查兩人的老師、職位和常用樂器，再看哪些差異能在多段錄音中重複聽見。", boundary: "『法國透明、德國厚重』最多是一個待驗的假設，不能當結論。", href: "/topics/03" },
  { title: "協奏曲的舞台感", focus: "聽獨奏如何進場、穿過樂團、與聲部對話及回到結構。", first: "分別記下第一次進場、主題回歸和華彩後收束。", compare: "同一樂章比較樂團密度、速度和獨奏音色核心的調整。", boundary: "錄音後製會改變平衡；現場投射必須以場地和合作排練重新判斷。", href: "/topics/10" },
  { title: "巴羅克與古長笛", focus: "聽舞曲步伐、和聲重音、交叉指法音色與裝飾功能。", first: "先跟低音聲部聽一遍，再聽長笛如何延遲或強調和聲。", compare: "用 traverso 與現代長笛版本比較音準、吐音和動態反應。", boundary: "歷史演奏不是少顫音的單一模板；樂器、調律、地區和年代都要交代。", href: "/topics/11" },
  { title: "奏鳴曲與室內樂", focus: "把注意力由長笛獨奏移到聲部之間的提問、回答和共同呼吸。", first: "第一遍只跟鋼琴或弦樂，標出它何時帶出轉折。", compare: "第二遍聽長笛何時融入、何時突出，以及氣口是否配合其他聲部。", boundary: "伴奏不是背景；沒有閱讀其他聲部，就不能完整判斷樂句。", href: "/topics/07" },
  { title: "二十世紀與當代聲響", focus: "先辨認音高、節奏、音色、空間和靜默，不急着數技巧或判斷好聽。", first: "畫一條音色時間線，標出三次最重要的聲音轉換。", compare: "回到譜面核對每個特殊音響的開始、結束和結構功能。", boundary: "偶然做到一次不等於可演奏；指法、氣流、動態和樂器都要記錄。", href: "/topics/13" }
] as const

export default function ListenPage() {
  return <main><PageHero eyebrow="我想聽好音樂" title={<PhraseTitle parts={["先完整聽一遍，", "再查作品和版本"]} />} description="六條路線各有第一遍的聽法、版本比較和需要留神的限制。聆聽筆記不必華麗，能指出時間和聲音，便有再查下去的價值。" image="listen" /><section className="section-band section-band-pale"><div className="content-wrap"><SectionHeader eyebrow="聆聽路線" title="六種情境，各有不同的聆聽重點" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{routes.map((route) => <Card key={route.title}><CardHeader><Badge>聆聽任務</Badge><CardTitle>{route.title}</CardTitle></CardHeader><CardContent className="grid gap-4 font-sans text-sm leading-6 text-muted-foreground"><p>{route.focus}</p><p><strong className="text-primary">先聽一遍：</strong>{route.first}</p><p><strong className="text-primary">換個版本：</strong>{route.compare}</p><p><strong className="text-wine">別忘了：</strong>{route.boundary}</p><Link href={route.href} className="font-bold text-primary underline underline-offset-4">打開相關導聽 →</Link></CardContent></Card>)}</div></div></section><JournalShelf category="listening" title="給耳朵多一點閱讀" /></main>
}

export const metadata:Metadata={"title": "長笛聆聽路線", "description": "由作品、演奏者與錄音版本開始，聆聽長笛的音色、樂句、風格與合作。", "alternates": {"canonical": "/listen"}};
