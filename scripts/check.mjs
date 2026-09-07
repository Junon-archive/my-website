#!/usr/bin/env node
/* ==========================================================================
   check.mjs — pre-commit consistency checks  (03-content-and-i18n.md §8)

   1  en / kr / jp key sets are identical
   2  every data-lang key used in HTML or JS exists in lang/en.json
   3  keys defined in en.json but never referenced            (warning only)
   4  assets/js/lang-data.js is byte-identical to a fresh build
   5  works-data href / artifacts / evidence local paths exist
   6  every works-data id has detail_<id>_title in en.json
   7  no placeholder strings ("To be added", "Your Name", "Lorem", "TBD")
   8  every page has <title>, <meta name="description"> and og:title
   9  (extension) no colour literals outside assets/css/tokens.css
  10  (extension) works-data ids and project_/research_*.html files map 1:1

   Exit code 1 when any check fails. Warnings never fail the run.
   ========================================================================== */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildLangData, loadWorks } from "./build-lang-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const p = (...s) => join(ROOT, ...s);
const read = (f) => readFileSync(f, "utf8");
const readJson = (f) => JSON.parse(read(f));

const results = [];
let failed = false;

function pass(n, title, note = "") {
  results.push(`  ok   ${String(n).padStart(2)}  ${title}${note ? "  — " + note : ""}`);
}
function fail(n, title, details = []) {
  failed = true;
  results.push(`  FAIL ${String(n).padStart(2)}  ${title}`);
  for (const d of details.slice(0, 25)) results.push(`         · ${d}`);
  if (details.length > 25) results.push(`         · … ${details.length - 25} more`);
}
function warn(n, title, details = []) {
  results.push(`  warn ${String(n).padStart(2)}  ${title}`);
  for (const d of details.slice(0, 15)) results.push(`         · ${d}`);
  if (details.length > 15) results.push(`         · … ${details.length - 15} more`);
}
function skip(n, title, why) {
  results.push(`  skip ${String(n).padStart(2)}  ${title}  — ${why}`);
}

/* ---------- inputs --------------------------------------------------------- */

const LANG_FILES = ["en", "kr", "jp"].map((l) => ({ lang: l, file: p("lang", `${l}.json`) }));
const missingLang = LANG_FILES.filter((l) => !existsSync(l.file));
const dicts = {};
for (const l of LANG_FILES) if (existsSync(l.file)) dicts[l.lang] = readJson(l.file);

const rootHtml = existsSync(ROOT)
  ? readdirSync(ROOT).filter((f) => f.endsWith(".html")).map((f) => ({ name: f, file: p(f) }))
  : [];
const tplDir = p("docs", "templates");
const tplHtml = existsSync(tplDir)
  ? readdirSync(tplDir).filter((f) => f.endsWith(".html"))
      .map((f) => ({ name: `docs/templates/${f}`, file: join(tplDir, f) }))
  : [];
const htmlFiles = [...rootHtml, ...tplHtml];

const jsFiles = ["layout.js", "works.js", "toc.js", "lang.js"]
  .map((f) => ({ name: `assets/js/${f}`, file: p("assets", "js", f) }))
  .filter((f) => existsSync(f.file));

const { works, site } = loadWorks();
const hasWorks = existsSync(p("assets", "js", "works-data.js"));

/* keys that JS builds at runtime and a regex can never see */
const RUNTIME_KEYS = [
  "brand_name", "nav_home", "nav_resume", "nav_portfolio", "nav_contact",
  "footer_quote", "footer_affiliation", "footer_copyright",
  "badge_project", "badge_research", "badge_progress", "badge_done",
  "detail_common_role", "detail_common_period", "detail_common_stack",
  "detail_common_artifacts", "detail_common_prev", "detail_common_next",
  "detail_common_back", "detail_common_updated", "detail_common_contents",
  "hero_cta_cv"
];
for (const w of works) {
  RUNTIME_KEYS.push(`work_${w.id}_title`, `work_${w.id}_sub`, `detail_${w.id}_title`);
}

