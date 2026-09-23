import Link from "next/link"
import { truncate } from "@/lib/utils"

type Row = Readonly<Record<string, string>>

const valueLabels:Record<string,string>={student_of:"曾向其學習",student:"曾指導學生",influenced_by:"受到影響",doctoral_advisor:"博士論文導師",educated_at:"就讀",employer:"工作機構",birth:"出生",death:"逝世",award:"獎項",official_biography:"機構或本人傳記",authority:"人物識別資料",encyclopedia:"百科",library_archive:"圖書館與檔案",bibliographic_catalog:"書目目錄",scholarly_index:"學術索引",Album:"專輯",Single:"單曲",EP:"迷你專輯",Broadcast:"廣播",Other:"其他發行"};
const labels: Readonly<Record<string, string>> = {
 recording_id:"錄音編號",bib_id:"書目編號",lineage_id:"關係編號",person_source_id:"來源編號",event_id:"事件編號",institution_link_id:"機構關係編號",scholarly_search_id:"搜尋編號",first_release_date:"首次發行",primary_type:"發行類型",event_type:"事件",search_type:"搜尋平台",note:"資料說明",
  id: "編號", name_zh: "中文名", name_en: "英文名", life_dates: "生卒年", era_zh: "時代", country_region: "國家／地域", country_region_zh: "國家／地域", roles: "角色", roles_zh: "身份", school_lineage: "師承／學派", major_posts: "主要職位", selection_basis: "收錄理由", selection_basis_zh: "收錄理由",
  title: "題名／作品", author_year: "作者／年份", type: "類型", related_people: "相關人物", topic_tags: "主題", notes: "備註", url: "來源連結", source: "來源", source_title: "來源名稱", source_type: "來源類型", relationship_type: "關係", related_name: "相關人物", institution_name: "機構", date_or_value: "日期／數值", place_or_context: "地點／背景", purpose: "用途"
}

const preferredTitleColumns = ["name_zh", "title", "source_title", "related_name", "institution_name", "name_en"] as const

function labelFor(column: string): string { return labels[column] ?? column.replaceAll("_", " ") }

export function DataTable({ rows, columns, caption = "研究資料" }: { rows: readonly Row[]; columns: readonly string[]; caption?: string }) {
  if (rows.length === 0) return <p className="rounded-md border border-dashed bg-card p-5 font-sans text-sm text-muted-foreground" role="status">{caption}目前沒有相符資料，可返回上方查看其他內容。</p>

  return <>
    <div className="grid min-w-0 gap-3 lg:hidden" role="list" aria-label={`${caption}，共 ${rows.length} 筆`}>
      {rows.map((row, rowIndex) => {
        const rowKey = getRowKey(row, columns, rowIndex)
        const titleColumn = getTitleColumn(row, columns)
        const title = truncate(row[titleColumn] || `第 ${rowIndex + 1} 筆資料`, 80)
        return <div key={rowKey} className="min-w-0" role="listitem"><details className="group min-w-0 overflow-hidden rounded-md border bg-card shadow-line">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-sans marker:content-none">
              <span className="min-w-0"><span className="block text-xs font-bold tracking-wide text-muted-foreground">{row["id"] || caption}</span><span className="mt-1 block break-words font-serif text-lg font-semibold leading-6 text-primary">{title}</span></span>
              <span className="shrink-0 text-xs font-bold text-brass group-open:hidden">查看</span><span className="hidden shrink-0 text-xs font-bold text-brass group-open:inline">收起</span>
            </summary>
            <dl className="grid min-w-0 gap-0 border-t bg-muted/20 font-sans">
              {columns.filter((column) => row[column]?.trim()).map((column) => <div key={column} className="grid min-w-0 gap-1 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-3"><dt className="text-xs font-bold text-primary">{labelFor(column)}</dt><dd className="min-w-0 break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{renderValue(row, column)}</dd></div>)}
            </dl>
          </details></div>
      })}
    </div>
    <div className="hidden min-w-0 max-w-full overflow-hidden lg:block">
      <div className="max-w-full overflow-x-auto rounded-md border bg-card shadow-soft focus-visible:ring-2 focus-visible:ring-ring" role="region" aria-label={`${caption}，共 ${rows.length} 筆，可左右捲動`} tabIndex={0}>
        <table className="data-table"><caption className="sr-only">{caption}，共 {rows.length} 筆。表格可左右捲動。</caption><thead><tr>{columns.map((column) => <th key={column} scope="col">{labelFor(column)}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={getRowKey(row, columns, rowIndex)}>{columns.map((column) => <td key={column}>{renderValue(row, column)}</td>)}</tr>)}</tbody></table>
      </div>
    </div>
  </>
}

function getRowKey(row: Row, columns: readonly string[], rowIndex: number): string {
  return row["id"] ?? row["recording_id"] ?? row["bib_id"] ?? row["lineage_id"] ?? `${rowIndex}-${columns.map((column) => row[column] ?? "").join("|")}`
}

function getTitleColumn(row: Row, columns: readonly string[]): string {
  return preferredTitleColumns.find((column) => columns.includes(column) && row[column])
    ?? columns.find((column) => row[column] && column !== "id")
    ?? columns[0]
    ?? "id"
}

function renderValue(row: Row, column: string) {
  const value = row[column] ?? ""
  const isUrl = value.startsWith("http://") || value.startsWith("https://")
  return isUrl
    ? <a href={value} target="_blank" rel="noreferrer">查看{row["source_title"] || row["source"] || labelFor(column)}（另開視窗）</a>
    : (valueLabels[value] || value || "—")
}

export function PageLinks({ count, base }: { count: number; base: string }) {
  return <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="資料分頁">{Array.from({ length: count }, (_item, index) => index + 1).map((page) => <Link key={page} href={`${base}/${page}`} className="rounded-md border bg-card p-4 font-sans font-bold text-primary shadow-line hover:border-primary hover:bg-accent">第 {page} 頁</Link>)}</nav>
}
