import QuizPage from "@/components/QuizPage";
import I18nProvider from "@/i18n/I18nProvider";
import { LANGUAGES, DEFAULT_LANG, EXTRA_LANGS, createI18n, sitePath } from "@/i18n/config";
import { MESSAGES } from "@/i18n/messages";
import { OPERATORS, MAIN_THEME } from "@/config/operators";
import { absoluteUrl } from "@/config/site";

/* Общая логика всех страниц:
     /            /tg/          /en/           — основной сайт (operator = null)
     /tcell/      /tcell/tg/    /tcell/en/     — сайт оператора                */

/** Первый сегмент URL: оператор (/tcell/) или язык основного сайта (/tg/) */
export function resolveSlug(slug) {
  return OPERATORS[slug] ? { operator: slug, lang: DEFAULT_LANG } : { operator: null, lang: slug };
}

/** Все значения первого сегмента — для generateStaticParams */
export const FIRST_SEGMENTS = [...Object.keys(OPERATORS), ...EXTRA_LANGS];

const getSite = (operator) =>
  operator
    ? { slug: operator, ...OPERATORS[operator] }
    : { slug: null, name: null, regulation: null, theme: MAIN_THEME };

/** title, description, canonical, hreflang и Open Graph */
export function siteMetadata(operator, lang) {
  const site = getSite(operator);
  const { t } = createI18n(lang, MESSAGES[lang]);
  const title = site.name ? t("meta.title", { operator: site.name }) : t("meta.mainTitle");
  const description = site.name ? t("meta.description", { operator: site.name }) : t("meta.mainDescription");
  const url = absoluteUrl(sitePath(operator, lang));

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(LANGUAGES.map(({ code }) => [code, absoluteUrl(sitePath(operator, code))])),
        "x-default": absoluteUrl(sitePath(operator, DEFAULT_LANG)),
      },
    },
    openGraph: {
      type: "website",
      siteName: "Mavj Quiz",
      title,
      description,
      url,
      locale: LANGUAGES.find((l) => l.code === lang).ogLocale,
    },
  };
}

export function siteViewport(operator) {
  return { themeColor: getSite(operator).theme.accent };
}

/** Структурированные данные: название сайта и варианты написания — для поиска по «Мавч», «Мавҷ», «Mavj» */
function siteJsonLd(lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mavj Quiz",
    alternateName: ["Мавч", "Мавҷ", "Mavj", "Мавч Quiz"],
    url: absoluteUrl(sitePath(null, lang)),
    inLanguage: lang,
  };
}

export function SitePage({ operator, lang }) {
  return (
    <I18nProvider lang={lang} messages={MESSAGES[lang]}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd(lang)) }}
      />
      <QuizPage operator={getSite(operator)} builtAt={new Date().toISOString()} />
    </I18nProvider>
  );
}
