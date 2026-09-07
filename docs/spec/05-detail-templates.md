# 05. 상세 페이지 템플릿 (Detail Templates)

프로젝트와 연구는 서로 다른 섹션 구성을 갖는다. 두 템플릿은 같은 골격(브레드크럼, 헤드, 메타, TOC, pager)을 공유한다. 본문은 영어 단일.

## 1. 공통 골격

```html
<body class="page-detail" data-work-id="{id}">
<div class="shell">
  <header data-site-header data-active="portfolio"></header>
  <main class="detail-wrap">
    <aside class="toc" data-toc></aside>                <!-- toc.js가 섹션 h2에서 생성 -->
    <div class="detail-body">
      <nav class="crumb" aria-label="Breadcrumb">
        <a href="index.html" data-lang="nav_home">Home</a> ›
        <a href="portfolio.html?filter={project|research}" data-lang="{filter_projects|filter_research}">Projects</a> ›
        <span data-lang="detail_{id}_short">RowScope</span>
      </nav>
      <div class="detail-head">
        <div class="badges" data-work-badges></div>      <!-- works.js: type, status, date/updated -->
        <h1 class="detail-title" data-lang="detail_{id}_title">…</h1>
        <p class="detail-desc" data-lang="detail_{id}_subtitle">…</p>
        <div class="tagrow" data-work-tags></div>        <!-- works.js -->
      </div>
      <div class="meta" data-work-meta></div>            <!-- works.js: Role / Period / Stack / Artifacts -->

      <section class="detail-section" id="s1"> <h2><span class="num">01</span><span data-lang="…">Problem</span></h2> … </section>
      …
      <nav class="pager" data-work-pager aria-label="Previous and next"></nav>   <!-- works.js -->
    </div>
  </main>
  <footer data-site-footer></footer>
</div>
```

- 히어로: 메타 스트립 아래, 첫 섹션 위에 `<figure class="hero-illus" data-illus="{id}.hero" role="img" aria-label="…"></figure>`. `scenes/{id}.js`의 `hero`가 3:1 등각 장면을 그린다(08 문서 4절). 7개 모두 히어로를 가진다. 래스터 히어로는 없다.
- 설명 도식: 섹션 안에 `<figure class="diagram" data-illus="{id}.{name}"><figcaption data-lang="detail_{id}_fig_{name}"></figcaption></figure>`. `Illus.render`가 figcaption 앞에 SVG를 삽입한다. 어느 섹션에 어떤 도식이 들어가는지는 08 문서 4절이 정한다.
- 증거 이미지: Results 섹션의 차트 다음에 `<figure class="evidence"><picture>…</picture><figcaption data-lang="detail_{id}_evidence1"></figcaption></figure>`. works-data.evidence가 비어 있으면 없음.
- TOC는 `toc.js`가 `section.detail-section > h2`를 읽어 생성한다. 번호는 `.num` 텍스트, 제목은 h2의 두 번째 span. HTML에 TOC를 손으로 쓰지 않는다.
- 섹션 id는 `s1`~`s6` 고정. 존재하지 않는 섹션(예: What went wrong 없음)은 HTML에서 제외하고 번호를 당긴다.
- 메타 스트립, 배지, 태그, pager는 works-data에서 렌더된다. HTML에는 빈 컨테이너만 둔다. JS 실패 시에도 제목과 본문은 읽힌다.

## 2. 프로젝트 템플릿 (`project_<id>.html`)

