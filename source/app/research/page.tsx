import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, PhraseTitle, SectionHeader } from "@/components/site/page-shell";
import { LineIcon } from "@/components/site/icons";

const sets = [
  ["人", "people", "100 位人物資料", "人物、年代、地區、角色、學派與重要性。"],
  ["文", "bibliography", "文獻與閱讀資料", "方法書、研究書目、訪談與館藏線索。"],
  ["音", "recordings", "錄音與曲目資料", "錄音、曲目、版本與聆聽入口。"],
  ["承", "lineage", "師承與學派關係", "老師、學生、影響與學派傳承。"],
  ["源", "sources", "人物來源索引", "傳記、機構、文獻與館藏來源。"],
  ["年", "timeline", "人物時間線", "人物事件、日期與背景。"],
  ["獎", "institutions", "機構與職位資料", "樂團、音樂院及教學工作。"],
  ["查", "search", "錄音與學術搜尋入口", "學術查證與延伸搜尋。"]
];

export default function ResearchPage() {
  return (
    <main>
      <PageHero eyebrow="研究區" title="資料可以查，也應該讀得明" description="人物、文獻、錄音、師承和來源都整理成網頁。日常查找毋須先下載檔案；需要進一步整理時，再查閱或下載完整資料。" image="research" />
      <section className="section-band section-band-pale">
        <div className="content-wrap">
          <SectionHeader eyebrow="網站內資料庫" title={<PhraseTitle parts={["先在網頁查找，", "需要時再下載資料"]} />} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {sets.map(([icon, slug, title, text]) => (
              <Link key={slug as string} href={`/research/${slug}`} className="rounded-md border bg-card p-5 shadow-line hover:-translate-y-0.5 hover:bg-accent">
                <LineIcon label={icon as string} className="mb-5" />
                <h2 className="font-serif text-xl font-medium text-primary">{title as string}</h2>
                <p className="mt-3 font-sans text-sm leading-6 text-muted-foreground">{text as string}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export const metadata:Metadata={"title": "長笛研究資料", "description": "查閱人物、書目、作品與錄音、師承、來源、時間線和機構資料，下載公開資料檔。", "alternates": {"canonical": "/research"}};
