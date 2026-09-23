import fs from "node:fs"
import path from "node:path"

const sourceRoots = ["app", "components"]
const files = sourceRoots.flatMap((root) => walk(root))
const offenders = []

for (const file of files) {
  const source = fs.readFileSync(file, "utf8")
  for (const match of source.matchAll(/<Image\b[\s\S]*?\/>/g)) {
    if (!/\bunoptimized\b/.test(match[0])) offenders.push(file)
  }
}

if (offenders.length > 0) {
  throw new Error(`Next Image must bypass the unstable runtime optimizer:\n${[...new Set(offenders)].join("\n")}`)
}

console.log(`Static image delivery passed (${files.length} source files scanned).`)

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(target)
    return /\.(?:tsx|jsx)$/.test(entry.name) ? [target] : []
  })
}
