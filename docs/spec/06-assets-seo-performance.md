# 06. 자산, SEO, 성능 (Assets, SEO, Performance)

## 1. 이미지

### 현황
| 파일 | 크기 | 해상도 | 사용처 |
|---|---|---|---|
| oran_5g_system.png | 940K | 1536×1024 | 5G 카드/히어로 |
| CAN.png | 840K | 2422×944 | CAN 카드/히어로 |
| eBPF.png | 500K | 1536×1024 | eBPF 카드/히어로 |
| mono_profile.png | 500K | 556×859 | 히어로 프로필 → 삭제 |
| openCL.png | 324K | 875×436 | OpenCL |
| rowscope.png | 106K | 1627×874 | RowScope |
| dynamic_moh.png | ? | 997×802 | MoH |
| pim_accel.png | ? | 632×426 | PIM |

### 규칙 (2026-09-07 개정: 썸네일과 히어로는 SVG)
- 썸네일, 상세 히어로, 설명 도식은 전부 코드 생성 SVG(08 문서). 래스터는 **증거 이미지**(실제 스크린샷, 측정 플롯)에만 쓴다.
- 증거 후보 판정 (Phase 3에서 파일을 열어 확인):
  - `rowscope.png` 1627×874: 실제 stride 분석 플롯 → 유지, `rowscope-plot.png`
  - `CAN.png` 2422×944: LabVIEW 프론트패널 스크린샷이면 유지 `can-panel.png`, 아니면 삭제
  - `openCL.png` 875×436: 앱 결과 화면이면 유지 `opencl-result.png`, 아니면 삭제
  - `eBPF.png`, `oran_5g_system.png` 1536×1024: 생성형 개념 이미지로 추정 → 삭제
  - `dynamic_moh.png`, `pim_accel.png`: 개념도 → 삭제 (SVG 도식으로 대체)
- 유지되는 증거 이미지는 `assets/img/src/`에 원본을 두고 `scripts/optimize-images.sh`가 생성:
  - `assets/img/<name>.webp` 최대 폭 1600, 품질 82
  - `assets/img/<name>.png` 최대 폭 1600 (폴백)
- 도구: Python Pillow (`scripts/optimize-images.py`). 이 환경에 cwebp와 ImageMagick은 없고 Pillow는 있다.
- HTML은 `<picture><source type="image/webp" srcset="…webp"><img src="…png" width height loading="lazy" decoding="async" alt="…"></picture>`.
- 파일명은 ASCII 소문자, 하이픈.
- 삭제: alien.png, nyancat.jpg, laiming.png, paper01/02_*.jpg, project01/02_*.jpg, profile.jpg, mono_profile.png, mono_profile_background.jpg, oran_5g.png, 그리고 위 판정에서 삭제로 결정된 파일.

### 신규 자산
- `assets/img/favicon.svg`: 네이비 사각(radius 20%) 위 흰색 "JH", Manrope 800. 32px에서 읽히도록 글자 폭 확인. `favicon.ico`는 만들지 않는다(현대 브라우저는 SVG 지원. Safari 구버전 대응은 `apple-touch-icon.png` 180×180 하나 추가).
- `assets/img/og.png`: 1200×630. 왼쪽 이름과 eyebrow, 오른쪽 등각 도식(프리뷰 SVG를 래스터화). 배경 `--paper`, 하단 도메인. 생성은 headless Chrome 스크린샷으로(`scripts/make-og.sh`, 선택).

## 2. PDF

| 현행 경로 | 신규 경로 | 링크 위치 |
|---|---|---|
| `assets/pdf/project_oran_5g.pdf` | `assets/pdf/5g-oran-report.pdf` | 5G 상세 Artifacts |
| `assets/pdf/CAN/CAN_presentation.pdf` | `assets/pdf/can-slides.pdf` | CAN 상세 |
| `assets/pdf/CAN/CAN_project_report.docx` | `assets/pdf/can-report.pdf` (사용자가 PDF로 변환) | CAN 상세 |
| `assets/pdf/Android_OpenCL_GPU/마프실_Project_2019440100_이준헌.pdf` | `assets/pdf/opencl-report.pdf` | OpenCL 상세 |
| `assets/pdf/Android_OpenCL_GPU/마프실_PPT_Project_2019440100_이준헌.pdf` | `assets/pdf/opencl-slides.pdf` | OpenCL 상세 |
| `assets/pdf/Android_OpenCL_GPU/2023 마프응 프로젝트 안내.pdf`, `Ch12. OpenCL_JNI_template.pdf` | 삭제 (수업 자료, 본인 산출물 아님) | — |
| (신규) | `assets/pdf/Junheon_Lee_CV.pdf` | Home CTA, Resume |

