# 00. 개요 (Overview)

포트폴리오 사이트 junon-lee.pages.dev 의 전면 개편 설계 명세. 이 디렉터리의 문서는 구현의 단일 기준이며, 구현 중 결정이 바뀌면 문서를 먼저 고친다.

| 문서 | 내용 |
|---|---|
| 00-overview.md | 목표, 범위, 현재 문제, 설계 원칙, 미결 사항 |
| 01-design-system.md | 색, 서체, 간격, 컴포넌트 토큰과 규칙 |
| 02-information-architecture.md | 사이트 맵, 내비게이션, URL, 카드 정렬 규칙 |
| 03-content-and-i18n.md | 콘텐츠 데이터 모델, 번역 소스 단일화, 키 규약 |
| 04-page-specs.md | Home, Portfolio, Resume, Contact 페이지 명세 |
| 05-detail-templates.md | 프로젝트 상세, 연구 상세 템플릿 명세 |
| 06-assets-seo-performance.md | 이미지, PDF, 메타 태그, 성능, 정리 대상 |
| 07-implementation-plan.md | 단계별 작업, 완료 기준, QA 체크리스트 |
| 08-illustration-system.md | 썸네일·히어로·설명 도식의 SVG 일러스트 체계, 작업별 장면 정의 |

참고 자료: `temp/mockup.png` (디자인 목업), `temp/preview.html` (목업 HTML), `temp/preview_v2.html` (승인된 프리뷰, 이 명세의 시각 기준).

## 1. 목표

1. 목업 기반의 새 시각 정체성 적용. 네이비/블루 팔레트, 이중 언어 히어로, 번호 TOC형 상세 페이지.
2. 데이터 이원화 제거. 번역과 카드 정보의 소스를 하나로 만들어 드리프트가 구조적으로 불가능하게 한다.
3. 미완성 흔적 제거. placeholder 텍스트, 동작하지 않는 폼, 죽은 페이지, 미사용 이미지.
4. 상세 페이지를 "증거가 있는 케이스 스터디"로 격상. 메타 블록, 실제 수치 차트, PDF/소스 링크, 이전/다음 내비게이션.
5. 채용 담당자와 연구실 방문자가 필요한 것(CV, 이메일, 소속, 대표 성과)을 두 클릭 안에 얻게 한다.

## 2. 범위

포함:
- 모든 HTML 페이지 재작성 (index, portfolio, resume, contact, project_*, research_*)
- CSS 전면 재작성, JS 재구성 (lang, layout, works)
- `lang/*.json` 정리와 키 재구성, `lang-data.js` 자동 생성
- 이미지 최적화, PDF 링크, SEO 메타, favicon
- 죽은 파일 삭제

제외:
- 빌드 프레임워크 도입 (11ty, Astro 등). 정적 파일 + 소규모 Node 스크립트로 유지한다.
- 백엔드 폼 처리. Contact는 mailto와 외부 링크로 대체한다.
- 블로그, 다크 모드 토글 UI (다크 토큰은 정의하되 시스템 설정을 따른다).

## 3. 현재 문제 (2026-09-07 진단)

### 데이터
- `assets/js/lang-data.js`(417 키)와 `lang/en.json`(385 키)이 어긋남. RowScope 관련 29개 키가 JSON에 없고 lang-data.js에만 존재. `work_can_date`는 두 곳의 값이 다름.
- `kr.json`, `jp.json`에 ebpf, moh, pim 관련 117개 키가 없음.
- 이력서의 `resume_pub*`, `resume_proj*`가 "To be added". `resume_exp3_*`(TA)는 JSON에 있으나 HTML에서 미사용.
- 이름 표기 불일치: `brand_name` JUNON LEE, `profile_name` JUN-HEON LEE, 목업은 Junheon Lee.
- CAN 날짜 불일치: index.html 2025.01, en.json 2024.12. 5G 날짜: html 2024.12, `detail_5g_timeline` 2025.
- `profile_title` 값 앞에 공백. footer 연도 2025.

### 구조
- index.html과 portfolio.html의 카드 그리드가 동일. 필터 라벨만 다름.
- nav, footer, hero가 페이지마다 복붙. nav-logo fallback이 "Your Name"인 페이지 다수.
- 상세 페이지에 footer, active nav, 뒤로가기, 이전/다음 없음.
- 연구 페이지가 프로젝트 템플릿(Bring-up Pipeline, Debugging Case Study)을 그대로 사용.
- `detail_*_role/timeline/stack`, `detail_*_artifacts_*` 키가 있으나 HTML에서 렌더링하지 않음. `assets/pdf/` 아래 PDF 3종이 어디서도 링크되지 않음.

