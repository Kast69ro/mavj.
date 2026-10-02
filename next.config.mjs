/**
 * Статическая сборка: `npm run build` кладёт готовый сайт в out/.
 * Содержимое out/ выкладывается в корень сайта. Для подпапки: NEXT_PUBLIC_BASE_PATH=/test npm run build
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
