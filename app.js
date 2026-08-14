/* ==========================================================================
   JMW Gear Spec Navigator — App Logic (V2.3)
   ========================================================================== */

const CURRENT_VERSION = 'V2.29';
const VERSION_LOG = [
  { v: 'V2.29', date: '2026.08', notes: ['매뉴얼 뷰어 창 확대(96vw, 최대 1900px) + 매뉴얼 영역 비중 확대, "매뉴얼 닫기" 버튼을 좌측으로 이동해 전체 닫기(✕) 버튼과 겹침 해소'] },
  { v: 'V2.28', date: '2026.08', notes: ['매뉴얼 보기를 새 탭 대신 네비게이터 내장 뷰어로 변경 — 상세창이 넓어지며 좌측 사양정보 + 우측 매뉴얼(iframe)이 한 화면에 나란히 표시'] },
  { v: 'V2.27', date: '2026.08', notes: ['제품 상세 팝업에 "매뉴얼 보기·다운로드·URL복사" 버튼 추가 (PDF 직접 호스팅, 브라우저 기본 뷰어로 검색·페이지이동 지원) — BYTULZ 매뉴얼로 우선 테스트'] },
  { v: 'V2.26', date: '2026.08', notes: ['Contents 구조 재정비 — Product Line과 동급 독립 섹션으로 변경, 영상 있는 그룹(Dryer/Iron/Bytulz)만 표시, Tutorial/Styling Tip 상단 필터 칩 추가. 총 24개 영상(BYTULZ 7편 포함) 등록'] },
  { v: 'V2.25', date: '2026.08', notes: ['Product Line에 "Contents > Tutorial" 대분류 신설 — 유튜브 사용법 영상을 제품처럼 그리드로 보고 클릭 시 팝업 재생 (현재 드라이기 5편 등록, 다운로드 없이 임베드 방식)'] },
  { v: 'V2.24', date: '2026.08', notes: ['좌측 상단 "JMW Gear Spec Navigator" 클릭 시 초기 화면으로 이동(모든 필터·검색·비교 초기화)'] },
  { v: 'V2.23', date: '2026.08', notes: ['M5042D 스위치 정보 오류(무게값 잘못 복사됨) 수정 반영. 데이터 전수 감사 추가 진행(추가 이상 없음).'] },
  { v: 'V2.22', date: '2026.08', notes: ['숫자 오인식 버그 2건 수정 — "1.700W급"을 1.7로 잘못 읽던 문제, 무게 g/kg 단위 혼용 보정. (엑셀 자체 오류 1건 발견: M5042D 스위치란에 무게값이 잘못 들어감, 확인 필요)'] },
  { v: 'V2.21', date: '2026.08', notes: ['모바일 대응 보강 — 비교창 좁은 화면에서 깨지던 문제 수정(가로스크롤 방식으로 전환), 상단 바로가기 초소형 화면에서 숨김'] },
  { v: 'V2.20', date: '2026.08', notes: ['JMW 브랜드 퍼플 컬러 반영 (로고·바로가기·카테고리 대표 라벨 폰트)'] },
  { v: 'V2.19', date: '2026.08', notes: ['비교표 콤마-나열 숫자 오인식 버그 수정(온도범위 등), 좌측라벨 확장, 칸 100%채움 복원, 창 80% 축소, 정렬영역에 단종토글 추가'] },
  { v: 'V2.18', date: '2026.08', notes: ['비교표 칸 폭을 300px 고정(2~5개), 6개만 자동축소로 스크롤 방지 + 폰트·색상 대비 확대'] },
  { v: 'V2.17', date: '2026.08', notes: ['상단바에 "JMW 공식몰 비교기능" 바로가기 추가'] },
  { v: 'V2.16', date: '2026.08', notes: ['비교표 이미지 확대, 제목 여백 확보, 전압/주파수 오염 근본 수정, 기화측정·임시노출 기준 하이라이트 추가'] },
  { v: 'V2.15', date: '2026.08', notes: ['비교표 "더 좋은 값" 계산 버그 수정 — 풍온 항목에서 "(220V 기준)"의 220을 온도로 잘못 인식하던 문제 해결'] },
  { v: 'V2.14', date: '2026.08', notes: ['유통 필터 위치·방식 개편(전체/단일선택), 라벨 폰트 강조, 신규 엑셀 반영(단종 4건)'] },
  { v: 'V2.13', date: '2026.08', notes: ['유통 값 "A+B+C" 정규화, 비교표 하이라이트·정렬 개선'] },
  { v: 'V2.12', date: '2026.08', notes: ['유통 필터 원본표기 적용, 비교창 폭 확장'] },
  { v: 'V2.11', date: '2026.08', notes: ['유통 빠른선택 추가, 비교 삭제버튼 개선'] },
  { v: 'V2.10', date: '2026.08', notes: ['프리볼트 키워드에 프리고 추가'] },
  { v: 'V2.9', date: '2026.08', notes: ['정렬/빠른선택/시리즈 영역 분리, 단계 필터 추가, 시리즈 통합'] },
  { v: 'V2.8', date: '2026.08', notes: ['쇼핑몰 바로가기 메뉴 추가'] },
  { v: 'V2.7', date: '2026.08', notes: ['키워드 복수선택, 카드 사양 확장, 비교 인사이트·시리즈 필터 추가'] },
  { v: 'V2.6', date: '2026.08', notes: ['우클릭/개발자도구 차단'] },
  { v: 'V2.5', date: '2026.08', notes: ['버전 패널 자동펼침 개선'] },
  { v: 'V2.4', date: '2026.08', notes: ['버전 정보 패널 추가'] },
  { v: 'V2.3', date: '2026.08', notes: ['단종 모델 기본 포함으로 변경'] },
  { v: 'V2.2', date: '2026.08', notes: ['데이터 재검증, 키워드 재설계'] },
  { v: 'V2.1', date: '2026.08', notes: ['사양 누락분 반영, 필터 버그 수정'] },
  { v: 'V2.0', date: '2026.08', notes: ['통합검색·사이드바 개편, 화이트 테마 리뉴얼'] },
  { v: 'V1.0', date: '2026.08', notes: ['최초 배포 — 221개 모델'] },
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
  dryer:      ['와트', '사이즈', '무게', '색상', '풍온'],
  iron:       ['와트', '열판사이즈', '무게', '색상', '온도범위'],
  curling:    ['와트', '열판사이즈', '무게', '색상'],
  bodydryer:  ['와트', '사이즈', '무게', '온도범위'],
  circulator: ['와트', '사이즈', '무게', '배터리용량', '풍속'],
  bytulz:     ['제품무게', '온도범위'],
};

