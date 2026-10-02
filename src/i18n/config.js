import i18next from "i18next";

/* Без импорта переводов — файл можно подключать в клиентских компонентах.
   Сами переводы — в ./messages.js (только для серверных страниц). */

export const LANGUAGES = [
  { code: "ru", label: "RU", ogLocale: "ru_RU" },
  { code: "tg", label: "TJ", ogLocale: "tg_TJ" },
  { code: "en", label: "EN", ogLocale: "en_US" },
];

/** Язык без префикса в URL: / и /tcell/ — русский, /tg/, /tcell/en/ … — остальные */
export const DEFAULT_LANG = "ru";
export const EXTRA_LANGS = LANGUAGES.map((l) => l.code).filter((c) => c !== DEFAULT_LANG);

/** Путь страницы на нужном языке (без basePath — его добавляет Next).
    operator = null — основной сайт: sitePath(null, "en") → /en/, sitePath("tcell", "en") → /tcell/en/ */
export const sitePath = (operator, lang) => {
  const parts = [operator, lang !== DEFAULT_LANG && lang].filter(Boolean);
  return parts.length ? `/${parts.join("/")}/` : "/";
};

/** Отдельный экземпляр i18next на страницу — синхронный, чтобы тексты попали в HTML при сборке */
export function createI18n(lang, messages) {
  const i18n = i18next.createInstance();
  i18n.init({
    resources: { [lang]: { translation: messages } },
    lng: lang,
    fallbackLng: false,
    initAsync: false,
    interpolation: { escapeValue: false },
  });
  return i18n;
}
