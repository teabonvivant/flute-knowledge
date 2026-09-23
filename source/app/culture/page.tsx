import type { Metadata } from "next";
import { JournalShelf } from "@/components/site/journal"
import Link from "next/link";
import { PageHero, PhraseTitle, SectionHeader } from "@/components/site/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTopics } from "@/lib/data";

export default function CulturePage() {
  const topics = getTopics().filter((topic) => ["03", "05", "06", "11", "12", "13", "26", "28", "29"].includes(topic.number));
  return (
    <main>
      <PageHero eyebrow="我想了解長笛文化" title={<PhraseTitle parts={["從樂器和錄音，", "了解學派與傳承"]} />} description="由 Boehm、法國學派和古長笛，讀到當代聲響、女性與多元研究。把人物和樂器放回時代，才聽得清不同傳統各自重視甚麼。" image="culture" />
      <section className="section-band section-band-pale">
        <div className="content-wrap">
          <SectionHeader eyebrow="文化主題" title={<PhraseTitle parts={["從歷史和學派，", "讀到今天的問題"]} />} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topics.map((topic) => (
              <Card key={topic.number}>
                <CardHeader><CardTitle><Link href={`/topics/${topic.number}`}>{topic.title}</Link></CardTitle></CardHeader>
                <CardContent className="font-sans text-sm text-muted-foreground">{topic.description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    <JournalShelf category="history" title="沿着長笛的歷史再走一步" /></main>
  );
}

export const metadata:Metadata={"title": "長笛文化", "description": "從歷史樂器、師承與作品，走向長笛在不同時代和音樂文化中的角色。", "alternates": {"canonical": "/culture"}};
