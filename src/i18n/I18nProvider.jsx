"use client";

import { useEffect, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18n } from "./config";

/** messages передаются с сервера — в клиентский бандл попадает только текущий язык */
export default function I18nProvider({ lang, messages, children }) {
  const i18n = useMemo(() => createI18n(lang, messages), [lang, messages]);

  /* <html lang="…"> — для скринридеров и переносов */
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
