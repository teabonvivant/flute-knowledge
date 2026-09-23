import fs from "node:fs"
import path from "node:path"

const runtimeRoots = ["lib", "app", "components", "worker"]
const forbidden = ["node:fs", "node:fs/promises", "node:path", "fs.readFileSync", "fs.existsSync", "path.join", "path.resolve", "process.cwd()", "../長笛知識庫_100位演奏家教授", ".sqlite"]
const publicExports = ["getPeople", "getPerson", "getCsv", "getTopics", "getTopic", "getResearchSet", "personSummary", "chunkRows"]

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(target)
    return /\.(?:ts|tsx|js|jsx)$/.test(entry.name) ? [target] : []
  })
}

const extraIndex = process.argv.indexOf("--extra-file")
const extraFile = extraIndex >= 0 ? process.argv[extraIndex + 1] : undefined
const files = runtimeRoots.flatMap((root) => sourceFiles(root))
if (extraFile) files.push(extraFile)
const violations = files.flatMap((file) => {
  const source = fs.readFileSync(file, "utf8")
  return forbidden.filter((token) => source.includes(token)).map((token) => `${file}: ${token}`)
})
const facade = fs.readFileSync("lib/data.ts", "utf8")
const missingExports = publicExports.filter((name) => !facade.includes(name))
if (missingExports.length > 0) violations.push(`lib/data.ts missing public exports: ${missingExports.join(", ")}`)
if (violations.length > 0) {
  console.error("Worker runtime guard failed:\n" + violations.join("\n"))
  process.exit(1)
}
console.log(`Worker runtime guard passed (${files.length} source files, ${publicExports.length} public exports).`)