const QUICK_TAGS = {
  dryer:      ['음이온', '셀프클리닝', '전자파차단', 'LED케어', '세이프 모드', '프리볼트'],
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
  let s = String(str);
  // 콤마는 "1,350W"(천단위 구분, 콤마 1개) vs "120,140,160도"(값 나열, 콤마 2개 이상) 두 가지로 쓰인다.
  // 콤마가 1개뿐일 때만 천단위 구분자로 보고 합치고, 2개 이상이면 나열로 보고 그대로 분리한다.
  const commaCount = (s.match(/,/g) || []).length;
  if (commaCount === 1) {
    s = s.replace(/(\d{1,3}),(\d{3})/, '$1$2');
  }
  // 드물게 마침표를 천단위 구분자로 쓴 경우("1.700W급") — 소수점(72.8, 99.999% 등)과 구분하기 위해
  // "숫자.정확히3자리" 바로 뒤에 단위 글자(영문/한글)가 붙을 때만 천단위로 판단
  s = s.replace(/(\d{1,3})\.(\d{3})(?=\s*[A-Za-z가-힣])/g, '$1$2');
  const matches = s.match(/\d+(?:\.\d+)?/g);
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
function specWeightNum(p, key) {
  return weightNum(p.specs[key]); // g/kg 단위 혼용 보정 (아래 weightNum 정의, hoisting으로 안전)
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
    { label: '가벼운순',        key: '무게', fn: specWeightNum, dir: 'asc'  },
  ],
  iron: [
    { label: '온도 높은순', key: '온도범위', fn: specMaxNum,   dir: 'desc' },
    { label: '온도 낮은순', key: '온도범위', fn: specMaxNum,   dir: 'asc'  },
    { label: '와트 높은순', key: '와트',     fn: specFirstNum, dir: 'desc' },
    { label: '와트 낮은순', key: '와트',     fn: specFirstNum, dir: 'asc'  },
    { label: '가벼운순',    key: '무게',     fn: specWeightNum, dir: 'asc'  },
  ],
  curling: [
    { label: '온도 높은순',   key: '온도범위',   fn: specMaxNum,   dir: 'desc' },
    { label: '온도 낮은순',   key: '온도범위',   fn: specMaxNum,   dir: 'asc'  },
    { label: '열판 큰순',     key: '열판사이즈', fn: specFirstNum, dir: 'desc' },
    { label: '열판 작은순',   key: '열판사이즈', fn: specFirstNum, dir: 'asc'  },
    { label: '가벼운순',      key: '무게',       fn: specWeightNum, dir: 'asc'  },
  ],
  circulator: [
    { label: '와트 높은순', key: '와트', fn: specFirstNum, dir: 'desc' },
    { label: '와트 낮은순', key: '와트', fn: specFirstNum, dir: 'asc'  },
    { label: '가벼운순',    key: '무게', fn: specWeightNum, dir: 'asc'  },
  ],
};

// 단계 필터 대상 필드 (드라이기=스위치 단수, 아이론=온도 단계) — 값이 상호배타적이라 이 항목끼리는 OR, 다른 조건과는 AND
const STEP_FIELD = { dryer: 'switchSteps', iron: 'tempSteps' };

let PRODUCTS = [];
let TUTORIALS = [];
let MANUALS = [];
let state = {
  category: '이미용가전',
  subcategory: 'dryer',
  query: '',
  tagFilter: new Set(),   // 사이드바 "빠른 키워드" 칩 — 다중 선택 가능(AND 조합), 현재 중분류 내에서만 필터링
  stepFilter: new Set(),  // 단계(스위치/온도) 칩 — 다중 선택 시 OR, 다른 필터와는 AND
  distFilter: 'all',      // 유통 — 타입 필터와 동일하게 단일 선택 (전체/특정 값)
  contentsView: null,     // null = 제품 브라우징, 'dryer'|'iron' = Contents 섹션 보는 중
  contentsTypeFilter: 'all', // Contents 안에서 전체/tutorial/tip 필터
  seriesFilter: null,     // 계열/라인 그룹 필터
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
  try {
    const tRes = await fetch('tutorials.json');
    TUTORIALS = await tRes.json();
  } catch (e) {
    TUTORIALS = [];
  }
  try {
    const mRes = await fetch('manuals.json');
    MANUALS = await mRes.json();
  } catch (e) {
    MANUALS = [];
  }
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

  $('#brandHome').addEventListener('click', (e) => {
    e.preventDefault();
    goHome();
  });

  applyAccent();
}

