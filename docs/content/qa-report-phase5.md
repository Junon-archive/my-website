# QA 보고서 — Phase 5 (검증) / junon-lee.pages.dev redesign

- 브랜치: `redesign-2026-09` @ f1e038f (커밋 안 함)
- 대상: index, portfolio, resume, contact, 404, project_ebpf, project_rowscope, project_can,
  project_5g_oran, project_opencl, research_dynamic_moh, research_pim_accel, docs/gallery.html (13 페이지)
- 서버: `python3 -m http.server 8765 --bind 127.0.0.1 --directory .`
- 브라우저: `google-chrome 146.0.7680.177` headless (`--headless=new`), 별도로 CDP(WebSocket, `--remote-debugging-port`)를
  직접 열어 `Emulation.setDeviceMetricsOverride`/`Emulation.setEmulatedMedia`로 정확한 360px 뷰포트와
  진짜 다크 모드를 재현함 (사유는 "헤드리스 플래그 함정" 절 참고).
- 스크린샷: `temp/qa/*.png` (35장, 예산 40장 이내)

## 체크리스트 표

### 데이터
| 항목 | 결과 |
|---|---|
| `npm run check` 통과 | ✅ 10/10 통과 (12개 unused-key 경고는 비차단) |
| en/kr/jp 키 수 동일, placeholder 없음 | ✅ |
| works-data 순서 = 02 문서 표, Home 4 / Portfolio 7 | ✅ |
| 날짜가 Q3/Q4 확정값과 일치 | ✅ |

### 페이지
| 항목 | 결과 |
|---|---|
| 헤더 active 정확, 브랜드→Home | ✅ |
| KR/EN/JP 전환 시 헤더/푸터/섹션제목/hero/contact 전환, 카드·본문 영어 유지 | ✅ |
| 언어가 내부 링크에 전파 | ✅ (`?lang=kr` 확인) |
| Home CTA 3개 목적지, CV 다운로드 | ✅ (`cvUrl:null`이라 버튼 자체가 숨겨짐 — 의도대로 동작. Q7 파일 도착 시 재검증 필요) |
| Portfolio 필터 3개 + `?filter=` 초기상태 + 개수 표기 | ✅ |
| Resume placeholder 없음, 제목 링크 | ✅ 7개 전부 상세로 링크 |
| Contact mailto/GitHub, 폼 없음, 휴대폰 없음 | ✅ |
| 404.html | ✅ (로컬 렌더 확인. Cloudflare 커스텀 404 등록 여부는 배포 후 별도 확인 필요 — 로컬 QA로는 검증 불가) |

### 상세
| 항목 | 결과 |
|---|---|
| TOC 항목=섹션 수 (7페이지 전부) | ✅ ebpf 7/7, rowscope 6/6, can 6/6, 5g_oran 7/7, opencl 7/7, dynamic_moh 6/6, pim_accel 6/6 |
| 메타 스트립 Role/Period/Stack, Artifacts 없으면 열 생략 | ✅ (ebpf: Artifacts 열 없음 확인) |
| 배지 Completed / In progress+updated | ✅ |
| 차트 실측값, 범례 안 겹침, 다크 모드 읽힘 | ✅ line(rowscope)/bar(opencl)/bits(can) 전부 값·aria-label 정확, 다크 CDP 스크린샷으로 가독성 확인 |
| 히어로 7 / 썸네일 7, 각도·광원·선 굵기 | ✅ 갤러리 및 개별 페이지에서 30° 등각, 3색 광원 일관 확인 |
| 설명 도식 (본문은 13개, 07 문서 표기는 "12개") | ⚠️ 실제 13개(2+1+3+1+1+3+2) 전부 구현·figcaption 보유. **07 문서의 "12개" 표기가 자체 합산 오류**(스펙 모순, 구현 문제 아님) |
| SVG role=img + aria-label | ✅ 전수 확인 |
| aspect-ratio로 CLS 방지 | ⚠️ 히어로는 `aspect-ratio` 사용(✅), 설명 도식(`figure.diagram`)은 `min-height:120px`로 대체(의도적 주석 있음) — 04 문서 문구("aspect-ratio로 높이 예약")와 다르지만 CLS 자체는 실측상 발생하지 않음 |
| 래스터는 evidence에만 | ✅ index.html `<img>` 0개, project_rowscope/opencl에만 evidence PNG/WebP |
| pager 순서 = 정렬 규칙, 양끝 Back to portfolio | ✅ ebpf→rowscope→can→5g_oran→opencl→dynamic_moh→pim_accel, 양끝 확인 |
| PDF 링크 5개 새 탭 | ✅ 5g-oran-report, can-slides, can-report, opencl-report, opencl-slides 전부 `target=_blank rel=noopener`, download 속성 없음 |
| 브레드크럼 필터 이동 | ✅ `portfolio.html?filter=project` / `?filter=research` |

