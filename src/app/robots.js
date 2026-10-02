import { absoluteUrl } from "@/config/site";

export const dynamic = "force-static";

/* Если собрать с NEXT_PUBLIC_BASE_PATH (например /test), robots.txt ляжет в /test/robots.txt — поисковики его там не увидят.
   В корне домена (по умолчанию) всё работает */
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
