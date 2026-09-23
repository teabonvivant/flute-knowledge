import fs from 'node:fs';
import {routes} from './editorial-routes.mjs';
const base='https://flute-atlas-hk.teabonvivant.chatgpt.site';
fs.writeFileSync('public/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+routes.map(route=>`<url><loc>${base}${route}</loc></url>`).join('\n')+'\n</urlset>\n');
fs.writeFileSync('public/robots.txt',`User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`Discovery files generated for ${routes.length} pages.`);