### 자산과 품질
- 썸네일 PNG 500KB~1MB. lazy loading, width/height 없음.
- index.html title이 "Portfolio | Resume". meta description, OG, favicon 없음.
- Contact 폼에 action 없음. 사이드바에 휴대폰 번호 공개.
- 죽은 파일: project_esmoe, project_orion, project_example1, research_cxl, research_offloading, remote.html. 미사용 이미지: alien, nyancat, laiming, paper01/02, project01/02, profile.jpg, mono_profile_background.jpg, oran_5g.png.

## 4. 설계 원칙

1. **소스는 하나.** 카드 목록은 `assets/js/works-data.js`, UI 문자열은 `lang/*.json`. 파생 파일은 스크립트로 생성하고 체크 스크립트로 검증한다.
2. **HTML에는 영어 기본 텍스트를 둔다.** JS 실패 시에도 영어로 읽히는 페이지여야 한다. "Your Name" 같은 placeholder 금지.
3. **상세 콘텐츠는 영어 단일.** UI 크롬(nav, footer, 버튼, 섹션 라벨)만 3개 언어. 기존 규칙 유지.
4. **숫자는 증거다.** 카드와 상세 페이지의 그래프는 실제 측정값만 사용한다. 값이 없으면 그래프를 넣지 않는다.
4a. **그림은 코드로 그린다.** 썸네일, 히어로, 설명 도식은 08 문서 체계의 inline SVG. 래스터 이미지는 스크린샷과 측정 플롯 같은 실제 산출물에만 쓴다. 생성형 개념 이미지는 쓰지 않는다.
5. **구조는 정보다.** 번호 TOC는 실제 순서(문제→구현→측정→결과)를 가진 상세 페이지에만 쓴다.
6. **기존 URL 유지.** `project_*.html`, `research_*.html` 파일명은 바꾸지 않는다. 외부에 공유된 링크가 있을 수 있다.
7. **빌드 없이도 열린다.** `file://`로 열어도 레이아웃이 깨지지 않아야 한다. fetch 실패 시 `lang-data.js` 폴백으로 동작한다.

## 5. 미결 사항 → 확정 (Phase 0, 2026-09-07)

사용자 지시: 중요 결정 외에는 묻지 않고 진행. 아래는 명세의 임시 결정을 그대로 확정한 것이며, 사용자가 나중에 뒤집을 수 있도록 근거를 남긴다.

| # | 항목 | 확정 | 근거 / 되돌리는 방법 |
|---|---|---|---|
| Q1 | 공개 이메일 | `wnsgjs34@uos.ac.kr` | 사용자가 만든 목업의 값. gmail로 바꾸려면 `lang/*.json`의 `contact_email`과 `works`와 무관한 `layout.js` footer 링크만 수정 |
| Q2 | 이름 표기 | 브랜드 "Junheon Lee", 한글 "이준헌". 도메인 junon-lee 유지 | 목업 기준 |
| Q3 | CAN 날짜 | 2025.01 | 수상(2025.01 동계 현장실습)과 일치 |
| Q4 | 5G O-RAN 날짜 | 2024.12 | index.html 현행값 |
| Q5 | MoH 연구 제목 | title "GPU Memory System Optimization for LLM Inference", subtitle에 MoH-guided head-wise offloading | 목업 기준 |
| Q6 | 휴대폰 번호 | 비공개 | 스팸 위험 |
| Q7 | CV PDF | 파일 없음 → CV 버튼은 `works-data`/`layout` 설정 `CV_URL = null`이면 렌더하지 않음 | 파일을 `assets/pdf/Junheon_Lee_CV.pdf`에 넣고 `CV_URL` 설정 시 자동 노출 |
| Q8 | GitHub 저장소 링크 | 없음 → artifacts에 code 링크 미포함 | works-data.artifacts에 추가하면 자동 노출 |
| Q9 | 썸네일 | 코드 생성 SVG (08 문서) | 사용자 결정 |
| Q10 | NRF 연구장려금 | 포함 (2026.08) | 목업 기준. 사실과 다르면 `resume_award1_*` 삭제 |
| Q11 | 기존 PNG 판정 | rowscope.png 유지(플롯). CAN.png, openCL.png는 Phase 3에서 열어 판정. 나머지 삭제 | 06 문서 1절 |
| Q12 | 브랜치 | `redesign-2026-09` 단일 브랜치, Phase별 커밋. main 머지와 배포는 사용자 확인 후 | 07 문서 |
