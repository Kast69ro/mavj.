import { SitePage, siteMetadata, siteViewport } from "@/lib/sitePage";
import { DEFAULT_LANG } from "@/i18n/config";

/* Основной сайт на русском: / */

export const metadata = siteMetadata(null, DEFAULT_LANG);
export const viewport = siteViewport(null);

export default function Page() {
  return <SitePage operator={null} lang={DEFAULT_LANG} />;
}
