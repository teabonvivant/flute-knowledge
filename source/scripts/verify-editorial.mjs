import fs from 'node:fs';
import assert from 'node:assert/strict';
import {articles,categories,people,topics,csv,routes} from './editorial-routes.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sources=read('data/journal-sources.json');
const expansions=read('data/topic-expansions.json');
const glossary=read('data/glossary.json');
const careers=read('data/person-careers.json');
assert.equal(articles.length,100);assert.equal(people.length,100);assert.equal(topics.length,30);assert.equal(glossary.length,40);
assert.equal(new Set(articles.map(a=>a.slug)).size,100);assert.equal(new Set(articles.map(a=>a.title)).size,100);
assert.equal(categories.length,10);
assert(people.every(p=>careers[p.id]?.length>0));
const assets=new Set();
for(const c of categories){assert.equal(articles.filter(a=>a.category===c.slug).length,10);assets.add(`public/images/journal/${c.image}.webp`)}
for(const a of articles){
 assert(a.characterCount>=250,`Article ${a.id} too short`);assert(a.sections.length>=5);assert.equal(a.diagram.nodes.length,4);
 assert(a.sourceIds.length>0);assert(a.sourceIds.every(id=>sources.some(s=>s.id===id)));
 assert(a.topics.every(n=>topics.some(t=>t.number===n)));assert(categories.some(c=>c.slug===a.category));
 assets.add(`public/images/diagrams/${a.slug}.svg`);
 assert(a.diagram.caption.length<=19);assert(a.diagram.nodes.every(n=>n.label.length<=7&&n.detail.length<=18));
}
for(const asset of assets)assert(fs.existsSync(asset),asset);
for(const t of topics)assert.equal(expansions[t.number]?.length,2);
const badIds=['Q57000253','Q125264597','Q56244390','Q130004243','Q137700068','Q107199492','Q112657661','Q113804448','Q553397','Q1972963','Q7610284','Q40414972','Q106754536','Q4679932','Q100925597','Q106887820','Q96964814','Q102408806'];
const serialized=JSON.stringify({people,csv});
for(const id of badIds)assert(!serialized.includes(id),`Wrong identity remains: ${id}`);
for(const s of csv['person_sources.csv'])assert.doesNotThrow(()=>new URL(s.url));
assert(!serialized.includes('Curated from person literature field'));
const report={articles:articles.length,illustrationsPerArticle:2,newEditorialIllustrations:10,newArticleDiagrams:100,articleCharacters:articles.reduce((n,a)=>n+a.characterCount,0),topics:topics.length,glossary:glossary.length,people:people.length,canonicalPages:routes.length,records:Object.fromEntries(Object.entries(csv).map(([k,v])=>[k,v.length]))};
fs.writeFileSync('../editorial-qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
