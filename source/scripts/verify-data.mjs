import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const forbidden = ["嚗", "銝", "蝡", "雿", "摨", "撣", "蝺", "鈭", "憭", "隤", "�"]

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}

const people = JSON.parse(fs.readFileSync("data/flute_masters_100.json", "utf8"))
if (!Array.isArray(people) || people.length !== 100) throw new Error("Expected 100 flute masters")
const ids = new Set(people.map((person) => person.id))
if (ids.size !== people.length || ids.has("")) throw new Error("Flute master IDs must be unique and non-empty")
const csvFiles = fs.readdirSync("data").filter((file) => file.endsWith(".csv"))
if (csvFiles.length < 10) throw new Error("Expected the research CSV source files")

const topics = JSON.parse(fs.readFileSync("data/generated/topics_30.json", "utf8"))
const professorGuides = JSON.parse(fs.readFileSync("data/professor_guides.json", "utf8"))
if (!Array.isArray(topics) || topics.length !== 30) throw new Error("Expected 30 flute topics")
if (!Array.isArray(professorGuides.guides) || professorGuides.guides.length !== 30) {
  throw new Error("Professor guides must cover all 30 flute topics")
}

const topicNumbers = new Set(topics.map((topic) => topic.number))
const sources = professorGuides.sources ?? []
const sourceIds = new Set(sources.map((source) => source.id))
if (sources.length < 8) throw new Error("Professor guides need at least 8 authoritative sources")
if (sourceIds.size !== sources.length) throw new Error("Professor source IDs must be unique")
for (const source of sources) {
  for (const field of ["id", "label", "scope", "url"]) {
    if (typeof source[field] !== "string" || source[field].trim() === "") {
      throw new Error(`Professor source ${source.id ?? "unknown"}.${field} must be non-empty`)
    }
  }
  if (new URL(source.url).protocol !== "https:") throw new Error(`Professor source ${source.id} must use HTTPS`)
}

const guideNumbers = new Set(professorGuides.guides.map((guide) => guide.number))
if (guideNumbers.size !== professorGuides.guides.length || guideNumbers.size !== topicNumbers.size) {
  throw new Error("Professor guides must cover each flute topic exactly once")
}
for (const number of topicNumbers) {
  if (!guideNumbers.has(number)) throw new Error(`Missing professor guide topic: ${number}`)
}

for (const guide of professorGuides.guides) {
  if (!topicNumbers.has(guide.number)) throw new Error(`Unknown professor guide topic: ${guide.number}`)
  if (typeof guide.question !== "string" || guide.question.length < 18) throw new Error(`${guide.number}.question is too shallow`)
  if (!Array.isArray(guide.paragraphs) || guide.paragraphs.length < 2 || guide.paragraphs.some((text) => text.length < 45)) {
    throw new Error(`${guide.number}.paragraphs must contain two substantial topic-specific paragraphs`)
  }
  if (!Array.isArray(guide.steps) || guide.steps.length < 3) throw new Error(`${guide.number}.steps must contain at least 3 steps`)
  if (!Array.isArray(guide.listenFor) || guide.listenFor.length < 3) throw new Error(`${guide.number}.listenFor must contain at least 3 observations`)
  if (typeof guide.caution !== "string" || guide.caution.length < 24) throw new Error(`${guide.number}.caution is too shallow`)
  if (!Array.isArray(guide.sourceIds) || guide.sourceIds.length === 0 || guide.sourceIds.some((id) => !sourceIds.has(id))) {
    throw new Error(`${guide.number} has an invalid source reference`)
  }
}

const professorGuideFile = path.join(root, "data", "professor_guides.json")
for (const file of [
  ...walk(path.join(root, "app")),
  ...walk(path.join(root, "components")),
  ...walk(path.join(root, "lib")),
  professorGuideFile
]) {
  if (!/\.(tsx|ts|css|json)$/.test(file)) continue
  const text = fs.readFileSync(file, "utf8")
  const hit = forbidden.find((token) => text.includes(token))
  if (hit) throw new Error(`Forbidden mojibake token ${hit} in ${path.relative(root, file)}`)
}

console.log(`Source data passed (${people.length} people, ${csvFiles.length} CSV files).`)
