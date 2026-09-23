import fs from "node:fs"
import path from "node:path"

const projectRoot = process.cwd()
const dataDir = path.join(projectRoot, "data")
const outputDir = path.join(dataDir, "generated")
const topicsSource = path.join(dataDir, "topics.json")

function parseCsv(text) {
  const rows = []
  let cell = ""
  let row = []
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index] ?? ""
    const next = text[index + 1] ?? ""
    if (char === '"' && quoted && next === '"') {
      cell += '"'
      index += 1
    } else if (char === '"') quoted = !quoted
    else if (char === "," && !quoted) {
      row.push(cell)
      cell = ""
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1
      row.push(cell)
      if (row.some(Boolean)) rows.push(row)
      row = []
      cell = ""
    } else cell += char
  }
  if (cell || row.length > 0) rows.push([...row, cell])
  const [headers = [], ...body] = rows
  return body.map((items) => Object.fromEntries(headers.map((header, index) => [header.trim(), (items[index] ?? "").trim()])))
}

const csvRows = Object.fromEntries(
  fs.readdirSync(dataDir).filter((file) => file.endsWith(".csv")).sort().map((file) => [file, parseCsv(fs.readFileSync(path.join(dataDir, file), "utf8"))])
)
const topics = JSON.parse(fs.readFileSync(topicsSource, "utf8"))
if (topics.length !== 30) throw new Error(`Expected 30 topics, received ${topics.length}`)

fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(path.join(outputDir, "csv_rows.json"), JSON.stringify(csvRows))
fs.writeFileSync(path.join(outputDir, "topics_30.json"), JSON.stringify(topics))
const downloadDir = path.join(projectRoot, "public", "downloads")
fs.mkdirSync(downloadDir, { recursive: true })
for (const file of [...Object.keys(csvRows), "flute_masters_100.json"]) fs.copyFileSync(path.join(dataDir, file), path.join(downloadDir, file))
console.log(`Generated ${Object.keys(csvRows).length} CSV sets and ${topics.length} topics.`)
