# 08. 일러스트 체계 (Illustration System)

모든 썸네일, 상세 히어로, 설명 도식은 코드로 생성하는 inline SVG다. 래스터 이미지(PNG/WebP)는 "실제 산출물의 증거"(스크린샷, 측정 플롯)일 때만 Results 섹션에 넣는다. 시각 기준은 `temp/preview_v2.html`의 히어로 등각 도식과 PIM 뱅크 도식.

## 1. 컨셉: Blueprint Schematic

"설계도 위의 하드웨어". 두 가지 시점만 쓴다.

| 시점 | 용도 | 예 |
|---|---|---|
| **Isometric (등각)** | 장면(scene). 하드웨어와 시스템의 물리적 구성. 썸네일과 히어로 | GPU 패키지, DRAM 뱅크 배열, ECU 버스, 컨테이너 3개, Android 보드 |
| **Flat schematic (평면)** | 설명 도식(diagram). 데이터 레이아웃, 프로토콜, 상태, 시간축 | CAN 프레임 필드, 64비트 맵, 주소 분해, 상태 머신, 전송 겹침 타임라인 |

하나의 그림 안에서 두 시점을 섞지 않는다. 장면은 등각, 설명은 평면.

## 2. 공통 규칙

### 색
토큰만 사용. 그림 안 색은 아래 5개로 제한한다.

| 역할 | 토큰 | 용도 |
|---|---|---|
| 바탕/면 | `--paper`, `--tint`, `--blue-soft` | 등각 육면체의 오른쪽면 / 윗면 / 왼쪽면. 평면 도식의 박스 채움 |
| 선 | `--line` | 윤곽선, 그리드, 보조선 |
| 강조 | `--blue` | **장면의 주제 하나에만**. 화살표, 선택된 요소, 활성 로우, 측정 지점 |
| 이상 | `--warn` | 침입 패킷, 충돌, 병목 지점. 보안/경합을 다루는 그림에만 |
| 글자 | `--slate` | 라벨. 강조 라벨은 `--blue` |

한 그림에 `--blue` 강조는 한 종류(한 요소 또는 한 흐름)만. 두 개 이상 강조하고 싶으면 그림을 나눈다.

### 선과 형태
- stroke-width: 등각 1, 평면 1.2, 화살표 1.4. 점선은 `4 3`.
- 모서리: 평면 박스 `rx=3`, 큰 컨테이너 `rx=6`. 등각은 직각.
- 등각 축: 30°. `ux=[0.87,-0.5]`, `uy=[-0.87,-0.5]`. 모든 장면이 같은 각도.
- 바탕 그리드: 장면에는 28px 간격 격자를 `--line` 45% 투명도로 깐다(히어로와 동일). 평면 도식에는 격자 없음.
- 그림자 없음. 그라디언트 없음. 면 3색의 명암만으로 입체감을 낸다.

### 글자
- `--mono`, 10.5px (썸네일은 9.5px). 대문자 강제 없음.
- 썸네일 라벨 최대 4개, 히어로 최대 8개, 설명 도식은 제한 없음(읽히는 것이 목적).
- 히어로에서만 리더 라인(라벨→대상 선)을 쓴다. 썸네일은 대상 옆에 바로 놓는다.
- 값이 있는 라벨은 단위를 붙인다(`8 KB row`, `246 ms`, `64 bit`).

### 크기
| 용도 | viewBox | 표시 크기 | 비고 |
|---|---|---|---|
| 썸네일 (카드) | 400×225 | 카드 폭 100%, 16:9 | Home 4열과 Portfolio 3열 공용 |
| 히어로 (상세) | 1200×400 | 본문 폭 100%, 3:1 | 썸네일과 같은 장면을 넓게, 라벨 추가 |
| 설명 도식 | 780×(240~360) | 본문 폭 100% | 섹션 안 `figure.diagram` |
| 인라인 소도식 | 200×64 | 카드/메타 안 | 필요 시만 |

모든 SVG는 `width="100%"`, `height="auto"`, `preserveAspectRatio="xMidYMid meet"`. 컨테이너가 `aspect-ratio`를 가져 CLS를 막는다.

### 접근성
- 장면과 도식은 `role="img"` + `aria-label` 한 문장(무엇을 보여주는지).
- 순수 장식(히어로 격자)은 `aria-hidden`.
- 설명 도식은 `<figure>` + `<figcaption>`(lang 키 `detail_<id>_fig_<name>`)을 반드시 가진다. 캡션은 그림이 말하는 결론 한 문장.

