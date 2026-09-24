"""Export the built preview to GitHub Pages without a server runtime.

Install lxml, run npm ci && npm run build && npm run preview:built, then:
  python scripts/export-github-pages.py --output ../pages-export
The output must be empty. The original application and data are never changed.
"""
import argparse
import concurrent.futures
import hashlib
import json
import re
import shutil
import subprocess
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from lxml import etree, html

ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', required=True, type=Path)
parser.add_argument('--preview', default='http://127.0.0.1:8031')
parser.add_argument('--base', default='/flute-knowledge/')
parser.add_argument('--origin', default='https://teabonvivant.github.io')
parser.add_argument('--source-origin', default='')
parser.add_argument('--node', default='node')
args = parser.parse_args()
out = args.output.resolve()
if out == ROOT or ROOT.is_relative_to(out) or (out.exists() and any(out.iterdir())):
    raise SystemExit('Output must be an empty directory outside the source tree.')
if not re.fullmatch(r'/[A-Za-z0-9_-]+/', args.base):
    raise SystemExit('Use a project base path such as /flute-knowledge/.')
out.mkdir(parents=True, exist_ok=True)
base = args.base
site_url = args.origin.rstrip('/') + base
source_origin = args.source_origin.rstrip('/')
read = lambda p: json.loads((ROOT / p).read_text(encoding='utf-8'))
people = read('data/flute_masters_100.json')
topics = read('data/generated/topics_30.json')
articles = read('data/generated/journal.json')
csv = read('data/generated/csv_rows.json')
sets = {'people': people, **{slug: csv[file] for slug, file in {
    'bibliography': 'bibliography_seeds.csv', 'recordings': 'recording_catalog_seed.csv',
    'lineage': 'lineage_links.csv', 'sources': 'person_sources.csv', 'timeline': 'person_timeline.csv',
    'institutions': 'institution_links.csv', 'search': 'scholarly_search_links.csv',
}.items()}}
routes = ['/', '/learn', '/practice', '/listen', '/instrument', '/culture', '/masters', '/topics', '/research', '/blog', '/glossary', '/about', '/sitemap', '/search']
routes += ['/masters/' + p['id'] for p in people] + ['/topics/' + t['number'] for t in topics] + ['/blog/' + a['slug'] for a in articles]
for slug, rows in sets.items():
    routes += ['/research/' + slug] + [f'/research/{slug}/{n}' for n in range(1, (len(rows) + 39) // 40 + 1)]

def public_url(url):
    if source_origin and url.startswith(source_origin):
        url = url[len(source_origin):] or '/'
        return args.origin.rstrip('/') + public_url(url)
    if not url.startswith('/') or url.startswith('//') or url.startswith(base):
        return url
    parsed = urllib.parse.urlsplit(url)
    pathname = base + parsed.path.lstrip('/')
    if not Path(pathname).suffix and not pathname.endswith('/'):
        pathname += '/'
    return urllib.parse.urlunsplit(('', '', pathname, parsed.query, parsed.fragment))

assets = out / 'assets'
assets.mkdir()
shutil.copytree(ROOT / 'public', out, dirs_exist_ok=True)
for file in (ROOT / 'dist/client/assets').glob('*.css'):
    css = file.read_text(encoding='utf-8')
    css = re.sub(r'url\(([\"\']?)(/[^)\"\']+)\1\)', lambda m: f'url({m[1]}{public_url(m[2])}{m[1]})', css)
    (assets / file.name).write_text(css + '\n[hidden]{display:none!important}\n', encoding='utf-8')

def hashed_asset(stem, content):
    name = f'{stem}-{hashlib.sha256(content.encode()).hexdigest()[:12]}.js'
    (assets / name).write_text(content, encoding='utf-8')
    return base + 'assets/' + name

client_url = hashed_asset('pages-client', (ROOT / 'scripts/github-pages-client.js').read_text(encoding='utf-8'))
raw_data = subprocess.check_output([args.node, str(ROOT / 'scripts/export-pages-data.mjs')], cwd=ROOT)
data = json.loads(raw_data)
data_urls = {route: hashed_asset('pages-data-' + route, 'window.FLUTE_PAGE_DATA=' + json.dumps(value, ensure_ascii=False, separators=(',', ':')) + ';\n') for route, value in data.items()}

def fetch_route(route):
    try:
        response = urllib.request.urlopen(args.preview.rstrip('/') + route, timeout=90)
    except urllib.error.HTTPError as error:
        if route != '/__github_pages_missing__' or error.code != 404:
            raise
        response = error
    source = response.read().decode('utf-8')
    tree = html.document_fromstring(source)
    head = tree.find('head')
    for element in tree.xpath('//script[not(@type="application/ld+json")] | //link[@rel="modulepreload"]'):
        element.getparent().remove(element)
    for element in tree.iter():
        if not isinstance(element.tag, str):
            continue
        for attr in ['href', 'src', 'action', 'poster']:
            if element.get(attr):
                element.set(attr, public_url(element.get(attr)))
        if element.get('srcset'):
            element.set('srcset', ', '.join(' '.join([public_url(part.strip().split()[0]), *part.strip().split()[1:]]) for part in element.get('srcset').split(',')))
        if source_origin and element.tag == 'meta' and element.get('content', '').startswith(source_origin):
            element.set('content', public_url(element.get('content')))
        if source_origin and element.tag == 'script' and element.text:
            element.text = element.text.replace(source_origin, site_url.rstrip('/'))
    tree.set('data-site-base', base)
    tree.set('data-route', route)
    early = etree.Element('script')
    early.text = "try{var t=localStorage.getItem('flute-atlas-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}"
    head.insert(0, early)
    if route.lstrip('/') in data_urls:
        head.append(etree.Element('script', src=data_urls[route.lstrip('/')], defer='defer'))
    head.append(etree.Element('script', src=client_url, defer='defer'))
    if route == '/__github_pages_missing__':
        target = out / '404.html'
    else:
        target = out / route.lstrip('/') / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text('<!DOCTYPE html>\n' + html.tostring(tree, encoding='unicode', method='html'), encoding='utf-8')
    return route

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for n, route in enumerate(pool.map(fetch_route, routes + ['/__github_pages_missing__']), 1):
        if n % 40 == 0:
            print(f'Exported {n} pages', flush=True)

(out / '.nojekyll').touch()
(out / '.gitattributes').write_text('# Preserve exported bytes and download checksums across platforms.\n* -text\n*.woff2 binary\n*.webp binary\n*.png binary\n', encoding='utf-8')
(out / '.gitignore').write_text('**/node_modules/\n**/dist/\n**/.wrangler/\n**/.next/\n**/.vinext/\n**/*.tsbuildinfo\n**/*.log\n**/.env*\n!**/.env.example\n', encoding='utf-8')
(out / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nDisallow: {base}search/\n\nSitemap: {site_url}sitemap.xml\n', encoding='utf-8')
sitemap = etree.Element('urlset', nsmap={None: 'http://www.sitemaps.org/schemas/sitemap/0.9'})
for route in routes:
    if route != '/search':
        entry = etree.SubElement(sitemap, 'url')
        etree.SubElement(entry, 'loc').text = args.origin.rstrip('/') + public_url(route)
(out / 'sitemap.xml').write_bytes(etree.tostring(sitemap, encoding='UTF-8', xml_declaration=True, pretty_print=True))

# Keep rebuildable application source in the repository; never copy local state.
source_dir = out / 'source'
allowed = ['app', 'build', 'components', 'content', 'data', 'lib', 'public', 'scripts', 'types', 'worker']
ignore = shutil.ignore_patterns('*.sqlite', '*.db', '*.tsbuildinfo', '*.log', '__pycache__', '.env*', '*.webp.json', 'validation_report.md', 'robots.txt', 'sitemap.xml')
for name in allowed:
    shutil.copytree(ROOT / name, source_dir / name, ignore=ignore)
for name in ['.gitignore', 'components.json', 'next-env.d.ts', 'next.config.mjs', 'package-lock.json', 'package.json', 'postcss.config.mjs', 'tailwind.config.ts', 'tsconfig.json', 'vite.config.ts']:
    shutil.copy2(ROOT / name, source_dir / name)
(source_dir / '.openai').mkdir()
shutil.copy2(ROOT / '.openai/hosting.json', source_dir / '.openai/hosting.json')
(source_dir / 'requirements-pages.txt').write_text('lxml>=5,<7\n', encoding='utf-8')
(out / 'README.md').write_bytes(f'''# 長笛知識館 · Flute Atlas

以香港繁體中文書寫，陪你從長笛入門、日常練習與聆聽，走到演奏家、樂器與音樂文化。

**網站：[{site_url}]({site_url})**

網站收錄長笛誌、演奏家檔案、知識主題、音樂詞彙及研究資源。你可以從一個練習問題開始，也可以沿着作品、人物與館藏資料繼續閱讀。
'''.encode('utf-8'))
manifest = {'pages': len(routes), 'site': site_url, 'files': {str(p.relative_to(out)).replace('\\', '/'): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(out.rglob('*')) if p.is_file() and not p.is_relative_to(source_dir)}}
(out / 'deployment-manifest.json').write_bytes((json.dumps(manifest, ensure_ascii=False, indent=2).replace('\n', '\r\n') + '\r\n').encode('utf-8'))
print(json.dumps({'pages': len(routes), 'articles': len(articles), 'people': len(people), 'topics': len(topics), 'output': str(out)}, ensure_ascii=False), flush=True)
