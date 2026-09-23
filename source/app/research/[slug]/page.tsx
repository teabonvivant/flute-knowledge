import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CjkText, PageHero, SectionHeader } from "@/components/site/page-shell";
import { PageLinks } from "@/components/site/data-table";
import { chunkRows, getResearchSet } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

const slugs = ["people", "bibliography", "recordings", "lineage", "sources", "timeline", "institutions", "search"] as const;

export async function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;if(!slugs.some(s=>s===slug))return {title:"研究資料"};const set=getResearchSet(slug);return {title:set.title,description:set.description,alternates:{canonical:`/research/${slug}`}}}

export default async function ResearchSetPage({ params }: Props) {
  const { slug } = await params;
  if (!slugs.some((item) => item === slug)) notFound();
  const set = getResearchSet(slug);
  const pages = chunkRows(set.rows, 40);
  return (
    <main>
      <Breadcrumbs items={[{ label: "首頁", href: "/" }, { label: "研究區", href: "/research" }, { label: set.title }]} />
      <PageHero eyebrow="研究資料" title={set.title} description={set.description} image="research" />
      <section className="section-band section-band-pale">
        <div className="content-wrap">
          <SectionHeader eyebrow="資料分頁" title={`共 ${set.rows.length} 筆資料`}>
            <p><CjkText text="資料分成每頁四十筆，手機閱讀和定位都較方便。選一個頁碼，便可打開該批完整表格。" phrases={["較方便", "完整表格"]} /></p>
          </SectionHeader>
          <a href={`/downloads/${set.file}`} download className="mb-6 inline-flex rounded-md border bg-card px-5 py-3 font-bold text-primary">下載完整資料 {set.file.endsWith(".json")?"JSON":"CSV"} ↓</a><PageLinks count={pages.length} base={`/research/${slug}`} />
          <Link href="/research" className="mt-8 inline-flex font-sans font-bold text-primary underline underline-offset-4">返回研究區</Link>
        </div>
      </section>
    </main>
  );
}
