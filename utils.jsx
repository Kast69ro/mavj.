
import {
  Smartphone,
  MessageSquareText,
  Star,
  Trophy,
  UserCheck,
  Timer,
  RotateCcw,
  Zap,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "./src/i18n";

/* ─────────────────────────────────────────
   РЕГЛАМЕНТЫ ПО ОПЕРАТОРАМ
───────────────────────────────────────── */
export const REGULATIONS = [
  {
    id: "bm",
    label: "Babilon",
    href: "/Rules-BM.pdf",
    className: "bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#ca8a04]",
  },
  {
    id: "mg",
    label: "Megafon",
    href: "/Rules-MG.pdf",
    className: "bg-[#22c55e] hover:bg-[#16a34a] active:bg-[#16a34a]",
  },
  {
    id: "tc",
    label: "Tcell",
    href: "/Rules-TC.pdf",
    className: "bg-[#7B2D8E] hover:bg-[#65247A] active:bg-[#65247A]",
  },
];

/* ─────────────────────────────────────────
   EMAILJS
   (лучше перенести в .env: import.meta.env.VITE_EMAILJS_PUBLIC_KEY и т.д.)
───────────────────────────────────────── */
export const EMAILJS_PUBLIC_KEY = "Zt-8PKYSygAWj0S3V";
export const EMAILJS_SERVICE_ID = "service_lsibncc";
export const EMAILJS_TEMPLATE_ID = "template_ptuzsdo";

/* ─────────────────────────────────────────
   ПРАВИЛА НАЧИСЛЕНИЯ — единый источник правды
───────────────────────────────────────── */
export const THRESHOLDS = { first: 2000, second: 1800, third: 1000 };
export const QUESTIONS_PER_DAY = 14;
export const MAX_POINTS_PER_DAY = 115;
export const SUBSCRIBE_TEL = "tel:*3033*1%23";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
// TODO: заменить на запрос к API
export const SCORES = {
  901234567: 1245,
  935556677: 720,
  917654321: 1890,
  981234567: 85,
};

export const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/* Тексты всех списков ниже — в src/i18n/locales/*.json, здесь только ключи и структура */
export const NAV_LINKS = [
  { href: "#prizes", key: "prizes" },
  { href: "#how", key: "how" },
  { href: "#check", key: "check" },
  { href: "#winners", key: "winners" },
  { href: "#tariff", key: "tariff" },
];

export const STATS = [
  { key: "perDay", value: "1,60", currency: true },
  { key: "questions", value: String(QUESTIONS_PER_DAY) },
  { key: "maxPoints", value: String(MAX_POINTS_PER_DAY) },
];

/* какое устройство рисовать для места: ключ из DEVICES ниже */
export const PLACE_DEVICE = { 1: "iphone", 2: "watch", 3: "airpods" };

export const PRIZES = [
  { place: 1, name: "iPhone 17 Pro Max", pts: THRESHOLDS.first },
  { place: 2, name: "Apple Watch Series 11", pts: THRESHOLDS.second },
  { place: 3, name: "AirPods 4 ANC", pts: THRESHOLDS.third },
];

export const HOW_STEPS = [
  { Icon: Smartphone, key: "subscribe" },
  { Icon: MessageSquareText, key: "answer" },
  { Icon: Star, key: "collect" },
  { Icon: Trophy, key: "prize" },
];

// TODO: заменить на данные с бэкенда по месяцу
export const WINNERS = [
  { place: 1, phone: "+992 90 *** 78XX", pts: 2145, prize: "iPhone 17 Pro Max" },
  { place: 2, phone: "+992 93 *** 44XX", pts: 1890, prize: "Apple Watch Series 11" },
  { place: 3, phone: "+992 98 *** 12XX", pts: 1023, prize: "AirPods 4 ANC" },
];

export const TARIFFS = [
  { key: "basic", featured: false, price: "1,60" },
  { key: "extra", featured: true, price: "0,90" },
];

export const RULES = [
  { Icon: UserCheck, key: "oneNumber" },
  { Icon: Timer, key: "timer" },
  { Icon: RotateCcw, key: "reset" },
  { Icon: Zap, key: "jackpot" },
  { Icon: ShieldCheck, key: "antifraud" },
  { Icon: LogOut, key: "stop" },
];

export const EMPTY_CONTACT_FORM = { from_name: "", phone: "", reply_to: "", message: "" };

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
export const fmt = (n) => n.toLocaleString("ru-RU");

/** Номер → 9 цифр без +992, или null если номер некорректный */
export const normalizePhone = (raw) => {
  const digits = raw.replace(/\D/g, "").replace(/^992/, "");
  return digits.length === 9 ? digits : null;
};

/** Баллы → данные для карточки результата (textKey + left — для t()) */
export const getScoreResult = (pts) => {
  const pct = Math.min(100, Math.round((pts / THRESHOLDS.first) * 100));
  let textKey;
  if (pts >= THRESHOLDS.first) textKey = "check.result.first";
  else if (pts >= THRESHOLDS.second) textKey = "check.result.second";
  else if (pts >= THRESHOLDS.third) textKey = "check.result.third";
  else textKey = "check.result.left";
  return { pts, pct, textKey, left: THRESHOLDS.third - pts };
};

/** Валидация формы связи → { поле: true } для полей с ошибкой (пустой, если всё ок).
    Текст ошибки — t(`contact.errors.${поле}`) */
export const validateContact = (form) => {
  const errs = {};
  if (!form.from_name.trim()) errs.from_name = true;
  if (form.phone.replace(/\D/g, "").length < 9) errs.phone = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reply_to.trim())) errs.reply_to = true;
  if (!form.message.trim()) errs.message = true;
  return errs;
};

