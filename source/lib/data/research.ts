import { getCsv, getPeople } from "@/lib/data/source"
import { personEra, personRegion, personRoles, personSelectionBasis } from "@/lib/data/derived"
import type { DataRow, ResearchSet } from "@/lib/data/types"

type ResearchDefinition = Readonly<{ title: string; file: string; columns: readonly string[]; description: string }>

export const researchDefinitions: Readonly<Record<string, ResearchDefinition>> = {
  people: { title: "100 位長笛名家資料", file: "flute_masters_100.json", columns: ["id", "name_zh", "name_en", "life_dates", "era_zh", "country_region_zh", "roles_zh", "selection_basis_zh"], description: "以中文比較人物的年代、地域、身份與入選理由；英文原始欄位仍保留在資料檔，方便研究核對。" },
  bibliography: { title: "文獻與研究書目", file: "bibliography_seeds.csv", columns: ["bib_id", "title", "author_year", "type", "related_people", "topic_tags", "notes", "url"], description: "按題名、作者、年份及研究主題追查文獻。" },
  recordings: { title: "作品與錄音目錄", file: "recording_catalog_seed.csv", columns: ["recording_id", "name_zh", "name_en", "title", "source", "first_release_date", "primary_type", "url"], description: "按人物整理作品相關發行與錄音版本，連結至逐項曲目及演出署名。" },
  lineage: { title: "師承與學派關係", file: "lineage_links.csv", columns: ["lineage_id", "name_en", "relationship_type", "related_name", "source", "url"], description: "查看師生、合作與學派傳承關係。" },
  sources: { title: "人物來源索引", file: "person_sources.csv", columns: ["person_source_id", "name_zh", "name_en", "source_type", "source_title", "note", "url"], description: "查閱人物條目所依據的可見來源。" },
  timeline: { title: "人物時間線", file: "person_timeline.csv", columns: ["event_id", "name_zh", "name_en", "event_type", "date_or_value", "place_or_context", "source"], description: "按時間整理演出、職位、獎項與重要事件。" },
  institutions: { title: "機構與職位關係", file: "institution_links.csv", columns: ["institution_link_id", "name_en", "institution_name", "relationship_type", "url"], description: "了解人物與樂團、學院及機構的關係。" },
  search: { title: "研究搜尋入口", file: "scholarly_search_links.csv", columns: ["scholarly_search_id", "name_zh", "name_en", "search_type", "purpose", "url"], description: "按人物進入學術、館藏與錄音搜尋。" }
}

function peopleRows(): DataRow[] {
  return getPeople().map((person) => ({
    ...Object.fromEntries(Object.entries(person).map(([key, value]) => [key, typeof value === "string" ? value : ""])),
    era_zh: personEra(person),
    country_region_zh: personRegion(person),
    roles_zh: personRoles(person),
    selection_basis_zh: personSelectionBasis(person)
  }))
}

export function getResearchSet(slug: string): ResearchSet {
  const definition = researchDefinitions[slug] ?? researchDefinitions.people
  if (!definition) throw new Error("Research definitions must include people")
  return { ...definition, rows: definition.file.endsWith(".json") ? peopleRows() : getCsv(definition.file) }
}
