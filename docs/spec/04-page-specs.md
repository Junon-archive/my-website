# 04. 페이지 명세 (Page Specs)

모든 페이지 공통 골격:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{페이지 제목} · Junheon Lee</title>
  <meta name="description" content="{영어 한 문장}">
  <meta property="og:title" content="…"> <meta property="og:description" content="…">
  <meta property="og:image" content="https://junon-lee.pages.dev/assets/img/og.png">
  <meta property="og:type" content="website"> <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=…&display=swap">
  <link rel="stylesheet" href="assets/css/tokens.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/pages.css">          <!-- 상세 페이지는 detail.css -->
  <script src="assets/js/lang-data.js"></script>
  <script src="assets/js/works-data.js"></script>
  <script src="assets/js/lang.js" defer></script>
  <script src="assets/js/layout.js" defer></script>
  <script src="assets/js/works.js" defer></script>
  <script src="assets/js/figures.js" defer></script>
</head>
<body class="page-{home|portfolio|resume|contact|detail}">
<div class="shell">
  <header class="site-header" data-site-header data-active="{home|resume|portfolio|contact}"></header>
  <main class="site-main"> … </main>
  <footer class="site-footer" data-site-footer></footer>
</div>
</body>
</html>
```

헤더와 푸터는 `layout.js`가 주입한다. 주입 템플릿 안의 텍스트도 `data-lang`을 가지며, 주입 직후 `applyLang()`을 호출한다. 주입 전 빈 header의 높이 점프를 막기 위해 `.site-header{min-height:70px}`. 페이지에 이미 `.nav` / `.footer-inner` 마크업이 있으면 주입을 건너뛴다(JS 없이도 읽히는 페이지를 원할 때 정적 마크업을 넣을 수 있음. 기본 페이지는 빈 컨테이너만 둔다). 모든 모듈은 `DOMContentLoaded`에서 부팅한다(`readyState === "loading"` 가드는 defer 스크립트에서 오동작함, 구현 중 발견).

페이지 제목 규칙:
| 파일 | `<title>` |
|---|---|
| index.html | Junheon Lee · Computer Architecture & Memory Systems |
| portfolio.html | Portfolio · Junheon Lee |
| resume.html | Resume · Junheon Lee |
| contact.html | Contact · Junheon Lee |
| project_*.html / research_*.html | {detail title} · Junheon Lee |

---

## 1. Home (`index.html`)

역할: "누구인가"를 30초 안에 전달하고 Research / Projects / CV로 보낸다. 전체 목록은 싣지 않는다.

### 1.1 Hero
```
.hero (grid 1.2fr .8fr)
├─ .hero-text
│  ├─ .eyebrow            hero_eyebrow      "Computer Architecture & Memory Systems"
│  ├─ h1                  hero_name_native "이준헌" + .bar "|" + .en hero_name_latin "Junheon Lee"
│  ├─ .subtitle           hero_role         (KR/EN/JP 번역)
│  ├─ .areas (mono)       hero_areas        "Computer Architecture · Memory Systems · GPU Systems"
│  ├─ .lead               hero_lead         (번역)
│  └─ .actions
│     ├─ a.btn.primary → portfolio.html?filter=research   hero_cta_research + 화살표 아이콘
│     ├─ a.btn         → portfolio.html?filter=project    hero_cta_projects + 화살표
│     └─ a.btn         → assets/pdf/Junheon_Lee_CV.pdf    다운로드 아이콘 + hero_cta_cv  (download 속성)
└─ .visual (aria-hidden)
   ├─ svg#iso            figures.js가 생성하는 등각 메모리 계층 도식 (프리뷰 코드 이관)
   └─ .hand              "From Architecture / to Real Performance" (영어 고정, 번역 안 함)
