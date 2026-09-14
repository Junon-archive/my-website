/* Single source of truth for the work list.
   Card order, detail meta strips, charts, evidence, artifacts and pager all derive from this file.
   Strings that need translation live in lang/*.json under work_<id>_* and detail_<id>_*.
   Sort order (see docs/spec/02 section 4): projects, then research, then apps;
   date descending, in-progress items first within their type. */

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
  },

  {
    id: "nihongo",
    type: "app",
    status: "maintained",
    date: "2026.09",
    period: "2026.09 – present",
    updated: null,
    featured: true,
    href: "app_nihongo.html",
    role: "Solo · product, backend, frontend, ops",
    stack: ["Python 3.12", "FastAPI", "PostgreSQL 16", "SQLAlchemy · Alembic", "FSRS", "SudachiPy", "TypeScript", "Vite", "Playwright", "Docker Compose", "Cloudflare"],
    tags: ["FastAPI", "PostgreSQL", "TypeScript", "Spaced repetition", "LLM pipeline"],
    illus: {
      thumb: "thumb",
      hero: "hero",
      alt: "Server slab with an API, a worker and a PostgreSQL stack; the worker asks an LLM for sentences that land in the database"
    },
    diagrams: [
      { name: "arch", section: "s3" }
    ],
    keyfact: "2,078 tests · trial makes 0 API calls",
    results: null,
    evidence: [
      { src: "assets/img/nihongo-home.png", webp: "assets/img/nihongo-home.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Home screen with two cards: try expression learning, or learn kana first", captionKey: "detail_nihongo_shot1" },
      { src: "assets/img/nihongo-sheet.png", webp: "assets/img/nihongo-sheet.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Explanation sheet for the tapped expression with reading, meaning, meaning in context, nuance and an example", captionKey: "detail_nihongo_shot2" },
      { src: "assets/img/nihongo-furigana.png", webp: "assets/img/nihongo-furigana.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Trial sentence with furigana readings above the kanji and the Korean translation revealed", captionKey: "detail_nihongo_shot3" },
      { src: "assets/img/nihongo-kana.png", webp: "assets/img/nihongo-kana.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Hiragana table with range chips and romaji under each character", captionKey: "detail_nihongo_shot4" },
      { src: "assets/img/nihongo-quiz-choose.png", webp: "assets/img/nihongo-quiz-choose.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Kana quiz asking for the romaji of a character from four choices", captionKey: "detail_nihongo_shot5" },
      { src: "assets/img/nihongo-quiz-read.png", webp: "assets/img/nihongo-quiz-read.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Kana quiz in read-aloud mode with the answer revealed and right or wrong buttons", captionKey: "detail_nihongo_shot6" }
    ],
    artifacts: [
      { label: "Live site", href: "https://japanese.our-lab-never-sleeps.xyz", kind: "link" },
      { label: "Source", href: "https://github.com/Junon-archive/japanese-learning-app", kind: "code" }
    ],
    prevNext: true
  },

  {
    id: "life_heatmap",
    type: "app",
    status: "maintained",
    date: "2026.08",
    period: "2026.08 – present",
    updated: null,
    featured: true,
    href: "app_life_heatmap.html",
    role: "Solo · product, design, build, deploy",
    stack: ["Preact 10", "TypeScript", "Vite 6", "Workbox PWA", "Cloudflare Pages Functions", "Workers KV", "Vitest"],
    tags: ["PWA", "Offline-first", "Sync", "Preact", "Serverless"],
    illus: {
      thumb: "thumb",
      hero: "hero",
      alt: "Phone showing a heatmap of days with one highlighted streak, synced through an edge key-value store to a PC"
    },
    diagrams: [
      { name: "arch", section: "s3" }
    ],
    keyfact: "34 tests · 28 KB gzip · 1 runtime dependency",
    results: null,
    evidence: [
      { src: "assets/img/heatmap-desktop.png", webp: "assets/img/heatmap-desktop.webp", width: 1600, height: 1000, frame: "wide", zoom: true,
        alt: "Desktop view with a streak heatmap, a basic heatmap and a conditional heatmap side by side", captionKey: "detail_life_heatmap_shot1" },
      { src: "assets/img/heatmap-streak.png", webp: "assets/img/heatmap-streak.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Streak heatmap on a phone with a purple intensity gradient, milestone glows and a failed day marked X", captionKey: "detail_life_heatmap_shot2" },
      { src: "assets/img/heatmap-editor.png", webp: "assets/img/heatmap-editor.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Cell editor bottom sheet with fill style, colour, mark and border options", captionKey: "detail_life_heatmap_shot3" },
      { src: "assets/img/heatmap-trend.png", webp: "assets/img/heatmap-trend.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Trend popup with a line chart of sleep hours and average, minimum and maximum chips", captionKey: "detail_life_heatmap_shot4" },
      { src: "assets/img/heatmap-year.png", webp: "assets/img/heatmap-year.webp", width: 1600, height: 1000, frame: "half", zoom: true,
        alt: "Year view with three contribution-style grids of 53 weeks", captionKey: "detail_life_heatmap_shot5" },
      { src: "assets/img/heatmap-legend.png", webp: "assets/img/heatmap-legend.webp", width: 1600, height: 1000, frame: "half", zoom: true,
        alt: "Legend popover opened on the basic heatmap", captionKey: "detail_life_heatmap_shot6" }
    ],
    artifacts: [
      { label: "Live site", href: "https://heatmap-for-me.pages.dev/", kind: "link" },
      { label: "Source", href: "https://github.com/Junon-archive/life-heatmap", kind: "code" }
    ],
    prevNext: true
  },

  {
    id: "riff",
    type: "app",
    status: "maintained",
    date: "2026.07",
    period: "2026.07 – present",
    updated: null,
    featured: true,
    href: "app_riff.html",
    role: "Solo · design, build, deploy",
    stack: ["Astro 5", "TypeScript", "VexFlow 4", "jsdom", "Web Audio API", "Service Worker", "Cloudflare Pages"],
    tags: ["Astro", "TypeScript", "SVG rendering", "i18n", "PWA"],
    illus: {
      thumb: "thumb",
      hero: "hero",
      alt: "Guitar neck with a pentatonic scale shape highlighted, rendered from a score card, next to a stack of lesson pages"
    },
    diagrams: [
      { name: "arch", section: "s3" }
    ],
    keyfact: "1,012 static pages · 28 KB gzip JS",
    results: null,
    evidence: [
      { src: "assets/img/riff-home.png", webp: "assets/img/riff-home.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Riff home page in English with practice tool cards, a guitar and bass filter and course cards", captionKey: "detail_riff_shot1" },
      { src: "assets/img/riff-course.png", webp: "assets/img/riff-course.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Course page for Solo and Scale Mastery with a progress bar at 27 percent, 14 of 52 days", captionKey: "detail_riff_shot2" },
      { src: "assets/img/riff-lesson.png", webp: "assets/img/riff-lesson.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Lesson page with combined staff notation and tablature showing half and full bends", captionKey: "detail_riff_shot3" },
      { src: "assets/img/riff-lesson-dark.png", webp: "assets/img/riff-lesson-dark.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Lesson in dark mode with a sixteenth-note muted rhythm in staff and tab", captionKey: "detail_riff_shot4" },
      { src: "assets/img/riff-bass-ja.png", webp: "assets/img/riff-bass-ja.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Bass lesson in Japanese with green theme and fretboard diagrams for 4- and 5-string bass", captionKey: "detail_riff_shot5" },
      { src: "assets/img/riff-metronome.png", webp: "assets/img/riff-metronome.webp", width: 780, height: 1688, frame: "phone", zoom: true,
        alt: "Metronome tool with BPM, time signature, subdivision and sound options", captionKey: "detail_riff_shot6" }
    ],
    artifacts: [
      { label: "Live site", href: "https://guitar-riff.pages.dev", kind: "link" },
      { label: "Source", href: "https://github.com/Junon-archive/Riff", kind: "code" }
    ],
    prevNext: true
  }
];
