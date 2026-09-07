# Evidence ledger

Every number and factual claim in `lang/en.json` and `assets/js/works-data.js` traces to one row
here. Format: `key or field | value | source`. "en.json (prior)" means the claim was already on the
live site and written by the site owner; it is his own work but has no external document behind it,
so it is repeated, not verified. Anything with no source at all is in `gaps.md` instead.

Source files:

| tag | file |
|---|---|
| **5G-PDF** | `assets/pdf/5g-oran-report.pdf` (was `project_oran_5g.pdf`), Korean lab report |
| **CAN-DOCX** | `assets/pdf/CAN/CAN_project_report.docx` → `assets/pdf/can-report.pdf`, Korean restoration report |
| **CAN-PPT** | `assets/pdf/can-slides.pdf` (was `CAN/CAN_presentation.pdf`) |
| **CL-PDF** | `assets/pdf/opencl-report.pdf` (was `마프실_Project_2019440100_이준헌.pdf`) |
| **CL-PPT** | `assets/pdf/opencl-slides.pdf` (was `마프실_PPT_Project_2019440100_이준헌.pdf`) |
| **LD** | `assets/js/lang-data.js` at commit c63dab9 — the only place the 29 RowScope keys and the OpenCL role/timeline/stack keys existed |
| **EN0** | `lang/en.json` before this rewrite |
| **PLOT** | `assets/img/rowscope-plot.png` (the measured stride plot) |
| **SPEC** | `docs/spec/*` decisions (00 section 5 Q1–Q12, 02 section 4, 03 sections 4–5) |

---

## Site-wide

| key / field | value | source |
|---|---|---|
| `brand_name`, `hero_name_latin`, `footer_copyright` | Junheon Lee | SPEC 00 Q2 |
| `hero_name_native` | 이준헌 | SPEC 00 Q2 |
| `contact_email`, `SITE.email` | wnsgjs34@uos.ac.kr | SPEC 00 Q1 |
| `contact_github`, `SITE.github` | Junon-archive / github.com/Junon-archive | SPEC 00 Q8, task brief |
| `contact_lab_name`, `footer_affiliation`, `SITE.lab` | Architecture & Computer Systems Laboratory · University of Seoul | SPEC 03/04, task brief |
| `contact_lab_addr` | Room 613, IT Building, University of Seoul | EN0 `contact_card_lab_desc` |
| `SITE.cvUrl` | null | SPEC 00 Q7 — no CV PDF exists |
| phone number | removed | SPEC 00 Q6 |
| `footer_quote` | Understand the system, measure the truth, build a better solution. | task brief / mockup |
| `resume_edu1_*`, `resume_edu2_*` | UoS M.S. ECE 2025–present, B.S. ECE 2019–2025 | EN0 `sidebar_education_*` |
| `resume_exp1_*` | Graduate researcher · ACAS Lab, 2025 – now | EN0 `resume_exp1_*` + SPEC 03 section 4 |
| `resume_exp3_*` | ROK Air Force 2019.08 – 2021.05, staff sergeant, honorable discharge | EN0 `resume_exp4_*` |
| `resume_award2_*` | Excellence Award, CAN project, 2025.01 | CAN-DOCX section 1 (수상 내역 우수상), EN0 `resume_award1_*`, SPEC 00 Q3 |
| `resume_award3_*` | Grand Prize, Incheon Student Policy Presentation, 2019.08 | EN0 `resume_award2_*` |
| `resume_award1_*` | NRF Graduate Research Scholarship, 2026.08 | SPEC 00 Q10 (mockup) — see gaps.md |
| card order | ebpf, rowscope, can, 5g_oran, opencl, dynamic_moh, pim_accel | SPEC 02 section 4 |

---

## ebpf — Practical Latency Observability with eBPF

No external document. Every statement is carried over from EN0 `detail_ebpf_*`, rewritten but not
extended.