| # | id | h2 (영어 고정, 키 `detail_common_p_*`) | 내용 | 필수 |
|---|---|---|---|---|
| 01 | s1 | Problem | `detail_<id>_overview` 한 문단. 왜 이 문제가 어려운지, 기존 도구가 왜 부족한지 | 필수 |
| 02 | s2 | What I built | `detail_<id>_point1..3` 불릿 3개. 각 불릿 첫 구는 굵게 처리하지 않고 한 문장으로 | 필수 |
| 03 | s3 | How it works | 첫 문단 `detail_<id>_arch_body` → 설명 도식 1~3개(08 문서 4절) → `.flow` 스텝 `detail_<id>_pipeline_step1..5` (3~5개). 스텝 제목은 `_stepN_title`, 본문 `_stepN` | 필수 |
| 04 | s4 | Results | `.results`: 차트(`figures.js`, works-data.results) + stat 타일 3개(`detail_<id>_stat1..3_value/label`) → 증거 PNG(있을 때) → `.takeaway` `detail_<id>_takeaway`. 차트 데이터가 없으면 `detail_<id>_validation_item1..3` 불릿으로 대체 | 필수 |
| 05 | s5 | What went wrong | `.case` 5행 `detail_<id>_debug_symptom/hypothesis/tests/fix/takeaway`. 5개 모두 있을 때만 섹션 노출 | 선택 |
| 06 | s6 | Engineering decisions | `detail_<id>_design_item1..3` 불릿. 각 항목 "결정. 이유." 두 문장 | 필수 |
| 07 | s7 | Stack & artifacts | works-data.stack 태그 + artifacts 버튼(`.btn` 아이콘: code/pdf/link) | 필수 |

프로젝트별 초기 매핑:

| id | s3 도식 (08 문서) | s4 차트 | s4 증거 | s5 | artifacts (초기) |
|---|---|---|---|---|---|
| ebpf | `pipeline` | 없음 → validation 불릿 | 없음 | 있음 | 없음 (GitHub URL 제공 시 추가) |
| rowscope | `address`, `state` | line: hit rate vs stride (실측 4점 + 모델) / stats 99.95%, 0.4%, 250× | `rowscope.png` | 없음 | Source(제공 시), Report(제공 시) |
| can | `frame`, `packing`, `ids` | bits: 64비트 배분 / stats 6 signals, 64 bits, 0 overlap | `CAN.png` (확인 후) | 없음 | `assets/pdf/can-slides.pdf`, `assets/pdf/can-report.pdf`(docx→PDF 변환) |
| 5g_oran | `bringup` | 없음 → validation 불릿 | 없음 | 있음 | `assets/pdf/5g-oran-report.pdf` |
| opencl | `stack` | bar: CPU 2059 / GPU 246 / grayscale 81 / rotation 72 (ms) / stats 8.4×, 246 ms, 81 ms | `openCL.png` (확인 후) | 있음 | `assets/pdf/opencl-report.pdf`, `assets/pdf/opencl-slides.pdf` |

CAN의 현행 섹션(Frame Structure, Bit-Packing, Vulnerabilities, Extended Feature)은 s3 How it works의 스텝과 s6 Engineering decisions로 재배치한다. 내용 손실 없이 위치만 바뀐다.

## 3. 연구 템플릿 (`research_<id>.html`)

| # | id | h2 (`detail_common_r_*`) | 내용 | 필수 |
|---|---|---|---|---|
| 01 | s1 | Motivation | `detail_<id>_overview` + `.question` 콜아웃 `detail_<id>_question` | 필수 |
| 02 | s2 | System problem | `detail_<id>_arch_body` 문단 + 설명 도식 (moh: `arch`, pim: `contention`) | 필수 |
| 03 | s3 | Approach | 설명 도식 (moh: `trace`, pim: `stages`) + `.flow` 스텝 `detail_<id>_pipeline_step1..5` | 필수 |
| 04 | s4 | Current findings | `.findings` 3칸 `detail_<id>_finding1..3_label/body` + 도식(moh: `overlap`) + `.takeaway` "Portfolio note"(`detail_common_r_note`: 논문 복제가 아니라 질문·방법·판단을 보여주는 영역이며 갱신됨) | 필수 |
| 05 | s5 | What went wrong | 프로젝트와 동일 `.case` | 선택 |
| 06 | s6 | Next steps | `detail_<id>_next1..3` 불릿 | 필수 |
| 07 | s7 | References | `detail_<id>_ref1..n` (저자, 제목, 학회, 연도). 없으면 섹션 생략 | 선택 |

연구 페이지의 배지: `Research` + `In progress` + "2025 – Present · updated {works-data.updated}". 제목에서 "(In Progress)" 괄호를 제거한다(배지가 대신한다).

