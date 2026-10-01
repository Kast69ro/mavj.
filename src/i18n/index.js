import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ru from "./locales/ru.json";
import tg from "./locales/tg.json";
import en from "./locales/en.json";

export const LANGUAGES = [
  { code: "ru", label: "RU" },
  { code: "tg", label: "TJ" },
  { code: "en", label: "EN" },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      tg: { translation: tg },
      en: { translation: en },
    },
    supportedLngs: LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "lang",
      caches: ["localStorage"],
    },
  });

/* <html lang="…"> — для скринридеров и переносов */
const syncHtmlLang = (lng) => {
  document.documentElement.lang = lng;
};
syncHtmlLang(i18n.resolvedLanguage ?? "ru");
i18n.on("languageChanged", () => syncHtmlLang(i18n.resolvedLanguage ?? "ru"));

export default i18n;