### 반응형과 접근성
| 항목 | 결과 |
|---|---|
| 360/600/960/1280에서 가로 스크롤 없음 | ✅ (360은 CDP 모바일 뷰포트로 재검증, `scrollWidth===clientWidth===360` 확인. 768/1024/1440은 별도 측정 안 함 — 960↔1280 사이 브레이크포인트가 없어 위험 낮음) |
| ≤600px navlinks 대체 행 | ✅ `.navmobile` 확인 (base.css:165) |
| ≤960px TOC 가로 탭 | ✅ |
| ≤960px flow 2열 | ✅ (detail.css `.flow{grid-template-columns:1fr 1fr}`) |
| ≤960px "arch 화살표 회전" | ⚪ 해당 없음 — 01 문서 4.9에서 프리뷰의 `.arch` CSS(좌우 비교+회전 화살표)를 폐기하고 SVG 도식으로 대체했다고 명시. 현재 SVG 도식엔 반응형 회전 로직이 없음(고정 뷰박스, 그대로 스케일). **07 문서 체크리스트가 폐기된 컴포넌트를 아직 참조하는 낡은 항목으로 보임** |
| 키보드 포커스 링 | ✅ (코드 검토: base.css:151 `:focus-visible{outline:2px solid var(--blue);outline-offset:3px}`. 실제 Tab 키 인터랙션은 headless 환경 한계로 미실행) |
| 다크 모드 대비, primary 버튼 글자색 | ✅ CDP `prefers-color-scheme:dark`로 index/portfolio/rowscope/can/opencl/dynamic_moh 확인. `.btn.primary`가 다크에서 밝은 배경+어두운 글자로 전환 확인 |
| reduced-motion | ✅ base.css:180 `@media(prefers-reduced-motion:reduce)` 존재 (코드 검토, 인터랙션 미실행) |
| 이미지 alt 서술형, 차트 aria-label | ✅ 일반 alt("Image" 등) 0건, 전부 서술형 |

