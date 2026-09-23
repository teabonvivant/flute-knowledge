import type { DataRow, Person, Topic } from "@/lib/data/types"

export function recordFrom(value: unknown, context: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${context} must be an object`)
  return Object.fromEntries(Object.entries(value))
}

export function stringField(record: Record<string, unknown>, key: string): string {
  const value = record[key]
  return typeof value === "string" ? value : ""
}

export function dataRowsFrom(value: unknown, context: string): DataRow[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => {
    const source = recordFrom(item, context)
    return Object.fromEntries(Object.entries(source).map(([key, field]) => [key, typeof field === "string" ? field : ""]))
  })
}

export function parsePerson(value: unknown): Person {
  const row = recordFrom(value, "flute master")
  return {
    id: stringField(row, "id"),
    name_en: stringField(row, "name_en"),
    name_zh: stringField(row, "name_zh"),
    life_dates: stringField(row, "life_dates"),
    country_region: stringField(row, "country_region"),
    era: stringField(row, "era"),
    roles: stringField(row, "roles"),
    school_lineage: stringField(row, "school_lineage"),
    major_posts: stringField(row, "major_posts"),
    core_topics: stringField(row, "core_topics"),
    selection_basis: stringField(row, "selection_basis"),
    recordings_repertoire: stringField(row, "recordings_repertoire"),
    literature: stringField(row, "literature"),
    research_keywords: stringField(row, "research_keywords")
  }
}

export function parseTopic(value: unknown): Topic {
  const row = recordFrom(value, "topic")
  return { number: stringField(row, "number"), title: stringField(row, "title"), description: stringField(row, "description") }
}
