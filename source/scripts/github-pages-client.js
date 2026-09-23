(() => {
  'use strict';
  const base = document.documentElement.dataset.siteBase;
  const route = document.documentElement.dataset.route;
  const data = window.FLUTE_PAGE_DATA;
  const params = new URLSearchParams(location.search);
  const query = (params.get('q') || '').trim();
  const lower = value => value.toLocaleLowerCase('zh-Hant-HK');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const href = (path, values = {}) => {
    const url = new URL(path.replace(/^\//, ''), location.origin + base);
    if (!url.pathname.endsWith('/') && !url.pathname.split('/').pop().includes('.')) url.pathname += '/';
    for (const [key, value] of Object.entries(values)) if (value) url.searchParams.set(key, value);
    return url.pathname + url.search + url.hash;
  };
  const link = (path, label, attrs = '') => `<a href="${escape(path)}" ${attrs}>${escape(label)}</a>`;
  const node = (tag, className, text = '') => {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = text;
    return el;
  };

  const toggle = document.querySelector('.menu-toggle');
  const header = document.querySelector('.site-header');
  let menu;
  const closeMenu = () => { menu?.remove(); menu = null; toggle?.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => {
    if (menu) return closeMenu();
    menu = document.querySelector('.desktop-nav').cloneNode(true);
    menu.id = 'flute-mobile-nav';
    menu.className = 'mobile-nav';
    menu.setAttribute('aria-label', '行動版主要導覽');
    const search = document.createElement('a');
    search.href = href('/search'); search.textContent = '搜尋全站';
    menu.append(search); header.append(menu);
    toggle.setAttribute('aria-expanded', 'true');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu) { closeMenu(); toggle.focus(); } });
  document.addEventListener('pointerdown', e => { if (menu && !header.contains(e.target)) closeMenu(); });
  const theme = document.querySelector('.theme-control select');
  let savedTheme = 'system';
  try { savedTheme = localStorage.getItem('flute-atlas-theme') || 'system'; } catch {}
  if (theme) {
    theme.value = ['light', 'dark'].includes(savedTheme) ? savedTheme : 'system';
    theme.addEventListener('change', () => {
      if (theme.value === 'system') delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = theme.value;
      try { localStorage.setItem('flute-atlas-theme', theme.value); } catch {}
    });
  }
  if (!data) return;

  if (route === '/blog') {
    const category = data.categories.find(c => c.slug === params.get('category'));
    const ordered = category ? data.articles : data.order.map(slug => data.articles.find(a => a.slug === slug));
    const matches = ordered.filter(a => (!category || a.category === category.slug) && (!query || lower(a.keywords).includes(lower(query))));
    const count = Math.ceil(matches.length / 12);
    const page = Math.min(Math.max(1, parseInt(params.get('page')) || 1), Math.max(1, count));
    const pageHref = n => href('/blog', { category: category?.slug, q: query, page: n > 1 ? String(n) : '' });
    const form = document.querySelector('.journal-search');
    form.querySelector('[name=q]').value = query;
    if (category) {
      const input = document.createElement('input'); input.type = 'hidden'; input.name = 'category'; input.value = category.slug; form.append(input);
    }
    for (const a of document.querySelectorAll('.journal-categories a')) {
      const active = new URL(a.href).searchParams.get('category') === (category?.slug || null);
      if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    }
    const results = document.querySelector('.journal-results');
    results.querySelector('h2').textContent = category?.title || '所有文章';
    results.querySelector('p').textContent = `${query ? `「${query}」· ` : ''}${matches.length} 篇${count > 1 ? ` · 第 ${page} / ${count} 頁` : ''}`;
    if (category) results.after(node('p', 'mb-8 font-sans text-muted-foreground', category.description));
    const grid = document.querySelector('.journal-grid');
    grid.classList.toggle('journal-grid-featured', page === 1 && !category && !query);
    grid.innerHTML = matches.slice((page - 1) * 12, page * 12).map(a => {
      const c = data.categories.find(c => c.slug === a.category);
      const url = escape(href('/blog/' + a.slug));
      return `<article class="journal-card"><a class="journal-card-image" href="${url}" tabindex="-1" aria-hidden="true"><img src="${escape(base + 'images/journal/' + c.image + '.webp')}" alt="" width="768" height="512" loading="lazy"></a><div class="journal-card-copy"><p class="journal-meta">${escape(c.title)} <span>·</span> 約 ${a.minutes} 分鐘</p><h3><a href="${url}">${escape(a.title)}</a></h3><p class="journal-excerpt">${escape(a.excerpt)}</p><a class="journal-read" aria-label="閱讀：${escape(a.title)}" href="${url}">閱讀全文</a></div></article>`;
    }).join('');
    if (!matches.length) {
      grid.className = 'journal-empty';
      grid.innerHTML = `<h3>沒有相符文章</h3><p>試試較短的關鍵字，或選擇上方的閱讀主題。</p>${link(href('/blog'), '查看全部文章')}`;
    }
    document.querySelector('.journal-pagination')?.remove();
    if (count > 1) {
      const nav = node('nav', 'journal-pagination'); nav.setAttribute('aria-label', '博客分頁');
      nav.innerHTML = (page > 1 ? link(pageHref(page - 1), '上一頁', 'rel="prev"') : '') + Array.from({ length: count }, (_, i) => link(pageHref(i + 1), i + 1, `aria-label="第 ${i + 1} 頁" ${page === i + 1 ? 'aria-current="page"' : ''}`)).join('') + (page < count ? link(pageHref(page + 1), '下一頁', 'rel="next"') : '');
      grid.after(nav);
    }
  }

  if (route === '/masters' || route === '/topics') {
    const masters = route === '/masters';
    const aliases = { '柏林愛樂': 'Berlin Philharmonic', '巴黎音樂院': 'Paris Conservatoire', '倫敦交響樂團': 'London Symphony', '茱莉亞': 'Juilliard', '柯蒂斯': 'Curtis' };
    const filterName = masters ? 'era' : 'group';
    const filter = params.get(filterName) || '';
    const needle = lower(masters ? aliases[query] || query : query);
    const form = document.querySelector('main form');
    form.querySelector('[name=q]').value = query;
    form.querySelector(`[name=${filterName}]`).value = filter;
    const matches = data.filter(item => (!needle || lower(item.keywords).includes(needle)) && (!filter || item[filterName] === filter));
    const ids = new Set(matches.map(item => masters ? item.id : item.number));
    const grid = document.querySelector('.directory-grid');
    for (const card of grid.children) {
      const id = new URL(card.href).pathname.split('/').filter(Boolean).pop();
      card.hidden = !ids.has(id);
    }
    grid.hidden = !matches.length;
    const status = document.querySelector('main [role=status]');
    status.textContent = `顯示 ${matches.length} / ${data.length} ${masters ? '位人物' : '個主題'}`;
    if (query || filter) status.insertAdjacentHTML('beforeend', ' · ' + link(href(route), '清除條件', 'class="text-primary underline underline-offset-4"'));
    if (!matches.length) grid.after(node('div', 'mt-5 rounded-md border border-dashed bg-card p-6 font-sans text-muted-foreground', masters ? '沒有相符人物。可改用英文姓氏或清除時代條件。' : '沒有相符主題。可縮短關鍵字或清除群組條件。'));
  }

  if (route === '/search') {
    const found = query ? data.filter(i => lower(i.title + ' ' + i.keywords).includes(lower(query))) : [];
    const pages = Math.max(1, Math.ceil(found.length / 20));
    const requested = Number(params.get('page'));
    const page = Number.isInteger(requested) ? Math.min(pages, Math.max(1, requested)) : 1;
    const status = document.querySelector('main [role=status]');
    document.querySelector('#site-q').value = query;
    status.textContent = query ? `「${query}」找到 ${found.length} 項結果` : '輸入人名、作品或正在關心的問題。';
    const grid = status.nextElementSibling;
    grid.innerHTML = found.slice((page - 1) * 20, page * 20).map(i => `<a class="rounded-md border bg-card p-6 hover:border-primary" href="${escape(href(i.href))}"><p class="eyebrow">${escape(i.kind)}</p><h2 class="font-serif text-2xl text-primary">${escape(i.title)}</h2><p class="mt-3 text-base leading-7 text-muted-foreground">${escape(i.detail)}</p></a>`).join('');
    if (query && !found.length) {
      const empty = node('p', 'rounded-md border bg-card p-6 leading-8');
      empty.innerHTML = `沒有相符結果。試試英文姓氏或較短的關鍵字，也可以從 ${link(href('/topics'), '知識主題', 'class="underline"')} 或 ${link(href('/blog'), '長笛誌', 'class="underline"')} 開始。`;
      grid.after(empty);
    }
    if (pages > 1) {
      const nav = node('nav', 'journal-pagination'); nav.setAttribute('aria-label', '搜尋結果分頁');
      nav.innerHTML = (page > 1 ? link(href('/search', { q: query, page: page - 1 }), '← 上一頁') : '') + `<span>第 ${page} / ${pages} 頁</span>` + (page < pages ? link(href('/search', { q: query, page: page + 1 }), '下一頁 →') : '');
      grid.after(nav);
    }
  }
})();
