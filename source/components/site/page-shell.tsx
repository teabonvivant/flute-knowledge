import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import categories from "@/data/journal-categories.json";

const protectedCjkPhrases = [
  "到第一張值得細聽的唱片",
  "一百位長笛人物",
  "再走進一百位長笛人物",
  "便有再查下去的價值",
  "都整理成網頁",
  "毋須先下載檔案",
  "記得中文名或英文姓氏",
  "按關鍵字或用途",
  "知識主題和研究用途",
  "可以返回索引或直接搜尋",
  "你可以返回索引或直接搜尋",
  "你可以按關鍵字或用途",
  "風格的核心文獻",
  "方便研究核對",
  "怎樣才算做到",
  "錄音與文獻",
  "錄音和文獻",
  "需要進一步",
  "重拾長笛",
  "英文姓氏",
  "整理成網頁",
  "預定時間",
  "時間和聲音",
  "當代聲響",
  "人物和樂器",
  "放回時代",
  "各自重視",
  "重量和維修",
  "不必華麗",
  "能指出",
  "下次回來",
  "研究資料",
  "資料檔",
  "完整資料",
  "聲音問題",
  "教學與風格",
  "演奏法",
  "力度改變",
  "並列出",
  "才不會",
  "第一張值得細聽的唱片",
  "返回索引或直接搜尋",
  "再查下去的價值",
  "關鍵字或用途",
  "或英文姓氏",
  "中文名或英文姓氏",
  "長笛教學",
  "長笛人物",
  "固定下來",
  "核心文獻",
  "研究用途",
  "仍保留"
] as const;

const cjkSegmenter = new Intl.Segmenter("zh-Hant-HK", { granularity: "word" });

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  image?: string;
};

export function PageHero({ eyebrow, title, description, image = "research" }: PageHeroProps) {
  const mapped: Record<string,string> = {learn:"beginning",practice:"daily",listen:"listening",culture:"history",research:"reading",performance:"stage"};
  const artwork = categories.find((category) => category.image === (mapped[image] || image)) || categories[0]!;
  return (
    <section className="page-hero">
      <div className="content-wrap page-hero-grid">
        <div className="page-hero-copy">
          <h1 className="display-title">{typeof title === "string" ? <CjkText text={title} /> : title}</h1>
          <p className="page-hero-description"><CjkText text={description} /></p>
        </div>
        <figure className="page-hero-art">
          <img src={`/images/journal/${artwork.image}.webp`} alt={artwork.alt} width={1536} height={1024} loading="eager" fetchPriority="high" />
        </figure>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="section-heading">
      <div><h2 className="phrase-aware-title">{typeof title === "string" ? <CjkText text={title} /> : title}</h2>
      {children ? <div className="section-description">{typeof children === "string" ? <CjkText text={children} /> : children}</div> : null}</div>
    </div>
  );
}

export function PhraseTitle({ parts }: { parts: readonly string[] }) {
  return <>{parts.map((part, index) => <Fragment key={`${index}-${part}`}>{index > 0 ? <wbr /> : null}<span className="cjk-chunk">{part}</span></Fragment>)}</>
}

export function CjkText({ text, phrases = [], maxChars = 8 }: { text: string; phrases?: readonly string[]; maxChars?: number }) {
  const protectedPhrases = [...new Set([...phrases, ...protectedCjkPhrases])]
    .filter(Boolean)
    .sort((left, right) => right.length - left.length)
  const pattern = new RegExp(`(${protectedPhrases.map(escapeRegExp).join("|")})`, "g")
  const protectedSet = new Set(protectedPhrases)
  const tokens = text.split(pattern).flatMap((part) => {
    if (!part) return []
    if (protectedSet.has(part)) return [{ text: part, wordLike: true }]
    return Array.from(cjkSegmenter.segment(part), (segment) => ({ text: segment.segment, wordLike: Boolean(segment.isWordLike) }))
  })
  const chunks: string[] = []
  let current = ""
  const flush = () => {
    if (current) chunks.push(current)
    current = ""
  }
  for (const token of tokens) {
    if (token.wordLike && current && [...current].length + [...token.text].length > maxChars) flush()
    current += token.text
    if (!token.wordLike && /[，。；！？：、,.;!?]/u.test(token.text)) flush()
  }
  flush()
  return <>{chunks.map((chunk, index) => <Fragment key={`${index}-${chunk}`}>{index > 0 ? <wbr /> : null}<span className="cjk-chunk">{chunk}</span></Fragment>)}</>
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function Breadcrumbs({ items }: { items: readonly Readonly<{ label: string; href?: string }>[] }) {
  return <nav className="content-wrap pt-5 font-sans text-sm text-muted-foreground" aria-label="頁面位置"><ol className="flex flex-wrap items-center gap-2">{items.map((item, index) => <li key={`${item.href ?? "current"}-${item.label}`} className="inline-flex items-center gap-2">{index > 0 ? <span aria-hidden="true">/</span> : null}{item.href ? <Link href={item.href} className="font-bold text-primary underline decoration-primary/25 underline-offset-4">{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>
}