### 일관성 검사 (리뷰 시)
- 같은 개념은 같은 형태: CPU는 작은 정사각 칩, GPU는 큰 정사각 다이 + HBM 스택, DRAM은 길쭉한 DIMM 또는 8칸 뱅크 배열, 컨테이너는 둥근 박스, 패킷은 작은 직사각형, 데이터 흐름은 `--blue` 화살표.
- 같은 방향: 데이터는 왼쪽→오른쪽 또는 위→아래. 호스트는 항상 왼쪽/아래, 디바이스는 오른쪽/위.
- 등각 장면의 광원 방향(윗면 `--tint`, 왼쪽 `--blue-soft`, 오른쪽 `--paper`) 고정.

## 3. 프리미티브 라이브러리 (`assets/js/illustrations.js`)

```js
window.Illus = {
  // 캔버스
  svg(container, {viewBox, aria, grid: bool}),       // svg 요소 생성, 격자 옵션
  // 등각
  isoBox(svg, origin, w, d, h, {fill}),             // 육면체 3면
  isoSlab(svg, origin, w, d),                       // 두께 6의 판 (보드, 인터포저)
  isoChip(svg, origin, size, {label}),              // 정사각 다이
  isoStack(svg, origin, w, d, layers),              // HBM처럼 층이 보이는 스택
  isoDimm(svg, origin, len),                        // 세로 DIMM
  isoContainer(svg, origin, w, d, h, {label}),      // 둥근 모서리 느낌의 컨테이너(윗면 라벨)
  isoBankArray(svg, origin, cols, rows, {open: idx}),// DRAM 뱅크 배열, 하나 강조
  isoPhone(svg, origin),                            // Android 보드/폰
  // 평면
  box(svg, x, y, w, h, {label, sub, fill, rx}),
  field(svg, x, y, w, h, {label, bits}),            // 프레임/비트 필드 조각
  fieldRow(svg, x, y, totalW, fields),              // 비율대로 이어붙인 필드 행
  cell grid(svg, x, y, cols, rows, size, {on: []}), // 셀 격자(헤드, 픽셀, 토큰), 강조 인덱스
  timeline(svg, x, y, w, lanes),                    // 레인별 막대(전송/연산 겹침)
  state(svg, x, y, label), transition(svg, a, b, label),
  // 연결
  arrow(svg, x1, y1, x2, y2, {dashed, both, label}),
  bus(svg, x1, y, x2, {nodes: [{x, label, warn}]}), // 수평 버스와 노드
  leader(svg, x, y, tx, ty, text),                  // 리더 라인 라벨
  label(svg, x, y, text, {anchor, accent}),
  bracket(svg, x1, x2, y, text)                     // 구간 표시
};
```

렌더 진입점: `Illus.render(el)`은 `el.dataset.illus`(예: `"rowscope.thumb"`, `"can.frame"`)를 읽어 `Illus.scenes[id][name](svg)`를 호출한다. 장면과 도식은 `assets/js/scenes/<id>.js`에 작업별로 분리한다(파일당 100~200줄). 페이지는 필요한 scene 파일만 로드한다. 카드 목록 페이지는 7개 전부 로드(합계 < 40KB 목표).

## 4. 작업별 장면과 도식

각 작업은 `thumb`(=hero의 좁은 크롭) 하나와 섹션별 도식 0~3개를 가진다. 도식은 "설명을 읽지 않아도 구조가 보이는가"를 기준으로 넣고, 텍스트를 반복하는 그림은 넣지 않는다.

### 4.1 rowscope — DRAM Row Buffer Locality
- **thumb/hero (iso)**: DRAM 칩 위 8개 뱅크 배열. 뱅크 3의 한 로우가 `--blue`로 열려 있고(row buffer), 접근 화살표 4개가 stride 간격으로 같은 로우를 때리다가 다음 로우로 넘어간다. 라벨: `bank 0..7`, `open row (8 KB)`, `stride`. 히어로 추가 라벨: `row hit`, `row conflict`, `4 B element`.
- **s3 도식 `address`** (flat): 가상 주소 비트열 → `col offset | bank id | row id` 분해. 비트 폭 표기, 기본 8 KB row / 8 bank.
- **s3 도식 `state`** (flat): 뱅크당 row buffer 상태 머신. `EMPTY → OPEN(row r)`, 같은 r이면 hit(`--blue`), 다른 r이면 conflict(`--warn`), EMPTY에서 miss.
- **s4 증거 (png)**: `rowscope.png` (실제 stride 분석 플롯) — Results 차트 옆 evidence figure로 유지. 차트는 06 문서 라인 차트.