/** Данные регламентов из API + локальный конфиг REGULATIONS → список ссылок */
export const mapRegulations = (data, fallbackLabel) =>
  Array.isArray(data)
    ? data
        .map((reg) => {
          const key = String(reg.operator ?? reg.id ?? "").toLowerCase();
          const config = REGULATIONS.find((r) =>
            [r.id, r.label].map((v) => String(v ?? "").toLowerCase()).includes(key),
          );
          return {
            ...reg,
            label: reg.label ?? config?.label ?? reg.operator ?? fallbackLabel,
            url: reg.url ?? reg.href ?? reg.file ?? config?.href ?? "#",
            className: config?.className ?? "bg-[var(--accent)] hover:bg-[var(--accent-hover)]",
          };
        })
        .filter((reg) => reg.url && reg.url !== "#")
    : [];

/** Плавный скролл к якорю */
export const scrollToId = (href) =>
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

/* ─────────────────────────────────────────
   СТИЛИ (цвета, анимации) — вставьте <QuizStyles /> один раз в корень страницы
───────────────────────────────────────── */
const QUIZ_CSS = `
:root {
  --ink: #0b1430;
  --muted: #4f626c;
  --surface: #f5f7fa;
  --line: rgba(11, 31, 42, 0.1);
  --accent: #1d4ed8;
  --accent-hover: #1e3fae;
  --accent-soft: #e6ecfd;
  --accent-on-dark: #6b9bff;
  --deep: #0a1433;
}

html {
  scroll-behavior: smooth;
}

@keyframes mq-up   { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes mq-pop  { from { opacity: 0; transform: scale(0.97); }     to { opacity: 1; transform: none; } }
@keyframes mq-down { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }

.mq-a0   { animation: mq-up 0.6s ease both; }
.mq-a1   { animation: mq-up 0.6s 0.1s ease both; }
.mq-a2   { animation: mq-up 0.6s 0.2s ease both; }
.mq-a3   { animation: mq-up 0.6s 0.3s ease both; }
.mq-pop  { animation: mq-pop 0.25s ease both; }
.mq-down { animation: mq-down 0.2s ease both; }
.mq-bar  { transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
`;

export function QuizStyles() {
  return <style>{QUIZ_CSS}</style>;
}


/* ─────────────────────────────────────────
   SVG DEVICES
───────────────────────────────────────── */
const deviceCls =
  "block mx-auto transition-transform duration-500 ease-out group-hover:-translate-y-2";
const deviceShadow = { filter: "drop-shadow(0 24px 40px rgba(11,31,42,0.18))" };
const font = "Onest, sans-serif";

