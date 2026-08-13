/* ==========================================================================
   JMW Gear Spec Navigator — App Logic (V2.3)
   ========================================================================== */

const CURRENT_VERSION = 'V2.4';
const VERSION_LOG = [
  { v: 'V2.4', date: '2026.08', notes: ['좌측 사이드바에 버전 정보 + 업데이트 내역(버전별) 패널 추가'] },
  { v: 'V2.3', date: '2026.08', notes: ['"단종 모델 포함" 기본값 ON으로 변경'] },
  { v: 'V2.2', date: '2026.08', notes: [
    '전체 데이터 재검증 (모델·이미지·스펙 컬럼 누락 없음 확인)',
    '서큘레이터 4종 확인 (2종은 단종 처리라 기본화면에 숨김)',
    '"신제품" 죽은 키워드 삭제',
    '스펙 정밀 정렬·빠른 키워드를 상단으로 이동',
    '실 데이터 기반으로 키워드 전면 재설계',
  ]},
  { v: 'V2.1', date: '2026.08', notes: [
    'Iron·Culing Iron 등 사양 누락분(제어방식/안전장치 등) 반영',
    '키워드 필터-전역검색 충돌 버그 수정',
    '"프리볼트" 키워드 추가',
    '화면 최대 폭 확장 (1440px → 1760px)',
  ]},
  { v: 'V2.0', date: '2026.08', notes: [
    '전 카테고리 통합 검색',
    '대분류+중분류 사이드바 트리로 개편',
    '최신 출시순 기본 정렬',
    '드라이기 스펙 정밀 정렬 추가',
    '화이트/반투명 글래스모피즘 디자인으로 전면 리뉴얼',
  ]},
  { v: 'V1.0', date: '2026.08', notes: ['최초 배포 — 221개 모델 · 실사진 · 키워드 검색·추천 · 최대 6개 비교'] },
];

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
  dryer:      ['음이온', '셀프클리닝', '전자파차단', 'LED케어', '세이프 모드'],
  iron:       ['슬립모드', '터치센서', '열판잠금', '무빙센서', '방수', '프리볼트'],
  curling:    ['자동전원차단', '사용자온도기억', '열판회전', '프리볼트'],
  bodydryer:  ['음이온케어', '예열기능', '메모리기능'],
  circulator: ['수면풍', '자연풍', '무선', '회전'],
  bytulz:     ['감량율', '살균', '자동'],
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
  '프리볼트': ['free voltage', 'freevoltage'],
};

/* ---- 스펙 기반 스마트 정렬 키워드 (중분류별) ---------------------------- */
function parseNumList(str) {
  if (!str) return [];
  const cleaned = String(str).replace(/,/g, '');
  const matches = cleaned.match(/\d+(?:\.\d+)?/g);
  return matches ? matches.map(Number) : [];
}
function specMaxNum(p, key) {
  const nums = parseNumList(p.specs[key]);
  return nums.length ? Math.max(...nums) : null;
}
function specFirstNum(p, key) {
  const nums = parseNumList(p.specs[key]);
  return nums.length ? nums[0] : null;
}
function specStepCount(p, key) {
  const v = p.specs[key];
  if (!v) return 0;
  const matches = String(v).match(/\d+\s*단/g);
  return matches ? new Set(matches).size : 0;
}

const SMART_TAGS = {
  dryer: [
    { label: '풍속 높은순',     key: '풍속', fn: specMaxNum,   dir: 'desc' },
    { label: '풍속 낮은순',     key: '풍속', fn: specMaxNum,   dir: 'asc'  },
    { label: '풍속 단계 많은순', key: '풍속', fn: specStepCount, dir: 'desc' },
    { label: '와트 높은순',     key: '와트', fn: specFirstNum, dir: 'desc' },
    { label: '와트 낮은순',     key: '와트', fn: specFirstNum, dir: 'asc'  },
    { label: '온도 높은순',     key: '풍온', fn: specMaxNum,   dir: 'desc' },
    { label: '온도 낮은순',     key: '풍온', fn: specMaxNum,   dir: 'asc'  },
    { label: '가벼운순',        key: '무게', fn: specFirstNum, dir: 'asc'  },
  ],
  iron: [
    { label: '온도 높은순', key: '온도범위', fn: specMaxNum,   dir: 'desc' },
    { label: '온도 낮은순', key: '온도범위', fn: specMaxNum,   dir: 'asc'  },
    { label: '와트 높은순', key: '와트',     fn: specFirstNum, dir: 'desc' },
    { label: '와트 낮은순', key: '와트',     fn: specFirstNum, dir: 'asc'  },
    { label: '가벼운순',    key: '무게',     fn: specFirstNum, dir: 'asc'  },
  ],
  curling: [
    { label: '온도 높은순',   key: '온도범위',   fn: specMaxNum,   dir: 'desc' },
    { label: '온도 낮은순',   key: '온도범위',   fn: specMaxNum,   dir: 'asc'  },
    { label: '열판 큰순',     key: '열판사이즈', fn: specFirstNum, dir: 'desc' },
    { label: '열판 작은순',   key: '열판사이즈', fn: specFirstNum, dir: 'asc'  },
    { label: '가벼운순',      key: '무게',       fn: specFirstNum, dir: 'asc'  },
  ],
  circulator: [
    { label: '와트 높은순', key: '와트', fn: specFirstNum, dir: 'desc' },
    { label: '와트 낮은순', key: '와트', fn: specFirstNum, dir: 'asc'  },
    { label: '가벼운순',    key: '무게', fn: specFirstNum, dir: 'asc'  },
  ],
};

