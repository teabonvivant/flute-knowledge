import { execFileSync } from "node:child_process"
import path from "node:path"

const baseUrl = process.env.QA_BASE_URL ?? "http://localhost:8030"
const routeScript = path.join(process.cwd(), "scripts", "qa-production-routes.mjs")
const routes = execFileSync(process.execPath, [routeScript, "--list-routes"], {
  cwd: process.cwd(),
  encoding: "utf8"
}).trim().split(/\r?\n/).filter(Boolean)
const failures = []

for (let index = 0; index < routes.length; index += 8) {
  const batch = routes.slice(index, index + 8)
  const results = await Promise.all(batch.map(async (route) => {
    const response = await fetch(new URL(route, baseUrl))
    if (!response.ok) return { route, status: response.status, issues: ["request failed"] }

    const html = await response.text()
    const h1Count = [...html.matchAll(/<h1[\s>]/g)].length
    const buttonWithoutLabel = /<button(?![^>]*(aria-label=|>[^<]+<))[^>]*>\s*(?:<svg[\s\S]*?<\/svg>)?\s*<\/button>/i.test(html)
    const imageWithoutAlt = /<img(?![^>]*alt=)[^>]*>/i.test(html)
    const skipLink = html.includes("跳至主要內容")
    const issues = []
    if (h1Count !== 1) issues.push(`expected one h1, found ${h1Count}`)
    if (buttonWithoutLabel) issues.push("unlabelled icon button")
    if (imageWithoutAlt) issues.push("image without alt")
    if (!skipLink) issues.push("skip link missing")
    return { route, status: response.status, issues }
  }))
  failures.push(...results.filter((result) => result.issues.length > 0))
}

if (failures.length > 0) {
  throw new Error(`Accessibility smoke failed:\n${failures.map((item) => `${item.status} ${item.route}: ${item.issues.join(", ")}`).join("\n")}`)
}

console.log(`Accessibility smoke passed (${routes.length} routes).`)