function keysIn(text) {
  const out = new Set();
  const re = /data-lang(?:-attr)?\s*=\s*["']([^"']+)["']|data-placeholder\s*=\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(text))) {
    const raw = m[1] || m[2];
    if (!raw) continue;
    if (/^(placeholder|aria-label|title|alt|content)$/.test(raw)) continue; /* data-lang-attr value */
    if (raw.includes("{") || raw.includes("}")) continue;                   /* template placeholder */
    if (raw.includes("+") || raw.includes('"')) continue;                   /* JS concatenation */
    out.add(raw);
  }
  return out;
}

/* ---------- 1. key sets ---------------------------------------------------- */

if (missingLang.length) {
  fail(1, "en / kr / jp key sets identical", missingLang.map((l) => `missing ${l.file}`));
} else {
  const en = new Set(Object.keys(dicts.en));
  const problems = [];
  for (const lang of ["kr", "jp"]) {
    const other = new Set(Object.keys(dicts[lang]));
    for (const k of en) if (!other.has(k)) problems.push(`${lang}.json missing ${k}`);
    for (const k of other) if (!en.has(k)) problems.push(`${lang}.json has extra ${k}`);
  }
  if (problems.length) fail(1, "en / kr / jp key sets identical", problems);
  else pass(1, "en / kr / jp key sets identical", `${en.size} keys`);
}

/* ---------- 2. referenced keys exist --------------------------------------- */

const used = new Set(RUNTIME_KEYS);
const usedBy = new Map();
for (const f of [...htmlFiles, ...jsFiles]) {
  for (const k of keysIn(read(f.file))) {
    used.add(k);
    if (!usedBy.has(k)) usedBy.set(k, f.name);
  }
}

if (!dicts.en) {
  skip(2, "data-lang keys exist in en.json", "lang/en.json missing");
} else {
  const missing = [...used].filter((k) => !(k in dicts.en))
    .map((k) => `${k}  (${usedBy.get(k) || "runtime"})`);
  if (missing.length) fail(2, "data-lang keys exist in en.json", missing);
  else pass(2, "data-lang keys exist in en.json", `${used.size} keys referenced`);
}

/* ---------- 3. unused keys (warning) --------------------------------------- */

if (dicts.en) {
  const unused = Object.keys(dicts.en).filter((k) => !used.has(k));
  if (unused.length) warn(3, `${unused.length} en.json key(s) never referenced`, unused);
  else pass(3, "no unused en.json keys");
}

/* ---------- 4. lang-data.js in sync ---------------------------------------- */

const langDataFile = p("assets", "js", "lang-data.js");
if (missingLang.length) {
  skip(4, "lang-data.js matches lang/*.json", "lang files missing");
} else if (!existsSync(langDataFile)) {
  fail(4, "lang-data.js matches lang/*.json", ["assets/js/lang-data.js does not exist — run npm run build"]);
} else {
  const expected = buildLangData();
  if (read(langDataFile) === expected) pass(4, "lang-data.js matches lang/*.json");
  else fail(4, "lang-data.js matches lang/*.json", ["stale or hand-edited — run npm run build"]);
}

/* ---------- 5. works-data paths -------------------------------------------- */