export function IPhoneSVG({ className = "w-[150px] md:w-[180px]" }) {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 190 380" className={`${deviceCls} ${className}`} style={deviceShadow}>
      <rect x="5" y="3" width="180" height="374" rx="46" fill="#24343c" />
      <rect x="7" y="5" width="176" height="370" rx="44" fill="#0b1f2a" />
      <rect x="9" y="7" width="172" height="366" rx="42" fill="url(#mq-screen)" />
      <rect x="68" y="20" width="54" height="14" rx="7" fill="#000" />
      <text x="26" y="44" fontFamily={font} fontSize="9" fill="white" fontWeight="600">9:41</text>
      <rect x="18" y="60" width="154" height="72" rx="14" fill="rgba(255,255,255,0.08)" />
      <text x="95" y="84" fontFamily={font} fontSize="8.5" fill="rgba(255,255,255,0.9)" textAnchor="middle" fontWeight="700">{t("phoneMock.question")}</text>
      <text x="95" y="100" fontFamily={font} fontSize="8" fill="rgba(255,255,255,0.75)" textAnchor="middle">{t("phoneMock.text")}</text>
      <text x="95" y="117" fontFamily={font} fontSize="7" fill="rgba(255,255,255,0.55)" textAnchor="middle">{t("phoneMock.timer")}</text>
      <rect x="18" y="142" width="154" height="30" rx="10" fill="#1d4ed8" />
      <text x="95" y="161" fontFamily={font} fontSize="9" fill="white" textAnchor="middle" fontWeight="700">{t("phoneMock.a1")}</text>
      <rect x="18" y="178" width="154" height="28" rx="10" fill="rgba(255,255,255,0.08)" />
      <text x="95" y="196" fontFamily={font} fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">{t("phoneMock.a2")}</text>
      <rect x="18" y="212" width="154" height="28" rx="10" fill="rgba(255,255,255,0.08)" />
      <text x="95" y="230" fontFamily={font} fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">{t("phoneMock.a3")}</text>
      <text x="18" y="260" fontFamily={font} fontSize="7" fill="rgba(255,255,255,0.6)">{t("phoneMock.points")}</text>
      <rect x="18" y="266" width="154" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
      <rect x="18" y="266" width="96" height="5" rx="2.5" fill="#6b9bff" />
      <text x="18" y="288" fontFamily={font} fontSize="13" fill="white" fontWeight="800">1 245</text>
      <text x="172" y="288" fontFamily={font} fontSize="7" fill="rgba(255,255,255,0.6)" textAnchor="end">{t("phoneMock.of")}</text>
      <rect x="75" y="355" width="40" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="185" y="95" width="5" height="50" rx="2.5" fill="#24343c" />
      <rect x="0" y="110" width="5" height="34" rx="2.5" fill="#24343c" />
      <rect x="0" y="152" width="5" height="34" rx="2.5" fill="#24343c" />
      <defs>
        <linearGradient id="mq-screen" x1="9" y1="7" x2="9" y2="373" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1e3a8a" />
          <stop offset=".5" stopColor="#0d1840" />
          <stop offset="1" stopColor="#071820" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WatchSVG({ className = "w-[96px] md:w-[110px]" }) {
  return (
    <svg viewBox="0 0 130 210" className={`${deviceCls} ${className}`} style={deviceShadow}>
      <rect x="40" y="0" width="50" height="34" rx="8" fill="#3a4a52" />
      <rect x="40" y="176" width="50" height="34" rx="8" fill="#3a4a52" />
      <rect x="14" y="26" width="102" height="158" rx="26" fill="#24343c" />
      <rect x="19" y="31" width="92" height="148" rx="21" fill="#0b1f2a" />
      <rect x="24" y="40" width="82" height="130" rx="16" fill="url(#mq-watch)" />
      <text x="65" y="92" fontFamily={font} fontSize="22" fontWeight="800" fill="white" textAnchor="middle">10:09</text>
      <path d="M40 128 Q46 118 52 128 T64 128 T76 128 T88 128" stroke="#6b9bff" strokeWidth="2" fill="none" />
      <rect x="112" y="70" width="5" height="28" rx="2.5" fill="#3a4a52" />
      <defs>
        <linearGradient id="mq-watch" x1="24" y1="40" x2="24" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1e3a8a" />
          <stop offset="1" stopColor="#071820" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AirPodsSVG({ className = "w-[84px] md:w-[96px]" }) {
  return (
    <svg viewBox="0 0 120 200" className={`${deviceCls} ${className}`} style={deviceShadow}>
      <rect x="16" y="38" width="88" height="140" rx="22" fill="#dfe6e5" />
      <rect x="18" y="40" width="84" height="136" rx="20" fill="#f7faf9" />
      <rect x="26" y="84" width="68" height="2" rx="1" fill="#cfd8d7" />
      <ellipse cx="40" cy="62" rx="12" ry="18" fill="#e3eae9" />
      <ellipse cx="40" cy="62" rx="9" ry="14" fill="white" />
      <ellipse cx="80" cy="62" rx="12" ry="18" fill="#e3eae9" />
      <ellipse cx="80" cy="62" rx="9" ry="14" fill="white" />
      <circle cx="60" cy="152" r="3.5" fill="#1d4ed8" />
    </svg>
  );
}

export const DEVICES = { iphone: IPhoneSVG, watch: WatchSVG, airpods: AirPodsSVG };

/** Устройство для призового места (1 → iPhone, 2 → Watch, 3 → AirPods) */
export function PlaceDevice({ place, className }) {
  const Device = DEVICES[PLACE_DEVICE[place]];
  return Device ? <Device className={className} /> : null;
}

/* Волна — фирменный мотив «Мавҷ» */
export function Wave({ fill = "#ffffff", flip = false }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className={`block w-full h-[40px] md:h-[60px] ${flip ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M0 30 C 240 0 480 60 720 30 C 960 0 1200 60 1440 30 L1440 60 L0 60 Z" style={{ fill }} />
    </svg>
  );
}

/* ─────────────────────────────────────────
   UI PRIMITIVES
───────────────────────────────────────── */
export function Eyebrow({ children, dark }) {
  return (
    <p className={`text-xs font-bold tracking-[0.12em] uppercase mb-3 ${dark ? "text-[var(--accent-on-dark)]" : "text-[var(--accent)]"}`}>
      {children}
    </p>
  );
}

export function SectionTitle({ children, dark, className = "" }) {
  return (
    <h2
      className={`font-extrabold tracking-[-0.03em] leading-[1.1] ${dark ? "text-white" : "text-[var(--ink)]"} ${className}`}
      style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)" }}
    >
      {children}
    </h2>
  );
}

/** Заголовок секции: надзаголовок + h2 (+ необязательный подзаголовок) */
export function SectionHeader({ eyebrow, title, subtitle, dark, className = "text-center mb-10 md:mb-14" }) {
  return (
    <div className={className}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <SectionTitle dark={dark}>{title}</SectionTitle>
      {subtitle && (
        <p className={`mt-3 max-w-[520px] mx-auto leading-relaxed ${dark ? "text-white/70" : "text-[var(--muted)]"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function PrimaryButton({ href, children, className = "" }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold no-underline px-6 py-3.5 text-base transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${className}`}
    >
      {children}
    </a>
  );
}

export function ContactField({ label, name, type = "text", value, onChange, multiline, error, inputMode, autoComplete }) {
  const base =
    "w-full bg-white/[0.06] border rounded-xl px-4 py-3 text-base text-white placeholder-white/40 outline-none transition-colors duration-150 focus:bg-white/[0.1]";
  const border = error ? "border-red-400/70 focus:border-red-400" : "border-white/15 focus:border-[var(--accent-on-dark)]";
  const id = `cf-${name}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold tracking-[0.08em] uppercase text-white/70">
        {label}
      </label>
      {multiline ? (
        <textarea id={id} name={name} value={value} onChange={onChange} rows={3} className={`${base} ${border} resize-none`} />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={`${base} ${border}`}
        />
      )}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}

export function WinnerCard({ w }) {
  const { t } = useTranslation();
  return (
    <article className="group rounded-3xl bg-white border border-[var(--line)] p-6 flex items-center gap-5">
      <div className="w-[72px] h-[110px] shrink-0 flex items-end justify-center">
        <PlaceDevice place={w.place} className={w.place === 1 ? "w-[56px]" : w.place === 2 ? "w-[52px]" : "w-[48px]"} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-[0.1em] uppercase text-[var(--accent)] mb-1">
          {t("place", { place: w.place })}
        </p>
        <p className="text-lg font-extrabold tracking-wide whitespace-nowrap">{w.phone}</p>
        <p className="text-sm text-[var(--muted)]">{t("points", { count: w.pts, value: fmt(w.pts) })}</p>
        <p className="text-sm font-bold mt-2">{w.prize}</p>
      </div>
    </article>
  );
}

/** Переключатель языка RU / TJ / EN */
export function LanguageSwitcher({ className = "" }) {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage;
  return (
    <div role="group" aria-label={t("lang.label")} className={`inline-flex rounded-full bg-[var(--surface)] p-0.5 ${className}`}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={current === code}
          className={`rounded-full border-none cursor-pointer px-2.5 py-1 text-xs font-bold transition-colors ${
            current === code ? "bg-white text-[var(--ink)] shadow-sm" : "bg-transparent text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
          style={{ fontFamily: "inherit" }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