### 4.2 ebpf — Latency Observability
- **thumb/hero (iso)**: 두 층 슬래브. 위 얇은 판 "user space"(collector 박스, CSV/JSON 카드), 아래 두꺼운 판 "kernel". 커널 판 위에 프로브 핀 3개(`runqlat`, `memlat`, `iolat`)가 각각 `sched`, `page fault`, `block I/O` 지점에 꽂혀 있고, `--blue` 점선으로 BPF map을 거쳐 위층 collector로 올라간다. 라벨 4개: `kernel`, `user space`, `tracepoint`, `BPF map`.
- **s3 도식 `pipeline`** (flat): 좌→우. `tracepoint enter/exit` → `Δt in kernel` → `log2 histogram (BPF map)` → `collector (Go)` → `memlat.csv / runqlat.csv / iolat.csv + .summary.json`. 아래 브래킷 `--duration 30s`.
- **s4 도식 `histogram`** (flat, 조건부): 실측 runqlat 히스토그램 데이터가 확보되면 06 문서 hist 차트. 확보 전에는 넣지 않는다. 대신 "tail bucket" 개념도(빈 히스토그램 윤곽에 꼬리 구간만 `--blue`)는 s1 Problem에 넣을 수 있다. 결정: s1에는 넣지 않는다. 데이터 확보를 우선한다.

### 4.3 can — CAN Bus Security & IDS
- **thumb/hero (iso)**: 수평 CAN 버스(두 가닥 CAN_H/CAN_L을 한 선으로 단순화) 위에 ECU 노드 3개(작은 칩 박스)와 LabVIEW 모니터 노드 1개. 버스 위에 패킷 4개가 일정 간격, 그 사이에 `--warn` 패킷이 촘촘히 끼어들고 모니터 노드의 LED가 `--warn`. 라벨: `ECU`, `CAN bus`, `IDS (LabVIEW)`, `injected`.
- **s3 도식 `frame`** (flat): CAN 데이터 프레임 필드 행. `SOF 1 | ID 11 | RTR 1 | CTRL 6 | DATA 0–64 | CRC 16 | ACK 2 | EOF 7`. DATA 필드가 `--blue`.
- **s3 도식 `packing`** (flat): 64비트 맵. `LFT 10 | HEM 19 | BRAIN 21 | WATER 3 | GENDER 1 | STRESS 10`, 아래 바이트 경계 8칸 눈금, byte1 예시 수식 캡션.
- **s3 도식 `ids`** (flat): 시간축 위 패킷 도착 간격. 정상 구간 등간격 막대, 침입 구간 밀집 막대(`--warn`), 임계선 점선, `LED alert` 마커.
- **s4 증거 (png)**: `CAN.png`이 LabVIEW 프론트패널 스크린샷이면 evidence로 유지. 개념 이미지면 삭제. (Phase 3에서 확인)

### 4.4 5g_oran — 5G O-RAN Simulation
- **thumb/hero (iso)**: 바닥 슬래브 "Docker Compose" 위에 컨테이너 3개가 좌→우 `UE (srsRAN)` → `gNB (srsRAN)` → `Core (Open5GS)`, 그 위 한 단 높은 곳에 `RIC (O-RAN SC)`가 gNB와 `--blue` 점선 `E2`로 연결. 연결선 라벨 `ZMQ`, `N2/N3`. 히어로 추가: 네임스페이스 점선 테두리, `AMF`, `E2AP`.
- **s3 도식 `bringup`** (flat, 세로 시퀀스): 1 `5gc up` → 2 `RIC up` → 3 `gNB -e2` → 4 `UE attach` → 5 `ping/iperf`. 각 단계 오른쪽에 확인 신호(`AMF :38412`, `E2 session`, `NAS attach`, `IP assigned`).
- **s5 도식 `debug`** (flat, 선택): 증상→가설 3개→테스트→수정의 분기도. 텍스트 `.case`가 이미 있으므로 기본은 넣지 않는다.
- **png**: `oran_5g_system.png`은 개념 이미지(1536×1024 생성 이미지로 추정). 삭제. 히어로는 iso로 대체.

### 4.5 opencl — On-Device GPU Image Processing
- **thumb/hero (iso)**: Android 보드 위에 이미지 타일(작은 사진 격자 8×5)과 그 위로 떠 있는 GPU 다이. 타일의 한 5×5 영역이 `--blue`로 강조되고 GPU의 work-item 격자와 점선으로 대응. 라벨: `Mali GPU`, `work-items`, `5×5 Gaussian`, `JNI`.
- **s3 도식 `stack`** (flat, 세로 층): `Activity (Java)` → `JNI` → `OpenCLDriver.c` → `clBuildProgram / clEnqueueNDRangeKernel` → `Mali GPU`. 오른쪽에 `AndroidBitmap_lockPixels` ↔ `clEnqueueRead/WriteBuffer` 데이터 경로.
- **s4 차트 `bar`**: CPU blur 2059 / GPU blur 246 / grayscale 81 / rotation 72 (ms). 06 문서 bar 차트.
- **png**: `openCL.png` 내용 확인 후 결과 스크린샷이면 evidence, 아니면 삭제.