```
h1의 이름은 모든 언어에서 동일하다. `.visual`은 모바일(≤960px)에서 텍스트 위로 올라가고 높이 220px.

### 1.2 Pill row
4개 고정: Analyze / Implement / Measure / Optimize. 제목은 영어 고정, 설명(`pill_n_desc`)만 번역. 아이콘은 inline SVG(프리뷰 것 사용).

### 1.3 Featured Research
- 헤드: `home_research_title` "Featured Research", `home_research_sub`, 우측 `home_research_more` → portfolio.html?filter=research
- `works.js`가 `type: research` 항목을 `.card.wide`로 렌더. 카드 구조는 01 문서 4.5. 오른쪽 열은 해당 작업의 `thumb` 장면.
- 카드 클릭은 상세 페이지로.

### 1.4 Selected Projects
- 헤드: `home_projects_title` "Selected Projects", `home_projects_sub`, `home_projects_more` → portfolio.html?filter=project
- `featured: true`인 프로젝트를 정렬 규칙대로 최대 4개, `.grid4`.
- 카드 상단에 `.thumb` 등각 장면(08 문서, `scenes/<id>.js`의 `thumb`), 16:9. 그 아래 card-top(배지+날짜) → h3 → desc → `.keyfact`(mono 한 줄, 값이 있을 때만) → tagrow. Featured Research 카드(`.card.wide`)는 썸네일을 오른쪽 200px 열에 둔다.
- 카드에 데이터 스파크라인은 넣지 않는다. 그래프는 상세 Results에만.

### 1.5 Footer
공통. `footer_quote`, `footer_affiliation`, 링크 GitHub / Email, © {year} `footer_copyright`.

### 1.6 삭제되는 것
사이드바(프로필/학력/연락처), 필터 버튼, 세로 프로필 사진(`mono_profile.png`). 프로필 사진은 어디에도 쓰지 않는다. 히어로 오른쪽은 도식이다.

---

## 2. Portfolio (`portfolio.html`)

역할: 전체 작업 7개를 훑고 필터링한다.

```
.section
├─ .section-head
│  └─ .eyebrow portfolio_eyebrow "Portfolio" / h2 portfolio_title "Research & Projects" / .sub portfolio_sub
├─ .filters (role=group)
│  ├─ button[data-filter=all]      filter_all      + " · 7"
│  ├─ button[data-filter=project]  filter_projects + " · 5"
│  └─ button[data-filter=research] filter_research + " · 2"
└─ .grid3#pf-grid   works.js가 7개 전부 렌더
```

카드: `.card` 표준. 상단 `.thumb` 등각 장면(16:9, Home과 같은 `thumb` 함수), 배지(type + status), 날짜(in-progress는 날짜 대신 status 배지만), h3 `work_<id>_title`, desc `work_<id>_sub`, keyfact, 태그. 래스터 썸네일은 쓰지 않는다. 카드 순서는 정렬 규칙.

필터:
- `?filter=` 쿼리로 초기 상태. 버튼 클릭 시 `history.replaceState`로 쿼리 갱신.
- 숨김은 `hidden` 속성. 버튼 `aria-pressed`.
- 개수는 works-data에서 계산해 라벨 뒤에 붙인다.

Home과의 차이를 유지한다: Portfolio는 히어로 없음, 전체 목록 7개, 필터 있음, 3열. Home은 히어로 있음, 대표작만, 4열.

---

## 3. Resume (`resume.html`)

역할: 인쇄 가능한 수준으로 정리된 경력 요약 + CV PDF.

```
.resume-head (flex, space-between)
├─ .eyebrow resume_eyebrow / h2.detail-title "이준헌 | Junheon Lee" / .detail-desc resume_areas
└─ a.btn.primary → assets/pdf/Junheon_Lee_CV.pdf  (download)  resume_cv_cta + " · PDF"

.resume-grid (1.25fr .75fr)
├─ 왼쪽
│  ├─ .rblock Experience      resume_exp1..3 (when / role / desc)  .item 2열(120px 날짜열, tabular-nums)
│  ├─ .rblock Current research works.js: research 항목 → title(링크) + work_<id>_sub
│  └─ .rblock Selected projects works.js: project 전부 5개 → date / title(링크) + work_<id>_sub
└─ 오른쪽
   ├─ .rblock Education   resume_edu1..2
   ├─ .rblock Awards      resume_award1..3
   └─ .rblock Skills      3그룹, 문자열을 " · "로 split해 .tag로 렌더
```

규칙:
- placeholder 항목 없음. 값이 비면 블록 자체를 렌더하지 않는다.
- 경력 날짜 형식 "YYYY – now", "YYYY", "YYYY.MM – YYYY.MM". 문자열 그대로 lang JSON.
- CV 파일이 없으면(Q7) 버튼을 `aria-disabled`가 아니라 아예 숨긴다. check.mjs가 파일 존재를 검사하므로 배포 전 반드시 넣는다.
- 인쇄 스타일: `@media print`에서 헤더/푸터 숨김, 그리드 1열, 링크 밑줄. 상세 페이지도 같은 규칙.

---

## 4. Contact (`contact.html`)

역할: 연락 수단 3개와 "무엇에 열려 있는가" 한 줄. 폼 없음.

```
.contact-wrap (max-width 760, 가운데)
├─ .eyebrow contact_eyebrow "Contact"
├─ h2 contact_title  (번역: "연구, 인턴십, 엔지니어링 기회에 대해 편하게 연락 주세요.")
├─ .contact-cards (3열)
│  ├─ a.card[href=mailto:]   h3 "Email"  b {이메일}  p contact_email_note
│  ├─ a.card[href=github]    h3 "GitHub" b "Junon-archive" p contact_github_note
│  └─ .card                  h3 "Lab"    b contact_lab_name  p contact_lab_addr (Room 613, IT Building / University of Seoul)
└─ .open   b contact_open_label "Open to" · contact_open_desc
```

- 이메일은 Q1 확정값. 스팸 봇 대비 난독화는 하지 않는다(가독성 우선).
- 휴대폰 번호 미노출(Q6).
- 폼 관련 CSS/JS/키 전부 삭제.

---

## 5. 404 (`404.html`, 신규)

Cloudflare Pages는 루트의 `404.html`을 커스텀 404로 사용한다. 공통 헤더/푸터, 제목 "Page not found", Home / Portfolio 링크 2개. 언어 스크립트 포함.

---

## 6. 공통 상호작용

- 언어 전환 시 `document.documentElement.lang` 갱신, 모든 내부 `<a>`에 `?lang=` 전파(현행 유지). 외부 링크(`http` 시작)와 `mailto:`, PDF는 제외.
- 헤더의 브랜드 클릭 → index.html.
- 모든 외부 링크 `target="_blank" rel="noopener"`. PDF는 `download` 없이 새 탭(브라우저 뷰어).