| key / field | value | source |
|---|---|---|
| `detail_ebpf_overview` | three invisible latency sources, kernel instrumentation needed | EN0 `detail_ebpf_overview` |
| `detail_ebpf_point1` | runqlat / memlat / iolat, log2 histograms | EN0 `detail_ebpf_point1`, `_arch_body` |
| `detail_ebpf_point2` | shared CLI `--duration`, `--out` | EN0 `detail_ebpf_point1`, `_pipeline_step3` |
| `detail_ebpf_point3` | CSV + `.summary.json` + environment metadata | EN0 `detail_ebpf_point2`, `_pipeline_step4` |
| `detail_ebpf_arch_body`, `_fig_pipeline` | tracepoint → BPF map delta → histogram → Go collector | EN0 `detail_ebpf_arch_body`, `_skills_item4` (Go) |
| `_pipeline_step4` | `scripts/collect_all.sh --duration 30s --out results/week2_one_click` | EN0 `detail_ebpf_pipeline_step3` |
| `_validation_item1..3` | scheduling tail under load; memory tail on induced page faults; I/O clustered by request size | EN0 `detail_ebpf_validation_item1..3` |
| `_debug_*` | inconsistent runs → unified CLI and fixed duration | EN0 `detail_ebpf_debug_*` |
| `_design_item1..3` | in-kernel deltas, log2 buckets, one output format | derived from EN0 `_arch_body`, `_point1..3` (reasons stated, not new facts) |
| works-data `stack`, `tags` | eBPF, C, Go, Linux | EN0 `detail_ebpf_skills_item1/4` |
| works-data `date` 2026.02, `period` 2025.12 – 2026.02 | | SPEC 02 section 4 (date), SPEC 03 section 5 example (period) |
| `keyfact`, `results`, `evidence` | null / null / [] | SPEC 03 section 5 — no measured data released |

## rowscope — RowScope

| key / field | value | source |
|---|---|---|
| `detail_rowscope_title`, `_subtitle`, `_overview` | | LD `detail_rowscope_title/_subtitle/_overview` |
| `_point1` five-stage pipeline | C benchmarks → traces → mapper → state machine → aggregator | LD `detail_rowscope_point1` |
| `_point2` model | hit rate = 1 − stride × 4 / 8192, 11 strides from 1 to 1024 | LD `detail_rowscope_point2`; confirmed by PLOT (x axis 2^0 … 2^10, 11 markers) |
| `_point3` 250x gap | sequential 99.95%, random 0.4% on 16 MB, 9 working sets 512 KB – 128 MB | LD `detail_rowscope_point3`, `_results_body` |
| `_arch_body`, `_fig_address` | 8 KB row, 8 banks, bit-interleaved decomposition | LD `detail_rowscope_pipeline_step2` (8 KB / 8 banks / bit-interleaved). The "low 13 bits" figure is arithmetic from 8 KB. |
| `_fig_state` | OPEN / EMPTY per bank, hit vs conflict vs miss | LD `detail_rowscope_pipeline_step3` |
| `_pipeline_step1..5` and file names | sequential_access.c, random_access.c, stride_access.c, working_set_sweep.c, dram_mapping.py, row_buffer_model.py, summary.csv, report/final_report.md | LD `detail_rowscope_pipeline_step1..5` |
| `_stat1_value` 99.95% | sequential hit rate | LD `detail_rowscope_results_body` |
| `_stat2_value` 0.4% | random access, 16 MB array (99.6% conflict) | LD `detail_rowscope_results_body` |
| `_stat3_value` 250x | 99.95 / 0.4 | LD `detail_rowscope_point3` |
| `_takeaway` | stride 256 → 87.49%, stride 1024 → 49.98%, stride 2048 → ~0% | LD `detail_rowscope_results_body` |
| `_evidence1` caption | plot contents: hit rate left axis, conflict rate right axis, strides 1–1024 | PLOT (read directly) |
| `results.model` 12 values | 1 − stride·4/8192 evaluated at 1…2048 | computed from the formula in LD `_point2` |
| `results.measured` {1:99.95, 256:87.49, 1024:49.98, 2048:0} | | LD `detail_rowscope_results_body`; SPEC 03 section 5 table |
| `_design_item1..3` | user-space simulation vs PMU counters (UNC_M_CAS_COUNT); virtual-address proxy; open-page policy only | LD `detail_rowscope_design_item1..3` |
| `keyfact` | 99.95% vs 0.4% hit rate · seq vs random | SPEC 03 section 5 table |

