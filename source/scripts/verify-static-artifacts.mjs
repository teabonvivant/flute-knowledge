import fs from "node:fs"

const csvFile = "data/generated/csv_rows.json"
const topicsFile = "data/generated/topics_30.json"
for (const file of [csvFile, topicsFile]) {
  if (!fs.existsSync(file)) {
    console.error(`Missing generated artifact: ${file}`)
    process.exit(1)
  }
}
const csvRows = JSON.parse(fs.readFileSync(csvFile, "utf8"))
const topics = JSON.parse(fs.readFileSync(topicsFile, "utf8"))
const serialized = JSON.stringify({ csvRows, topics })
if (/\.sqlite/i.test(serialized)) throw new Error("sqlite is forbidden in generated artifacts")
if (typeof csvRows !== "object" || csvRows === null || Array.isArray(csvRows)) throw new Error("CSV artifact must be a map")
if (!Array.isArray(topics) || topics.length !== 30) throw new Error("Expected exactly 30 topics")
if (topics.some((topic, index) => topic.number !== String(index + 1).padStart(2, "0") || !topic.title || !topic.description)) throw new Error("Topics artifact must contain numbered titles and descriptions")
console.log(`Static artifacts passed (${Object.keys(csvRows).length} CSV files, ${topics.length} topics).`)
