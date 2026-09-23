export type Person = Readonly<{
  id: string
  name_en: string
  name_zh: string
  life_dates: string
  country_region: string
  era: string
  roles: string
  school_lineage: string
  major_posts: string
  core_topics: string
  selection_basis: string
  recordings_repertoire: string
  literature: string
  research_keywords?: string
}>

export type Topic = Readonly<{ number: string; title: string; description: string }>
export type DataRow = Readonly<Record<string, string>>
export type ResearchSet = Readonly<{ title: string; file: string; columns: readonly string[]; description: string; rows: readonly DataRow[] }>
