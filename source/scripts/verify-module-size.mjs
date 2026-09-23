import fs from "node:fs"
import path from "node:path"

const files = ["lib/data.ts", "lib/topic-guides.ts", ...fs.readdirSync("lib/data").filter((file) => file.endsWith(".ts")).map((file) => path.join("lib/data", file))]
const oversized = files.flatMap((file) => { const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith("//")).length; return lines > 250 ? [`${file}: ${lines}`] : [] })
if (oversized.length > 0) throw new Error(`Pure TypeScript modules exceed 250 lines:\n${oversized.join("\n")}`)
console.log(`Module size passed (${files.length} data modules).`)
