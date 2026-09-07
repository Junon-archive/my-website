# 01. 디자인 시스템 (Design System)

시각 기준: `temp/preview_v2.html`. 이 문서는 그 프리뷰의 결정을 토큰과 규칙으로 고정한다. 모든 값은 CSS 커스텀 프로퍼티로 선언하고, 컴포넌트는 토큰만 참조한다. 리터럴 색상 값을 컴포넌트 CSS에 직접 쓰지 않는다.

## 1. 색 (Color)

### 라이트 (기본, `:root`)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--navy` | `#12395F` | 제목, 브랜드, primary 버튼 배경 |
| `--blue` | `#1F67A7` | 액센트, 링크, active 밑줄, 차트 주선 |
| `--blue-soft` | `#EAF3FB` | 액센트 배경(배지, 콜아웃, 아이콘 원) |
| `--ink` | `#14283D` | 본문 텍스트 |
| `--slate` | `#5C7084` | 보조 텍스트, 캡션, 축 라벨 |
| `--line` | `#DBE4EC` | 경계선, 그리드 |
| `--tint` | `#F2F7FB` | 카드 내부 박스, 메타 스트립 배경 |
| `--paper` | `#FFFFFF` | 페이지 셸 배경 |
| `--canvas` | `#F5F8FB` | 셸 바깥 바탕 |
| `--ok` / `--ok-soft` | `#1F7A4D` / `#E6F4EC` | Completed 배지 |
| `--warn` / `--warn-soft` | `#A1620B` / `#FBF1E0` | In progress 배지 |
| `--shadow` | `0 10px 30px rgba(18,57,95,.08)` | 카드 hover |

### 다크 (`@media (prefers-color-scheme: dark)` 내 `:root:not([data-theme="light"])`, 그리고 `:root[data-theme="dark"]`)

| 토큰 | 값 |
|---|---|
| `--navy` | `#DBE8F5` |
| `--blue` | `#78B6EA` |
| `--blue-soft` | `#182C44` |
| `--ink` | `#E4ECF4` |
| `--slate` | `#98ADC2` |
| `--line` | `#26384F` |
| `--tint` | `#15233A` |
| `--paper` | `#111C2D` |
| `--canvas` | `#0B1421` |
| `--ok` / `--ok-soft` | `#6DD39A` / `#14301F` |
| `--warn` / `--warn-soft` | `#F0B85A` / `#3A2A10` |

규칙:
- `body`는 반드시 `background: var(--canvas)`를 명시한다.
- primary 버튼의 글자색은 다크에서 `--canvas`(어두운색)로 바뀐다. 프리뷰의 `:root:not([data-theme="light"]) .btn.primary` 규칙 참고.
- 상태 색(ok, warn)은 액센트와 별개다. 배지 외의 장식에 쓰지 않는다.
- 다크 모드 토글 UI는 만들지 않는다. 시스템 설정만 따른다.

## 2. 서체 (Typography)

Google Fonts 로드 (한 줄, `display=swap`):
```
Manrope:wght@500;600;700;800
Noto+Sans+KR:wght@400;500;700
JetBrains+Mono:wght@400;600
Caveat:wght@500
```

| 토큰 | 스택 | 용도 |
|---|---|---|
| `--display` | Manrope, Noto Sans KR, system-ui | h1~h4, 카드 제목, 버튼, 브랜드 |
| `--body` | Noto Sans KR, Manrope, -apple-system, system-ui | 본문, 설명 |
| `--mono` | JetBrains Mono, ui-monospace, Menlo | 날짜, 태그, 배지, 메타 라벨, 축 라벨, 수치 타일, eyebrow |
| `--hand` | Caveat, cursive | 히어로 손글씨 한 줄, footer 인용구. 그 외 사용 금지 |

타입 스케일 (px, line-height):

| 역할 | 크기 | 무게 | 비고 |
|---|---|---|---|
| Hero h1 | 52 / 1.05 | 800 | `letter-spacing:-.04em`. 영문 이름은 `.7em`, 600, `--slate` |
| Section h2 | 28 / 1.2 | 700 | `letter-spacing:-.035em` |
| Detail title | 34 / 1.15 | 700 | 모바일 28 |
| Detail section h3 | 21 / 1.3 | 700 | 앞에 mono 번호 12px `--blue` |
| Card h3 | 19 / 1.28 | 700 | |
| Resume block h3 | 19 | 700 | |
| Body | 15 / 1.65 | 400 | 상세 본문 최대 폭 780px (약 65자) |
| Lead (hero) | 17 / 1.8 | 400 | 최대 34em |
| Desc (card) | 14 / 1.6 | 400 | `--slate` |
| Meta/label | 10.5~12 | 600 | mono, `letter-spacing:.08em`, uppercase |
| Tag | 11 | 400 | mono |
| Stat value | 24~26 | 600 | mono, `letter-spacing:-.02em` |

