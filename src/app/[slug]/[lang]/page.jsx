import { SitePage, siteMetadata, siteViewport } from "@/lib/sitePage";
import { OPERATOR_SLUGS } from "@/config/operators";
import { EXTRA_LANGS } from "@/i18n/config";

/* /tcell/tg/, /tcell/en/ — оператор на другом языке */

export const dynamicParams = false;

export function generateStaticParams() {
  return OPERATOR_SLUGS.flatMap((slug) => EXTRA_LANGS.map((lang) => ({ slug, lang })));
}

export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  return siteMetadata(slug, lang);
}

export async function generateViewport({ params }) {
  const { slug } = await params;
  return siteViewport(slug);
}

export default async function Page({ params }) {
  const { slug, lang } = await params;
  return <SitePage operator={slug} lang={lang} />;
}