function goHome() {
  state.category = '이미용가전';
  state.subcategory = 'dryer';
  state.contentsView = null;
  state.contentsTypeFilter = 'all';
  state.query = '';
  state.tagFilter = new Set();
  state.stepFilter = new Set();
  state.distFilter = 'all';
  state.seriesFilter = null;
  state.dryerType = 'all';
  state.sort = 'newest';
  state.smartSort = null;
  state.compare.clear();
  state.includeDiscontinued = true;
  state.railOpen = false;
  $('#searchInput').value = '';
  $('#searchBox').classList.remove('has-value');
  $('#sortSelect').value = 'newest';
  $('#rail').classList.remove('open');
  applyAccent();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applyAccent() {
  const map = { beauty: '--acc-beauty', home: '--acc-home', kitchen: '--acc-kitchen', content: '--acc-content' };
  const glowMap = { beauty: '--acc-beauty-glow', home: '--acc-home-glow', kitchen: '--acc-kitchen-glow', content: '--acc-content-glow' };
  const accentKey = CATS[state.category].accent;
  const root = document.documentElement;
  root.style.setProperty('--accent', `var(${map[accentKey]})`);
  root.style.setProperty('--accent-glow', `var(${glowMap[accentKey]})`);
}

function setCategory(cat, sub) {
  state.category = cat;
  state.subcategory = sub || Object.keys(CATS[cat].subs)[0];
  state.contentsView = null;
  state.dryerType = 'all';
  state.tagFilter = new Set();
  state.stepFilter = new Set();
  state.distFilter = 'all';
  state.seriesFilter = null;
  state.smartSort = null;
  state.query = '';
  $('#searchInput').value = '';
  $('#searchBox').classList.remove('has-value');
  applyAccent();
  render();
}

function setContentsView(group) {
  state.contentsView = group;
  state.contentsTypeFilter = 'all';
  state.query = '';
  $('#searchInput').value = '';
  $('#searchBox').classList.remove('has-value');
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

function isTutorialView() {
  return state.contentsView !== null;
}

const CONTENT_TYPE_LABEL = { tutorial: 'Tutorial', tip: 'Styling Tip' };

function getTutorials() {
  let list = TUTORIALS.filter(t => t.group === state.contentsView);
  if (state.contentsTypeFilter !== 'all') {
    list = list.filter(t => t.type === state.contentsTypeFilter);
  }
  if (state.query) {
    const tokens = expandQuery(state.query);
    list = list.filter(t => {
      const hay = [t.title, t.subtitle, t.productName, t.sku].join(' ').toLowerCase();
      return tokens.some(tok => hay.includes(tok));
    });
  }
  return list;
}

function contentsGroupsAvailable() {
  // 실제 영상이 있는 그룹만 (없는 중분류는 만들지 않음)
  const groups = Array.from(new Set(TUTORIALS.map(t => t.group)));
  const order = ['dryer', 'iron', 'curling', 'bodydryer', 'circulator', 'bytulz'];
  return order.filter(g => groups.includes(g));
}

function contentsGroupLabel(g) {
  const map = { dryer: 'Dryer', iron: 'Iron', curling: 'Culing Iron', bodydryer: 'Body Dryer', circulator: 'Circulator', bytulz: 'Bytulz' };
  return map[g] || g;
}

function seriesGroupKey(p) {
  return p.series || p.lineGroup || p.name;
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
    if (state.tagFilter.size > 0) {
      items = items.filter(p => Array.from(state.tagFilter).every(tag => matchesQuery(p, expandQuery(tag))));
    }
    if (state.stepFilter.size > 0) {
      const field = STEP_FIELD[state.subcategory];
      if (field) {
        items = items.filter(p => p[field] !== null && p[field] !== undefined && state.stepFilter.has(p[field]));
      }
    }
    if (state.distFilter !== 'all') {
      items = items.filter(p => (p.specs['유통'] || '') === state.distFilter);
    }
    if (state.seriesFilter) {
      items = items.filter(p => seriesGroupKey(p) === state.seriesFilter);
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
      const active = !isGlobalSearch() && !isTutorialView() && state.category === catKey && state.subcategory === subKey;
      return `<button class="sub-item ${active ? 'active' : ''}" data-cat="${catKey}" data-sub="${subKey}">
        <span>${subMeta.label}<br><small style="color:var(--text-faint);font-size:11px;font-weight:400">${subMeta.kr}</small></span>
        <span class="count">${count}</span>
      </button>`;
    }).join('');
    const catActive = !isGlobalSearch() && !isTutorialView() && state.category === catKey;
    return `
      <div class="rail-cat-group">
        <button class="rail-cat-header ${catActive ? 'active' : ''}" data-cat="${catKey}">
          <span class="rail-cat-dot dot-${catMeta.accent}"></span>${catKey}
        </button>
        <div class="sub-list">${subsHtml}</div>
      </div>`;
  }).join('');

  // Contents — Product Line과 동급의 독립 섹션. 실제 영상이 있는 그룹만 표시.
  const contentsGroups = contentsGroupsAvailable();
  const contentsHtml = contentsGroups.map(g => {
    const count = TUTORIALS.filter(t => t.group === g).length;
    const active = isTutorialView() && state.contentsView === g;
    return `<button class="sub-item ${active ? 'active' : ''}" data-contents-group="${g}">
      <span>${contentsGroupLabel(g)}</span>
      <span class="count">${count}</span>
    </button>`;
  }).join('');
  const contentsBlock = contentsGroups.length ? `
    <div class="rail-group">
      <p class="rail-heading rail-heading-top">Contents</p>
      <div class="sub-list" style="margin-left:0;padding-left:0;border-left:none;">${contentsHtml}</div>
    </div>` : '';

  // 유통 — 타입 필터와 동일한 형태(전체 + 단일 선택)로 현재 중분류의 실제 값만 표시
  let distBlock = '';
  if (!isGlobalSearch() && !isTutorialView()) {
    const baseForDist = PRODUCTS.filter(p => p.category === state.category && p.subcategory === state.subcategory && (state.includeDiscontinued || !p.discontinued));
    const distCounts = new Map();
    baseForDist.forEach(p => {
      const v = p.specs['유통'];
      if (v) distCounts.set(v, (distCounts.get(v) || 0) + 1);
    });
    const distValues = Array.from(distCounts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'));
    if (distValues.length > 1) {
      distBlock = `
      <div class="rail-group">
        <p class="rail-heading">유통</p>
        <div class="chip-row" id="distChips">
          <button class="chip ${state.distFilter === 'all' ? 'active' : ''}" data-dist="all">전체</button>
          ${distValues.map(([v, count]) => `<button class="chip ${state.distFilter === v ? 'active' : ''}" data-dist="${escapeHtml(v)}">${escapeHtml(v)}</button>`).join('')}
        </div>
      </div>`;
    }
  }

  let extraFilters = '';
  if (!isGlobalSearch() && !isTutorialView() && state.subcategory === 'dryer') {
    extraFilters = `
      <div class="rail-group">
        <p class="rail-heading">타입</p>
        <div class="chip-row" id="dryerTypeChips">
          <button class="chip ${state.dryerType === 'all' ? 'active' : ''}" data-type="all">전체</button>
          <button class="chip ${state.dryerType === '고정형' ? 'active' : ''}" data-type="고정형">고정형</button>
          <button class="chip ${state.dryerType === '망치형' ? 'active' : ''}" data-type="망치형">망치형</button>
        </div>
      </div>`;
  }

  $('#rail').innerHTML = `
    <div class="rail-group">
      <p class="rail-heading rail-heading-top">Product Line</p>
      ${treeHtml}
    </div>
    ${contentsBlock}
    ${distBlock}
    ${extraFilters}
    <div class="rail-group">
      <div class="toggle-row">
        <span class="toggle-label">단종 모델 포함</span>
        <div class="switch ${state.includeDiscontinued ? 'on' : ''}" id="discToggle"></div>
      </div>
    </div>
    <div class="rail-group version-box">
      <p class="rail-heading">버전 정보</p>
      <div class="version-current">현재 <b>${CURRENT_VERSION}</b></div>
      ${VERSION_LOG.slice(0, 2).map(v => `
        <div class="version-entry version-entry-open">
          <div class="version-entry-head"><span class="version-badge">${v.v}</span><span class="version-date">${v.date}</span></div>
          <ul>${v.notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')}</ul>
        </div>
      `).join('')}
      ${VERSION_LOG.length > 2 ? `
      <details class="version-log">
        <summary>이전 버전 더보기</summary>
        ${VERSION_LOG.slice(2).map(v => `
          <div class="version-entry">
            <div class="version-entry-head"><span class="version-badge">${v.v}</span><span class="version-date">${v.date}</span></div>
            <ul>${v.notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')}</ul>
          </div>
        `).join('')}
      </details>` : ''}
    </div>
  `;

  $$('.rail-cat-header', $('#rail')).forEach(btn => {
    btn.addEventListener('click', () => {
      state.railOpen = false;
      $('#rail').classList.remove('open');
      setCategory(btn.dataset.cat);
    });
  });
  $$('.sub-item[data-cat]', $('#rail')).forEach(btn => {
    btn.addEventListener('click', () => {
      state.railOpen = false;
      $('#rail').classList.remove('open');
      setCategory(btn.dataset.cat, btn.dataset.sub);
    });
  });
  $$('.sub-item[data-contents-group]', $('#rail')).forEach(btn => {
    btn.addEventListener('click', () => {
      state.railOpen = false;
      $('#rail').classList.remove('open');
      setContentsView(btn.dataset.contentsGroup);
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
  const distChips = $('#distChips');
  if (distChips) {
    $$('.chip', distChips).forEach(btn => {
      btn.addEventListener('click', () => {
        state.distFilter = btn.dataset.dist;
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
  const discToggleTop = $('#discToggleTop');
  discToggleTop.classList.toggle('on', state.includeDiscontinued);
  discToggleTop.onclick = () => {
    state.includeDiscontinued = !state.includeDiscontinued;
    render();
  };

  if (isTutorialView()) {
    renderTutorialGrid();
    return;
  }

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

  $('#sortTagsMain').innerHTML = smartTags.map(t =>
    `<button class="chip ${state.smartSort && state.smartSort.label === t.label ? 'active' : ''}" data-smart="${t.label}">${t.label}</button>`
  ).join('');
  $$('.chip[data-smart]', $('#sortTagsMain')).forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.dataset.smart;
      state.smartSort = (state.smartSort && state.smartSort.label === label) ? null : matchSmartTagByLabel(label);
      render();
    });
  });

  $('#filterTagsMain').closest('.chip-section').querySelector('.chip-section-label').innerHTML =
    '빠른 선택 <span class="hint">키워드는 복수 선택 시 AND(모두 만족) · 단계 칩은 서로 OR(하나라도 해당)</span>';
  $('#filterTagsMain').innerHTML = tagTags.map(t =>
    `<button class="chip ${state.tagFilter.has(t) ? 'active' : ''}" data-tag="${t}">${t}</button>`
  ).join('');
  $$('.chip[data-tag]', $('#filterTagsMain')).forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      if (state.tagFilter.has(tag)) state.tagFilter.delete(tag);
      else state.tagFilter.add(tag);
      render();
    });
  });

  // 단계 칩 (드라이기: 스위치 단수 / 아이론: 온도 단계) — 같은 종류끼리는 OR
  const stepField = STEP_FIELD[state.subcategory];
  if (!isGlobalSearch() && stepField) {
    const baseForSteps = PRODUCTS.filter(p => p.category === state.category && p.subcategory === state.subcategory && (state.includeDiscontinued || !p.discontinued));
    const stepValues = Array.from(new Set(baseForSteps.map(p => p[stepField]).filter(v => v !== null && v !== undefined))).sort((a, b) => a - b);
    const stepChipsHtml = stepValues.map(v =>
      `<button class="chip ${state.stepFilter.has(v) ? 'active' : ''}" data-step="${v}">${v}단</button>`
    ).join('');
    $('#filterTagsMain').insertAdjacentHTML('beforeend', stepChipsHtml);
    $$('.chip[data-step]', $('#filterTagsMain')).forEach(btn => {
      btn.addEventListener('click', () => {
        const v = Number(btn.dataset.step);
        if (state.stepFilter.has(v)) state.stepFilter.delete(v);
        else state.stepFilter.add(v);
        render();
      });
    });
  }

  $('#sortTagsMain').closest('.chip-section').style.display = smartTags.length ? '' : 'none';
  $('#filterTagsMain').closest('.chip-section').style.display = (tagTags.length || stepField) ? '' : 'none';

  // 계열/라인 그룹 필터 (시리즈별 보기)
  const seriesRow = $('#seriesTagsMain');
  const seriesSection = seriesRow.closest('.chip-section');
  if (isGlobalSearch()) {
    seriesRow.innerHTML = '';
    seriesSection.style.display = 'none';
  } else {
    const baseItems = PRODUCTS.filter(p => p.category === state.category && p.subcategory === state.subcategory && (state.includeDiscontinued || !p.discontinued));
    const counts = new Map();
    baseItems.forEach(p => {
      const key = seriesGroupKey(p);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    const groups = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'));
    if (groups.length > 1) {
      seriesSection.style.display = '';
      seriesRow.innerHTML = groups.map(([key, count]) =>
        `<button class="chip ${state.seriesFilter === key ? 'active' : ''}" data-series="${escapeHtml(key)}">${escapeHtml(key)} <span class="chip-count">${count}</span></button>`
      ).join('');
      $$('.chip[data-series]', seriesRow).forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.series;
          state.seriesFilter = state.seriesFilter === key ? null : key;
          render();
        });
      });
    } else {
      seriesRow.innerHTML = '';
      seriesSection.style.display = 'none';
    }
  }

  const grid = $('#grid');
  if (items.length === 0) {
    const terms = [state.query, ...Array.from(state.tagFilter), ...Array.from(state.stepFilter).map(v => v + '단'), state.distFilter !== 'all' ? state.distFilter : null, state.seriesFilter].filter(Boolean);
    const shownTerm = terms.join(', ');
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

function renderTutorialGrid() {
  const groupLabel = contentsGroupLabel(state.contentsView);
  const list = getTutorials();

  if (state.query) {
    $('#mainTitle').textContent = '검색 결과';
    $('#mainPath').textContent = `Contents / ${groupLabel} 검색 · "${state.query}"`;
  } else {
    $('#mainTitle').textContent = groupLabel;
    $('#mainPath').textContent = `Contents / ${groupLabel}`;
  }
  $('#resultCount').innerHTML = `<b>${list.length}</b>개 영상`;

  // 정렬/유통/시리즈 섹션은 숨기고, "빠른 선택" 자리에 Tutorial/Styling Tip 필터만 사용
  $('#sortTagsMain').innerHTML = '';
  $('#sortTagsMain').closest('.chip-section').style.display = 'none';
  $('#seriesTagsMain').innerHTML = '';
  $('#seriesTagsMain').closest('.chip-section').style.display = 'none';

  const typesAvailable = Array.from(new Set(TUTORIALS.filter(t => t.group === state.contentsView).map(t => t.type)));
  const filterSection = $('#filterTagsMain').closest('.chip-section');
  if (typesAvailable.length > 1) {
    filterSection.style.display = '';
    filterSection.querySelector('.chip-section-label').innerHTML = '콘텐츠 유형 <span class="hint">하나만 선택</span>';
    $('#filterTagsMain').innerHTML = `
      <button class="chip ${state.contentsTypeFilter === 'all' ? 'active' : ''}" data-ctype="all">전체</button>
      ${typesAvailable.map(t => `<button class="chip ${state.contentsTypeFilter === t ? 'active' : ''}" data-ctype="${t}">${CONTENT_TYPE_LABEL[t] || t}</button>`).join('')}
    `;
    $$('.chip[data-ctype]', $('#filterTagsMain')).forEach(btn => {
      btn.addEventListener('click', () => {
        state.contentsTypeFilter = btn.dataset.ctype;
        render();
      });
    });
  } else {
    $('#filterTagsMain').innerHTML = '';
    filterSection.style.display = 'none';
  }

  const grid = $('#grid');
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="glyph">▶</div>
        <p>영상이 없습니다.</p>
        <p>${state.query ? `<b>"${escapeHtml(state.query)}"</b>에 해당하는 영상을 찾지 못했어요.` : '이 항목에는 아직 등록된 콘텐츠가 없어요.'}</p>
      </div>`;
  } else {
    grid.innerHTML = list.map(tutorialCardHtml).join('');
  }
  $$('.tutorial-card', grid).forEach(card => {
    card.addEventListener('click', () => openVideoModal(card.dataset.ytid));
  });

  renderTray();
}

function tutorialCardHtml(t) {
  const typeLabel = CONTENT_TYPE_LABEL[t.type] || t.type;
  return `
  <div class="card tutorial-card" data-ytid="${t.youtubeId}">
    <div class="card-frame tutorial-thumb-frame">
      <div class="card-corners"><i></i><i></i><i></i><i></i></div>
      <img src="https://img.youtube.com/vi/${t.youtubeId}/hqdefault.jpg" alt="${escapeHtml(t.title)}" loading="lazy">
      <div class="play-overlay"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
      <span class="content-type-badge type-${t.type}">${escapeHtml(typeLabel)}</span>
    </div>
    <div class="card-body">
      <div class="card-series">${escapeHtml(t.productName || t.sku || '')}</div>
      <div class="card-name">${escapeHtml(t.title)}</div>
      <div class="card-sku">${escapeHtml(t.subtitle || '')}</div>
    </div>
  </div>`;
}

function openVideoModal(youtubeId) {
  $('#videoModalBody').innerHTML = `
    <div class="video-embed-wrap">
      <iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" title="YouTube video"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>`;
  showOverlay('#videoOverlay');
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
  const manual = MANUALS.find(m => m.sku === p.sku);
  const manualUrl = manual ? new URL(`manuals/${manual.fileName}`, window.location.href).href : '';

  const manualHtml = manual ? `
    <div class="manual-actions">
      <button type="button" class="manual-btn" id="manualViewBtn" title="네비게이터 안에서 바로 보기">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        매뉴얼 보기
      </button>
      <a href="${manualUrl}" download="${escapeHtml(manual.fileName)}" class="manual-btn" title="PDF 다운로드">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16"/></svg>
        다운로드
      </a>
      <button type="button" class="manual-btn" id="manualCopyBtn" data-url="${manualUrl}" title="URL 복사">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
        URL 복사
      </button>
    </div>` : '';

  const pmodalEl = $('.pmodal');
  pmodalEl.classList.remove('manual-open'); // 새 제품 열 때는 항상 접힌 상태로 시작

  $('#productModalBody').innerHTML = `
    <div class="pmodal-media"><img src="images/${p.image}" alt="${escapeHtml(p.name)}"></div>
    <div class="pmodal-info">
      <div class="pmodal-eyebrow">${escapeHtml(p.category)} · ${escapeHtml(CATS[p.category].subs[p.subcategory].label)}</div>
      <h2>${escapeHtml(p.name)}</h2>
      <div class="pmodal-sku">${escapeHtml(p.sku)} ${p.series ? '· ' + escapeHtml(p.series) + ' 시리즈' : ''}</div>
      <div class="pmodal-badges-row">
        <div class="pmodal-badges">
          ${p.released ? `<span class="badge">출시 ${escapeHtml(p.released)}</span>` : ''}
          ${p.dryerType ? `<span class="badge">${escapeHtml(p.dryerType)}</span>` : ''}
          ${p.discontinued ? `<span class="badge" style="color:var(--danger);border-color:rgba(217,117,117,.3)">단종</span>` : `<span class="badge" style="color:var(--acc-home)">판매중</span>`}
        </div>
        ${manualHtml}
      </div>
      <table class="pmodal-spectable">${rows}</table>
      <div class="pmodal-actions">
        <button class="btn-compare-add ${inCompare ? 'active' : ''}" id="modalCompareBtn">${inCompare ? '✓ 비교함에 담김' : '+ 비교함에 담기'}</button>
      </div>
    </div>
    <div class="pmodal-manual-pane" id="pmodalManualPane">
      <div class="pmodal-manual-pane-head">
        <span>${manual ? escapeHtml(manual.title) : ''}</span>
        <button type="button" id="manualCloseBtn">✕ 매뉴얼 닫기</button>
      </div>
      <iframe id="manualIframe" title="매뉴얼 뷰어"></iframe>
    </div>
  `;
  $('#modalCompareBtn').addEventListener('click', () => {
    toggleCompare(id);
    openProductModal(id);
  });
  const viewBtn = $('#manualViewBtn');
  if (viewBtn) {
    viewBtn.addEventListener('click', () => {
      const opening = !pmodalEl.classList.contains('manual-open');
      pmodalEl.classList.toggle('manual-open', opening);
      if (opening) $('#manualIframe').src = manualUrl;
    });
  }
  const closeBtn = $('#manualCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      pmodalEl.classList.remove('manual-open');
    });
  }
  const copyBtn = $('#manualCopyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(copyBtn.dataset.url).then(() => {
        const original = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ 복사됨';
        setTimeout(() => { copyBtn.innerHTML = original; }, 1500);
      });
    });
  }
  showOverlay('#productOverlay');
}

