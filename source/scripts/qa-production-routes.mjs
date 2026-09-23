import fs from "node:fs"

const fixtureIndex = process.argv.indexOf("--fixture-body")
if (fixtureIndex >= 0) { const body = process.argv[fixtureIndex + 1] ?? ""; if (/Error 1101|Worker threw exception/i.test(body)) { console.error("Error 1101 was found"); process.exit(1) } process.exit(0) }
const {routes:canonicalRoutes,categories}=await import('./editorial-routes.mjs');
const routes=[...canonicalRoutes,'/search?q=Theobald%20Boehm',...categories.map(c=>'/blog?category='+c.slug),'/blog?page=9'];
if (process.argv.includes("--list-routes")) { console.log(routes.join("\n")); process.exit(0) }
const base = process.env["QA_BASE_URL"]
if (!base) throw new Error("QA_BASE_URL is required")
const token = process.env["QA_AUTH_TOKEN"]
const headers = token ? { "OAI-Sites-Authorization": `Bearer ${token}` } : {}
const failures = []
for (let index = 0; index < routes.length; index += 8) {
  const batch = routes.slice(index, index + 8)
  const results = await Promise.all(batch.map(async (route) => {
    const response = await fetch(new URL(route, base), { headers })
    const body = await response.text()
    const issues = []
    if (/Error 1101|Worker threw exception/i.test(body)) issues.push("Error 1101")
    if (/^\/topics\/\d{2}$/.test(route) && (!body.includes('href="/masters/') || body.includes("人物配對仍在整理"))) issues.push("related people missing")
    if (route === "/research/people/1" && (!body.includes('role="list"') || !body.includes("<table"))) issues.push("responsive research views missing")
    return { route, status: response.status, issues }
  }))
  failures.push(...results.filter((result) => result.status !== 200 || result.issues.length > 0))
}
if (failures.length > 0) throw new Error(`Route QA failed:\n${failures.map((item) => `${item.status} ${item.route}${item.issues.length ? ` ${item.issues.join(", ")}` : ""}`).join("\n")}`)
console.log(`Production route QA passed (${routes.length} routes).`)