## can — CAN Bus Security Analysis and Intrusion Detection

| key / field | value | source |
|---|---|---|
| `detail_can_overview` | CAN since 1986 (Bosch), no sender authentication, six-person team, biometric signal payload | CAN-DOCX sections 1.1, 1.2, 2.2 |
| `_point1` / `_fig_packing` bit map | LFT 10, HEM 19, BRAIN 21, WATER 3, GENDER 1, STRESS 10; 0+10 → 10+19 → 29+21 → 50+3 → 53+1 → 54+10 = 64 | CAN-DOCX section 3.2 table and its 합산 검증 line |
| `_point2` / `_pipeline_step1,3` bit ops | `byte1 = ((LFT & 0x300) >> 8) \| ((HEM & 0x3F) << 2)`; `LFT = ((byte1 & 0x03) << 8) \| byte0` | CAN-DOCX sections 4.1.1, 4.1.2 (verbatim code) |
| `_point3` / `_fig_ids` rate IDS | measured interval vs configured rate, LED green→red, receive loop stops in the same cycle | CAN-DOCX sections 4.1.5, 4.1.6, 5.2 |
| `_arch_body` | one VI, Tx loop + Rx loop, Build Array / Index Array, identifier 5, DLC 8 | CAN-DOCX sections 3.1, 4.1.1, 4.1.2, 5.1 |
| `_fig_frame` field widths | SOF 1, arbitration 12, control 6, data 0–64, CRC 16, ACK 2, EOF 7 | CAN-DOCX section 2.1.2 table |
| `_takeaway` max-value check | LFT 1023, HEM 524287, BRAIN 2097151, WATER 7, GENDER 1, STRESS 1023 → every byte 0xFF; BRAIN 100000 → byte3–byte6 pattern | CAN-DOCX section 6.1 |
| `_takeaway` rate steps | 200 → 210 → 250 → 300 ms against a 200 ms threshold, trips within one cycle | CAN-DOCX section 6.2 |
| `_design_item1` bus load | six separate frames = six times the load for the same information | CAN-DOCX section 8.3 Q1 |
| `_design_item2` limitation | rate detection cannot see a forged frame sent at the normal rate | CAN-DOCX sections 7.2, 8.3 Q2 |
| `_design_item3` scale/offset | ×100 scale, +100 offset for negatives, two's complement would need the whole 10-bit field | CAN-DOCX sections 4.2.2, 4.2.3, 8.3 Q3 |
| `_stat1..3` | 6 signals, 64 bits, 0 overlapping bits | CAN-DOCX section 3.2; SPEC 03 section 5 table |
| `results.segments` | 10 / 19 / 21 / 3 / 1 / 10 bits | CAN-DOCX section 3.2 |
| works-data `date` 2025.01, `period` 2024.12 – 2025.01 | | SPEC 00 Q3; CAN-DOCX 진행 시기 2024.12 and the 2025-01-13 demo timestamp in section 5.2 |
| works-data `role` Team lead · 6 people | | CAN-DOCX section 1.2 role table — but see gaps.md, the document contradicts itself |
| `evidence` [] | CAN.png judged a block diagram, deleted in Phase 3 | assets agent verdict (coordinator) |

## 5g_oran — 5G O-RAN End-to-End Simulation