규칙:
- 제목에는 `text-wrap: balance`.
- 숫자가 열로 정렬되는 곳(표, 이력서 날짜 열)은 `font-variant-numeric: tabular-nums`.
- 본문 컬럼은 65자 내외를 넘기지 않는다.

## 3. 간격과 레이아웃 (Spacing & Layout)

| 토큰 | 값 |
|---|---|
| `--shell-max` | 1200px |
| `--pad-x` | 44px (≤960px: 20px) |
| `--r` | 14px (카드), 10px (버튼, 박스), 6~7px (배지, 태그) |
| 섹션 상단 여백 | 36px |
| 카드 그리드 gap | 14~18px |
| 상세 섹션 padding | 28px 0, 위쪽 `1px solid --line` |

셸: `.shell`은 `--paper` 배경, `max-width: var(--shell-max)`, 바깥은 `--canvas`. `box-shadow: 0 0 0 1px var(--line)`로 경계.

헤더: `position: sticky; top: 0`, 높이 70px, `backdrop-filter: blur(14px)`, 배경 `color-mix(in srgb, var(--paper) 92%, transparent)`. 상세 페이지의 anchor 대상에는 `scroll-margin-top: 84px`.

그리드:
- Hero: `1.2fr .8fr`, gap 44px
- Pill row: 4열
- Featured research: 2열, 카드 내부 `1fr 200px` (텍스트 + 도식)
- Selected projects: 4열
- Portfolio grid: 3열
- Detail: `220px 1fr`, gap 34px
- Resume: `1.25fr .75fr`, gap 40px
- Contact cards: 3열

브레이크포인트:
- `≤960px`: hero, detail, resume, results를 1열. 4열 그리드는 2열. TOC는 가로 스크롤 탭으로 전환(sticky 해제).
- `≤600px`: 모든 그리드 1열. navlinks 숨김(모바일 메뉴는 4개 링크를 header 아래 가로 스크롤 행으로 노출한다. 햄버거 메뉴는 만들지 않는다).

## 4. 컴포넌트 (Components)

### 4.1 Header
브랜드(모노그램 `JH` 사각 + "Junheon Lee") · navlinks 4개 · lang 버튼 3개. active 링크는 `--blue` 3px 밑줄과 700 무게. 상세 페이지에서는 Portfolio가 active.

### 4.2 Button `.btn`
높이 약 42px, `padding: 11px 16px`, 700, 14px, 아이콘 15px. 변형: `.primary`(navy 채움). hover 시 `translateY(-1px)`와 `--blue` 테두리. 다운로드 버튼은 항상 다운로드 아이콘 + "(PDF)" 표기.

### 4.3 Badge `.badge`
mono 11px, `padding: 3px 8px`, radius 6px. 종류:
- `.research` (`--blue-soft`/`--blue`)
- `.project` (`--tint`/`--slate`, `--line` 테두리)
- `.progress` (`--warn-soft`/`--warn`) 텍스트 "In progress"
- `.done` (`--ok-soft`/`--ok`) 텍스트 "Completed"

### 4.4 Tag `.tag`
mono 11px, `--tint` 배경, `--line` 테두리. 한 카드에 최대 5개. 상세 페이지 상단은 최대 6개.

### 4.5 Card `.card`
`--line` 1px 테두리, radius `--r`, padding 20px, `--paper` 배경. 링크 카드는 hover 시 `translateY(-3px)`, `--shadow`, `--blue` 테두리. 내부 순서 고정: `.thumb`(등각 장면, 16:9) → card-top(배지+날짜) → h3 → desc → `.keyfact`(mono 한 줄, 실측값 있을 때만, `margin-top:auto`) → tagrow. 카드 높이는 콘텐츠가 정하고 같은 행은 grid stretch로 맞춘다.

카드 안에 데이터 그래프(스파크라인, 히스토그램)는 두지 않는다. 그림은 썸네일 장면 하나, 숫자는 keyfact 한 줄. 장식용 가짜 그래프 금지.

