import { useState, useRef, useEffect } from "react";
import { Select, MenuItem } from "@mui/material";
import emailjs from "@emailjs/browser";

import { FileText } from "lucide-react";
import { REGULATIONS } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchRules } from "./features/reglament/reglament";

/* ─────────────────────────────────────────
   EMAILJS CONFIG
───────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY = "Zt-8PKYSygAWj0S3V";
const EMAILJS_SERVICE_ID = "service_lsibncc";
const EMAILJS_TEMPLATE_ID = "template_ptuzsdo";

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const SCORES = {
  901234567: 1245,
  935556677: 720,
  917654321: 1890,
  981234567: 85,
};
const MONTHS = [
  { value: "january", label: "Январь " },
  { value: "february", label: "Февраль " },
  { value: "march", label: "Март " },
  { value: "april", label: "Апрель " },
  { value: "may", label: "Май " },
  { value: "june", label: "Июнь " },
  { value: "july", label: "Июль" },
  { value: "august", label: "Август " },
  { value: "september", label: "Сентябрь " },
  { value: "october", label: "Октябрь " },
  { value: "november", label: "Ноябрь " },
  { value: "december", label: "Декабрь " },
];

const NAV_LINKS = [
  { href: "#check", label: "Баллы" },
  { href: "#prizes", label: "Призы" },
  { href: "#how", label: "Участие" },
  { href: "#tariff", label: "Тарифы" },
];

const STATS = [
  { value: "1.60", label: "сом в день" },
  { value: "115", label: "баллов макс./день" },
  { value: "14", label: "вопросов в день" },
];

const PRIZES = [
  {
    place: "1 место",
    icon: "📱",
    name: "iPhone 17\nPro Max",
    pts: "> 2 000 баллов",
  },
  {
    place: "2 место",
    icon: "⌚",
    name: "Apple Watch\nSeries 11",
    pts: "> 1 800 баллов",
  },
  {
    place: "3 место",
    icon: "🎧",
    name: "AirPods 4\nActive Noise",
    pts: "> 1000 баллов",
  },
];

const HOW_STEPS = [
  {
    n: "Шаг 01",
    icon: "📨",
    title: "Подпишитесь",
    desc: "1,60 сом в день. Для всех операторов Таджикистана.",
  },
  {
    n: "Шаг 02",
    icon: "❓",
    title: "Отвечайте",
    desc: "До 14 вопросов в день. +9 за 90 дирам в доп. пакете.",
  },
  {
    n: "Шаг 03",
    icon: "⭐",
    title: "Копите баллы",
    desc: "5–10 баллов за ответ. Максимум 115 в день.",
  },
  {
    n: "Шаг 04",
    icon: "🏆",
    title: "Забирайте приз",
    desc: "Топ-3 в конце месяца получают настоящие Apple-устройства.",
  },
];

const WINNERS = [
  {
    medal: "🥇",
    phone: "+992 90 *** 78XX",
    pts: "2 145 баллов",
    prize: "📱 iPhone 17 Pro Max",
    dark: false,
  },
  {
    medal: "🥈",
    phone: "+992 93 *** 44XX",
    pts: "1 890 баллов",
    prize: "⌚ Apple Watch",
    dark: false,
  },
  {
    medal: "🥉",
    phone: "+992 98 *** 12XX",
    pts: "1 023 балла",
    prize: "🎧 AirPods 4",
    dark: false,
  },
];

const TARIFFS = [
  {
    light: true,
    tag: "Базовая подписка",
    price: "1.60",
    per: "сом в день",
    items: [
      "5 вопросов каждый день",
      "5 баллов за правильный ответ",
      "До 25 баллов в день",
      "Участие в ежемесячном розыгрыше",
    ],
  },
  {
    light: false,
    tag: "Доп. пакет",
    price: "0.90",
    per: "сом / день (по запросу)",
    items: [
      "+9 дополнительных вопросов",
      "10 баллов за правильный ответ",
      "+90 баллов в день",
      "Только с подтверждением",
    ],
  },
];

const RULES = [
  {
    icon: "📱",
    title: "1 номер = 1 участник",
    desc: "Каждый номер регистрируется один раз. Мультиаккаунты запрещены.",
  },
  {
    icon: "⏱️",
    title: "1 минута на ответ",
    desc: "Таймер запускается при получении вопроса 2-го вопроса. Первый ответ принимается.",
  },
  {
    icon: "🔄",
    title: "Сброс 1-го числа",
    desc: "Сброс каждые 3 месяца.",
  },
  {
    icon: "⚡",
    title: "Джекпот",
    desc: "Если порог не набран — приз переходит в следующий розыгрышь.",
  },
  {
    icon: "🛡️",
    title: "Антифрод",
    desc: "Боты выявляются автоматически. Нарушитель дисквалифицируется.",
  },
  {
    icon: "🚪",
    title: "Отписка: STOP",
    desc: "Отправьте STOP на номер оператора для отключения в любой момент.",
  },
];

/* ─────────────────────────────────────────
   SVG DEVICES — без фиксированных width/height,
   тянутся через CSS
───────────────────────────────────────── */
function WatchSVG() {
  return (
    <svg
      viewBox="0 0 130 210"
      className="block mx-auto w-[90px] sm:w-[110px] md:w-[130px] transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-2.5"
      style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.14))" }}
    >
      <rect x="48" y="4" width="34" height="10" rx="3.5" fill="#aeaeb2" />
      <rect x="48" y="196" width="34" height="10" rx="3.5" fill="#aeaeb2" />
      <rect x="14" y="26" width="102" height="158" rx="26" fill="#1c1c1e" />
      <rect x="17" y="29" width="96" height="152" rx="23" fill="#2c2c2e" />
      <rect x="19" y="31" width="92" height="148" rx="21" fill="#111" />
      <rect x="24" y="40" width="82" height="130" rx="16" fill="url(#wgrad)" />
      <text
        x="65"
        y="88"
        fontFamily="sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
      >
        10:09
      </text>
      <text
        x="65"
        y="105"
        fontFamily="sans-serif"
        fontSize="7"
        fill="rgba(255,255,255,0.45)"
        textAnchor="middle"
      >
        ПТ, 4 МАР 2026
      </text>
      <path
        d="M42 128 Q46 119 50 128 Q54 119 58 131 Q62 119 66 128 Q70 119 74 128 Q78 119 82 128 Q86 119 88 128"
        stroke="#ff375f"
        strokeWidth="1.8"
        fill="none"
      />
      <rect x="112" y="70" width="5" height="28" rx="2.5" fill="#3a3a3c" />
      <defs>
        <linearGradient
          id="wgrad"
          x1="24"
          y1="40"
          x2="24"
          y2="170"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#1a3888" stopOpacity=".55" />
          <stop offset="1" stopColor="#03071e" stopOpacity=".85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IPhoneSVG() {
  return (
    <svg
      viewBox="0 0 190 380"
      className="block mx-auto w-[140px] sm:w-[165px] md:w-[190px] transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-2.5"
      style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.14))" }}
    >
      <rect x="5" y="3" width="180" height="374" rx="46" fill="#2c2c2e" />
      <rect x="7" y="5" width="176" height="370" rx="44" fill="#1c1c1e" />
      <rect x="9" y="7" width="172" height="366" rx="42" fill="url(#sgrad)" />
      <rect x="68" y="20" width="54" height="14" rx="7" fill="#000" />
      <text
        x="26"
        y="44"
        fontFamily="sans-serif"
        fontSize="9"
        fill="white"
        fontWeight="600"
      >
        9:41
      </text>
      <rect
        x="18"
        y="60"
        width="154"
        height="72"
        rx="14"
        fill="rgba(255,255,255,0.07)"
      />
      <text
        x="95"
        y="84"
        fontFamily="sans-serif"
        fontSize="8.5"
        fill="rgba(255,255,255,0.85)"
        textAnchor="middle"
        fontWeight="600"
      >
        Вопрос 12 из 15
      </text>
      <text
        x="95"
        y="100"
        fontFamily="sans-serif"
        fontSize="7.5"
        fill="rgba(255,255,255,0.45)"
        textAnchor="middle"
      >
        Столица Таджикистана?
      </text>
      <text
        x="95"
        y="117"
        fontFamily="sans-serif"
        fontSize="7"
        fill="rgba(255,255,255,0.3)"
        textAnchor="middle"
      >
        ⏱ 12:34 осталось
      </text>
      <rect
        x="18"
        y="142"
        width="154"
        height="30"
        rx="10"
        fill="rgba(0,113,227,0.75)"
      />
      <text
        x="95"
        y="161"
        fontFamily="sans-serif"
        fontSize="9"
        fill="white"
        textAnchor="middle"
        fontWeight="500"
      >
        ✓ Душанбе
      </text>
      <rect
        x="18"
        y="178"
        width="154"
        height="28"
        rx="10"
        fill="rgba(255,255,255,0.06)"
      />
      <text
        x="95"
        y="196"
        fontFamily="sans-serif"
        fontSize="9"
        fill="rgba(255,255,255,0.5)"
        textAnchor="middle"
      >
        Худжанд
      </text>
      <rect
        x="18"
        y="212"
        width="154"
        height="28"
        rx="10"
        fill="rgba(255,255,255,0.06)"
      />
      <text
        x="95"
        y="230"
        fontFamily="sans-serif"
        fontSize="9"
        fill="rgba(255,255,255,0.5)"
        textAnchor="middle"
      >
        Хорог
      </text>
      <text
        x="18"
        y="260"
        fontFamily="sans-serif"
        fontSize="7"
        fill="rgba(255,255,255,0.35)"
      >
        Баллы в этом месяце
      </text>
      <rect
        x="18"
        y="266"
        width="154"
        height="5"
        rx="2.5"
        fill="rgba(255,255,255,0.07)"
      />
      <rect x="18" y="266" width="105" height="5" rx="2.5" fill="url(#pgrad)" />
      <text
        x="18"
        y="288"
        fontFamily="sans-serif"
        fontSize="13"
        fill="white"
        fontWeight="700"
      >
        1 245
      </text>
      <text
        x="163"
        y="288"
        fontFamily="sans-serif"
        fontSize="7"
        fill="rgba(255,255,255,0.35)"
        textAnchor="end"
      >
        из 1 800
      </text>
      <rect
        x="75"
        y="355"
        width="40"
        height="4"
        rx="2"
        fill="rgba(255,255,255,0.2)"
      />
      <rect x="185" y="95" width="5" height="50" rx="2.5" fill="#3a3a3c" />
      <rect x="185" y="154" width="5" height="34" rx="2.5" fill="#3a3a3c" />
      <rect x="0" y="104" width="5" height="24" rx="2.5" fill="#3a3a3c" />
      <rect x="0" y="135" width="5" height="42" rx="2.5" fill="#3a3a3c" />
      <rect x="0" y="184" width="5" height="42" rx="2.5" fill="#3a3a3c" />
      <defs>
        <linearGradient
          id="sgrad"
          x1="9"
          y1="7"
          x2="9"
          y2="373"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#1a3888" stopOpacity=".4" />
          <stop offset=".45" stopColor="#0d1840" stopOpacity=".35" />
          <stop offset="1" stopColor="#000" stopOpacity=".65" />
        </linearGradient>
        <linearGradient
          id="pgrad"
          x1="18"
          y1="0"
          x2="172"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0071e3" />
          <stop offset="1" stopColor="#34aadc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AirPodsSVG() {
  return (
    <svg
      viewBox="0 0 120 200"
      className="block mx-auto w-[80px] sm:w-[100px] md:w-[120px] transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-2.5"
      style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.14))" }}
    >
      <rect x="16" y="38" width="88" height="140" rx="22" fill="#e8e8ea" />
      <rect x="18" y="40" width="84" height="136" rx="20" fill="#f5f5f7" />
      <rect x="26" y="84" width="68" height="2" rx="1" fill="#d4d4d6" />
      <ellipse cx="40" cy="62" rx="12" ry="18" fill="#e0e0e2" />
      <ellipse cx="40" cy="62" rx="9" ry="14" fill="white" />
      <ellipse cx="40" cy="71" rx="3.5" ry="5.5" fill="#d4d4d6" />
      <circle cx="40" cy="57" r="1.8" fill="#c7c7cc" />
      <ellipse cx="80" cy="62" rx="12" ry="18" fill="#e0e0e2" />
      <ellipse cx="80" cy="62" rx="9" ry="14" fill="white" />
      <ellipse cx="80" cy="71" rx="3.5" ry="5.5" fill="#d4d4d6" />
      <circle cx="80" cy="57" r="1.8" fill="#c7c7cc" />
      <circle cx="60" cy="152" r="3.5" fill="#34c759" opacity=".85" />
      <rect x="50" y="172" width="20" height="4" rx="2" fill="#d4d4d6" />
      <rect
        x="26"
        y="40"
        width="84"
        height="8"
        rx="20"
        fill="rgba(255,255,255,0.6)"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────
   CONTACT FIELD
