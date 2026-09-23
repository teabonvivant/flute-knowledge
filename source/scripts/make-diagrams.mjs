import fs from 'node:fs';
const articles=JSON.parse(fs.readFileSync('data/generated/journal.json','utf8'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const lines=(s,n)=>[...s].reduce((a,c,i)=>{if(i%n===0)a.push('');a[a.length-1]+=c;return a},[]);
const text=(s,x,y,size,color='#243e32',n=9)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="middle" font-family="Microsoft JhengHei,Noto Sans TC,sans-serif">${lines(s,n).map((l,i)=>`<tspan x="${x}" dy="${i?size*1.5:0}">${esc(l)}</tspan>`).join('')}</text>`;
fs.mkdirSync('public/images/diagrams',{recursive:true});
for(const a of articles){
 const positions=[[164,234],[436,234],[164,468],[436,468]];
 const order=a.diagram.kind==='sequence'||a.diagram.kind==='cycle'?[0,1,3,2]:[0,1,2,3];
 let paths='';
 if(['sequence','cycle'].includes(a.diagram.kind)) paths='<path d="M278 234 H319 M436 341 V379 M321 468 H280" fill="none" stroke="#987144" stroke-width="3" marker-end="url(#arrow)"/>'+(a.diagram.kind==='cycle'?'<path d="M164 381 V342" fill="none" stroke="#987144" stroke-width="3" marker-end="url(#arrow)"/>':'');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 660" role="img" aria-labelledby="title desc"><title id="title">${esc(a.diagram.caption)}</title><desc id="desc">${esc(a.diagram.nodes.map(n=>n.label+'：'+n.detail).join('；'))}</desc><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1 L7 4 L1 7" fill="none" stroke="#987144" stroke-width="1.3"/></marker></defs><rect width="600" height="660" fill="#f9f5eb"/><path d="M38 52 H562" stroke="#b59a72"/>${text('FLUTE ATLAS · '+a.id,300,85,18,'#80613c',30)}${text(a.diagram.caption,300,133,26,'#243e32',19)}${paths}${a.diagram.nodes.map((n,i)=>{const [x,y]=positions[order[i]];return `<rect x="${x-107}" y="${y-58}" width="214" height="155" rx="4" fill="${i===0?'#243e32':'#ede8db'}"/><circle cx="${x}" cy="${y-62}" r="18" fill="#a7804a"/>${text(String(i+1),x,y-56,20,'#fff',2)}${text(n.label,x,y-5,28,i===0?'#fff':'#243e32',7)}${text(n.detail,x,y+39,22,i===0?'#f3ead8':'#4b534e',9)}`}).join('')}<path d="M38 605 H562" stroke="#b59a72"/>${text('長笛誌 · 練習與閱讀圖解',300,632,18,'#5c655e',28)}</svg>`;
 fs.writeFileSync(`public/images/diagrams/${a.slug}.svg`,svg);
}
console.log(`Created ${articles.length} topic-specific diagrams.`);
