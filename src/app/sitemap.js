import { OPERATOR_SLUGS } from "@/config/operators";
import { LANGUAGES, sitePath } from "@/i18n/config";
import { absoluteUrl } from "@/config/site";

export const dynamic = "force-static";

/** Основной сайт + каждый оператор, все языки со ссылками друг на друга */
export default function sitemap() {
  const lastModified = new Date();
  return [null, ...OPERATOR_SLUGS].flatMap((operator) => {
    const languages = Object.fromEntries(
      LANGUAGES.map(({ code }) => [code, absoluteUrl(sitePath(operator, code))]),
    );
    return LANGUAGES.map(({ code }) => ({
      url: absoluteUrl(sitePath(operator, code)),
      lastModified,
      alternates: { languages },
    }));
  });
}
