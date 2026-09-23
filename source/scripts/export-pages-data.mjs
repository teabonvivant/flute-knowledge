import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Evaluate the same data helpers as the server, so Pages keeps its search rules.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
const ts = require('typescript');
const cache = new Map();
function readModule(filename) {
  if (!path.extname(filename)) filename += '.ts';
  if (cache.has(filename)) return cache.get(filename).exports;
  if (filename.endsWith('.json')) return JSON.parse(fs.readFileSync(filename, 'utf8'));
  const module = { exports: {} };
  cache.set(filename, module);
  const localRequire = name => name.startsWith('@/')
    ? readModule(path.join(root, name.slice(2)))
    : name.startsWith('.') ? readModule(path.resolve(path.dirname(filename), name)) : require(name);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  new Function('require', 'module', 'exports', '__filename', '__dirname', code)(localRequire, module, module.exports, filename, path.dirname(filename));
  return module.exports;
}
const load = name => readModule(path.join(root, name));
const { getPeople, getTopics, personSummary, personRegion, personRoles } = load('lib/data.ts');
const { articles, editorialArticles, journalCategories, getCategory } = load('lib/journal.ts');
const { getTopicGuide } = load('lib/topic-guides.ts');
const { researchDefinitions } = load('lib/data/research.ts');
const careers = load('data/person-careers.json');
const personNotes = load('data/person-editorial.json');
const topicExpansions = load('data/topic-expansions.json');
const glossary = load('data/glossary.json');
const people = getPeople();
const topics = getTopics();
const groups = [['人物與資料', 1, 5], ['教材與曲目', 6, 10], ['歷史與當代', 11, 14], ['發音與音樂', 15, 22], ['教學與職涯', 23, 25], ['樂器與文化', 26, 30]];
const result = {
  blog: {
    categories: journalCategories,
    order: editorialArticles.map(a => a.slug),
    articles: articles.map(a => ({ slug: a.slug, title: a.title, category: a.category, minutes: a.minutes, excerpt: a.excerpt, keywords: `${a.title} ${a.excerpt} ${a.sections.flatMap(s => s.paragraphs).join(' ')}` })),
  },
  masters: people.map(p => ({ id: p.id, era: p.era, keywords: `${p.name_zh} ${p.name_en} ${personSummary(p)} ${personRegion(p)} ${personRoles(p)} ${p.country_region} ${p.roles} ${p.school_lineage} ${p.major_posts} ${p.core_topics}` })),
  topics: topics.map(t => ({ number: t.number, group: groups.find(([, start, end]) => Number(t.number) >= start && Number(t.number) <= end)[0], keywords: `${t.title} ${t.description} ${getTopicGuide(t).question} ${getTopicGuide(t).listenFor.join(' ')}` })),
  search: [
    ...people.map(p => ({ kind: '人物', title: p.name_zh || p.name_en, detail: p.name_en + ' · ' + personSummary(p), href: `/masters/${p.id}`, keywords: `${p.name_en} ${p.name_zh} ${p.school_lineage} ${p.major_posts} ${p.core_topics} ${personSummary(p)} ${(careers[p.id] || []).join(' ')} ${personNotes[p.id] || ''}` })),
    ...topics.map(t => ({ kind: '知識主題', title: t.title, detail: t.description, href: `/topics/${t.number}`, keywords: t.description + ' ' + JSON.stringify(getTopicGuide(t)) + ' ' + (topicExpansions[t.number] || []).join(' ') })),
    ...articles.map(a => ({ kind: '長笛誌', title: a.title, detail: getCategory(a.category).title + ' · ' + a.excerpt, href: `/blog/${a.slug}`, keywords: a.sections.flatMap(s => [s.heading, ...s.paragraphs]).join(' ') })),
    ...glossary.map(t => ({ kind: '詞彙', title: t.term, detail: t.description, href: `/glossary#${t.id}`, keywords: t.en + ' ' + t.description })),
    ...Object.entries(researchDefinitions).map(([slug, d]) => ({ kind: '研究資料', title: d.title, detail: d.description, href: `/research/${slug}`, keywords: d.description })),
    ...[['開始學長笛', '/learn', '初學、兒童、成人及重拾長笛的學習路線'], ['每日練習', '/practice', '音色、吐音、音準、節奏與指法'], ['選笛與保養', '/instrument', '開孔、閉孔、笛頭、清潔及維修'], ['聆聽路線', '/listen', '錄音、作品與版本比較'], ['長笛文化', '/culture', '歷史、學派與跨文化閱讀']].map(([title, href, detail]) => ({ kind: '學習路線', title, href, detail, keywords: detail })),
  ],
};
process.stdout.write(JSON.stringify(result));
