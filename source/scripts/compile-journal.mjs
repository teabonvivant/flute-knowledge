import fs from 'node:fs';
import path from 'node:path';

const categories = JSON.parse(fs.readFileSync('data/journal-categories.json','utf8'));
const sources = JSON.parse(fs.readFileSync('data/journal-sources.json','utf8'));
const articles = [];
for (const file of fs.readdirSync('content/journal').filter(f=>f.endsWith('.md')).sort()) {
  const blocks = fs.readFileSync(path.join('content/journal',file),'utf8').split(/^@@ /m).slice(1);
  for (const block of blocks) {
    const [header,...lines] = block.trim().split(/\r?\n/);
    const [id,slug,title,category,topicList,sourceList] = header.split('|').map(s=>s.trim());
    let sections=[]; let section={heading:'',paragraphs:[]}; let diagram;
    for (const line of lines.map(s=>s.trim()).filter(Boolean)) {
      if(line.startsWith('@diagram ')) {
        const [kind,caption,...nodes]=line.slice(9).split('|').map(s=>s.trim());
        diagram={kind,caption,nodes:nodes.map(n=>{const [label,detail]=n.split('~');return {label,detail};})};
      } else if(line.startsWith('## ')) {
        if(section.paragraphs.length) sections.push(section);
        section={heading:line.slice(3),paragraphs:[]};
      } else section.paragraphs.push(line);
    }
    if(section.paragraphs.length) sections.push(section);
    if(!categories.some(c=>c.slug===category)||!diagram||sections.length<4)throw new Error(`Incomplete article ${id}`);
    const sourceIds=sourceList.split(',').filter(Boolean);
    if(sourceIds.some(id=>!sources.some(s=>s.id===id)))throw new Error(`Invalid source in ${id}`);
    const characterCount=sections.flatMap(s=>s.paragraphs).join('').match(/[\p{Script=Han}]/gu)?.length??0;
    articles.push({id,slug,title,category,topics:topicList.split(','),sourceIds,excerpt:sections[0].paragraphs[0],sections,diagram,characterCount,minutes:Math.max(3,Math.ceil(characterCount/250)),published:'2026-09-22'});
  }
}
if(new Set(articles.map(a=>a.slug)).size!==articles.length)throw new Error('Duplicate article slug');
fs.mkdirSync('data/generated',{recursive:true});
fs.writeFileSync('data/generated/journal.json',JSON.stringify(articles,null,2)+'\n');
console.log(`Compiled ${articles.length} original articles; ${articles.reduce((n,a)=>n+a.characterCount,0)} Chinese characters.`);