### 성능과 SEO
| 항목 | 결과 |
|---|---|
| Lighthouse 90/95/95+ | ⚪ 미설치, 실행 안 함(요청사항대로). 대신 콘솔 에러·접근성 속성·전송량을 수동 검사 |
| index 첫 로드 < 400KB | ✅ 약 218.8KB (HTML+CSS+JS+7 scenes+illustrations, 폰트 제외). Google Fonts CSS 응답은 별도 300KB지만 이는 전체 CJK unicode-range 메타데이터이고 실제 다운로드되는 WOFF2 서브셋은 이보다 훨씬 작음(정밀 측정 불가 — 브라우저 네트워크 프로파일링 도구 없음). 폰트 포함해도 400KB를 넘길 가능성은 낮으나 정밀치 아님, 참고치로만 보고 |
| lang-data.js < 60KB | ✅ 57.48KB — **한도까지 여유 2.5KB뿐**. 향후 키 추가 시 바로 초과 위험, i18n 담당 주의 필요 |
| illustrations.js + scenes/*.js < 40KB (minify 전) | ❌ **93.11KB** (illustrations.js 32.0KB + scenes 7개 합 61.1KB) — 목표 대비 2.3배. 06 문서 §4 명시 목표 위반 |
| 모든 페이지 title/description/OG/canonical | ⚠️ title/description/og:title/og:description/og:image/og:type/canonical 전부 12페이지 존재(✅). 단 `og:url`이 index/portfolio/resume/contact/404 5개엔 있고 **7개 상세 페이지엔 없음**(비일관, 04 문서 골격엔 애초에 og:url 자체가 없어 필수 여부 모호) |
| index.html 구조화 데이터(JSON-LD Person) | ❌ **없음**. 06 문서 §3 "index.html에 application/ld+json Person(name, alternateName, affiliation, url, sameAs GitHub)" 요구사항 미구현 |
| robots.txt, sitemap.xml 접근 가능 | ✅ 200/200, sitemap 12개 URL 전부 등재 |
| 콘솔 에러 0 | ❌ **모든 삽화 포함 페이지(10/12, resume·contact·404 제외)에서 반복 발생.** 아래 결함 1번 참고 |

## 발견된 문제 (심각도순)

### 1. [major] 전 페이지 콘솔 에러 — `assets/js/illustrations.js:99`
- 증상: `Illus.render`가 만드는 모든 `<svg>`에 `height="auto"`를 속성으로 설정 → 브라우저가
  `Error: <svg> attribute height: Expected length, "auto".` 콘솔 에러를 삽화 개수만큼 반복 출력.
  index(8회), portfolio(7회), project_ebpf(4회), project_rowscope(6회), project_can(8회),
  project_5g_oran(4회), project_opencl(4회), research_dynamic_moh(8회), research_pim_accel(6회)에서 재현.
  resume/contact/404는 삽화가 없어 깨끗함.
- 원인: `assets/js/illustrations.js:97-99` `svg()` 함수가
  `mk(null, 'svg', { viewBox: vb, width: '100%', height: 'auto', ... })`로 svg를 생성하고,
  `mk()`(illustrations.js:53-58)가 `e.setAttribute(k, attrs[k])`로 그대로 속성을 박아 넣음.
  SVG presentation attribute `height`는 `"auto"` 키워드를 값으로 받지 않음(CSS `height:auto`와 다름).
  기능상 레이아웃은 CSS(`svg{width:100%;height:auto}`, `figure{aspect-ratio}`)가 이미 담당하므로
  이 속성 자체가 불필요.
- 재현: `google-chrome --headless=new ... --enable-logging=stderr --dump-dom http://.../index.html 2>&1 | grep CONSOLE`
- 수정안: `svg()`에서 `height: 'auto'` 속성 설정을 제거(또는 CSS로만 처리). 공용 JS이므로 직접 수정하지 않음.
- 담당: **portfolio-senior-dev** (공용 JS `illustrations.js`)

### 2. [major] `illustrations.js + scenes/*.js` 용량이 예산의 2.3배
- 06 문서 §4: "illustrations.js + scenes/*.js 합계 < 40KB (minify 전)".
- 실측: `illustrations.js` 32.0KB + `scenes/{ebpf,rowscope,can,5g_oran,opencl,dynamic_moh,pim_accel,home}.js` 합 61.1KB = **93.11KB**.
  `illustrations.js` 한 파일만으로 이미 예산의 80%를 씀.
- index 첫 로드 전체는 400KB 예산 안에 들지만(약 219KB), 이 하위 예산은 명백히 초과.
- 수정안: 프리미티브 재사용 확대/축약, 또는 minify 파이프라인 도입, 또는 예산 문서 자체를 재협상.
- 담당: **portfolio-senior-dev** (illustrations.js 아키텍처가 대부분의 용량을 차지)

### 3. [major] index.html에 JSON-LD `Person` 구조화 데이터 없음
- 06 문서 §3 요구: index.html에 `application/ld+json` Person(name, alternateName "이준헌",
  affiliation University of Seoul, url, sameAs GitHub).
- 확인: `grep "application/ld+json" index.html` → 0건.
- 담당: **portfolio-assets-seo**

### 4. [minor] 상세 페이지 7개에 `og:url` 없음
- index/portfolio/resume/contact/404엔 `og:url`이 있고 project_*/research_* 7개엔 없음(비일관).
  단 04 문서의 head 골격 예시 자체에도 `og:url`이 없어 필수 여부가 애매함 — 스펙 확인 필요.