한글/공백 파일명은 URL 인코딩 문제와 CDN 캐시 키 문제를 만들므로 전부 ASCII로 바꾼다. 개인정보(학번)가 파일명에 있는 것도 제거 사유.

## 3. SEO와 메타

- 모든 페이지에 `<title>`, `<meta name="description">`, OG 4종, twitter:card, canonical(`https://junon-lee.pages.dev/{file}`).
- `robots.txt`: 전체 허용, `Sitemap: https://junon-lee.pages.dev/sitemap.xml`.
- `sitemap.xml`: 11개 페이지(404 제외). `scripts/build-lang-data.mjs`가 works-data에서 함께 생성.
- `_headers` (Cloudflare Pages):
  ```
  /docs/*
    X-Robots-Tag: noindex
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  /*.html
    Cache-Control: public, max-age=0, must-revalidate
  ```
  `assets/*`에 immutable을 걸면 파일 내용이 바뀔 때 파일명도 바뀌어야 한다. 이미지/PDF는 내용이 거의 안 바뀌므로 허용하되, CSS/JS는 `assets/css/*`, `assets/js/*`를 별도로 `max-age=3600`으로 둔다.
- 구조화 데이터: index.html에 `application/ld+json` `Person` (name, alternateName "이준헌", affiliation University of Seoul, url, sameAs GitHub). 상세 페이지는 생략.
- `html[lang]`은 언어 전환 시 갱신. 검색엔진에는 영어 기본이 보인다.

## 4. 성능 목표

| 지표 | 목표 | 수단 |
|---|---|---|
| 첫 로드 전송량 (index) | < 400KB (폰트 포함) | 래스터 이미지 0. 모든 그림이 inline SVG. 폰트 4패밀리는 Google Fonts 기본 subset |
| lang-data.js | < 60KB | 죽은 키 삭제 후 재생성 (현행 107KB) |
| illustrations.js + scenes/*.js 합계 | < 40KB gzip (raw ≈ 95KB, 2026-09-07 개정) | 26개 그림을 담기에 40KB raw는 비현실적이었음. Cloudflare가 gzip/brotli로 전송하므로 gzip 기준으로 관리. 실측 raw 93KB / gzip 33KB |
| LCP | < 1.5s (모바일 4G) | 히어로가 텍스트+inline SVG. 외부 이미지 없음 |
| CLS | < 0.05 | 헤더 min-height, 썸네일/히어로/도식 컨테이너 `aspect-ratio`, 폰트 `display=swap` |
| 증거 이미지 | < 150KB 각 | WebP 1600px q82, `loading="lazy"` |

lang-data.js를 head에서 동기 로드하는 현행 방식은 유지한다(첫 렌더에 번역이 필요). 대신 크기를 줄인다. 더 줄이려면 언어별 파일 분리(`lang-data.en.js` 등)를 Phase 5 선택 과제로 둔다.

## 5. 접근성 검사 항목

- 모든 이미지 alt 서술형. 장식 SVG는 `aria-hidden="true"`.
- 차트 SVG `role="img"` + `aria-label`.
- 키보드만으로 헤더, 필터, 카드, TOC, pager 이동 가능. 포커스 링 보임.
- 언어 버튼 `aria-pressed`, 필터 `aria-pressed`.
- 색 대비 4.5:1 (본문), 3:1 (큰 제목, 배지).
- `prefers-reduced-motion` 준수.
- 헤딩 순서: 페이지당 h1 하나(Home은 이름, 상세는 제목, 나머지는 섹션 제목을 h1으로), 그 아래 h2/h3 순서 유지.

## 6. 정리 목록 (Phase 1에서 삭제)

파일:
```
project_esmoe.html  project_orion.html  project_example1.html
research_cxl.html   research_offloading.html  remote.html
assets/js/sidebar.js
assets/css/project.css (detail.css로 대체)
assets/img/{alien.png, nyancat.jpg, laiming.png, paper01_hero.jpg, paper01_thumb.jpg, paper02_hero.jpg, paper02_thumb.jpg,
            project01_hero.jpg, project01_thumb.jpg, project02_hero.jpg, project02_thumb.jpg, profile.jpg,
            mono_profile.png, mono_profile_background.jpg, oran_5g.png}
assets/pdf/Android_OpenCL_GPU/{2023 마프응 프로젝트 안내.pdf, Ch12. OpenCL_JNI_template.pdf}
```
lang 키: 03 문서 3절의 삭제 목록.

git 이력에는 남으므로 복구 가능. 삭제 커밋은 단독으로 만든다(Phase 1 마지막 커밋).
