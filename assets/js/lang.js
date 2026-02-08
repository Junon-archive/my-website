const translations = window.TRANSLATION_DATA || {
    en: {},
    kr: {},
    jp: {}
};

function getUrlLang() {
    try {
        return new URLSearchParams(window.location.search).get("lang");
    } catch (err) {
        return null;
    }
}

function getStoredLang() {
    try {
        return localStorage.getItem("lang");
    } catch (err) {
        return null;
    }
}

const preferredLang = getUrlLang() || getStoredLang() || "en";
let currentLang = preferredLang;
let dict = translations[currentLang] || translations.en || {};
let fallbackDict = translations.en || {};
let fallbackLoaded = false;

async function loadLangFile(lang) {
    try {
        const res = await fetch(`lang/${lang}.json`);
        if (!res.ok) throw new Error("failed to load");
        dict = await res.json();
        applyLang();
    } catch (err) {
        console.warn("Language file load failed, using fallback:", err);
    }
}

async function loadFallbackLang() {
    if (fallbackLoaded) return;
    try {
        const res = await fetch("lang/en.json");
        if (!res.ok) throw new Error("failed to load fallback");
        fallbackDict = await res.json();
        fallbackLoaded = true;
        applyLang();
    } catch (err) {
        console.warn("Fallback language load failed:", err);
    }
}

function setLang(lang) {
    currentLang = lang;
    dict = translations[lang] || translations.en || {};
    localStorage.setItem("lang", lang);
    applyLang();
    loadLangFile(lang);
    loadFallbackLang();
}

function applyLang() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.getAttribute("data-lang");
        if (dict && dict[key]) {
            el.innerText = dict[key];
        } else if (fallbackDict && fallbackDict[key]) {
            el.innerText = fallbackDict[key];
        }
    });

    document.querySelectorAll("[data-placeholder]").forEach(el => {
        const key = el.getAttribute("data-placeholder");
        if (dict && dict[key]) {
            el.setAttribute("placeholder", dict[key]);
        } else if (fallbackDict && fallbackDict[key]) {
            el.setAttribute("placeholder", fallbackDict[key]);
        }
    });

    updateNavLinks();
    updateLangButtons();
}

function initFilters() {
    const buttons = document.querySelectorAll("[data-filter]");
    const cards = document.querySelectorAll(".work-card");

    if (!buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const target = button.getAttribute("data-filter");
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            cards.forEach(card => {
                const category = card.getAttribute("data-category");
                card.style.display = (target === "all" || category === target) ? "" : "none";
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadFallbackLang();
    setLang(currentLang);
    initFilters();
});

function updateNavLinks() {
    const targets = document.querySelectorAll(".nav-shell nav a, .topnav nav a, .work-card");
    targets.forEach(link => {
        const base = link.getAttribute("data-base-href") || link.href.split("?")[0];
        link.setAttribute("data-base-href", base);
        link.href = `${base}?lang=${currentLang}`;
    });
}

function updateLangButtons() {
    const buttons = document.querySelectorAll(".lang-switch button");
    buttons.forEach(btn => {
        const target = btn.getAttribute("data-lang-code");
        const isActive = target === currentLang;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", isActive);
    });
}