let PRODUCTS = [];
let state = {
  category: '이미용가전',
  subcategory: 'dryer',
  query: '',
  tagFilter: null,        // 사이드바 "빠른 키워드" 칩 — 현재 중분류 내에서만 필터링
  dryerType: 'all',
  includeDiscontinued: true,
  sort: 'newest',
  smartSort: null,
  compare: new Set(),
  railOpen: false,
};

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

async function loadData() {
  const res = await fetch('products.json');
  PRODUCTS = await res.json();
  initUI();
  render();
}

function initUI() {
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

function setCategory(cat, sub) {
  state.category = cat;
  state.subcategory = sub || Object.keys(CATS[cat].subs)[0];
  state.dryerType = 'all';
  state.tagFilter = null;
  state.smartSort = null;
  state.query = '';
  $('#searchInput').value = '';
  $('#searchBox').classList.remove('has-value');
  applyAccent();
  render();
}

function matchSmartTagByLabel(label) {
  return (SMART_TAGS[state.subcategory] || []).find(t => t.label === label) || null;
}

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

function parseReleaseDate(s) {
  if (!s) return null;
  const m = String(s).match(/(\d{4})[.\-\/]?(\d{1,2})?/);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  const mo = m[2] ? parseInt(m[2], 10) : 1;
  return y * 100 + mo;
}

function isGlobalSearch() {
  return !!state.query && !state.smartSort;
}

function getFiltered() {
  let items;

  if (isGlobalSearch()) {
    items = PRODUCTS.slice();
    if (!state.includeDiscontinued) items = items.filter(p => !p.discontinued);
    const tokens = expandQuery(state.query);
    items = items.filter(p => matchesQuery(p, tokens));
  } else {
    items = PRODUCTS.filter(p =>
      p.category === state.category &&
      p.subcategory === state.subcategory
    );
    if (!state.includeDiscontinued) items = items.filter(p => !p.discontinued);
    if (state.subcategory === 'dryer' && state.dryerType !== 'all') {
      items = items.filter(p => p.dryerType === state.dryerType);
    }
    if (state.tagFilter) {
      items = items.filter(p => matchesQuery(p, expandQuery(state.tagFilter)));
    }
    if (state.smartSort) {
      const { key, fn, dir } = state.smartSort;
      items = [...items].sort((a, b) => {
        const va = fn(a, key), vb = fn(b, key);
        if (va === null && vb === null) return 0;
        if (va === null) return 1;
        if (vb === null) return -1;
        return dir === 'desc' ? vb - va : va - vb;
      });
      return items;
    }
  }

  if (state.sort === 'name') {
    items = [...items].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  } else if (state.sort === 'oldest') {
    items = [...items].sort((a, b) => (parseReleaseDate(a.released) || 0) - (parseReleaseDate(b.released) || 0));
  } else {
    items = [...items].sort((a, b) => (parseReleaseDate(b.released) || 0) - (parseReleaseDate(a.released) || 0));
  }
  return items;
}

function renderRail() {
  const treeHtml = Object.entries(CATS).map(([catKey, catMeta]) => {
    const subsHtml = Object.entries(catMeta.subs).map(([subKey, subMeta]) => {
      const count = PRODUCTS.filter(p => p.category === catKey && p.subcategory === subKey && (state.includeDiscontinued || !p.discontinued)).length;
      const active = !isGlobalSearch() && state.category === catKey && state.subcategory === subKey;
      return `<button class="sub-item ${active ? 'active' : ''}" data-cat="${catKey}" data-sub="${subKey}">
        <span>${subMeta.label}<br><small style="color:var(--text-faint);font-size:11px;font-weight:400">${subMeta.kr}</small></span>
        <span class="count">${count}</span>
      </button>`;
    }).join('');
    const catActive = !isGlobalSearch() && state.category === catKey;
    return `
      <div class="rail-cat-group">
        <button class="rail-cat-header ${catActive ? 'active' : ''}" data-cat="${catKey}">
          <span class="rail-cat-dot dot-${catMeta.accent}"></span>${catKey}
        </button>
        <div class="sub-list">${subsHtml}</div>
      </div>`;
  }).join('');

  let extraFilters = '';
  if (!isGlobalSearch() && state.subcategory === 'dryer') {
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

  $('#rail').innerHTML = `
    <div class="rail-group">
      <p class="rail-title">Product Line</p>
      ${treeHtml}
    </div>
    ${extraFilters}
    <div class="rail-group">
      <div class="toggle-row">
        <span class="toggle-label">단종 모델 포함</span>
        <div class="switch ${state.includeDiscontinued ? 'on' : ''}" id="discToggle"></div>
      </div>
    </div>
    <div class="rail-group version-box">
      <p class="rail-title">버전 정보</p>
      <div class="version-current">현재 <b>${CURRENT_VERSION}</b></div>
      <details class="version-log">
        <summary>업데이트 내역 보기</summary>
        ${VERSION_LOG.map(v => `
          <div class="version-entry">
            <div class="version-entry-head"><span class="version-badge">${v.v}</span><span class="version-date">${v.date}</span></div>
            <ul>${v.notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')}</ul>
          </div>
        `).join('')}
      </details>
    </div>
  `;

  $$('.rail-cat-header', $('#rail')).forEach(btn => {
    btn.addEventListener('click', () => {
      state.railOpen = false;
      $('#rail').classList.remove('open');
      setCategory(btn.dataset.cat);
    });
  });
  $$('.sub-item', $('#rail')).forEach(btn => {
    btn.addEventListener('click', () => {
      state.railOpen = false;
      $('#rail').classList.remove('open');
      setCategory(btn.dataset.cat, btn.dataset.sub);
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
}

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
  const catBadge = isGlobalSearch()
    ? `<div class="card-cat-badge">${escapeHtml(p.category)} · ${escapeHtml(CATS[p.category].subs[p.subcategory].label)}</div>`
    : '';

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
      ${catBadge}
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

  if (isGlobalSearch()) {
    $('#mainTitle').textContent = '검색 결과';
    $('#mainPath').textContent = `전체 모델 대상 검색 · "${state.query}"`;
  } else {
    const subMeta = CATS[state.category].subs[state.subcategory];
    $('#mainTitle').textContent = subMeta.label;
    $('#mainPath').textContent = `${state.category} / ${subMeta.kr}`;
  }
  $('#resultCount').innerHTML = `<b>${items.length}</b>개 모델`;

  const smartTags = isGlobalSearch() ? [] : (SMART_TAGS[state.subcategory] || []);
  const tagTags = isGlobalSearch() ? [] : (QUICK_TAGS[state.subcategory] || []);
  const smartChipsHtml = smartTags.map(t =>
    `<button class="chip chip-smart ${state.smartSort && state.smartSort.label === t.label ? 'active' : ''}" data-smart="${t.label}">${t.label}</button>`
  ).join('');
  const tagChipsHtml = tagTags.map(t =>
    `<button class="chip ${state.tagFilter === t ? 'active' : ''}" data-tag="${t}">${t}</button>`
  ).join('');
  $('#quickTagsMain').innerHTML = smartChipsHtml + tagChipsHtml;
  $$('.chip[data-smart]', $('#quickTagsMain')).forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.dataset.smart;
      state.smartSort = (state.smartSort && state.smartSort.label === label) ? null : matchSmartTagByLabel(label);
      render();
    });
  });
  $$('.chip[data-tag]', $('#quickTagsMain')).forEach(btn => {
    btn.addEventListener('click', () => {
      state.tagFilter = state.tagFilter === btn.dataset.tag ? null : btn.dataset.tag;
      render();
    });
  });

  const grid = $('#grid');
  if (items.length === 0) {
    const shownTerm = state.query || state.tagFilter || '';
    grid.innerHTML = `
      <div class="empty-state">
        <div class="glyph">◇</div>
        <p>검색 결과가 없습니다.</p>
        <p><b>"${escapeHtml(shownTerm)}"</b>에 해당하는 모델을 찾지 못했어요.</p>
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
