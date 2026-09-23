import type { Metadata } from "next";
import { JournalShelf } from "@/components/site/journal"
import Link from "next/link"
import { PageHero, PhraseTitle, SectionHeader } from "@/components/site/page-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    time: "起步",
    title: "吹出可重複的第一個音",
    goal: "每天花五分鐘找一個舒適中音，用相近氣量連續起音三次。高音可以稍後才來。",
    listen: "留意音高何時出現、風聲佔多少、尾音是否自然；『夠大聲』不是這一課的判準。",
    check: "三次都能輕鬆發聲，下顎和肩頸可活動，音頭前沒有明顯爆氣。",
    avoid: "不要固定嘴角、抬肩吸氣，或用更大氣壓掩蓋氣流未對準吹孔。",
    href: "/topics/17"
  },
  {
    time: "連接",
    title: "讓手指和氣流一起移動",
    goal: "用三至五個音吹一條短句。連奏時氣流不斷，之後才加入輕而清楚的音頭。",
    listen: "換指之間有沒有多餘音、漏氣或拍子停頓；手指應貼近按鍵而不是抬高預備。",
    check: "慢速連奏沒有中斷，拇指和小指仍可微調，節拍不因困難換指搖動。",
    avoid: "不要用整隻手壓鍵，也不要在慢速未穩定前反覆衝刺最高速度。",
    href: "/topics/21"
  },
  {
    time: "聆聽",
    title: "建立長音與音準日課",
    goal: "在已能舒服吹奏的音域選音；逐步加入八度與五度，先聽差異，再用調音器核對。",
    listen: "聽音高偏差方向、弱奏核心和音區銜接；調音器只作最後核對。",
    check: "能先說出偏高或偏低，再以細小氣流或下顎調整修正，不大幅滾笛。",
    avoid: "不要為了讀數置中犧牲音色、身體自由或和弦中的實際功能。",
    href: "/topics/20"
  },
  {
    time: "發音",
    title: "把吐音放回樂句",
    goal: "用同一句比較連奏、輕單吐和較清楚音頭，知道每種音頭服務甚麼語氣。",
    listen: "舌頭加入後，氣流、音值和拍子是否仍完整；音頭清楚不等於越短越好。",
    check: "能在兩個速度保持相同節奏，前後音連接沒有爆氣或舌根僵硬。",
    avoid: "不要只練單音速度；吐音必須轉移到作品的重音、句法和時期風格。",
    href: "/topics/18"
  },
  {
    time: "整合",
    title: "錄音、聆聽、再調整",
    goal: "每週留下一段不重來的錄音。寫低一件值得保留的事，再挑一個最影響音樂的問題。",
    listen: "比較樂句高點、氣口、節拍和合作聲部，不以近距離音色或一次錯音判定全部。",
    check: "能用具體聲音證據決定下週任務，並在新樂段測試修正是否可以轉移。",
    avoid: "不要把錄音變成自我批判清單；一次只改一項，保留已經有效的選擇。",
    href: "/topics/22"
  }
] as const

const lessonRules = [
  { title: "一次只改一項", body: "問題可能來自氣流、口型、舌頭、手指、音準或句法。同時改五樣，最後只會不知道哪一樣真正有效。" },
  { title: "每項都要有證據", body: "錄音、錄影、調音、節拍、譜面標記或老師回饋，至少選一種；『感覺較好』仍要回到聲音驗證。" },
  { title: "不適不是進度", body: "出現痛楚、麻痺、暈眩、呼吸困難或持續緊張，便應停下來。休息或尋求專業協助，是照顧演奏生命，不是偷懶。" }
] as const

export default function LearnPage() {
  return (
    <main>
      <PageHero eyebrow="我想開始學" title={<PhraseTitle parts={["第一個音吹得自在，", "才慢慢往前走"]} />} description="這條路線寫給初學者、家長，也寫給重拾長笛的人。每一階段都說明要聽甚麼、怎樣才算做到，以及哪些技巧毋須急着學。" image="learn" />
      <section className="section-band section-band-pale">
        <div className="content-wrap">
          <SectionHeader eyebrow="學習路線" title="五個階段，逐步檢查聽覺與吹奏狀態" />
          <div className="learning-stages">
            {steps.map((step, index) => (
              <Card key={step.title}>
                <CardHeader><Badge>{step.time}</Badge><CardTitle>{index + 1}. {step.title}</CardTitle></CardHeader>
                <CardContent className="grid gap-4 font-sans text-sm leading-6 text-muted-foreground">
                  <p>{step.goal}</p>
                  <p><strong className="text-primary">要聽：</strong>{step.listen}</p>
                  <p><strong className="text-primary">完成判準：</strong>{step.check}</p>
                  <p><strong className="text-wine">不要：</strong>{step.avoid}</p>
                  <Link href={step.href} className="font-bold text-primary underline underline-offset-4">讀相關主題 →</Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="section-band">
        <div className="content-wrap">
          <SectionHeader eyebrow="課堂原則" title="基本功不止是重複，也包括知道自己正在改甚麼" />
          <div className="grid gap-4 md:grid-cols-3">
            {lessonRules.map((rule) => <Card key={rule.title}><CardHeader><CardTitle>{rule.title}</CardTitle></CardHeader><CardContent className="font-sans text-sm leading-7 text-muted-foreground">{rule.body}</CardContent></Card>)}
          </div>
          <Link href="/topics/23" className="mt-7 inline-flex min-h-11 items-center rounded-md border bg-card px-4 font-sans font-bold text-primary">查看完整長笛教學法 →</Link>
        </div>
      </section>
    <JournalShelf category="beginning" title="把第一堂課帶回日常" /></main>
  )
}

export const metadata:Metadata={"title": "開始學長笛", "description": "從第一個音到完整樂句，為初學、成人重拾與兒童學習整理清楚而循序的長笛路線。", "alternates": {"canonical": "/learn"}};
