/* ==========================================================================
   JMW Gear Spec Navigator — App Logic
   ========================================================================== */

const CATS = {
  '이미용가전': {
    accent: 'beauty',
    subs: {
      dryer:     { label: 'Dryer',       kr: '드라이기' },
      iron:      { label: 'Iron',        kr: '매직기·스타일러' },
      curling:   { label: 'Culing Iron', kr: '컬링아이언' },
    }
  },
  '생활가전': {
    accent: 'home',
    subs: {
      bodydryer:  { label: 'Body Dryer', kr: '바디드라이어' },
      circulator: { label: 'Circulator', kr: '서큘레이터' },
    }
  },
  '주방가전': {
    accent: 'kitchen',
    subs: {
      bytulz: { label: 'Bytulz', kr: '음식물처리기' },
    }
  }
};

const CARD_SPEC_KEYS = {
  dryer:      ['와트', '사이즈', '무게', '색상'],
  iron:       ['와트', '열판사이즈', '무게', '색상'],
  curling:    ['와트', '열판사이즈', '무게', '색상'],
  bodydryer:  ['와트', '사이즈', '무게'],
  circulator: ['와트', '사이즈', '무게'],
  bytulz:     ['소비전력', '용량', '제품사이즈'],
};

const QUICK_TAGS = {
  dryer:      ['두피케어', 'LED케어', '망치형', '음이온', '신제품'],
  iron:       ['슬립모드', '무빙센서', '터치센서', '방수', '골드'],
  curling:    ['자동전원차단', '사용자온도기억', 'FreeVoltage', '음이온'],
  bodydryer:  ['음이온케어', '예열기능', '메모리기능'],
  circulator: ['수면풍', '자연풍', '무선', '회전'],
  bytulz:     ['살균', '자동', '필터'],
};

const SYNONYMS = {
  '곱슬머리': ['컬링', '웨이브', '노즐', '브러시노즐', '매직'],
  '컬머리': ['컬링', '웨이브'],
  '두피': ['두피케어'],
  '원룸': ['소형', '미니'],
  '자취방': ['소형', '미니'],
  '거실': ['대형'],
  '캠핑': ['미니', '무선', '휴대'],
  '휴대용': ['미니', '무선'],
  '무선': ['무선', '배터리'],
  '선물': ['에디션', '스페셜', 'SE'],
  '조용한': ['저소음'],
  '저소음': ['저소음'],
  '냄새': ['탈취', '살균'],
  '건조': ['건조'],
};

let PRODUCTS = [];
let state = {
  category: '이미용가전',
  subcategory: 'dryer',
  query: '',
  dryerType: 'all',       // all | 고정형 | 망치형
  includeDiscontinued: false,
  sort: 'default',
  compare: new Set(),
  railOpen: false,
};

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------------------------------------------------------------------- */
/* Load data                                                              */
/* ---------------------------------------------------------------------- */
async function loadData() {
  const res = await fetch('products.json');
  PRODUCTS = await res.json();
  initUI();
  render();
}

/* ---------------------------------------------------------------------- */
/* UI init (tabs, rail)                                                   */
/* ---------------------------------------------------------------------- */
function initUI() {
  const tabWrap = $('#catTabs');
  tabWrap.innerHTML = Object.keys(CATS).map(cat => `
    <button class="cat-tab ${cat === state.category ? 'active' : ''}" data-cat="${cat}">${cat}</button>
  `).join('');
  tabWrap.addEventListener('click', e => {
    const btn = e.target.closest('.cat-tab');
    if (!btn) return;
    setCategory(btn.dataset.cat);
  });

  $('#searchInput').addEventListener('input', e => {
    state.query = e.target.value.trim();
    $('#searchBox').classList.toggle('has-value', !!state.query);
    render();
  });
  $('#searchClear').addEventListener('click', () => {
    state.query = '';
    $('#searchInput').value = '';
    $('#searchBox').classList.remove('has-value');
    render();
  });

  $('#sortSelect').addEventListener('change', e => {
    state.sort = e.target.value;
    render();
  });

  $('#railToggle').addEventListener('click', () => {
    state.railOpen = !state.railOpen;
    $('#rail').classList.toggle('open', state.railOpen);
  });

  applyAccent();
}

function applyAccent() {
  const map = { beauty: '--acc-beauty', home: '--acc-home', kitchen: '--acc-kitchen' };
  const glowMap = { beauty: '--acc-beauty-glow', home: '--acc-home-glow', kitchen: '--acc-kitchen-glow' };
  const accentKey = CATS[state.category].accent;
  const root = document.documentElement;
  root.style.setProperty('--accent', `var(${map[accentKey]})`);
  root.style.setProperty('--accent-glow', `var(${glowMap[accentKey]})`);
}

