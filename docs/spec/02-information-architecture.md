# 02. 정보 구조 (Information Architecture)

## 1. 사이트 맵

```
/                      index.html         Home
/portfolio.html                           전체 목록 (필터: All / Projects / Research)
/resume.html                              이력서 + CV 다운로드
/contact.html                             연락처
/project_ebpf.html                        프로젝트 상세
/project_rowscope.html
/project_can.html
/project_5g_oran.html
/project_opencl.html
/research_dynamic_moh.html                연구 상세
/research_pim_accel.html
/404.html                                 (신규) Cloudflare Pages 커스텀 404
```

삭제: `project_esmoe.html`, `project_orion.html`, `project_example1.html`, `research_cxl.html`, `research_offloading.html`, `remote.html`. 관련 lang 키(`detail_esmoe_*`, `detail_orion_*`, `detail_cxl_*`, `detail_llm_*`, `work_esmoe_*`, `work_orion_*`, `work_llm_*`, `work_cxl_*`, `sidebar_project_*`, `sidebar_skill_*`, `intro_*`)도 삭제.

## 2. 내비게이션

전역 헤더 4개 링크: Home · Resume · Portfolio · Contact. 순서는 현행 유지.

active 규칙:
| 페이지 | active |
|---|---|
| index.html | Home |
| resume.html | Resume |
| portfolio.html, project_*, research_* | Portfolio |
| contact.html | Contact |

언어 버튼 KR / EN / JP. 선택은 `?lang=` 파라미터 우선, 다음 `localStorage`, 기본 `en`. 내부 링크는 현재 언어를 `?lang=`으로 전파한다(현행 `updateNavLinks` 동작 유지).

기본 언어 결정: 현행 `en` 유지. 브라우저 언어 자동 감지는 하지 않는다. 이유: 방문자의 다수가 해외 채용/연구 관계자일 수 있고, 한국어 방문자는 KR 버튼이 눈에 띄게 배치되어 있다.

## 3. 페이지 간 흐름

```
Home ──(Research →)──▶ portfolio.html?filter=research
Home ──(Projects →)──▶ portfolio.html?filter=project
Home ──(Download CV)──▶ assets/pdf/Junheon_Lee_CV.pdf
Home 카드 ─────────────▶ 상세 페이지
Portfolio 카드 ────────▶ 상세 페이지
상세 ──(breadcrumb)────▶ Home / Portfolio
상세 ──(TOC Back)──────▶ portfolio.html
상세 ──(pager)─────────▶ 이전/다음 상세
상세 ──(Artifacts)─────▶ PDF / GitHub (새 탭)
Resume ────────────────▶ 상세 페이지(프로젝트 제목 링크), CV PDF
Contact ───────────────▶ mailto:, GitHub
```

상세 페이지 브레드크럼: `Home › Projects › {short title}` 또는 `Home › Research › {short title}`. Projects/Research 링크는 해당 필터가 적용된 portfolio.html로 간다.

## 4. 작업 목록과 정렬 규칙

작업(work)은 프로젝트와 연구 두 종류. 모든 목록(Home, Portfolio, Resume, pager)은 아래 규칙으로 정렬된 하나의 배열에서 파생된다. 소스는 `assets/js/works-data.js` (03 문서 참조).

정렬:
1. `type: project` 전부가 `type: research`보다 앞.
2. 같은 type 안에서 `date` 내림차순 (YYYY.MM 문자열 비교).
3. `status: in-progress`는 date가 없으므로 해당 type의 맨 앞.

확정 순서 (2026-09 기준):

| # | id | type | date | status |
|---|---|---|---|---|
| 1 | ebpf | project | 2026.02 | completed |
| 2 | rowscope | project | 2025.12 | completed |
| 3 | can | project | 2025.01 | completed |
| 4 | 5g_oran | project | 2024.12 | completed |
| 5 | opencl | project | 2023.12 | completed |
| 6 | dynamic_moh | research | — | in-progress |
| 7 | pim_accel | research | — | in-progress |

pager 순서도 이 순서다. 1번의 Previous와 7번의 Next는 "Back to portfolio".

Home 노출:
- Featured Research: research 전부 (현재 2개).
- Selected Projects: `featured: true`인 프로젝트 최대 4개, 정렬 규칙 유지. 초기값: ebpf, rowscope, can, opencl (5g_oran은 Portfolio에서만).

Portfolio 노출: 7개 전부. 필터 버튼에 개수 표기 ("All · 7").

## 5. URL 규약

- 파일명 유지: `project_<id>.html`, `research_<id>.html`. id는 works-data의 id와 같다.
- 쿼리: `?lang=kr|en|jp`, `?filter=all|project|research` (portfolio.html만).
- 상세 페이지 섹션 anchor: `#s1` ~ `#s6` (템플릿 공통, 05 문서 참조).
- 새 작업 추가 시 절차: works-data에 항목 추가 → lang JSON에 `detail_<id>_*` 추가 → `project_<id>.html` 생성 → 이미지 추가. 카드 HTML을 손으로 쓰지 않는다.

## 6. 파일 구조 (목표)

```
/
├─ index.html  portfolio.html  resume.html  contact.html  404.html
├─ project_*.html  research_*.html
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css        색/서체/간격 토큰, 다크 토큰
│  │  ├─ base.css          reset, body, 셸, 헤더, 푸터, 버튼, 배지, 태그
│  │  ├─ pages.css         hero, pillrow, 카드 그리드, 이력서, 연락처
│  │  └─ detail.css        TOC, 메타, 섹션, 도식, 차트, pager
│  ├─ js/
│  │  ├─ lang-data.js      (생성 파일) lang/*.json 번들
│  │  ├─ lang.js           언어 전환, data-lang 적용
│  │  ├─ layout.js         헤더/푸터 주입, active nav, 연도
│  │  ├─ works-data.js     작업 목록 단일 소스
│  │  ├─ works.js          카드 렌더, 필터, pager, 이력서 프로젝트 목록
│  │  ├─ figures.js        데이터 차트 생성기 (line, bar, bits, hist, metric)
│  │  ├─ illustrations.js  SVG 프리미티브 (isoBox, field, arrow, grid …) + render 진입점
│  │  ├─ scenes/           작업별 장면·도식: ebpf.js rowscope.js can.js 5g_oran.js opencl.js dynamic_moh.js pim_accel.js
│  │  └─ toc.js            스크롤 스파이
│  ├─ img/                 evidence PNG/WebP(실제 산출물만), og.png, favicon.svg
│  └─ pdf/                 CV, 프로젝트 보고서
├─ lang/  en.json  kr.json  jp.json
├─ scripts/
│  ├─ build-lang-data.mjs  lang/*.json → assets/js/lang-data.js
│  ├─ check.mjs            키 누락/드리프트/링크/파일 존재 검사
│  └─ optimize-images.sh   PNG → WebP, 리사이즈
├─ docs/spec/              이 문서들
├─ docs/gallery.html       모든 장면·도식을 한 화면에 렌더하는 개발용 갤러리 (noindex)
├─ docs/templates/         project.html, research.html 템플릿
└─ temp/                   목업, 프리뷰 (배포 제외)
```

`temp/`와 `docs/`는 Cloudflare Pages 배포에 포함돼도 무해하지만, 검색 노출을 피하기 위해 `_headers`로 `X-Robots-Tag: noindex`를 적용하거나 `.gitignore`가 아닌 배포 제외 설정을 쓴다. 결정: `temp/`는 `.gitignore`에 추가, `docs/`는 커밋하되 `_headers`에서 noindex.