if (!hasWorks) {
  fail(5, "works-data paths exist", ["assets/js/works-data.js does not exist"]);
} else {
  const bad = [];
  const isLocal = (u) => u && !/^(https?:|mailto:|tel:|#)/i.test(u);
  for (const w of works) {
    const href = w.href || `${w.type}_${w.id}.html`;
    if (!existsSync(p(href))) bad.push(`${w.id}: href ${href}`);
    for (const a of w.artifacts || []) {
      if (isLocal(a.href) && !existsSync(p(a.href))) bad.push(`${w.id}: artifact ${a.href}`);
    }
    for (const e of w.evidence || []) {
      for (const src of [e.src, e.webp].filter(Boolean)) {
        if (isLocal(src) && !existsSync(p(src))) bad.push(`${w.id}: evidence ${src}`);
      }
    }
    if (!w.illus || !w.illus.thumb) bad.push(`${w.id}: illus.thumb missing`);
    else if (!existsSync(p("assets", "js", "scenes", `${w.id}.js`))) {
      bad.push(`${w.id}: assets/js/scenes/${w.id}.js missing`);
    }
  }
  if (bad.length) fail(5, "works-data paths exist", bad);
  else pass(5, "works-data paths exist", `${works.length} works`);
}

/* ---------- 6. detail titles ----------------------------------------------- */

if (!hasWorks || !dicts.en) {
  skip(6, "detail_<id>_title present", "works-data.js or en.json missing");
} else {
  const bad = works.filter((w) => !(`detail_${w.id}_title` in dicts.en))
                   .map((w) => `detail_${w.id}_title`);
  if (bad.length) fail(6, "detail_<id>_title present", bad);
  else pass(6, "detail_<id>_title present");
}

/* ---------- 7. placeholder strings ----------------------------------------- */

const FORBIDDEN = ["To be added", "Your Name", "Lorem", "TBD"];
{
  const hits = [];
  for (const [lang, d] of Object.entries(dicts)) {
    for (const [k, v] of Object.entries(d)) {
      if (typeof v !== "string") continue;
      for (const f of FORBIDDEN) if (v.includes(f)) hits.push(`lang/${lang}.json ${k}: "${f}"`);
    }
  }
  for (const f of htmlFiles) {
    const text = read(f.file);
    for (const bad of FORBIDDEN) if (text.includes(bad)) hits.push(`${f.name}: "${bad}"`);
  }
  if (hits.length) fail(7, "no placeholder strings", hits);
  else pass(7, "no placeholder strings");
}

/* ---------- 8. head metadata ------------------------------------------------ */

{
  const bad = [];
  for (const f of rootHtml) {
    const text = read(f.file);
    if (!/<title>[^<]+<\/title>/i.test(text)) bad.push(`${f.name}: <title>`);
    if (!/<meta\s+name=["']description["']/i.test(text)) bad.push(`${f.name}: meta description`);
    if (!/property=["']og:title["']/i.test(text)) bad.push(`${f.name}: og:title`);
  }
  if (!rootHtml.length) skip(8, "page head metadata", "no root HTML pages yet");
  else if (bad.length) fail(8, "page head metadata", bad);
  else pass(8, "page head metadata", `${rootHtml.length} pages`);
}

/* ---------- 9. colour literals outside tokens.css --------------------------- */

{
  const files = ["base.css", "pages.css", "detail.css"]
    .map((f) => ({ name: `assets/css/${f}`, file: p("assets", "css", f) }))
    .filter((f) => existsSync(f.file));
  const hits = [];
  const hex = /#[0-9a-fA-F]{3,8}(?![0-9a-zA-Z_-])/g;
  const rgb = /\b(rgba?|hsla?)\s*\(/g;
  for (const f of files) {
    read(f.file).split("\n").forEach((line, i) => {
      if (line.trim().startsWith("/*") || line.trim().startsWith("*")) return;
      for (const re of [hex, rgb]) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(line))) hits.push(`${f.name}:${i + 1}  ${m[0]}`);
      }
    });
  }
  if (!files.length) skip(9, "no colour literals outside tokens.css", "component CSS missing");
  else if (hits.length) fail(9, "no colour literals outside tokens.css", hits);
  else pass(9, "no colour literals outside tokens.css", `${files.length} files`);
}

/* ---------- 10. works ids <-> detail pages ---------------------------------- */

{
  const pages = rootHtml.map((f) => f.name)
    .filter((n) => /^(project|research)_.+\.html$/.test(n));
  if (!hasWorks) {
    skip(10, "works ids map 1:1 to detail pages", "works-data.js missing");
  } else {
    const expected = new Set(works.map((w) => w.href || `${w.type}_${w.id}.html`));
    const bad = [];
    for (const e of expected) if (!pages.includes(e)) bad.push(`no page for ${e}`);
    for (const pg of pages) if (!expected.has(pg)) bad.push(`no works entry for ${pg}`);
    if (bad.length) fail(10, "works ids map 1:1 to detail pages", bad);
    else pass(10, "works ids map 1:1 to detail pages", `${pages.length} pages`);
  }
}

/* ---------- report ---------------------------------------------------------- */

console.log("\ncheck.mjs — junon-lee portfolio\n");
console.log(results.join("\n"));
console.log(failed ? "\nFAILED\n" : "\nAll checks passed.\n");
process.exit(failed ? 1 : 0);
