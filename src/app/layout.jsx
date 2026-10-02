import { Onest } from "next/font/google";
import { SITE_URL } from "@/config/site";
import "./globals.css";

/* Onest: кириллица, включая таджикские ҷ ӣ ӯ ҳ қ ғ. Шрифт скачивается при сборке и раздаётся с нашего сервера */
const onest = Onest({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Mavj Quiz",
};

/* lang="ru" по умолчанию; на страницах tg/en его меняет I18nProvider */
export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={onest.variable}>
      <body>{children}</body>
    </html>
  );
}
