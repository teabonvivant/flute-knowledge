import fs from "node:fs"

const required = ["app/page.tsx", "app/learn/page.tsx", "app/practice/page.tsx", "app/listen/page.tsx", "app/instrument/page.tsx", "app/culture/page.tsx", "app/masters/page.tsx", "app/masters/[id]/page.tsx", "app/topics/page.tsx", "app/topics/[number]/page.tsx", "app/research/page.tsx", "app/research/[slug]/page.tsx", "app/research/[slug]/[page]/page.tsx", "app/search/page.tsx", "app/blog/page.tsx", "app/blog/[slug]/page.tsx", "app/glossary/page.tsx", "app/about/page.tsx", "app/sitemap/page.tsx", "app/error.tsx", "app/not-found.tsx"]
const missing = required.filter((file) => !fs.existsSync(file))
if (missing.length > 0) throw new Error(`Missing routes: ${missing.join(", ")}`)
console.log(`Route inventory passed (${required.length} required route files).`)
