# 07. 구현 계획 (Implementation Plan)

단계마다 별도 브랜치와 커밋. 각 단계는 `npm run check`가 통과하고 로컬에서 6개 화면(Home, Portfolio, Resume, Contact, 프로젝트 상세, 연구 상세)이 KR/EN/JP로 열리는 것을 완료 기준으로 한다. 배포는 Phase 4 이후 한 번에.

## Phase 0. 확정 (사용자 결정)

00 문서 5절의 Q1~Q10을 확정한다. 산출물: 00 문서의 표를 갱신한 커밋. 특히 Q7(CV PDF)과 Q8(GitHub URL)은 파일/URL 제공이 필요하다. 없으면 해당 버튼을 숨긴 채 진행한다.

## Phase 1. 데이터 정리 (브랜치 `refactor/data`)

목표: 소스 단일화. 화면 변화 없음.

1. `scripts/build-lang-data.mjs`, `scripts/check.mjs`, `package.json` 작성.
2. RowScope 키 29개를 `lang-data.js`에서 `lang/*.json`으로 이관. `work_can_date` 등 값 충돌 해소(Q3, Q4 반영).
3. 03 문서 3절의 삭제 키 제거, 개명 키 적용(`detail_common_*`, `hero_*`, `resume_*` 재번호).
4. kr/jp에 누락된 117개 키를 en 값으로 채움.
5. placeholder 값 제거("To be added", "Your Name", 선행 공백).
6. `assets/js/works-data.js` 작성 (7개 항목, 03 문서 5절 모델).
7. `lang-data.js` 재생성. `npm run check` 통과.
8. 06 문서 6절 정리 목록 삭제, PDF 개명. `.gitignore`에 `temp/` 추가.

완료 기준: check 통과, 기존 HTML이 여전히 렌더됨(키 개명은 HTML도 같이 수정). 커밋 3개 이상으로 나눈다(스크립트 / 키 정리 / 삭제).

## Phase 2. 공통 레이어 (브랜치 `feat/layout`)

목표: 새 CSS 토큰과 헤더/푸터 주입. 아직 페이지 내용은 안 바꿈.

1. `assets/css/tokens.css`, `base.css` 작성 (01 문서). 폰트 링크 추가.
2. `assets/js/layout.js`: 헤더/푸터 템플릿 주입, `data-active`, 연도, `applyLang` 호출.
3. `lang.js` 정리: `html[lang]` 매핑, 속성 대상 지원, 외부 링크 제외.
4. 모든 HTML의 head를 04 문서 골격으로 통일(메타, favicon, 스크립트 순서). `sidebar.js` 제거.
5. `404.html`, `robots.txt`, `_headers` 추가.

완료 기준: 모든 페이지에 같은 헤더/푸터, active 표시 정확, 언어 전환 시 헤더/푸터도 전환. Lighthouse 접근성 90 이상.

## Phase 3. 상세 페이지 (브랜치 `feat/detail`)

목표: 05 문서 템플릿 적용.

1. `assets/js/illustrations.js` 프리미티브 라이브러리(08 문서 3절)와 `docs/gallery.html` 작성. 프리뷰의 등각 히어로와 PIM 도식을 프리미티브로 다시 그려 기준 샘플로 삼는다.
2. `assets/js/scenes/<id>.js` 7개: 각각 `thumb`, `hero`, 섹션 도식(08 문서 4절). 갤러리에서 라이트/다크 스크린샷을 찍어 `docs/spec/img/`에 남기고 일관성 검사(08 문서 2절).
3. `assets/css/detail.css`, `assets/js/works.js`(메타/배지/태그/pager 부분), `toc.js`, `figures.js`(line, bar, bits, metric, hist) 작성.
4. `docs/templates/project.html`, `research.html` 작성.
5. 7개 상세 페이지를 템플릿으로 재작성. 순서: rowscope(차트+도식 2) → can(도식 3) → opencl(bar) → ebpf → 5g_oran → dynamic_moh → pim_accel.
6. 각 페이지의 lang 키를 05 문서 필드로 재배치(stat, takeaway, question, finding, next, design_item, fig 캡션 신규 작성 포함). 신규 영어 문장은 기존 본문에서 추출하고 없는 사실을 만들지 않는다.
7. 기존 PNG 판정(06 문서 1절). 증거로 남는 파일만 WebP 파이프라인 적용.

완료 기준: 7개 페이지 모두 히어로 장면, TOC/메타/pager 동작, 도식이 캡션과 함께 렌더, 차트가 실제 값으로 렌더, PDF 링크 열림, 모바일에서 TOC가 가로 탭으로 전환, 다크 모드에서 모든 SVG 읽힘. 갤러리 리뷰 통과(강조색 1종, 라벨 수 제한, 광원 방향 일치).

## Phase 4. 메인 페이지 (브랜치 `feat/pages`)

목표: 04 문서 적용.

1. `assets/css/pages.css` 작성.
2. `works.js` 카드 렌더(썸네일 `Illus.render` 호출 포함)/필터/이력서 목록 부분.
3. index.html: 히어로(등각 SVG를 프리미티브로 이관), pill row, Featured Research, Selected Projects.
4. portfolio.html: 필터 + 그리드. 카드 썸네일은 scenes의 `thumb`.
5. resume.html: 재구성 + CV 버튼 + 인쇄 스타일.
6. contact.html: 카드 3개 + open 한 줄. 폼 제거.
7. og.png, apple-touch-icon.png 생성. sitemap.xml 생성 로직.