───────────────────────────────────────── */
function ContactField({
  label,
  name,
  type = "text",
  value,
  onChange,
  multiline,
  error,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.67rem] font-semibold tracking-[0.1em] uppercase text-white/30">
        {label}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={3}
          placeholder={label}
          className={`bg-white/[0.06] border rounded-[10px] px-3.5 py-2.5 text-[0.85rem] text-white placeholder-white/20 outline-none resize-none transition-all duration-150 focus:bg-white/[0.09]
            ${error ? "border-red-500/60 focus:border-red-500" : "border-white/[0.08] focus:border-white/25"}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
          className={`bg-white/[0.06] border rounded-[10px] px-3.5 py-2.5 text-[0.85rem] text-white placeholder-white/20 outline-none transition-all duration-150 focus:bg-white/[0.09]
            ${error ? "border-red-500/60 focus:border-red-500" : "border-white/[0.08] focus:border-white/25"}`}
        />
      )}
      {error && <span className="text-[0.7rem] text-red-400">{error}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function SMSQuiz() {
  const formRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [fillWidth, setFillWidth] = useState(0);
  const [form, setForm] = useState({
    from_name: "",
    phone: "",
    reply_to: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("idle");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);

  const { data } = useSelector((state) => state.rules);
  const dispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState("april");

  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.from_name.trim()) errs.from_name = "Введите имя";
    if (!form.phone.trim()) errs.phone = "Введите телефон";
    if (
      !form.reply_to.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reply_to)
    )
      errs.reply_to = "Введите корректный email";
    if (!form.message.trim()) errs.message = "Введите сообщение";
    return errs;
  };

  const handleCheck = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) {
      alert("Введите корректный номер");
      return;
    }
    const pts = SCORES[digits] ?? Math.floor(Math.random() * 1500) + 50;
    const pct = Math.min(100, Math.round((pts / 1800) * 100));
    let status = "";
    if (pts >= 1800) status = "🥇 Вы претендуете на iPhone 17 Pro Max!";
    else if (pts >= 1600) status = "🥈 Вы претендуете на Apple Watch!";
    else if (pts >= 800) status = "🥉 Вы претендуете на AirPods 4!";
    else if (pts >= 600) status = "🎯 Вы в зоне призов — продолжайте!";
    else status = `До допуска: ещё ${600 - pts} баллов`;
    setResult({ pts, pct, status });
    setFillWidth(0);
    setTimeout(() => setFillWidth(pct), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus("loading");
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setStatus("success");
      setForm({ from_name: "", phone: "", reply_to: "", message: "" });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const regulationsList = Array.isArray(data)
    ? data
        .map((reg) => {
          const operatorKey = String(
            reg.operator ?? reg.id ?? "",
          ).toLowerCase();
          const config = REGULATIONS.find((r) => {
            const ids = [r.id, r.label].map((value) =>
              String(value ?? "").toLowerCase(),
            );
            return ids.includes(operatorKey);
          });

          return {
            ...reg,
            label: reg.label ?? config?.label ?? reg.operator ?? "Регламент",
            url: reg.url ?? reg.href ?? reg.file ?? config?.href ?? "#",
            className: config?.className ?? "bg-[#0071e3] hover:bg-[#0062d2]",
          };
        })
        .filter((reg) => reg.url && reg.url !== "#")
    : [];

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div
      className="bg-white text-[#1d1d1f] overflow-x-hidden"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        @keyframes au    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes popIn { from { opacity:0; transform:scale(.97); }      to { opacity:1; transform:scale(1); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        .anim-0   { animation: au .7s ease both; }
        .anim-1   { animation: au .7s .1s ease both; }
        .anim-2   { animation: au .7s .2s ease both; }
        .anim-3   { animation: au .7s .3s ease both; }
        .anim-4   { animation: au .7s .4s ease both; }
        .anim-pop { animation: popIn .25s ease both; }
        .anim-slide { animation: slideDown .2s ease both; }
        .rf-bar   { transition: width 1s cubic-bezier(.4,0,.2,1); }
      `}</style>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.08] bg-white/[0.82] backdrop-saturate-[180%] backdrop-blur-xl">
        <div className="h-12 px-5 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollTo("#hero")} // замените #hero на id вашей 1-й секции
          >
            <img src="/logo.png" alt="Mavj Quiz Logo" className="h-7 w-auto" />
            <span className="text-[1.1rem] font-bold tracking-tight">
              Mavj Quiz
            </span>
          </div>

          {/* Desktop nav */}
          <ul className="hidden md:flex list-none gap-0">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(href);
                  }}
                  className="text-[#6e6e73] hover:text-[#1d1d1f] no-underline text-[0.8rem] px-3 h-12 flex items-center transition-colors duration-150 cursor-pointer"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Burger button — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] bg-transparent border-none cursor-pointer p-0"
            aria-label="Меню"
          >
            <span
              className={`block w-5 h-[1.5px] bg-[#1d1d1f] transition-all duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-[#1d1d1f] transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-[#1d1d1f] transition-all duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="anim-slide md:hidden border-t border-black/[0.06] bg-white/[0.96] backdrop-blur-xl px-5 pb-3">
            {NAV_LINKS.map(({ href, label }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className="w-full text-left py-3 text-[0.9rem] font-medium text-[#1d1d1f] border-b border-black/[0.05] last:border-none bg-transparent border-x-0 border-t-0 cursor-pointer"
                style={{ fontFamily: "inherit" }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="text-center px-[5%] pt-[100px] md:pt-[148px] bg-white overflow-hidden"
      >
        <h1
          className="anim-1 font-extrabold tracking-[-0.045em] leading-[1.02] mb-4"
          style={{ fontSize: "clamp(2.6rem,7vw,5.5rem)" }}
        >
          Отвечай.
          <br />
          Побеждай.
        </h1>
        <p
          className="anim-2 font-light text-[#6e6e73] max-w-[520px] mx-auto mb-8 leading-[1.5]"
          style={{ fontSize: "clamp(0.95rem,2.5vw,1.35rem)" }}
        >
          Ежедневные вопросы по SMS. Набирай баллы и выигрывай Apple каждый
          месяц.
        </p>
        <div className="anim-3 flex gap-3 justify-center flex-wrap mb-12 md:mb-[72px]">
          <a
            href="tel:*3033*1%23"
            className="bg-[#0071e3] hover:bg-[#0077ed] hover:scale-[1.02] text-white no-underline rounded-full px-5 py-3 md:px-6 md:py-[13px] text-sm md:text-base font-semibold inline-flex items-center gap-1.5 transition-all duration-200"
          >
            Участвовать
          </a>
          <a
            href="#how"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#how");
            }}
            className="bg-transparent text-[#0071e3] border border-[rgba(0,113,227,0.35)] hover:border-[#0071e3] rounded-full px-5 py-3 md:px-6 md:py-[13px] text-sm md:text-base font-semibold no-underline transition-all duration-200 cursor-pointer"
          >
            Как участвовать
          </a>
        </div>

        {/* Devices — горизонтально на десктопе, вертикально на мобиле */}
        <div className="anim-4 flex flex-col items-center gap-8 md:flex-row md:justify-center md:items-end md:gap-8 pb-12 md:pb-0">
          {/* iPhone — на мобиле первый (главный приз) */}
          <div className="group text-center order-1 md:order-2">
            <IPhoneSVG />
            <p className="text-[0.88rem] font-semibold tracking-[-0.01em] mt-3.5 mb-0.5">
              iPhone 17 Pro Max
            </p>
            <p className="text-[0.75rem] text-[#86868b]">1-е место</p>
          </div>
          {/* Watch */}
          <div className="group text-center order-2 md:order-1">
            <WatchSVG />
            <p className="text-[0.88rem] font-semibold tracking-[-0.01em] mt-3.5 mb-0.5">
              Apple Watch Series 11
            </p>
            <p className="text-[0.75rem] text-[#86868b]">2-е место</p>
          </div>
          {/* AirPods */}
          <div className="group text-center order-3">
            <AirPodsSVG />
            <p className="text-[0.88rem] font-semibold tracking-[-0.01em] mt-3.5 mb-0.5">
              AirPods 4 Active Noise
            </p>
            <p className="text-[0.75rem] text-[#86868b]">3-е место</p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      {/* 2 колонки на мобиле, 4 — на десктопе */}
      <div className="bg-[#f5f5f7] border-t border-b border-black/[0.08] grid grid-cols-2 md:flex md:justify-center">
        {STATS.map(({ value, label }, i) => (
          <div
            key={label}
            className={`py-6 md:py-7 px-4 md:px-5 text-center md:flex-1 md:max-w-[220px] border-black/[0.08]
            ${i % 2 === 0 ? "border-r" : ""}
            ${i < 2 ? "border-b md:border-b-0" : ""}
            ${i < STATS.length - 1 ? "md:border-r" : ""}
          `}
          >
            <p className="text-[1.7rem] md:text-[2rem] font-bold tracking-[-0.03em] leading-none">
              {value}
            </p>
            <p className="text-[0.75rem] md:text-[0.78rem] text-[#86868b] mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── CHECK ── */}
      <section id="check" className="py-14 md:py-20 px-[5%] text-center">
        <p className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#0071e3] mb-2.5">
          Победители месяца
        </p>
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-3"
          style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)" }}
        >
          Топ-3 победителей
        </h2>
        <p className="text-[0.95rem] text-[#6e6e73] max-w-[600px] mx-auto mb-10 leading-[1.6] font-light">
          Награды за наибольшее количество баллов, накопленных в этом месяце.
        </p>

        {/* Desktop: 3 карточки рядом */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
          {WINNERS.map((winner, idx) => (
            <div
              key={idx}
              className={`rounded-[20px] p-6 text-center transition-all duration-300 ${
                winner.dark
                  ? "bg-[#1d1d1f] text-white"
                  : "bg-[#f5f5f7] text-[#1d1d1f]"
              }`}
            >
              <div className="text-5xl mb-4">{winner.medal}</div>
              <div className="w-full h-[200px] bg-gradient-to-br from-[#0071e3]/20 to-[#34aadc]/20 rounded-[12px] mb-4 flex items-center justify-center overflow-hidden">
                <div className="text-6xl">📱</div>
              </div>
              <p
                className={`text-sm font-semibold mb-2 ${winner.dark ? "text-white/60" : "text-[#6e6e73]"}`}
              >
                Номер телефона
              </p>
              <p
                className={`text-lg font-bold mb-3 ${winner.dark ? "text-white" : "text-[#1d1d1f]"}`}
              >
                {winner.phone}
              </p>
              <p
                className={`text-[0.9rem] font-semibold mb-3 ${winner.dark ? "text-[#0a84ff]" : "text-[#0071e3]"}`}
              >
                {winner.pts}
              </p>
              <p
                className={`text-[0.85rem] font-medium ${winner.dark ? "text-white/70" : "text-[#6e6e73]"}`}
              >
                {winner.prize}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: Слайдер */}
        <div className="md:hidden">
          <div className="max-w-[500px] mx-auto">
            {/* Карточка */}
            <div className="anim-pop rounded-[20px] p-6 bg-[#f5f5f7] text-center">
              <div className="text-5xl mb-4">
                {WINNERS[currentWinnerIndex].medal}
              </div>
              <div className="w-full h-[220px] bg-gradient-to-br from-[#0071e3]/20 to-[#34aadc]/20 rounded-[12px] mb-4 flex items-center justify-center overflow-hidden">
                <div className="text-6xl">📱</div>
              </div>
              <p className="text-sm font-semibold text-[#6e6e73] mb-2">
                Номер телефона
              </p>
              <p className="text-lg font-bold text-[#1d1d1f] mb-3">
                {WINNERS[currentWinnerIndex].phone}
              </p>
              <p className="text-[0.9rem] font-semibold text-[#0071e3] mb-3">
                {WINNERS[currentWinnerIndex].pts}
              </p>
              <p className="text-[0.85rem] font-medium text-[#6e6e73]">
                {WINNERS[currentWinnerIndex].prize}
              </p>
            </div>

            {/* Навигация слайдера */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() =>
                  setCurrentWinnerIndex((prev) =>
                    prev === 0 ? WINNERS.length - 1 : prev - 1,
                  )
                }
                className="w-10 h-10 rounded-full bg-[#f5f5f7] border border-black/[0.12] flex items-center justify-center cursor-pointer hover:bg-[#e8e8eb] transition-colors"
                style={{ fontFamily: "inherit" }}
              >
                ←
              </button>

              {/* Индикаторы точек */}
              <div className="flex gap-2">
                {WINNERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentWinnerIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentWinnerIndex
                        ? "bg-[#0071e3] w-6"
                        : "bg-black/[0.12]"
                    }`}
                    style={{ fontFamily: "inherit" }}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentWinnerIndex((prev) =>
                    prev === WINNERS.length - 1 ? 0 : prev + 1,
                  )
                }
                className="w-10 h-10 rounded-full bg-[#f5f5f7] border border-black/[0.12] flex items-center justify-center cursor-pointer hover:bg-[#e8e8eb] transition-colors"
                style={{ fontFamily: "inherit" }}
              >
                →
              </button>
            </div>

            {/* Текст позиции */}
            <p className="text-center text-sm text-[#6e6e73] mt-4">
              {currentWinnerIndex + 1} из {WINNERS.length}
            </p>
          </div>
        </div>
      </section>

      {/* ── PRIZES DARK ── */}
      <section
        id="prizes"
        className="bg-[#1d1d1f] py-14 md:py-20 px-[5%] text-center"
      >
        <p className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#2997ff] mb-2.5">
          Призы этого месяца
        </p>
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-3 text-white"
          style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)" }}
        >
          Выиграйте Apple.
        </h2>
        <p className="text-[0.95rem] text-white/55 max-w-[460px] mx-auto mb-10 leading-[1.6] font-light">
          Три победителя каждый месяц.
        </p>
        {/* Вертикально на мобиле, горизонтально на десктопе */}
        <div className="flex flex-col md:flex-row gap-px max-w-[860px] mx-auto bg-white/[0.07] rounded-[18px] overflow-hidden">
          {PRIZES.map((p) => (
            <div
              key={p.place}
              className="flex-1 py-8 md:py-10 px-6 bg-white/[0.04] hover:bg-white/[0.09] text-center transition-colors duration-200 relative after:content-[''] after:absolute after:top-0 after:left-[15%] after:right-[15%] after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.12] after:to-transparent"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.12em] uppercase text-white/35 mb-4 md:mb-5">
                {p.place}
              </p>
              <span className="text-[2.5rem] md:text-[3rem] block mb-3 md:mb-4">
                {p.icon}
              </span>
              <p className="text-base font-semibold text-white leading-[1.3] mb-3 md:mb-3.5 whitespace-pre-line">
                {p.name}
              </p>
              <span className="inline-block bg-white/[0.07] border border-white/[0.1] rounded-full px-3 py-1 text-[0.74rem] text-white/50">
                {p.pts}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW ── */}
      <section
        id="how"
        className="py-14 md:py-20 px-[5%] text-center bg-[#f5f5f7]"
      >
        <p className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#0071e3] mb-2.5">
          Участие
        </p>
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-10 md:mb-12"
          style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)" }}
        >
          Просто. Каждый день.
        </h2>
        {/* 2 колонки на мобиле, 4 — на десктопе */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-black/[0.08] rounded-[18px] overflow-hidden bg-white max-w-[960px] mx-auto">
          {HOW_STEPS.map((h, i) => (
            <div
              key={h.n}
              className={`py-7 md:py-8 px-4 md:px-5 text-center hover:bg-[#f5f5f7] transition-colors duration-150
              ${i % 2 === 0 ? "border-r border-black/[0.08]" : ""}
              ${i < 2 ? "border-b border-black/[0.08] md:border-b-0" : ""}
              ${i < HOW_STEPS.length - 1 ? "md:border-r md:border-black/[0.08]" : ""}
            `}
            >
              <p className="text-[0.62rem] font-semibold tracking-[0.1em] uppercase text-[#86868b] mb-3">
                {h.n}
              </p>
              <p className="text-[1.8rem] md:text-[2rem] mb-2.5 md:mb-3">
                {h.icon}
              </p>
              <p className="text-[0.85rem] md:text-[0.9rem] font-semibold mb-1.5">
                {h.title}
              </p>
              <p className="text-[0.75rem] md:text-[0.78rem] text-[#86868b] leading-[1.55] font-light">
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WINNERS ── */}
      <section id="winners" className="py-14 md:py-20 px-[5%] text-center">
        <p className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#0071e3] mb-2.5">
          Зал победителей
        </p>
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-3"
          style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)" }}
        >
          Победители месяца
        </h2>
        <div className="flex justify-center items-center gap-2 mb-10">
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{
              borderRadius: "999px",
              backgroundColor: "#f5f5f7",
              fontFamily: "inherit",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#1d1d1f",
              paddingX: "3px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover": {
                backgroundColor: "#e8e8ed",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #0071e3",
              },
              "& .MuiSelect-icon": {
                color: "#6e6e73",
              },
            }}
          >
            {MONTHS.map((m) => (
              <MenuItem
                key={m.value}
                value={m.value}
                sx={{
                  fontFamily: "inherit",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                }}
              >
                {m.label}
              </MenuItem>
            ))}
          </Select>
          <p className="text-[0.95rem] text-[#6e6e73] leading-[1.6] font-light">
            Номера скрыты из соображений приватности.
          </p>
        </div>
        {/* Вертикально на мобиле, горизонтально на десктопе */}
        <div className="flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-3.5">
          {WINNERS.map((w) => (
            <div
              key={w.phone}
              className={`rounded-[18px] p-7 md:p-8 w-full max-w-[320px] md:w-[220px] text-center transition-all duration-200 border border-transparent ${w.dark ? "bg-[#1d1d1f] hover:border-white/10" : "bg-[#f5f5f7] hover:bg-white hover:border-black/[0.08] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1"}`}
            >
              <p className="text-[2rem] mb-3">{w.medal}</p>
              <p
                className={`text-[0.92rem] font-semibold tracking-[0.02em] mb-0.5 text-[#1d1d1f] `}
              >
                {w.phone}
              </p>
              <p
                className={`text-[0.78rem] mb-2.5 ${w.dark ? "text-white/40" : "text-[#86868b]"}`}
              >
                {w.pts}
              </p>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.72rem] font-semibold ${w.dark ? "bg-white/10 text-white/75" : "bg-[rgba(0,113,227,0.08)] text-[#0071e3]"}`}
              >
                {w.prize}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TARIFF DARK ── */}
      <section
        id="tariff"
        className="bg-[#1d1d1f] py-14 md:py-20 px-[5%] text-center"
      >
        <p className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#2997ff] mb-2.5">
          Тарифы
        </p>
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-3 text-white"
          style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)" }}
        >
          Прозрачные цены.
        </h2>
        <p className="text-[0.95rem] text-white/55 max-w-[460px] mx-auto mb-10 leading-[1.6] font-light">
          Никаких скрытых платежей. Доп. пакет — только с вашего согласия.
        </p>
        {/* Вертикально на мобиле, горизонтально на десктопе */}
        <div className="flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-3.5">
          {TARIFFS.map((tc) => (
            <div
              key={tc.tag}
              className={`rounded-[18px] p-7 md:p-8 w-full max-w-[360px] md:w-[260px] text-left transition-colors duration-200 ${tc.light ? "bg-white border border-transparent hover:bg-[#f9f9fb]" : "bg-white/[0.05] border border-white/10 hover:bg-white/[0.09]"}`}
            >
              <p
                className={`text-[0.67rem] font-semibold tracking-[0.08em] uppercase mb-3 ${tc.light ? "text-[#86868b]" : "text-white/35"}`}
              >
                {tc.tag}
              </p>
              <p
                className={`text-[2.4rem] md:text-[2.6rem] font-bold tracking-[-0.04em] leading-none mb-0.5 ${tc.light ? "text-[#0071e3]" : "text-[#2997ff]"}`}
              >
                {tc.price}
              </p>
              <p
                className={`text-[0.8rem] mb-5 ${tc.light ? "text-[#86868b]" : "text-white/35"}`}
              >
                {tc.per}
              </p>
              <div
                className={`h-px mb-4 ${tc.light ? "bg-black/[0.08]" : "bg-white/[0.07]"}`}
              />
              <ul className="list-none flex flex-col gap-2.5">
                {tc.items.map((item) => (
                  <li
                    key={item}
                    className={`text-[0.82rem] flex gap-1.5 ${tc.light ? "text-[#6e6e73]" : "text-white/65"}`}
                  >
                    <span className="text-[#30d158] font-bold shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── RULES ── */}
      <section
        id="rules"
        className="py-14 md:py-20 px-[5%] text-center bg-[#f5f5f7]"
      >
        <p className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#0071e3] mb-2.5">
          Правила
        </p>
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-10 md:mb-12"
          style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)" }}
        >
          Условия участия
        </h2>
        {/* 1 колонка на мобиле, 2 на sm, 3 на md */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-3.5 max-w-[820px] mx-auto">
          {RULES.map((r) => (
            <div
              key={r.title}
              className="bg-white border border-black/[0.08] rounded-[14px] p-5 md:p-6 text-left transition-all duration-200 hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)] hover:-translate-y-0.5"
            >
              <p className="text-[1.4rem] mb-2.5">{r.icon}</p>
              <p className="text-[0.88rem] font-semibold mb-1.5">{r.title}</p>
              <p className="text-[0.78rem] text-[#86868b] leading-[1.55] font-light">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="regulations" className="py-14 md:py-20 px-[5%] text-center">
        <p className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#0071e3] mb-2.5">
          Документы
        </p>
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-8 md:mb-10"
          style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)" }}
        >
          Регламенты по операторам
        </h2>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center items-center">
          {regulationsList?.map((reg) => (
            <a
              key={reg.url}
              href={reg.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-white text-[0.88rem] font-medium px-7 py-3 rounded-full transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,113,227,0.35)] hover:-translate-y-0.5 ${reg.className}`}
            >
              <FileText />
              {reg.label}
            </a>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="bg-[#1d1d1f] py-14 md:py-20 px-[5%]">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#2997ff] mb-2.5">
              Связь
            </p>
            <h2
              className="font-bold tracking-[-0.03em] leading-[1.08] text-white"
              style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)" }}
            >
              Свяжитесь с нами.
            </h2>
          </div>

          {/* 1 колонка на мобиле, 3 колонки на десктопе */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.4fr] gap-px bg-white/[0.07] rounded-[18px] overflow-hidden">
            {/* Col 1: Адрес */}
            <div className="bg-white/[0.04] hover:bg-white/[0.07] transition-colors duration-200 p-7 md:p-8">
              <p className="text-[0.62rem] font-bold tracking-[0.12em] uppercase text-white/35 mb-5 md:mb-6">
                Адрес
              </p>
              <div className="flex flex-col gap-4 md:gap-5">
                <a
                  href="#"
                  className="flex items-start gap-3 text-white/70 hover:text-white transition-colors duration-150 no-underline group"
                >
                  <span className="mt-0.5 text-[#0071e3] shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5c0-2.49-2.01-4.5-4.5-4.5Zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="text-[0.85rem] leading-[1.5]">
                    Tajikistan,
                    <br />
                    Dushanbe
                  </span>
                </a>
                <a
                  href="tel:+992117111111"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-150 no-underline"
                >
                  <span className="text-[#0071e3] shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.823 8.713a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="text-[0.85rem]">3033</span>
                </a>
                <a
                  href="mailto:mavjivase@gmail.com"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-150 no-underline"
                >
                  <span className="text-[#0071e3] shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="text-[0.85rem]">mavjivase@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Col 2: Контакты */}
            <div className="bg-white/[0.04] hover:bg-white/[0.07] transition-colors duration-200 p-7 md:p-8">
              <p className="text-[0.62rem] font-bold tracking-[0.12em] uppercase text-white/35 mb-5 md:mb-6">
                Контакты
              </p>
              <p className="text-[0.85rem] text-white/60 leading-[1.7] mb-4">
                Для получения подробной информации свяжитесь с нами — выберите
                удобный способ.
              </p>
              <p className="text-[0.85rem] text-white/60 leading-[1.7]">
                Опытные сотрудники ответят на ваши вопросы и окажут поддержку в
                решении проблемы.
              </p>
            </div>

            {/* Col 3: Форма */}
            <div className="bg-white/[0.04] hover:bg-white/[0.07] transition-colors duration-200 p-7 md:p-8">
              <p className="text-[0.62rem] font-bold tracking-[0.12em] uppercase text-white/35 mb-5 md:mb-6">
                Написать нам
              </p>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center h-[240px] md:h-[280px] gap-3">
                  <span className="text-[2.5rem]">✅</span>
                  <p className="text-white font-semibold text-[0.95rem]">
                    Сообщение отправлено!
                  </p>
                  <p className="text-white/40 text-[0.8rem] text-center">
                    Мы свяжемся с вами в ближайшее время.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-[0.78rem] text-[#2997ff] hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Отправить ещё
                  </button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3.5"
                  noValidate
                >
                  <ContactField
                    label="Ф.И.О"
                    name="from_name"
                    value={form.from_name}
                    onChange={handleChange}
                    error={errors.from_name}
                  />
                  <ContactField
                    label="Телефон"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    type="number"
                  />
                  <ContactField
                    label="Email"
                    name="reply_to"
                    value={form.reply_to}
                    onChange={handleChange}
                    error={errors.reply_to}
                    type="email"
                  />
                  <ContactField
                    label="Сообщение"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    error={errors.message}
                    multiline
                  />

                  {status === "error" && (
                    <p className="text-[0.78rem] text-red-400 text-center">
                      Ошибка отправки. Попробуйте позже.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-1 w-full bg-[#0071e3] hover:bg-[#0077ed] hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 text-white rounded-full py-[13px] px-6 text-[0.88rem] font-semibold cursor-pointer transition-all duration-200 border-none flex items-center justify-center gap-2"
                    style={{ fontFamily: "inherit" }}
                  >
                    {status === "loading" ? (
                      <>
                        <svg
                          className="animate-spin"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <circle
                            cx="7"
                            cy="7"
                            r="5.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeDasharray="20 14"
                            strokeLinecap="round"
                          />
                        </svg>
                        Отправка...
                      </>
                    ) : (
                      <>
                        Отправить
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M1 7h12M8 2l5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1d1d1f] border-t border-white/[0.06] px-5 py-5 flex items-center justify-between">
        <span className="text-[0.72rem] text-white/30 font-medium tracking-[0.02em]">
          © {currentYear} Mavj Quiz · Таджикистан
        </span>
        <span className="text-[0.72rem] text-white/30 hover:text-white/60 transition-colors duration-150 cursor-pointer">
          Обратная связь
        </span>
      </footer>
    </div>
  );
}
