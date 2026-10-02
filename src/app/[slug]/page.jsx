import { SitePage, siteMetadata, siteViewport, resolveSlug, FIRST_SEGMENTS } from "@/lib/sitePage";

/* /tcell/ — оператор на русском; /tg/, /en/ — основной сайт на другом языке */

export const dynamicParams = false;

export function generateStaticParams() {
  return FIRST_SEGMENTS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { operator, lang } = resolveSlug((await params).slug);
  return siteMetadata(operator, lang);
}

export async function generateViewport({ params }) {
  const { operator } = resolveSlug((await params).slug);
  return siteViewport(operator);
}

export default async function Page({ params }) {
  const { operator, lang } = resolveSlug((await params).slug);
  return <SitePage operator={operator} lang={lang} />;
}