완료 기준: 프리뷰(temp/preview_v2.html)와 시각적으로 동등. Home 첫 로드 전송량 400KB 미만. 3개 언어에서 레이아웃 깨짐 없음(일본어/한국어 긴 문장 hero lead 확인).

## Phase 5. 검증과 배포 (브랜치 `main` 머지)

1. QA 체크리스트(아래) 전항목.
2. 프리뷰 배포(Cloudflare Pages preview branch)에서 모바일 실기기 확인.
3. main 머지, 배포, 사이트 맵 제출.
4. 메모리/문서 갱신: `.claude/agents/*`와 auto-memory의 카드 순서 규칙, "project-meta 불필요" 규칙, lang-data.js 관련 메모를 새 구조에 맞게 수정.

선택 과제(이후): 언어별 lang-data 분리, 연구 페이지 References 채우기, 다크 모드 토글, 블로그.

## QA 체크리스트

### 데이터
- [ ] `npm run check` 통과
- [ ] en/kr/jp 키 수 동일, "To be added"/"Your Name" 없음
- [ ] works-data 순서가 02 문서 표와 일치. Home 4개, Portfolio 7개
- [ ] 모든 날짜가 Q3/Q4 확정값과 일치 (카드, 메타, 이력서)

### 페이지
- [ ] 모든 페이지 헤더 active 정확, 브랜드 클릭 → Home
- [ ] KR/EN/JP 전환 시 헤더, 푸터, 섹션 제목, hero, contact 안내 전환. 카드/상세 본문은 영어 유지
- [ ] 언어가 내부 링크에 전파되고 새로고침 후 유지
- [ ] Home CTA 3개 목적지 정확. CV 다운로드 동작(파일 존재)
- [ ] Portfolio 필터 3개 동작, `?filter=` 진입 시 초기 상태 반영, 개수 표기 정확
- [ ] Resume에 placeholder 없음. 프로젝트 제목 링크가 상세로 이동
- [ ] Contact mailto, GitHub 링크 동작. 폼 없음. 휴대폰 번호 없음
- [ ] 404.html이 Cloudflare에서 표시됨

### 상세
- [ ] 7개 페이지 TOC 항목 = 섹션 수, 클릭 시 헤더에 안 가림
- [ ] 메타 스트립 Role/Period/Stack 표시, Artifacts 없는 항목은 열 생략
- [ ] 배지: 프로젝트 Completed, 연구 In progress + updated
- [ ] 차트: rowscope line, opencl bar, can bits 실제 값. 범례가 데이터와 안 겹침. 다크 모드에서 읽힘
- [ ] 히어로 장면 7개, 썸네일 7개가 같은 각도/광원/선 굵기. 썸네일 라벨 ≤4, 히어로 ≤8
- [ ] 설명 도식 12개(rowscope 2, ebpf 1, can 3, 5g 1, opencl 1, moh 3, pim 2) 모두 figcaption 있음, `--blue` 강조 1종, `--warn`은 can/pim 이상 현상에만
- [ ] 모든 SVG `role="img"` + `aria-label`, 컨테이너 `aspect-ratio`로 CLS 없음
- [ ] 래스터 이미지는 evidence figure에만 존재. 생성형 개념 이미지 0
- [ ] pager 이전/다음 순서가 정렬 규칙과 일치, 양 끝은 Back to portfolio
- [ ] PDF 링크 5개(5g, can×2, opencl×2) 새 탭에서 열림
- [ ] 브레드크럼 Projects/Research 링크가 필터 적용된 portfolio로 이동

### 반응형과 접근성
- [ ] 360px, 768px, 1024px, 1440px에서 가로 스크롤 없음
- [ ] ≤600px에서 navlinks 대체 행 표시
- [ ] ≤960px에서 TOC 가로 탭, arch 화살표 회전, flow 2열
- [ ] 키보드 탐색으로 전 요소 도달, 포커스 링 보임
- [ ] prefers-color-scheme: dark에서 모든 화면 대비 확인, primary 버튼 글자색
- [ ] prefers-reduced-motion에서 transition 없음
- [ ] 이미지 alt 서술형, 차트 aria-label

### 성능과 SEO
- [ ] Lighthouse (모바일) Performance 90+, Accessibility 95+, SEO 95+
- [ ] index 첫 로드 < 400KB, lang-data.js < 60KB
- [ ] 모든 페이지 title/description/OG/canonical. OG 이미지 미리보기 확인(Slack/카카오톡)
- [ ] robots.txt, sitemap.xml 접근 가능
- [ ] 콘솔 에러 0 (file:// 로 열었을 때 fetch 실패 경고만 허용)

## 작업량 추정

| Phase | 파일 수 | 비고 |
|---|---|---|
| 1 | ~10 | 스크립트 3, JSON 3, works-data, 삭제 다수 |
| 2 | ~20 | CSS 2, JS 2, 모든 HTML head |
| 3 | ~22 | CSS 1, JS 4 + scenes 7, 갤러리 1, 템플릿 2, 상세 7. 장면·도식 26개(히어로 7, 썸네일 7, 도식 12)가 가장 큰 작업 |
| 4 | ~8 | CSS 1, JS 확장, HTML 4, og.png |
| 5 | — | 검증 |

Phase 1과 2는 순차. Phase 3은 illustrations.js → scenes → 템플릿 → 페이지 순. Phase 4는 works.js/figures.js/scenes를 공유하므로 3을 먼저 끝내고 확장한다. 장면 제작은 갤러리에서 7개를 나란히 보며 한 번에 톤을 맞추는 것이 각 페이지에서 따로 그리는 것보다 빠르다.
