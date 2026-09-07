/* Single source of truth for the work list.
   Card order, detail meta strips, charts, evidence, artifacts and pager all derive from this file.
   Strings that need translation live in lang/*.json under work_<id>_* and detail_<id>_*.
   Sort order (see docs/spec/02 section 4): projects before research, date descending,
   in-progress items first within their type. */

window.SITE = {
  name: "Junheon Lee",
  email: "wnsgjs34@uos.ac.kr",
  github: "https://github.com/Junon-archive",
  domain: "https://junon-lee.pages.dev",
  cvUrl: null,
  lab: "Architecture & Computer Systems Laboratory · University of Seoul"
};

window.WORKS = [
  {
    id: "ebpf",
    type: "project",
    status: "completed",
    date: "2026.02",
    period: "2025.12 – 2026.02",
    updated: null,
    featured: true,
    href: "project_ebpf.html",
    role: "Solo",
    stack: ["eBPF", "C", "Go", "Linux"],
    tags: ["eBPF", "Linux", "Go", "Observability"],
    illus: {
      thumb: "thumb",
      hero: "hero",
      alt: "Three eBPF probes on kernel tracepoints feeding histograms up to a user-space collector"
    },
    diagrams: [
      { name: "pipeline", section: "s3" }
    ],
    keyfact: null,
    results: null,
    evidence: [],
    artifacts: [],
    prevNext: true
  },

  {
    id: "rowscope",
    type: "project",
    status: "completed",
    date: "2025.12",
    period: "2025.12",
    updated: null,
    featured: true,
    href: "project_rowscope.html",
    role: "Solo",
    stack: ["C", "Python", "Matplotlib"],
    tags: ["DRAM", "Memory Systems", "C", "Python", "Simulation"],
    illus: {
      thumb: "thumb",
      hero: "hero",
      alt: "DRAM bank array with one open row, struck by stride-spaced accesses until they cross into the next row"
    },
    diagrams: [
      { name: "address", section: "s3" },
      { name: "state", section: "s3" }
    ],
    keyfact: "99.95% vs 0.4% hit rate · seq vs random",
    results: {
      kind: "line",
      x: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
      xLabel: "stride (elements)",
      xLog: true,
      model: [99.95, 99.90, 99.80, 99.61, 99.22, 98.44, 96.88, 93.75, 87.50, 75.00, 50.00, 0],
      measured: { 0: 99.95, 8: 87.49, 10: 49.98, 11: 0 },
      yLabel: "%",
      yTicks: [0, 25, 50, 75, 100],
      title: "Row buffer hit rate vs. stride (8 KB row, 4 B elements)",
      legend: "-- model  ● measured",
      legendPos: "bottom-left",
      aria: "Row buffer hit rate falls from 99.95 percent at stride 1 to 87.5 percent at stride 256, 50 percent at stride 1024 and 0 at stride 2048"
    },
    evidence: [
      {
        src: "assets/img/rowscope-plot.png",
        webp: "assets/img/rowscope-plot.webp",
        width: 1600,
        height: 859,
        alt: "Line chart: row hit rate falls from about 100 percent at stride 1 to 50 percent at stride 1024 while the row conflict rate rises to about 50 percent",
        captionKey: "detail_rowscope_evidence1"
      }
    ],
    artifacts: [],
    prevNext: true
  },

  {
    id: "can",
    type: "project",
    status: "completed",
    date: "2025.01",
    period: "2024.12 – 2025.01",
    updated: null,
    featured: true,
    href: "project_can.html",
    role: "Team lead · 6 people",
    stack: ["LabVIEW", "CAN", "Bit packing"],
    tags: ["CAN", "LabVIEW", "Automotive", "Security", "IDS"],
    illus: {
      thumb: "thumb",
      hero: "hero",
      alt: "CAN bus with three ECU nodes and a LabVIEW monitor, injected packets crowding between the regular ones"
    },
    diagrams: [
      { name: "frame", section: "s3" },
      { name: "packing", section: "s3" },
      { name: "ids", section: "s3" }
    ],
    keyfact: "6 signals · 64 bits · 0 overlap",
    results: {
      kind: "bits",
      segments: [
        { label: "LFT", bits: 10 },
        { label: "HEM", bits: 19 },
        { label: "BRAIN", bits: 21 },
        { label: "WATER", bits: 3 },
        { label: "GENDER", bits: 1 },
        { label: "STRESS", bits: 10 }
      ],
      caption: "bit 0 → 63",
      title: "Six signals packed into the 64-bit CAN data field",
      aria: "Bit map of the 64 bit CAN payload: LFT 10 bits, HEM 19, BRAIN 21, WATER 3, GENDER 1, STRESS 10"
    },
    evidence: [],
    artifacts: [
      { label: "Slides (PDF)", href: "assets/pdf/can-slides.pdf", kind: "pdf" },
      { label: "Report (PDF)", href: "assets/pdf/can-report.pdf", kind: "pdf" }
    ],
    prevNext: true
  },

  {
    id: "5g_oran",
    type: "project",
    status: "completed",
    date: "2024.12",
    period: "2024.12",
    updated: null,
    featured: false,
    href: "project_5g_oran.html",
    role: "Solo",
    stack: ["Open5GS", "srsRAN", "O-RAN SC RIC", "Docker Compose", "ZMQ"],
    tags: ["5G", "O-RAN", "srsRAN", "Open5GS", "Docker"],
    illus: {
      thumb: "thumb",
      hero: "hero",
      alt: "Three containers on a Docker Compose slab — UE, gNB and core — with the RIC linked to the gNB over E2"
    },
    diagrams: [
      { name: "bringup", section: "s3" }
    ],
    keyfact: null,
    results: null,
    evidence: [],
    artifacts: [
      { label: "Report (PDF)", href: "assets/pdf/5g-oran-report.pdf", kind: "pdf" }
    ],
    prevNext: true
  },

  {
    id: "opencl",
    type: "project",
    status: "completed",
    date: "2023.12",
    period: "2023.09 – 2023.12",
    updated: null,
    featured: true,
    href: "project_opencl.html",
    role: "Solo",
    stack: ["Android (Java)", "C (NDK/JNI)", "OpenCL 1.2", "CMake 3.22"],
    tags: ["OpenCL", "Android", "GPGPU", "C", "JNI"],
    illus: {
      thumb: "thumb",
      hero: "hero",
      alt: "Android board with an image tile grid and a GPU die above it, one neighbourhood mapped to work-items"
    },
    diagrams: [
      { name: "stack", section: "s3" }
    ],
    keyfact: "8.4x faster · 2059 → 246 ms",
    results: {
      kind: "bar",
      items: [
        { label: "CPU blur", value: 2059 },
        { label: "GPU blur", value: 246 },
        { label: "Grayscale", value: 81 },
        { label: "Rotation", value: 72 }
      ],
      unit: "ms",
      title: "Execution time on device (ms, lower is better)",
      highlight: [1],
      aria: "Gaussian blur takes 2059 milliseconds on the CPU and 246 on the GPU; grayscale 81 and rotation 72 on the GPU"
    },
    evidence: [
      {
        src: "assets/img/opencl-result.png",
        webp: "assets/img/opencl-result.webp",
        width: 875,
        height: 436,
        alt: "App output tiles: original, blur, grayscale, rotate",
        captionKey: "detail_opencl_evidence1"
      }
    ],
    artifacts: [
      { label: "Report (PDF)", href: "assets/pdf/opencl-report.pdf", kind: "pdf" },
      { label: "Slides (PDF)", href: "assets/pdf/opencl-slides.pdf", kind: "pdf" }
    ],
    prevNext: true
  },

  {
    id: "dynamic_moh",
    type: "research",
    status: "in-progress",
    date: null,
    period: "2025 – present",
    updated: "2026.09",
    featured: false,
    href: "research_dynamic_moh.html",
    role: "Graduate researcher",
    stack: ["PyTorch", "Transformers", "CUDA", "Python"],
    tags: ["LLM Inference", "GPU Memory", "PCIe", "PyTorch", "Profiling"],
    illus: {
      thumb: "thumb",
      hero: "hero",
      alt: "CPU with DRAM on the left and a GPU package on the right across PCIe, attention heads split between resident and offloaded"
    },
    diagrams: [
      { name: "arch", section: "s2" },
      { name: "trace", section: "s3" },
      { name: "overlap", section: "s4" }
    ],
    keyfact: null,
    results: null,
    evidence: [],
    artifacts: [],
    prevNext: true
  },

  {
    id: "pim_accel",
    type: "research",
    status: "in-progress",
    date: null,
    period: "2025 – present",
    updated: "2026.09",
    featured: false,
    href: "research_pim_accel.html",
    role: "Graduate researcher",
    stack: ["CUDA", "C++", "PIMSimulator", "Python"],
    tags: ["PIM", "CUDA", "3DGS-SLAM", "Memory Systems", "Simulation"],
    illus: {
      thumb: "thumb",
      hero: "hero",
      alt: "PIM module with four banks, each holding a local accumulator, fed by fragments binned on the host"
    },
    diagrams: [
      { name: "contention", section: "s2" },
      { name: "stages", section: "s3" }
    ],
    keyfact: null,
    results: null,
    evidence: [],
    artifacts: [],
    prevNext: true
  }
];
