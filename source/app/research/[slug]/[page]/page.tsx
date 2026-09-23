import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DataTable } from "@/components/site/data-table";
import { Breadcrumbs, PageHero } from "@/components/site/page-shell";
import { chunkRows, getResearchSet } from "@/lib/data";

type Props = { params: Promise<{ slug: string; page: string }> };

const slugs = ["people", "bibliography", "recordings", "lineage", "sources", "timeline", "institutions", "search"] as const;

export async function generateStaticParams() {
  return slugs.flatMap((slug) => {
    const set = getResearchSet(slug);
    return chunkRows(set.rows, 40).map((_chunk, index) => ({ slug, page: String(index + 1) }));
  });
}

export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug,page}=await params;if(!slugs.some(s=>s===slug))return {title:"研究資料"};const set=getResearchSet(slug);return {title:`${set.title}・第 ${page} 頁`,description:set.description,alternates:{canonical:`/research/${slug}/${page}`}}}

export default async function ResearchSetPartPage({ params }: Props) {
  const { slug, page } = await params;
  if (!slugs.some((item) => item === slug)) notFound();
  const set = getResearchSet(slug);
  const chunks = chunkRows(set.rows, 40);
  if (!/^[1-9]\d*$/.test(page)) notFound();
  const index = Number(page) - 1;
  const rows = chunks[index];
  if (!rows) notFound();

  return (
    <main>
      <Breadcrumbs items={[{ label: "首頁", href: "/" }, { label: "研究區", href: "/research" }, { label: set.title, href: `/research/${slug}` }, { label: `第 ${page} 頁` }]} />
      <PageHero eyebrow={`${set.title} / 第 ${page} 頁`} title={set.title} description={set.description} image="research" />
      <section className="section-band">
        <div className="content-wrap">
          <p className="mb-4 font-sans text-sm font-bold text-muted-foreground">顯示第 {index * 40 + 1}–{Math.min((index + 1) * 40, set.rows.length)} 筆，共 {set.rows.length} 筆</p>
          <DataTable rows={rows} columns={set.columns} caption={set.title} />
          <div className="mt-8 flex flex-wrap gap-4 font-sans font-bold text-primary">
            <Link href={`/research/${slug}`} className="underline underline-offset-4">返回分頁索引</Link>
            {index > 0 ? <Link href={`/research/${slug}/${index}`} className="underline underline-offset-4">上一頁</Link> : null}
            {index < chunks.length - 1 ? <Link href={`/research/${slug}/${index + 2}`} className="underline underline-offset-4">下一頁</Link> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