// 비교표에서 "더 좋은 값"을 판단할 방향 (desc=높을수록 좋음, asc=낮을수록 좋음)
// 전압(V)/주파수(Hz) 표기가 실제 성능 수치(온도·와트 등)와 섞여 잘못 비교되지 않도록 범위/단일 표기 모두 제거
function stripVoltage(v) {
  let s = String(v || '');
  s = s.replace(/\d+(\.\d+)?\s*[-~]\s*\d+(\.\d+)?\s*V\b/gi, '');
  s = s.replace(/\d+(\.\d+)?\s*V\b/gi, '');
  s = s.replace(/\d+(\.\d+)?\s*[-~]\s*\d+(\.\d+)?\s*Hz\b/gi, '');
  s = s.replace(/\d+(\.\d+)?\s*Hz\b/gi, '');
  return s;
}
function maxNum(v) { const nums = parseNumList(stripVoltage(v)); return nums.length ? Math.max(...nums) : null; }
function firstNum(v) { const nums = parseNumList(stripVoltage(v)); return nums.length ? nums[0] : null; }
// 무게는 g/kg 단위가 섞여 있어 kg 표기를 g 기준으로 환산해 비교(예: "3.41kg" → 3410)
function weightNum(v) {
  const s = String(v || '');
  const kg = s.match(/(\d+(?:\.\d+)?)\s*kg\b/i);
  if (kg) return parseFloat(kg[1]) * 1000;
  return firstNum(v);
}