연구별 초기 매핑:

| id | question | 도식 (08 문서) | findings 출처 |
|---|---|---|---|
| dynamic_moh | "Can MoH routing signals reduce effective attention cost, by using fewer heads or treating heads differently, without hurting output quality?" | s2 `arch`, s3 `trace`, s4 `overlap` | validation_item1..3 → Accuracy vs ρ / Regularity / Transfers |
| pim_accel | "Can bank-local reduction inside PIM remove the atomic contention that dominates 3DGS-SLAM's rendering backward pass?" | s2 `contention`, s3 `stages` | validation_item1..3 → Correctness / Metrics / Evidence target |

## 4. 메타 스트립 렌더 규칙

```
Role      works.role
Period    works.period
Stack     works.stack.join(" · ")
Artifacts works.artifacts → 링크. 없으면 열 생략 → grid는 남은 열로 채움 (repeat(auto-fit, minmax(160px,1fr)))
```

라벨은 `detail_common_role/period/stack/artifacts`로 번역.

## 5. Pager

정렬 배열에서 현재 id의 이전/다음. 카드 안 텍스트: 상단 mono 라벨(`detail_common_prev` "← Previous" / `detail_common_next` "Next →"), 아래 `work_<id>_title`. 첫 항목의 Previous, 마지막의 Next는 "Back to portfolio" 카드(`detail_common_back`).

## 6. 차트 명세 (`figures.js`)

모든 차트는 `figures.render(container, spec)` 하나의 진입점. spec은 works-data.results.

```js
// line
{ kind: "line", x: [1,2,4,…,2048], xLabel: "stride (elements)", xLog: true,
  model: [99.95, 99.9, …, 0], measured: {0: 99.95, 8: 87.49, 10: 49.98, 11: 0},
  yLabel: "%", yTicks: [0,25,50,75,100], title: "Row buffer hit rate vs. stride (8 KB row, 4 B elements)",
  legend: "-- model  ● measured", legendPos: "bottom-left",
  aria: "Hit rate falls from 99.95% at stride 1 to 50% at stride 1024 and 0 at stride 2048" }
// bar
{ kind: "bar", items: [{label:"CPU blur", value:2059},{label:"GPU blur",value:246},{label:"Grayscale",value:81},{label:"Rotation",value:72}],
  unit: "ms", title: "Execution time on device (ms, lower is better)", highlight: [1] }
// hist (실측 log2 히스토그램) { kind:"hist", data:[…], tail: 7, unit:"µs" }
// metric               { kind:"metric", value:"8.4×", caption:"…" }
// bits                 { kind:"bits", segments:[{label:"LFT",bits:10},…], caption:"bit 0 → 63" }
```

`arch`, `concept` 같은 구조 도식은 `figures.js`가 아니라 `illustrations.js` + `scenes/<id>.js`가 담당한다. `figures.js`는 수치 데이터 차트만.

규칙은 01 문서 4.10. 차트 크기: 460×230 viewBox. 차트는 상세 Results에만 쓴다.

## 7. 새 상세 페이지 추가 절차

1. `works-data.js`에 항목 추가 (id, type, date, tags, stack, artifacts, illus, keyfact, results, evidence).
2. `lang/en.json`에 `detail_<id>_*` 추가. kr/jp에 동일 값 복사(`scripts/build-lang-data.mjs --sync-detail <id>` 옵션으로 자동 복사).
3. `assets/js/scenes/<id>.js`에 `thumb`(필수), `hero`, 섹션 도식 함수 작성. `docs/gallery.html`에서 일관성 확인.
4. `docs/templates/project.html` 또는 `research.html`을 복사해 `project_<id>.html` 생성, `data-work-id`와 `data-lang` 키의 `<id>`만 치환. 도식 `figure.diagram` 자리 배치.
5. 증거 이미지가 있으면 추가 후 `npm run images`.
6. `npm run build && npm run check`.

`docs/templates/`에 두 템플릿 파일을 둔다(Phase 3 산출물).