| key / field | value | source |
|---|---|---|
| `detail_5g_oran_overview`, `_point1..2` | purpose, four components (5GC, RIC, gNB, UE), ZMQ, SSH to the lab server | 5G-PDF sections 1.1, 2.1.1, 2.1.2, 2.1.3 |
| `_arch_body` AMF address | `ngap.address` = 10.53.1.2 inside `amf.yaml` in container `open5gs_5gc` | 5G-PDF section 4.3.1 |
| `_pipeline_step1` | `cd ~/srsRAN_Project/docker` then `docker compose up 5gc` | 5G-PDF section 3.1 |
| `_pipeline_step2` / `_validation_item2` | `~/oran-sc-ric`, `docker compose up`, log line `RMR is ready now...` | 5G-PDF section 3.2 |
| `_pipeline_step3` | `./gnb -c gnb_zmq.yaml e2 --addr=… --bind_addr=…`, config downloaded from docs.srsran.com | 5G-PDF section 3.3 |
| `_pipeline_step4` | `ip netns add ue1`, `./srsue ue_zmq.conf` | 5G-PDF section 3.4 |
| `_debug_symptom` | INI error, could not read a section of `cu_cp.amf`, gNB exits | 5G-PDF sections 4.1, 4.2 |
| `_debug_tests` | AMF address checked in the container; `gnb_e2ap.pcap` existence, filename match, permissions, moved to `/test` | 5G-PDF sections 4.3.1 – 4.3.5 |
| `_debug_fix` | none of the four was the cause; the checked-out source was out of date, updating fixed it | 5G-PDF section 5 (결론) |
| `_validation_item3` | after the rebuild core, gNB, RIC and UE all run and the test succeeds | 5G-PDF section 5 |
| works-data `date` 2024.12 | | SPEC 00 Q4 |
| artifacts | `assets/pdf/5g-oran-report.pdf` | file present |

## opencl — On-Device GPU Image Processing via OpenCL

| key / field | value | source |
|---|---|---|
| **2059 ms CPU blur, 246 ms GPU blur** | slide "구현 기능", photographed device screen "Execution Time: 2059.0ms" / "246.0ms" | CL-PPT page 6 (read as image) |
| **81 ms grayscale, 72 ms rotation** | slide "구현 기능", "Execution Time: 81.0ms" / "72.0ms" | CL-PPT page 8 (read as image) |
| 8.4x | 2059 / 246 = 8.37 | computed from the two measurements above |
| timing method | `System.nanoTime()` around each native call, printed to a TextView | CL-PDF section 4.1 MainActivity.java |
| `_point1`, `_pipeline_step3..5` | `clGetPlatformIDs` → `clGetDeviceIDs(CL_DEVICE_TYPE_GPU)` → `clCreateContext` → `clCreateCommandQueue`, `clCreateProgramWithSource`/`clBuildProgram`, `clCreateBuffer`, `clEnqueueWriteBuffer`, `clEnqueueNDRangeKernel`, `clFinish`, `clEnqueueReadBuffer`, all `clRelease*` | CL-PDF section 4.2 OpenCLDriver.c |
| local work size 64, 1-D NDRange | `localSize = 64; grid = …; globalSize = grid * localSize;` | CL-PDF section 4.2 |
| `_point2` four native methods | `GaussianBlurBitmap`, `GaussianBlurGPU`, `GaussianGreyGPU`, `GaussianRotateGPU` | CL-PDF section 4.1 |
| `_pipeline_step1` build | CMake 3.22.1, links `libGLES_mali.so`, `jnigraphics`, log lib; `OpenCLDriver.c` built as a shared library | CL-PDF section 4.3 CMakeLists.txt |
| Mali GPU | inferred from the linked `libGLES_mali.so` | CL-PDF section 4.3 |
| kernel files read from the device | `#define CL_FILE "/data/local/tmp/Blur.cl"`, `GREY_FILE`, `Rotate.cl` | CL-PDF section 4.2 |
| `_design_item1` staging buffer | "원본 이미지 안 건드리고 이미지 처리하기 위해 쓰임" | CL-PPT slide "수행 방법 – OpenCL"; CL-PDF section 3.2 |
| `_design_item2` one driver path | "OpenCL을 이용하는 함수들의 경우, 사용하는 CL 파일의 종류만 다르고 그 외는 모두 일치한다" | CL-PDF section 4.2 closing note |
| `_debug_*` camera crash | crash on launch with the camera active; permission re-checked and still failing; the same flow worked in a separate project; **root cause never found**; camera path removed, `BitmapFactory.decodeFile` used instead | CL-PDF section 5.0 |
| "documentation almost non-existent" | "인터넷에서 문서화된 자료가 없다시피 하여, 직접 부딪히며 배운 점이 많다" | CL-PDF section 5.1 |
| `_evidence1` | four output tiles (original, blur, grayscale, rotate) | `assets/img/opencl-result.png`, cropped from CL-PPT |
| works-data `role`, `period`, `stack` | Solo; 2023.09 – 2023.12; Android (Java), OpenCL 1.2, C (NDK/JNI), CMake 3.22 | LD `detail_opencl_role/_timeline/_stack` |
| artifacts | `opencl-report.pdf`, `opencl-slides.pdf` | files present |