### 4.6 Meta strip `.meta`
상세 페이지 제목 아래. 4열: Role · Period · Stack · Artifacts. `--tint` 배경, `--line` 테두리, radius 12px. Artifacts 열은 링크 목록(Source ↗, Report (PDF) ↗ 등). 값이 없는 열은 "—"가 아니라 열 자체를 생략하고 나머지가 채운다.

### 4.7 TOC `.toc`
sticky(`top: 90px`), 오른쪽 `--line` 경계. 항목은 mono 번호 + 제목, hover 시 `--blue` 왼쪽 3px 바와 `--tint` 배경. 맨 아래 "← Back to portfolio". 스크롤 스파이(현재 섹션 강조)는 IntersectionObserver로 구현하되 실패해도 동작에 영향 없어야 한다.

### 4.8 Callouts
- `.question`: 연구 페이지 Key question. `--blue-soft` 배경, 왼쪽 4px `--blue` 바, 라벨 mono uppercase.
- `.takeaway`: `--tint` 배경, `--line` 테두리, 굵은 제목 줄.
- `.case`: Symptom/Hypotheses/Tests/Fix/Takeaway 2열 정의 목록(110px 라벨).

### 4.9 Diagrams
- `.flow`: 5단계 스텝 카드(≤960px 2열, ≤600px 1열). 우상단 mono 번호. HTML/CSS 컴포넌트.
- `.findings`: 3열 소카드, mono 라벨 + 한 문장. HTML/CSS 컴포넌트.
- `.results`: 차트 박스(1.3fr) + stat 타일 스택(.7fr).
- `figure.diagram`: 설명용 SVG 도식 컨테이너. `--line` 테두리, radius 12px, padding 14px, `--paper` 배경, `aspect-ratio`로 높이 예약, 아래 `figcaption`(13px `--slate`). 내용물은 08 문서의 평면 도식.
- `figure.hero-illus`: 상세 히어로 등각 장면. 3:1, 격자 바탕은 히어로 `.visual`과 동일 스타일.
- `.card .thumb`: 카드 썸네일 등각 장면. 16:9, `--tint` 바탕, radius 10px, 카드 상단.
- 아키텍처 좌우 비교(`arch`)는 CSS 박스가 아니라 08 문서의 SVG 도식으로 그린다(프리뷰의 `.arch` CSS는 폐기).

그림의 색, 선, 각도, 라벨 규칙은 08 문서가 기준이다.

### 4.10 Chart
inline SVG, JS로 생성. 규칙:
- 축과 눈금은 실제 값 범위에 맞춘다. 0%~100%면 0/25/50/75/100.
- 측정값은 채운 원, 모델/추정은 점선. 범례는 데이터가 없는 빈 영역에 둔다.
- 텍스트 색은 `--slate`, 선은 `--blue`/`--line`. 리터럴 색 금지.
- `role="img"`와 `aria-label`에 결론 한 문장.
- `.chartbox h4`에 단위와 조건을 쓴다(예: "8 KB row, 4 B elements").

### 4.11 Pager `.pager`
상세 페이지 하단 2열. 왼쪽 "← Previous", 오른쪽 "Next →"(우측 정렬). 순서는 02-information-architecture.md의 정렬 규칙을 따른다. 첫/마지막 항목은 빈 칸 대신 "Back to portfolio" 카드.

### 4.12 Footer
위 `--line` 경계. 왼쪽 손글씨 인용구, 오른쪽 소속 한 줄 + 링크(GitHub, Email) + © 연도. 연도는 JS에서 `new Date().getFullYear()`로 채운다.

## 5. 모션과 접근성

- transition은 150~180ms, `transform`과 `border-color`, `box-shadow`만.
- `prefers-reduced-motion: reduce`에서 모든 transition/animation 제거, `scroll-behavior: auto`.
- 모든 인터랙티브 요소에 `:focus-visible` 2px `--blue` 아웃라인, offset 3px.
- 이미지 alt는 내용을 설명한다. "Project thumbnail" 같은 일반 alt 금지.
- 언어 버튼은 `aria-pressed`, 필터 버튼은 `aria-pressed`. 필터로 숨긴 카드는 `hidden` 속성으로 처리.
- 색 대비: `--slate` on `--paper` 4.5:1 이상 유지(라이트 `#5C7084` on white = 5.1:1).

## 6. 금지 목록

- 카드마다 그림자 상시 적용(hover에만).
- 이모지 아이콘. 아이콘은 inline SVG 20px, stroke 1.6.
- 섹션 번호를 순서가 없는 목록에 사용.
- 100vh 히어로.
- 컴포넌트 CSS 안의 hex 리터럴.
