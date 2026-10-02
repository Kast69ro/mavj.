/** Домен и путь, под которым лежит сайт. Меняются через .env при сборке. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mavj.tj";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Абсолютный URL страницы: absoluteUrl("/tcell/en/") → https://mavj.tj/tcell/en/ */
export const absoluteUrl = (path = "/") => `${SITE_URL}${BASE_PATH}${path}`;