function setCategory(cat) {
  state.category = cat;
  const firstSub = Object.keys(CATS[cat].subs)[0];
  state.subcategory = firstSub;
  state.dryerType = 'all';
  applyAccent();
  $$('.cat-tab').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  render();
}

/* ---------------------------------------------------------------------- */
/* Filtering                                                              */
/* ---------------------------------------------------------------------- */
function expandQuery(q) {
  const tokens = q.split(/\s+/).filter(Boolean);
  const expanded = new Set(tokens.map(t => t.toLowerCase()));
  tokens.forEach(t => {
    if (SYNONYMS[t]) SYNONYMS[t].forEach(s => expanded.add(s.toLowerCase()));
  });
  return Array.from(expanded);
}

function matchesQuery(p, tokens) {
  if (tokens.length === 0) return true;
  const haystack = [
    p.name, p.sku, p.series,
    ...(p.tags || []),
    ...Object.values(p.specs || {})
  ].join(' ').toLowerCase();
  return tokens.some(t => haystack.includes(t));
}

function getFiltered() {
  const tokens = expandQuery(state.query);
  let items = PRODUCTS.filter(p =>
    p.category === state.category &&
    p.subcategory === state.subcategory
  );

  if (!state.includeDiscontinued) items = items.filter(p => !p.discontinued);
  if (state.subcategory === 'dryer' && state.dryerType !== 'all') {
    items = items.filter(p => p.dryerType === state.dryerType);
  }
  items = items.filter(p => matchesQuery(p, tokens));

  if (state.sort === 'name') {
    items = [...items].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  } else if (state.sort === 'newest') {
    items = [...items].sort((a, b) => (b.released || '').localeCompare(a.released || ''));
  }
  return items;
}

