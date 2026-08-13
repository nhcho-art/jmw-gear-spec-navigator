# JMW Gear Spec Navigator (V2.0)

JMW 전 제품군(이미용가전 / 생활가전 / 주방가전) 스펙 비교·검색 사내 도구입니다.
직원들이 매장/사무실에서 브라우저로 접속해 모델을 검색하고, 스펙을 나란히 비교할 수 있습니다.

## 구성

```
index.html      메인 페이지
style.css       디자인/레이아웃
app.js          검색·필터·비교 로직
products.json   제품 데이터 (엑셀에서 자동 변환됨, 221개 모델)
images/         제품 실사진 (엑셀에서 자동 추출, webp 변환)
```

## GitHub Pages에 올리는 방법 (최초 1회)

1. github.com 에서 새 저장소(Repository) 생성 — 예: `jmw-gear-spec-navigator`
   - Public 또는 Private 모두 가능하나, Pages 무료 기능은 Public 저장소에서 가장 간단합니다.
   - 사내용으로 비공개가 필요하면 Private 저장소 + GitHub 유료 플랜(Pages 지원) 또는 Organization 사용을 검토하세요.
2. 저장소 페이지의 **Add file → Upload files** 클릭
3. 이 폴더 안의 파일/폴더(`index.html`, `style.css`, `app.js`, `products.json`, `images/`)를 통째로 드래그 앤 드롭 업로드 후 **Commit changes**
4. 저장소 **Settings → Pages** 이동
5. **Source**를 `Deploy from a branch`로, **Branch**를 `main` / `(root)`로 설정 후 저장
6. 1~2분 후 `https://[깃헙아이디].github.io/jmw-gear-spec-navigator/` 형태의 주소로 접속 가능

## 데이터 업데이트 방법 (신모델 추가 등)

이 도구는 엑셀 파일(`JMW_모델_라인업.xlsx`)에서 자동 변환한 정적 데이터를 사용합니다.
엑셀이 업데이트되면 Claude에게 "엑셀 최신본으로 데이터 갱신해줘"라고 요청하시면
`products.json`과 `images/`를 재생성해 드립니다. (버전은 V1.0 → V1.1 등으로 관리)

## 버전 기록

- **V2.1** (2026.08) — 버그 수정 및 개선.
  - **[데이터] 사양 누락 수정**: 엑셀 컬럼명 공백/줄바꿈 불일치로 Iron/Culing Iron/생활가전의 "제어방식/안전장치"(44~130개 모델), Dryer(소싱)의 "기화측정기준·임시노출기준·기타" 항목이 누락되어 있던 것을 발견해 전체 재반영
  - **[버그] 키워드 필터-검색 충돌 수정**: 중분류(Iron 등)에서 "빠른 키워드" 칩 선택 후 다른 중분류(Dryer 등)로 이동하면 결과가 0개로 나오던 문제 해결 — 이제 카테고리 이동 시 선택된 키워드/타입/정렬이 자동 초기화됨
  - **[UX] 검색창과 빠른 키워드 칩의 역할 분리**: 상단 검색창은 전체 모델 대상 전역 검색, 좌측 "빠른 키워드" 칩은 현재 중분류 내 필터로 명확히 구분
  - **[UX] 프리볼트 키워드 추가**: Iron/Culing Iron 빠른 키워드에 "프리볼트" 추가 (Free Voltage 사양 검색)
  - **[디자인] 화면 최대 폭 확장**: 1440px → 1760px
- **V2.0** (2026.08) — 대규모 개편. 전 카테고리 통합 검색, 대분류+중분류 사이드바 트리, 최신순 기본정렬,
  드라이기 스펙 정밀 정렬, 화이트/반투명 글래스모피즘 리뉴얼.
- **V1.0** (2026.08) — 최초 배포. 이미용가전(Dryer/Iron/Culing Iron), 생활가전(Body Dryer/Circulator),
  주방가전(Bytulz) 전 라인업 221개 모델 · 실사진 · 키워드 검색·추천 · 최대 6개 비교 · 단종/타입 필터 반영.