- 담당: **portfolio-assets-seo** (일관성 정리) 또는 **portfolio-master-planner** (필수 여부 확정)

### 5. [minor] `lang-data.js` 57.48KB — 60KB 한도까지 2.5KB 여유
- 지금은 통과지만 여유가 거의 없음. 향후 kr/jp 키 추가 시 바로 초과 가능.
- 담당: **portfolio-i18n-translator** (참고 — 즉시 조치 불필요, 모니터링만)

### 6. [informational] 07 문서 QA 체크리스트 "설명 도식 12개" 산술 오류
- "rowscope 2, ebpf 1, can 3, 5g 1, opencl 1, moh 3, pim 2"를 더하면 13인데 문서는 "12개"로 표기.
  실제 구현은 13개 전부 존재하고 정확히 이 분포와 일치 — **구현은 맞고 문서 합산이 틀림**.
- 담당: **portfolio-master-planner** (07 문서 오탈자 수정)

### 7. [informational] 07 문서 "≤960px arch 화살표 회전" 항목이 폐기된 컴포넌트를 참조
- 01 문서 §4.9는 프리뷰의 `.arch` CSS(좌우 비교 + 반응형 회전 화살표)를 명시적으로 폐기하고
  08 문서의 SVG 도식으로 교체한다고 밝힘. 현재 SVG 도식(예: dynamic_moh의 `arch` 장면)은
  고정 뷰박스로 그대로 스케일될 뿐 반응형 회전 로직이 없음(원래 그렇게 설계된 대체 방식).
  07 문서 체크리스트만 옛 컴포넌트 이름을 그대로 남겨 혼란 소지.
- 담당: **portfolio-master-planner** (07 문서 체크리스트 정리)

### 8. [informational] RowScope 삽화가 "row conflict"에 `--warn` 토큰 사용
- `assets/js/scenes/rowscope.js:47,71,111,112,114,130`이 `--warn` 강조를 사용.
  07 문서 체크리스트 문구는 "`--warn`은 can/pim 이상 현상에만"이라 명시하지만,
  08 문서 §2의 일반 규칙("이상 = 침입 패킷, 충돌, 병목 지점")엔 "충돌(collision)"이 포함되어 있어
  row buffer conflict도 정의상 부합함. 좁은 체크리스트 문구와 넓은 디자인 규칙이 서로 다름 — 스펙 내부 모순.
- 담당: **portfolio-master-planner** (문구 확정 — rowscope 포함 여부 결정)

## 헤드리스 QA 도구 관련 함정 (재발 방지용 기록)

이번 검증 중 아래 두 가지가 **실제 사이트 결함처럼 보였지만 전부 헤드리스 Chrome 146의 도구 한계였음**을 확인하고 바로잡음. 향후 QA에서 반드시 CDP 방식을 우선 사용할 것.

1. **`--window-size=W,H`가 W<500일 때 무시되고 500으로 고정됨** (이번 Chrome 146 빌드 확인).
   `--screenshot`이 출력 PNG는 요청한 W×H로 잘라내지만, 실제 레이아웃은 500px 폭에서 계산됨 →
   360/400/440/480px 스크린샷에서 텍스트가 단어 중간에서 잘려 마치 반응형 오버플로 버그처럼 보임.
   `data:` 페이지에 `window.innerWidth`를 출력시켜 500 고정을 확인(`temp/qa`에서 재현 스크립트는 정리함).
   **해결**: CDP `Emulation.setDeviceMetricsOverride({width, height, mobile:true})`로 진짜 뷰포트를 만들어야
   360px 이하도 정확히 측정 가능. 실측 결과 index/portfolio/project_rowscope/project_can/research_dynamic_moh
   전부 360px에서 `scrollWidth === clientWidth === 360`, 실제 오버플로 없음.