const SPEC_DIRECTION = {
  '무게': { dir: 'asc', fn: weightNum },
  '코드길이': { dir: 'desc', fn: firstNum },
  '코드 길이': { dir: 'desc', fn: firstNum },
  '풍온': { dir: 'desc', fn: maxNum },
  '풍속': { dir: 'desc', fn: maxNum },
  '와트': { dir: 'desc', fn: firstNum },
  '온도범위': { dir: 'desc', fn: maxNum },
  '기화측정기준': { dir: 'desc', fn: maxNum },
  '임시노출기준': { dir: 'desc', fn: maxNum },
  '스위치': { dir: 'desc', fn: v => { const m = stripVoltage(v).match(/(\d+)\s*단/); return m ? Number(m[1]) : null; } },
};

function openCompareModal() {
  const items = Array.from(state.compare).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  if (items.length < 2) return;

  const labelOrder = [];
  items.forEach(p => Object.keys(p.specs).forEach(k => { if (!labelOrder.includes(k)) labelOrder.push(k); }));

  // 좌측 항목명 칸은 살짝 넓게 고정, 모델 칸은 남은 폭을 개수만큼 균등 배분(빈 공간 없이 항상 꽉 참)
  const ROW_LABEL_WIDTH = 170; // px
  const colWidthStyle = `width:calc((100% - ${ROW_LABEL_WIDTH}px) / ${items.length})`;
  const tableWidthPx = null; // 테이블이 컨테이너 100%를 채우도록 함(별도 고정폭 없음)

  const headCells = items.map(p => `
    <th class="compare-head-cell" style="${colWidthStyle}">
      <div class="chc-inner">
        <img src="images/${p.image}" alt="">
        <div class="cname">${escapeHtml(p.name)}</div>
        <div class="csku">${escapeHtml(p.sku)}</div>
        <button data-remove-cmp="${p.id}">✕ 비교에서 제외</button>
      </div>
    </th>`).join('');

  const bodyRows = labelOrder.map(label => {
    const values = items.map(p => p.specs[label] || '—');
    const allSame = values.every(v => v === values[0]);
    const direction = SPEC_DIRECTION[label];
    let bestFlags = null;
    if (direction && !allSame) {
      const nums = items.map(p => direction.fn(p.specs[label]));
      const valid = nums.filter(n => n !== null && n !== undefined && !isNaN(n));
      if (valid.length >= 2) {
        const best = direction.dir === 'asc' ? Math.min(...valid) : Math.max(...valid);
        bestFlags = nums.map(n => n !== null && n !== undefined && !isNaN(n) && n === best);
      }
    }
    const cells = items.map((p, i) => {
      let cls = allSame ? '' : 'diff';
      if (bestFlags && bestFlags[i]) cls = 'best';
      return `<td class="${cls}" style="${colWidthStyle}">${bestFlags && bestFlags[i] ? '<span class="best-mark">▲</span> ' : ''}${escapeHtml(values[i])}</td>`;
    }).join('');
    return `<tr><td class="row-label" style="width:${ROW_LABEL_WIDTH}px">${escapeHtml(label)}</td>${cells}</tr>`;
  }).join('');


  const relByProduct = relativeInsights(items);
  const insightCards = items.map(p => {
    const bullets = [...ruleInsights(p), ...(relByProduct[p.id] || [])];
    if (bullets.length === 0) return '';
    return `
      <div class="insight-card">
        <div class="insight-name">${escapeHtml(p.name)}</div>
        <ul>${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
      </div>`;
  }).filter(Boolean).join('');
  const insightsHtml = insightCards ? `
    <div class="compare-insights">
      <h3>인사이트 &amp; 추천</h3>
      <p class="sub">각 모델의 사양을 바탕으로 어떤 상황에 더 잘 맞는지 정리했습니다.</p>
      <div class="insight-grid">${insightCards}</div>
    </div>` : '';

  $('#compareModalBody').innerHTML = `
    <h2>스펙 비교</h2>
    <p class="sub">선택한 ${items.length}개 모델의 사양을 나란히 비교합니다. <span class="best-mark">▲</span>는 해당 항목에서 더 좋은 값(가벼움·긴 코드·높은 출력 등, 방향에 맞게 자동 판단)을 의미하며, 그 외 값이 다른 항목은 주황색으로 강조됩니다.</p>
    <div class="compare-scroll">
      <table class="compare-table">
        <thead><tr><th class="row-label" style="width:${ROW_LABEL_WIDTH}px">모델</th>${headCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
    ${insightsHtml}
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
/* 비교 인사이트 — 실제 데이터(tags/specs)에 근거한 규칙 기반 추천 문구      */
/* ---------------------------------------------------------------------- */
function hasTag(p, tag) { return (p.tags || []).includes(tag); }

const INSIGHT_RULES = [
  { match: p => hasTag(p, '프리볼트'), text: '해외 전압(100-240V)에서도 그대로 사용 가능해 여행·출장용으로 추천합니다.' },
  { match: p => hasTag(p, '무선') || /무선/.test(p.name), text: '무선으로 사용할 수 있어 공간 제약 없이 휴대하기 좋습니다.' },
  { match: p => p.dryerType === '망치형', text: '다양한 각도로 스타일링하기 편한 망치형 그립입니다.' },
  { match: p => p.dryerType === '고정형', text: '한 손에 편하게 쥐고 쓰기 좋은 고정형 그립입니다.' },
  { match: p => hasTag(p, '방수'), text: '방수 기능이 있어 욕실 등 물기 있는 환경에서도 사용할 수 있습니다.' },
  { match: p => hasTag(p, '음이온') || hasTag(p, 'Anion'), text: '음이온 케어 기능으로 모발 손상을 줄여줍니다.' },
  { match: p => hasTag(p, '저소음'), text: '소음이 적어 아이가 있는 가정이나 이른 아침·늦은 밤 사용에 적합합니다.' },
  { match: p => hasTag(p, '슬립모드'), text: '일정 시간 사용하지 않으면 자동으로 꺼져 절전과 안전에 유리합니다.' },
  { match: p => hasTag(p, '자동전원차단'), text: '자동 전원 차단 기능이 있어 끄는 걸 깜빡해도 안전합니다.' },
  { match: p => hasTag(p, '세라믹'), text: '세라믹 코팅으로 모발 자극이 적습니다.' },
  { match: p => hasTag(p, 'LED케어'), text: 'LED 케어 기능으로 두피·모발 관리까지 함께 할 수 있습니다.' },
  { match: p => hasTag(p, '셀프클리닝'), text: '셀프클리닝 기능으로 내부 먼지 관리가 편합니다.' },
  { match: p => hasTag(p, '터치센서'), text: '터치 센서로 간편하게 조작할 수 있습니다.' },
  { match: p => hasTag(p, '무빙센서'), text: '움직임을 감지하는 무빙센서로 사용 편의성이 높습니다.' },
  { match: p => hasTag(p, '열판잠금'), text: '열판 잠금 기능으로 보관·이동 시 안전합니다.' },
  { match: p => hasTag(p, '수면풍'), text: '수면풍 모드가 있어 자는 동안에도 편하게 사용할 수 있습니다.' },
  { match: p => hasTag(p, '자연풍'), text: '자연풍 모드로 은은한 바람을 원할 때 좋습니다.' },
  { match: p => hasTag(p, '음이온케어'), text: '음이온 케어 기능이 있습니다.' },
  { match: p => hasTag(p, '예열기능'), text: '예열 기능이 있어 사용 전 미리 데워둘 수 있습니다.' },
  { match: p => hasTag(p, '살균'), text: '살균 기능으로 위생 관리에 유리합니다.' },
  { match: p => p.isAccessory, text: '본체와 함께 사용하는 별매 액세서리입니다.' },
];

function ruleInsights(p) {
  return INSIGHT_RULES.filter(r => r.match(p)).map(r => r.text).slice(0, 3);
}

const RELATIVE_AXES = [
  { key: '무게', dir: 'asc', fn: specFirstNum, label: '선택한 모델 중 가장 가벼워 휴대성이 좋습니다.' },
  { key: '와트', dir: 'desc', fn: specFirstNum, label: '선택한 모델 중 출력(와트)이 가장 높습니다.' },
  { key: '코드길이', dir: 'desc', fn: specFirstNum, label: '선택한 모델 중 코드가 가장 길어 콘센트에서 멀리 떨어져도 여유롭게 사용할 수 있습니다.' },
];

function relativeInsights(items) {
  const byId = {};
  RELATIVE_AXES.forEach(axis => {
    const withVal = items.map(p => ({ p, v: axis.fn(p, axis.key) })).filter(x => x.v !== null && x.v !== undefined);
    if (withVal.length < 2) return;
    withVal.sort((a, b) => axis.dir === 'asc' ? a.v - b.v : b.v - a.v);
    const best = withVal[0];
    const allSame = withVal.every(x => x.v === best.v);
    if (allSame) return;
    (byId[best.p.id] = byId[best.p.id] || []).push(axis.label);
  });
  return byId;
}

function showOverlay(sel) { $(sel).classList.add('show'); document.body.style.overflow = 'hidden'; }
function hideOverlay(sel) {
  $(sel).classList.remove('show');
  document.body.style.overflow = '';
  if (sel === '#videoOverlay') $('#videoModalBody').innerHTML = ''; // 닫으면 재생 중지
  if (sel === '#productOverlay') {
    const pm = $('.pmodal');
    if (pm) pm.classList.remove('manual-open'); // 닫으면 매뉴얼 확장 상태 초기화
    const iframe = $('#manualIframe');
    if (iframe) iframe.src = '';
  }
}

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

/* ---------------------------------------------------------------------- */
/* 우클릭 / 개발자도구 단축키 차단 (완전 차단은 아니며, 캐주얼한 복사 방지용) */
/* ---------------------------------------------------------------------- */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toUpperCase();
  if (k === 'F12') { e.preventDefault(); return; }
  if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(k)) { e.preventDefault(); return; }
  if (e.ctrlKey && (k === 'U' || k === 'S')) { e.preventDefault(); return; }
  if (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(k)) { e.preventDefault(); return; } // Mac
});
