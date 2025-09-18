// Load i18n dictionary JSON
async function loadI18n() {
    const lang = localStorage.getItem("lang") || "ja";
    try {
        const res = await fetch("i18n/i18n.json", { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const dict = await res.json();
        window.I18N_DICT = dict[lang] || {};
    } catch (e) {
        console.warn("Failed to load i18n/i18n.json:", e);
        // Keep existing window.I18N_DICT if any
    }
}

// calculate era
function getEra(year) {
    if (year >= 2019) {
        return { era: "令和", eraYear: year - 2018 };
    } else if (year >= 1989) {
        return { era: "平成", eraYear: year - 1988 };
    } else if (year >= 1926) {
        return { era: "昭和", eraYear: year - 1925 };
    } else if (year >= 1912) {
        return { era: "大正", eraYear: year - 1911 };
    } else if (year >= 1868) {
        return { era: "明治", eraYear: year - 1867 };
    } else {
        return { era: "不明", eraYear: null };
    }
}

// i18n: language helpers and loader
function getLang() {
    return localStorage.getItem("lang") || "ja";
}
function setLang(l) {
    localStorage.setItem("lang", l);
}

function applyTranslations() {
    /** 
    // text-only translations
    $("[data-i18n]").each(function () {
        $(this).text(t($(this).attr("data-i18n")));
    });
    // HTML translations (e.g., with <br>)
    $("[data-i18n-html]").each(function () {
        $(this).html(t($(this).attr("data-i18n-html")));
    });
     */
}