### 4.6 dynamic_moh — MoH-Guided Head-wise Offloading
- **thumb/hero (iso)**: 왼쪽 낮은 곳 CPU + DIMM(`DDR DRAM`), 오른쪽 높은 곳 GPU 패키지(다이 + HBM). 그 사이 `PCIe` 점선. GPU 다이 위에 attention head 격자 4×8이 떠 있고 그중 일부만 `--blue`(resident), 나머지는 `--line` 윤곽만(offloaded, DRAM 쪽에 복제). 라벨: `heads`, `resident`, `offloaded`, `PCIe`.
- **s2 도식 `arch`** (flat): 05 문서의 CPU ↔ PCIe(overlap?) ↔ GPU 3칸 박스. 프리뷰 `.arch` 그대로 SVG화.
- **s3 도식 `trace`** (flat): 토큰(가로) × 헤드(세로) 격자. 선택된 셀 `--blue`. 오른쪽에 두 토큰 열의 Jaccard 비교 브래킷. "규칙성이 있는가"를 보여주는 그림.
- **s4 도식 `overlap`** (flat 타임라인): 레인 2개 `layer i compute`, `KV transfer (i+1)`. 위: naive(직렬), 아래: prefetch(겹침). 겹친 구간 `--blue`.

### 4.7 pim_accel — PIM Gradient Accumulation
- **thumb/hero (iso)**: DIMM 형태의 PIM 모듈 위에 뱅크 4개, 각 뱅크 안에 작은 `Σ` 누산기. 위쪽에서 fragment 조각들이 호스트 binning 단계를 거쳐 각 뱅크로 `--blue` 선으로 떨어진다. 라벨: `fragments`, `host binning`, `bank-local Σ`, `PIM`.
- **s2 도식 `contention`** (flat, 좌우 비교): 왼쪽 GPU `atomicAdd`: 화살표 12개가 `acc[g]` 셀 하나로 몰림(`--warn` 셀). 오른쪽 PIM: 같은 12개가 뱅크 4개로 분산, 각 뱅크 `Σ`. 캡션 "same fragments, no global atomics".
- **s3 도식 `stages`** (flat): `bin (host)` → `transfer` → `accumulate (PIM)` → `write-back`. 각 단계 아래 측정 항목(latency, bytes moved).
- **s4 도식**: 결과 데이터 확보 전 없음. Zipf skew vs speedup 라인 차트 자리를 06 문서 line spec으로 예약.

## 5. 도식 배치 규칙 (상세 페이지)

- 히어로: 메타 스트립 바로 아래, 첫 섹션 위. 3:1.
- 섹션 도식: 해당 섹션의 첫 문단 **아래**, 불릿/플로우 **위**. 한 섹션에 도식 2개면 세로로 쌓고 각각 캡션.
- 도식과 텍스트가 같은 말을 하면 텍스트를 줄인다. 그림이 구조를, 텍스트가 이유를 맡는다.
- 증거 PNG는 Results의 차트 다음, `figure.evidence`로. 캡션에 출처(파일명, 측정 조건).

## 6. 제작 절차

1. `assets/js/scenes/<id>.js`에 `thumb(svg)`, `hero(svg)`, 섹션 도식 함수 작성. `thumb`과 `hero`는 같은 배치 함수에 `variant` 인자를 준다.
2. 개발용 `docs/gallery.html`(배포 제외)에 7개 썸네일과 모든 도식을 한 화면에 렌더해 일관성을 본다. 광원, 각도, 라벨 크기, 강조 색 개수 검사.
3. 라이트/다크 두 테마 스크린샷을 `docs/spec/img/`에 남긴다.
4. 리뷰 기준: 2절 일관성 검사 항목, 라벨 수 제한, `--blue` 한 종류, `--warn`은 이상 현상에만.

## 7. 새 작업 추가 시

`scenes/<id>.js`의 `thumb`은 필수, `hero`는 `thumb`을 재사용해도 된다. 도식은 05 문서 템플릿의 s2/s3/s4 중 구조가 있는 곳에만. 그림을 못 그릴 만큼 구조가 없는 작업이면 썸네일도 "관련 하드웨어 하나"(칩, 보드, 버스) 장면으로 최소화한다.