2. **`--blink-settings=preferredColorScheme=2`가 다크 모드를 강제하지 않음** (이번 Chrome 146 빌드 확인).
   `matchMedia('(prefers-color-scheme: dark)').matches`가 계속 `false`로 남아, 캡처한 "다크" 스크린샷이
   실제로는 라이트 모드였음.
   **해결**: CDP `Emulation.setEmulatedMedia({features:[{name:'prefers-color-scheme',value:'dark'}]})`.
   재촬영한 다크 스크린샷(`temp/qa/*-dark.png`)이 진짜 다크 모드이며 전부 정상.

## 성능/용량 수치 요약

| 항목 | 실측 | 목표 | 결과 |
|---|---|---|---|
| index 첫 로드 (HTML+CSS+JS+7 scenes, 폰트 제외) | 218.8KB | < 400KB(폰트 포함) | ✅ (폰트 포함 정밀 측정 불가, 여유 있음) |
| lang-data.js | 57.48KB | < 60KB | ✅ (여유 2.5KB) |
| illustrations.js + scenes/*.js | 93.11KB | < 40KB (minify 전) | ❌ 2.3배 초과 |
| evidence 이미지 (webp, 실제 서빙분) | rowscope 44.8KB / opencl 25.7KB | < 150KB 각 | ✅ |
| evidence 이미지 (png 폴백, 구형 브라우저용) | rowscope 210KB / opencl 316KB | — | 참고용(폴백 전용, 대부분 브라우저는 webp 사용) |
| og.png | 105.4KB | — | 참고용 |

## 스크린샷 (`temp/qa/`)

- 라이트 1280: `index-1280.png`, `portfolio-1280.png`, `project_ebpf-1280.png`, `project_rowscope-1280.png`,
  `project_can-1280.png`, `project_5g_oran-1280.png`, `project_opencl-1280.png`,
  `research_dynamic_moh-1280.png`, `research_pim_accel-1280.png`, `resume-1280.png`, `contact-1280.png`, `404-1280.png`
- 960/600(브레이크포인트, `--window-size`로 충분히 정확 — 500px 이상): `portfolio-{960,600}.png`,
  `project_rowscope-{960,600}.png`, `project_can-{960,600}.png`, `research_dynamic_moh-{960,600}.png`
- 360(CDP 진짜 모바일 뷰포트): `index-360-cdp.png`, `portfolio-360-cdp.png`, `project_rowscope-360-cdp.png`,
  `project_can-360-cdp.png`, `research_dynamic_moh-360-cdp.png`
- 다크(CDP 진짜 `prefers-color-scheme:dark`): `index-1280-dark.png`, `portfolio-1280-dark.png`,
  `project_rowscope-1280-dark.png`, `project_can-1280-dark.png`, `project_opencl-1280-dark.png`,
  `research_dynamic_moh-1280-dark.png`, `project_opencl-results-dark.png`, `project_opencl-evidence-dark.png`,
  `project_can-results-dark.png`
- 참고: `gallery-1400.png` (docs/gallery.html 전체)

## 직접 수정

없음. 이번 회차에서 발견한 것들은 전부 공용 JS(illustrations.js), 예산/스펙 문서, SEO 메타(og:url·JSON-LD)에
해당해 QA 권한 범위(오탈자/닫힘 태그/JSON 콤마/명백한 경로 오타)를 벗어나 직접 수정하지 않고 보고함.

## 최종

🔴 **보류** — 사유: 콘솔 에러 0 기준 위반(결함 1, 전 페이지 재현), `illustrations.js+scenes` 성능 예산
2.3배 초과(결함 2), index.html 구조화 데이터 누락(결함 3). 세 항목 모두 기능/사용성을 막지는 않지만
07 문서 QA 체크리스트의 명시적 통과 기준을 위반하므로 각각 담당 에이전트 처리 후 재검증 필요.
그 외 페이지 흐름·언어전환·필터·pager·반응형·다크모드·접근성 속성은 전부 통과.