/* ---------------------------------------------------------------------- */
/* Render: Rail                                                           */
/* ---------------------------------------------------------------------- */
function renderRail() {
  const subs = CATS[state.category].subs;
  const subListHtml = Object.entries(subs).map(([key, meta]) => {
    const count = PRODUCTS.filter(p => p.category === state.category && p.subcategory === key && (state.includeDiscontinued || !p.discontinued)).length;
    return `<button class="sub-item ${state.subcategory === key ? 'active' : ''}" data-sub="${key}">
      <span>${meta.label}<br><small style="color:var(--text-faint);font-size:11px;font-weight:400">${meta.kr}</small></span>
      <span class="count">${count}</span>
    </button>`;
  }).join('');

  let extraFilters = '';
  if (state.subcategory === 'dryer') {
    extraFilters = `
      <div class="rail-group">
        <p class="rail-title">타입</p>
        <div class="chip-row" id="dryerTypeChips">
          <button class="chip ${state.dryerType === 'all' ? 'active' : ''}" data-type="all">전체</button>
          <button class="chip ${state.dryerType === '고정형' ? 'active' : ''}" data-type="고정형">고정형</button>
          <button class="chip ${state.dryerType === '망치형' ? 'active' : ''}" data-type="망치형">망치형</button>
        </div>
      </div>`;
  }

  const quickTags = QUICK_TAGS[state.subcategory] || [];

  $('#rail').innerHTML = `
    <div class="rail-group">
      <p class="rail-title">Product Line</p>
      <div class="sub-list">${subListHtml}</div>
    </div>
    ${extraFilters}
    <div class="rail-group">
      <div class="toggle-row">
        <span class="toggle-label">단종 모델 포함</span>
        <div class="switch ${state.includeDiscontinued ? 'on' : ''}" id="discToggle"></div>
      </div>
    </div>
    <div class="rail-group recommend-box">
      <p class="rail-title">빠른 키워드 추천</p>
      <div class="chip-row" id="quickTagChips">
        ${quickTags.map(t => `<button class="chip" data-tag="${t}">${t}</button>`).join('')}
      </div>
    </div>
  `;

  $$('.sub-item', $('#rail')).forEach(btn => {
    btn.addEventListener('click', () => {
      state.subcategory = btn.dataset.sub;
      state.dryerType = 'all';
      state.railOpen = false;
      $('#rail').classList.remove('open');
      render();
    });
  });
  const dtChips = $('#dryerTypeChips');
  if (dtChips) {
    $$('.chip', dtChips).forEach(btn => {
      btn.addEventListener('click', () => {
        state.dryerType = btn.dataset.type;
        render();
      });
    });
  }
  $('#discToggle').addEventListener('click', () => {
    state.includeDiscontinued = !state.includeDiscontinued;
    render();
  });
  $$('.chip', $('#quickTagChips')).forEach(btn => {
    btn.addEventListener('click', () => {
      state.query = btn.dataset.tag;
      $('#searchInput').value = state.query;
      $('#searchBox').classList.add('has-value');
      render();
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Render: Grid                                                           */
/* ---------------------------------------------------------------------- */
function isNew(p) {
  if (!p.released) return false;
  const m = p.released.match(/(\d{4})/);
  if (!m) return false;
  return parseInt(m[1], 10) >= 2025;
}

function cardHtml(p) {
  const specKeys = CARD_SPEC_KEYS[p.subcategory] || [];
  const chips = specKeys
    .map(k => p.specs[k])
    .filter(Boolean)
    .slice(0, 4)
    .map(v => `<span class="spec-chip">${escapeHtml(truncate(v, 16))}</span>`)
    .join('');
  const selected = state.compare.has(p.id);
  const badge = p.discontinued
    ? `<span class="card-badge disc">단종</span>`
    : (isNew(p) ? `<span class="card-badge new">NEW</span>` : '');

  return `
  <div class="card ${selected ? 'selected' : ''}" data-id="${p.id}">
    <div class="card-check" data-check="${p.id}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l5 5L20 6"/></svg>
    </div>
    ${badge}
    <div class="card-frame">
      <div class="card-corners"><i></i><i></i><i></i><i></i></div>
      <img src="images/${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
    </div>
    <div class="card-body">
      <div class="card-series">${escapeHtml(p.series || CATS[p.category].subs[p.subcategory].kr)}</div>
      <div class="card-name">${escapeHtml(p.name)}</div>
      <div class="card-sku">${escapeHtml(p.sku)}</div>
      <div class="card-specs">${chips}</div>
    </div>
  </div>`;
}

function render() {
  renderRail();
  const items = getFiltered();
  const subMeta = CATS[state.category].subs[state.subcategory];

  $('#mainTitle').textContent = subMeta.label;
  $('#mainPath').textContent = `${state.category} / ${subMeta.kr}`;
  $('#resultCount').innerHTML = `<b>${items.length}</b>개 모델`;

  const quickTags = QUICK_TAGS[state.subcategory] || [];
  $('#quickTagsMain').innerHTML = quickTags.map(t =>
    `<button class="chip ${state.query === t ? 'active' : ''}" data-tag="${t}">${t}</button>`
  ).join('');
  $$('.chip', $('#quickTagsMain')).forEach(btn => {
    btn.addEventListener('click', () => {
      state.query = state.query === btn.dataset.tag ? '' : btn.dataset.tag;
      $('#searchInput').value = state.query;
      $('#searchBox').classList.toggle('has-value', !!state.query);
      render();
    });
  });

  const grid = $('#grid');
  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="glyph">◇</div>
        <p>검색 결과가 없습니다.</p>
        <p><b>"${escapeHtml(state.query)}"</b>에 해당하는 모델을 찾지 못했어요.</p>
      </div>`;
  } else {
    grid.innerHTML = items.map(cardHtml).join('');
  }

  $$('.card', grid).forEach(card => {
    const id = card.dataset.id;
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-check]')) {
        toggleCompare(id);
        return;
      }
      openProductModal(id);
    });
  });

  renderTray();
}

function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------------------------------------------------------------------- */
/* Compare                                                                 */
/* ---------------------------------------------------------------------- */
function toggleCompare(id) {
  if (state.compare.has(id)) {
    state.compare.delete(id);
  } else {
    if (state.compare.size >= 6) {
      flashTray();
      return;
    }
    state.compare.add(id);
  }
  render();
}

function flashTray() {
  const tray = $('#tray');
  tray.style.borderColor = 'var(--danger)';
  setTimeout(() => tray.style.borderColor = '', 300);
}

function renderTray() {
  const tray = $('#tray');
  const ids = Array.from(state.compare);
  if (ids.length === 0) { tray.classList.remove('show'); return; }
  tray.classList.add('show');
  const items = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  $('#trayThumbs').innerHTML = items.map(p => `
    <div class="tray-thumb">
      <img src="images/${p.image}" alt="">
      <button data-remove="${p.id}">✕</button>
    </div>`).join('');
  $('#trayCount').textContent = `${items.length}개 선택`;
  $$('[data-remove]', $('#trayThumbs')).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.compare.delete(btn.dataset.remove);
      render();
    });
  });
  $('#trayCta').disabled = items.length < 2;
}

$('#trayClear').addEventListener('click', () => { state.compare.clear(); render(); });
$('#trayCta').addEventListener('click', () => openCompareModal());

/* ---------------------------------------------------------------------- */
/* Product modal                                                          */
/* ---------------------------------------------------------------------- */
function openProductModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const rows = Object.entries(p.specs).map(([k, v]) => `
    <tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>
  `).join('');
  const inCompare = state.compare.has(id);

  $('#productModalBody').innerHTML = `
    <div class="pmodal-media"><img src="images/${p.image}" alt="${escapeHtml(p.name)}"></div>
    <div class="pmodal-info">
      <div class="pmodal-eyebrow">${escapeHtml(p.category)} · ${escapeHtml(CATS[p.category].subs[p.subcategory].label)}</div>
      <h2>${escapeHtml(p.name)}</h2>
      <div class="pmodal-sku">${escapeHtml(p.sku)} ${p.series ? '· ' + escapeHtml(p.series) + ' 시리즈' : ''}</div>
      <div class="pmodal-badges">
        ${p.released ? `<span class="badge">출시 ${escapeHtml(p.released)}</span>` : ''}
        ${p.dryerType ? `<span class="badge">${escapeHtml(p.dryerType)}</span>` : ''}
        ${p.discontinued ? `<span class="badge" style="color:var(--danger);border-color:rgba(217,117,117,.3)">단종</span>` : `<span class="badge" style="color:var(--acc-home)">판매중</span>`}
      </div>
      <table class="pmodal-spectable">${rows}</table>
      <div class="pmodal-actions">
        <button class="btn-compare-add ${inCompare ? 'active' : ''}" id="modalCompareBtn">${inCompare ? '✓ 비교함에 담김' : '+ 비교함에 담기'}</button>
      </div>
    </div>
  `;
  $('#modalCompareBtn').addEventListener('click', () => {
    toggleCompare(id);
    openProductModal(id);
  });
  showOverlay('#productOverlay');
}

/* ---------------------------------------------------------------------- */
/* Compare modal                                                          */
/* ---------------------------------------------------------------------- */
function openCompareModal() {
  const items = Array.from(state.compare).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  if (items.length < 2) return;

  const labelOrder = [];
  items.forEach(p => Object.keys(p.specs).forEach(k => { if (!labelOrder.includes(k)) labelOrder.push(k); }));

  const headCells = items.map(p => `
    <th class="compare-head-cell">
      <img src="images/${p.image}" alt="">
      <div class="cname">${escapeHtml(p.name)}</div>
      <div class="csku">${escapeHtml(p.sku)}</div>
      <button data-remove-cmp="${p.id}">제외</button>
    </th>`).join('');

  const bodyRows = labelOrder.map(label => {
    const values = items.map(p => p.specs[label] || '—');
    const allSame = values.every(v => v === values[0]);
    const cells = items.map((p, i) => `<td class="${allSame ? '' : 'diff'}">${escapeHtml(values[i])}</td>`).join('');
    return `<tr><td class="row-label">${escapeHtml(label)}</td>${cells}</tr>`;
  }).join('');

  $('#compareModalBody').innerHTML = `
    <h2>스펙 비교</h2>
    <p class="sub">선택한 ${items.length}개 모델의 사양을 나란히 비교합니다. 값이 다른 항목은 강조 표시됩니다.</p>
    <div class="compare-scroll">
      <table class="compare-table">
        <thead><tr><th class="row-label">모델</th>${headCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  `;
  $$('[data-remove-cmp]', $('#compareModalBody')).forEach(btn => {
    btn.addEventListener('click', () => {
      state.compare.delete(btn.dataset.removeCmp);
      hideOverlay('#compareOverlay');
      render();
      if (state.compare.size >= 2) openCompareModal();
    });
  });
  showOverlay('#compareOverlay');
}

/* ---------------------------------------------------------------------- */
/* Overlay helpers                                                        */
/* ---------------------------------------------------------------------- */
function showOverlay(sel) { $(sel).classList.add('show'); document.body.style.overflow = 'hidden'; }
function hideOverlay(sel) { $(sel).classList.remove('show'); document.body.style.overflow = ''; }

$$('.overlay').forEach(ov => {
  ov.addEventListener('click', e => { if (e.target === ov) { hideOverlay('#' + ov.id); } });
});
$$('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => hideOverlay('#' + btn.closest('.overlay').id));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') $$('.overlay.show').forEach(ov => hideOverlay('#' + ov.id));
});

loadData();