## dynamic_moh — GPU Memory System Optimization for LLM Inference

| key / field | value | source |
|---|---|---|
| title | GPU Memory System Optimization for LLM Inference | SPEC 00 Q5 |
| `_question` | "Can MoH routing signals reduce effective attention cost…" | SPEC 05 section 3 table |
| `_overview`, `_arch_body` | KV cache footprint and host-device transfer as the bottleneck; PyTorch/Transformers with router hooks; PCIe, pinned memory, async overlap | EN0 `detail_moh_overview`, `_arch_body` |
| `_pipeline_step1..4` | `scripts/run_router_trace.py`, trace statistics and Jaccard similarity, rho sweeps, offloading policies (naive / keep-hot with window tau / prefetch) | EN0 `detail_moh_pipeline_step1..4` |
| `_finding1..3` | accuracy vs rho knee; regularity limited; system metrics still needed | EN0 `detail_moh_validation_item1..3` |
| `_debug_*` | small gains or slowdowns; H1 many small transfers, H2 no pinned memory/async, H3 tracing overhead; microbenchmarks and ablations; pinned + async + batching + keep-hot | EN0 `detail_moh_debug_*` |
| `_next1..3` | latency/throughput, GPU memory peak, PCIe bytes, overlap ratio | EN0 `detail_moh_validation_item3`, `_debug_tests` |
| works-data `updated` 2026.09 | date this page text was written | this rewrite |

## pim_accel — PIM-Accelerated Gradient Accumulation for 3DGS-SLAM

| key / field | value | source |
|---|---|---|
| `_question` | "Can bank-local reduction inside PIM remove the atomic contention…" | SPEC 05 section 3 table |
| `_overview`, `_arch_body` | Rendering BP dominates tracking/mapping; P fragments with `gaussian_id` and `grad[D]` → `acc[G][D]`; `gaussian_id % num_banks` binning | EN0 `detail_pim_overview`, `_arch_body` |
| `_pipeline_step1..4` | standalone workload, GPU atomicAdd and block-reduction baselines, SAIT PIMSimulator bank-local path, sweeps over P, G, D and skew | EN0 `detail_pim_pipeline_step1..4` |
| `_finding1..3` | correctness under fixed seed (max_abs_error, relative error); latency, atomic pressure, PIM cycles, data movement; Zipf-skew crossover as the evidence target | EN0 `detail_pim_validation_item1..3` |
| `_debug_*` | wrong results or suspicious speedups; host doing PIM's work / payload encoding / binning layout; locked inputs, three-way comparison, per-stage timing | EN0 `detail_pim_debug_*` |
| works-data `stack` | CUDA, C++, PIMSimulator, Python | EN0 `detail_pim_pipeline_step2/3`, `_skills_item4` |
| works-data `updated` 2026.09 | date this page text was written | this rewrite |
