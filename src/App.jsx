import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  FileText,
  MapPin,
  Phone,
  Mail,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  THRESHOLDS,
  QUESTIONS_PER_DAY,
  MAX_POINTS_PER_DAY,
  SUBSCRIBE_TEL,
  SCORES,
  MONTHS,
  NAV_LINKS,
  STATS,
  PRIZES,
  HOW_STEPS,
  WINNERS,
  TARIFFS,
  RULES,
  EMPTY_CONTACT_FORM,
  fmt,
  normalizePhone,
  getScoreResult,
  validateContact,
  mapRegulations,
  scrollToId,
  QuizStyles,
  IPhoneSVG,
  WatchSVG,
  AirPodsSVG,
  PlaceDevice,
  Wave,
  SectionHeader,
  PrimaryButton,
  ContactField,
  WinnerCard,
  LanguageSwitcher,
} from "../utils.jsx";
import { fetchRules } from "./features/reglament/reglament";

export default function SMSQuiz() {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [result, setResult] = useState(null);
  const [fillWidth, setFillWidth] = useState(0);
  const [form, setForm] = useState(EMPTY_CONTACT_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [menuOpen, setMenuOpen] = useState(false);
  const [winnerIdx, setWinnerIdx] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);

  const { data } = useSelector((state) => state.rules);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch]);

  /* ── Проверка баллов ── */
  const handleCheck = (e) => {
    e.preventDefault();
    const digits = normalizePhone(phone);
    if (!digits) {
      setPhoneError("check.phoneError");
      return;
    }
    setPhoneError("");
    // TODO: заменить на запрос к API
    const pts = SCORES[digits] ?? Math.floor(Math.random() * 1500) + 50;
    const res = getScoreResult(pts);
    setResult(res);
    setFillWidth(0);
    setTimeout(() => setFillWidth(res.pct), 80);
  };

  /* ── Форма связи ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateContact(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setStatus("loading");
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, {
        publicKey: EMAILJS_PUBLIC_KEY,
      });
      setStatus("success");
      setForm(EMPTY_CONTACT_FORM);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const fieldError = (name) => (errors[name] ? t(`contact.errors.${name}`) : "");

  const regulationsList = mapRegulations(data, t("rules.regulationFallback"));

  const scrollTo = (href) => {
    scrollToId(href);
    setMenuOpen(false);
  };

  const navClick = (href) => (e) => {
    e.preventDefault();
    scrollTo(href);
  };

  const currentYear = new Date().getFullYear();
  const monthLabels = t("months", { returnObjects: true });
  const monthLabel = monthLabels[MONTHS.indexOf(selectedMonth)];

  return (
    <div
      className="bg-white text-[var(--ink)] overflow-x-hidden antialiased"
      style={{ fontFamily: "'Onest', system-ui, sans-serif" }}
    >
      <QuizStyles />

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[var(--line)]">
        <div className="max-w-[1120px] mx-auto h-14 px-5 flex items-center justify-between">
          <a href="#hero" onClick={navClick("#hero")} className="flex items-center gap-2 no-underline text-[var(--ink)]">
            <img src="/logo.png" alt="" className="h-7 w-auto" />
            <span className="text-lg font-extrabold tracking-tight">Mavj Quiz</span>
          </a>

          <ul className="hidden md:flex list-none items-center gap-1 m-0 p-0">
            {NAV_LINKS.map(({ href, key }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={navClick(href)}
                  className="text-[var(--muted)] hover:text-[var(--ink)] no-underline text-sm font-semibold px-3 py-2 rounded-full hover:bg-[var(--surface)] transition-colors"
                >
                  {t(`nav.${key}`)}
                </a>
              </li>
            ))}
            <li className="ml-2">
              <LanguageSwitcher />
            </li>
            <li className="ml-1">
              <a
                href={SUBSCRIBE_TEL}
                className="inline-flex items-center rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-bold no-underline px-4 py-2 transition-colors"
              >
                {t("nav.participate")}
              </a>
            </li>
          </ul>

          <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] bg-transparent border-none cursor-pointer"
            aria-label={t("nav.menu")}
            aria-expanded={menuOpen}
          >
            <span className={`block w-5 h-0.5 bg-[var(--ink)] transition-transform ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[var(--ink)] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[var(--ink)] transition-transform ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mq-down md:hidden border-t border-[var(--line)] bg-white px-5 pb-3">
            {NAV_LINKS.map(({ href, key }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className="w-full text-left py-3.5 text-base font-semibold text-[var(--ink)] border-0 border-b border-solid border-[var(--line)] last:border-b-0 bg-transparent cursor-pointer"
                style={{ fontFamily: "inherit" }}
              >
                {t(`nav.${key}`)}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="bg-[var(--surface)] pt-24 md:pt-32">
        <div className="max-w-[1120px] mx-auto px-5 grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-6 items-center">
          <div className="text-center md:text-left">
            <span className="mq-a0 inline-flex items-center gap-2 rounded-full bg-white border border-[var(--line)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              {t("hero.badge", { month: monthLabel, monthLower: monthLabel.toLowerCase() })}
            </span>
            <h1
              className="mq-a1 font-extrabold tracking-[-0.04em] leading-[1.02] mb-5"
              style={{ fontSize: "clamp(2.6rem,6.5vw,4.75rem)" }}
            >
              {t("hero.title1")}
              <br />
              <span className="text-[var(--accent)]">{t("hero.title2")}</span>
            </h1>
            <p
              className="mq-a2 text-[var(--muted)] max-w-[480px] mx-auto md:mx-0 mb-8 leading-relaxed"
              style={{ fontSize: "clamp(1rem,2vw,1.2rem)" }}
            >
              {t("hero.subtitle")}
            </p>
            <div className="mq-a3 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <PrimaryButton href={SUBSCRIBE_TEL}>{t("hero.cta")}</PrimaryButton>
              <a
                href="#check"
                onClick={navClick("#check")}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[rgba(11,31,42,0.15)] hover:border-[rgba(11,31,42,0.4)] text-[var(--ink)] font-bold no-underline px-6 py-3 text-base transition-colors"
              >
                {t("hero.check")}
              </a>
            </div>
          </div>

          <div className="mq-a2 flex items-end justify-center gap-3 md:gap-6 pb-6">
            <div className="group text-center"><WatchSVG className="w-[70px] sm:w-[90px] md:w-[110px]" /></div>
            <div className="group text-center"><IPhoneSVG className="w-[130px] sm:w-[160px] md:w-[200px]" /></div>
            <div className="group text-center"><AirPodsSVG className="w-[60px] sm:w-[78px] md:w-[96px]" /></div>
          </div>
        </div>
        <Wave fill="#ffffff" />
      </section>

      {/* ── STATS ── */}
      <div className="max-w-[880px] mx-auto px-5 -mt-2">
        <div className="grid grid-cols-3 rounded-2xl border border-[var(--line)] bg-white">
          {STATS.map(({ key, value, currency }, i) => (
            <div key={key} className={`py-5 md:py-7 px-2 text-center ${i < STATS.length - 1 ? "border-r border-[var(--line)]" : ""}`}>
              <p className="text-2xl md:text-4xl font-extrabold tracking-[-0.03em] leading-none">
                {value}
                {currency && <span className="text-base md:text-lg font-bold text-[var(--muted)] ml-1">{t("stats.currency")}</span>}
              </p>
              <p className="text-xs md:text-sm text-[var(--muted)] mt-2 leading-snug">{t(`stats.${key}`)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRIZES ── */}
      <section id="prizes" className="py-16 md:py-24 px-5">
        <div className="max-w-[1120px] mx-auto">
          <SectionHeader
            eyebrow={t("prizes.eyebrow")}
            title={t("prizes.title")}
            subtitle={t("prizes.subtitle")}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {PRIZES.map(({ place, name, pts }) => (
              <article
                key={place}
                className={`group rounded-3xl p-7 md:p-8 text-center border transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(11,31,42,0.08)] ${
                  place === 1 ? "bg-[var(--accent-soft)] border-[rgba(29,78,216,0.2)] md:-translate-y-3" : "bg-[var(--surface)] border-transparent"
                }`}
              >
                <p className={`inline-block text-xs font-bold tracking-[0.1em] uppercase rounded-full px-3 py-1 mb-6 ${place === 1 ? "bg-[var(--accent)] text-white" : "bg-white text-[var(--muted)]"}`}>
                  {t("place", { place })}
                </p>
                <div className="h-[200px] flex items-end justify-center mb-6">
                  <PlaceDevice place={place} className={place === 1 ? "w-[110px]" : place === 2 ? "w-[100px]" : "w-[90px]"} />
                </div>
                <h3 className="text-lg font-extrabold mb-1">{name}</h3>
                <p className="text-sm text-[var(--muted)]">{t("prizes.from", { value: fmt(pts) })}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW ── */}
      <section id="how" className="bg-[var(--surface)] py-16 md:py-24 px-5">
        <div className="max-w-[1120px] mx-auto">
          <SectionHeader eyebrow={t("how.eyebrow")} title={t("how.title")} />
          <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 list-none m-0 p-0">
            {HOW_STEPS.map(({ Icon, key }, i) => (
              <li key={key} className="relative bg-white rounded-2xl p-6 border border-[var(--line)]">
                <div className="flex items-center justify-between mb-5">
                  <span className="w-11 h-11 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <span className="text-4xl font-extrabold text-[rgba(11,31,42,0.1)] leading-none">{i + 1}</span>
                </div>
                <h3 className="text-base font-extrabold mb-1.5">{t(`how.steps.${key}.title`)}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {t(`how.steps.${key}.desc`, { questions: QUESTIONS_PER_DAY, max: MAX_POINTS_PER_DAY })}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CHECK POINTS ── */}
      <section id="check" className="py-16 md:py-24 px-5">
        <div className="max-w-[640px] mx-auto text-center">
          <SectionHeader
            eyebrow={t("check.eyebrow")}
            title={t("check.title")}
            subtitle={t("check.subtitle")}
            className="mb-8"
          />

          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3" noValidate>
            <div className="flex-1 flex items-center rounded-full border-2 border-[var(--line)] focus-within:border-[var(--accent)] bg-white px-5 transition-colors">
              <span className="text-[var(--muted)] font-semibold mr-2">+992</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="90 123 4567"
                aria-label={t("check.phoneLabel")}
                className="flex-1 min-w-0 py-3.5 bg-transparent outline-none text-base font-semibold text-[var(--ink)] placeholder-[rgba(79,98,108,0.6)] border-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] hover:bg-black text-white font-bold px-6 py-3.5 text-base border-none cursor-pointer transition-colors"
              style={{ fontFamily: "inherit" }}
            >
              <Search size={18} /> {t("check.submit")}
            </button>
          </form>
          {phoneError && <p className="text-sm text-red-600 mt-3 text-left sm:pl-5">{t(phoneError)}</p>}

          {result && (
            <div className="mq-pop mt-6 rounded-2xl bg-[var(--surface)] p-6 text-left">
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-4xl font-extrabold tracking-[-0.03em]">{fmt(result.pts)}</p>
                <p className="text-sm text-[var(--muted)]">{t("check.ofFirst", { value: fmt(THRESHOLDS.first) })}</p>
              </div>
              <div className="relative h-2.5 rounded-full bg-[rgba(11,31,42,0.1)] overflow-hidden mb-2">
                <div className="mq-bar absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]" style={{ width: `${fillWidth}%` }} />
              </div>
              <div className="relative h-5 text-[11px] font-semibold text-[var(--muted)] mb-4">
                <span className="absolute -translate-x-1/2" style={{ left: `${(THRESHOLDS.third / THRESHOLDS.first) * 100}%` }}>AirPods</span>
                <span className="absolute -translate-x-1/2" style={{ left: `${(THRESHOLDS.second / THRESHOLDS.first) * 100}%` }}>Watch</span>
                <span className="absolute right-0">iPhone</span>
              </div>
              <p className="text-base font-bold">
                {t(result.textKey, { count: result.left, value: fmt(result.left) })}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── WINNERS ── */}
      <section id="winners" className="bg-[var(--surface)] py-16 md:py-24 px-5">
        <div className="max-w-[1120px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <SectionHeader
              eyebrow={t("winners.eyebrow")}
              title={t("winners.title")}
              className="text-center md:text-left"
            />
            <label className="relative self-center md:self-auto">
              <span className="sr-only">{t("winners.month")}</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none rounded-full bg-white border border-[var(--line)] pl-5 pr-10 py-2.5 text-sm font-bold text-[var(--ink)] cursor-pointer outline-none focus:border-[var(--accent)]"
                style={{ fontFamily: "inherit" }}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={m}>{monthLabels[i]} {currentYear}</option>
                ))}
              </select>
              <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[var(--muted)] pointer-events-none" />
            </label>
          </div>
          <p className="text-sm text-[var(--muted)] -mt-6 mb-8 text-center md:text-left">
            {t("winners.privacy")}
          </p>

          {/* Desktop */}
          <div className="hidden md:grid grid-cols-3 gap-5">
            {WINNERS.map((w) => <WinnerCard key={w.phone} w={w} />)}
          </div>

          {/* Mobile slider */}
          <div className="md:hidden max-w-[420px] mx-auto">
            <div key={winnerIdx} className="mq-pop">
              <WinnerCard w={WINNERS[winnerIdx]} />
            </div>
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => setWinnerIdx((p) => (p === 0 ? WINNERS.length - 1 : p - 1))}
                className="w-11 h-11 rounded-full bg-white border border-[var(--line)] flex items-center justify-center cursor-pointer"
                aria-label={t("winners.prev")}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {WINNERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWinnerIdx(i)}
                    aria-label={t("winners.dot", { n: i + 1 })}
                    className={`h-2 rounded-full border-none cursor-pointer transition-all ${i === winnerIdx ? "w-6 bg-[var(--accent)]" : "w-2 bg-[rgba(11,31,42,0.2)]"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setWinnerIdx((p) => (p === WINNERS.length - 1 ? 0 : p + 1))}
                className="w-11 h-11 rounded-full bg-white border border-[var(--line)] flex items-center justify-center cursor-pointer"
                aria-label={t("winners.next")}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TARIFFS ── */}
      <section id="tariff" className="bg-[var(--deep)] text-white">
        <Wave fill="var(--surface)" flip />
        <div className="py-16 md:py-20 px-5 max-w-[1120px] mx-auto">
          <SectionHeader
            dark
            eyebrow={t("tariffs.eyebrow")}
            title={t("tariffs.title")}
            subtitle={t("tariffs.subtitle")}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[760px] mx-auto">
            {TARIFFS.map((tariff) => (
              <div
                key={tariff.key}
                className={`rounded-3xl p-7 md:p-8 ${tariff.featured ? "bg-white/[0.06] border border-[rgba(107,155,255,0.4)]" : "bg-white text-[var(--ink)]"}`}
              >
                <p className={`text-xs font-bold tracking-[0.1em] uppercase mb-4 ${tariff.featured ? "text-[var(--accent-on-dark)]" : "text-[var(--muted)]"}`}>
                  {t(`tariffs.${tariff.key}.tag`)}
                </p>
                <p className="text-5xl font-extrabold tracking-[-0.04em] leading-none">{tariff.price}</p>
                <p className={`text-sm mt-1.5 mb-6 ${tariff.featured ? "text-white/70" : "text-[var(--muted)]"}`}>{t(`tariffs.${tariff.key}.per`)}</p>
                <ul className="list-none m-0 p-0 flex flex-col gap-3">
                  {t(`tariffs.${tariff.key}.items`, { returnObjects: true }).map((item) => (
                    <li key={item} className={`flex gap-2.5 text-sm ${tariff.featured ? "text-white/85" : "text-[var(--ink)]"}`}>
                      <Check size={18} className={`shrink-0 ${tariff.featured ? "text-[var(--accent-on-dark)]" : "text-[var(--accent)]"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Wave fill="#ffffff" />
      </section>

      {/* ── RULES ── */}
      <section id="rules" className="py-16 md:py-24 px-5">
        <div className="max-w-[1120px] mx-auto">
          <SectionHeader eyebrow={t("rules.eyebrow")} title={t("rules.title")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-[960px] mx-auto">
            {RULES.map(({ Icon, key }) => (
              <div key={key} className="flex gap-4">
                <span className="w-10 h-10 shrink-0 rounded-xl bg-[var(--surface)] text-[var(--accent)] flex items-center justify-center">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="text-base font-extrabold mb-1">{t(`rules.items.${key}.title`)}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{t(`rules.items.${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>

          {regulationsList.length > 0 && (
            <div id="regulations" className="mt-14 pt-10 border-t border-[var(--line)] text-center">
              <h3 className="text-lg font-extrabold mb-5">{t("rules.regulations")}</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {regulationsList.map((reg) => (
                  <a
                    key={reg.url}
                    href={reg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 w-44 rounded-full text-white text-sm font-bold no-underline px-5 py-3 transition-all hover:-translate-y-0.5 hover:shadow-lg ${reg.className}`}
                  >
                    <FileText size={18} className="shrink-0" />
                    <span className="truncate max-w-[180px]">{reg.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="bg-[var(--deep)] text-white">
        <Wave fill="#ffffff" flip />
        <div className="py-16 md:py-20 px-5 max-w-[1120px] mx-auto grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16">
          <div>
            <SectionHeader dark eyebrow={t("contact.eyebrow")} title={t("contact.title")} className="mb-4" />
            <p className="text-white/70 leading-relaxed mb-8 max-w-[400px]">
              {t("contact.text")}
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-4">
              <li className="flex items-center gap-3 text-white/85">
                <MapPin size={18} className="text-[var(--accent-on-dark)] shrink-0" /> {t("contact.address")}
              </li>
              <li>
                <a href="+992115553033" className="flex items-center gap-3 text-white/85 hover:text-white no-underline">
                  <Phone size={18} className="text-[var(--accent-on-dark)] shrink-0" /> 3033
                </a>
              </li>
              <li>
                <a href="mailto:mavjivase@gmail.com" className="flex items-center gap-3 text-white/85 hover:text-white no-underline">
                  <Mail size={18} className="text-[var(--accent-on-dark)] shrink-0" /> mavjivase@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-6 md:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center min-h-[320px] gap-3">
                <CheckCircle2 size={44} className="text-[var(--accent-on-dark)]" />
                <p className="text-lg font-extrabold">{t("contact.successTitle")}</p>
                <p className="text-white/70 text-sm">{t("contact.successText")}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 text-sm font-bold text-[var(--accent-on-dark)] hover:underline bg-transparent border-none cursor-pointer"
                  style={{ fontFamily: "inherit" }}
                >
                  {t("contact.sendMore")}
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ContactField label={t("contact.fields.from_name")} name="from_name" value={form.from_name} onChange={handleChange} error={fieldError("from_name")} autoComplete="name" />
                  <ContactField label={t("contact.fields.phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={handleChange} error={fieldError("phone")} />
                </div>
                <ContactField label={t("contact.fields.reply_to")} name="reply_to" type="email" autoComplete="email" value={form.reply_to} onChange={handleChange} error={fieldError("reply_to")} />
                <ContactField label={t("contact.fields.message")} name="message" value={form.message} onChange={handleChange} error={fieldError("message")} multiline />

                {status === "error" && (
                  <p className="text-sm text-red-300 text-center">{t("contact.sendError")}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-on-dark)] hover:bg-[#93b6ff] disabled:opacity-60 text-[var(--deep)] font-extrabold py-3.5 px-6 text-base border-none cursor-pointer transition-colors"
                  style={{ fontFamily: "inherit" }}
                >
                  {status === "loading" ? (
                    <><Loader2 size={18} className="animate-spin" /> {t("contact.sending")}</>
                  ) : (
                    <>{t("contact.send")} <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/10 px-5 py-6 pb-24 md:pb-6">
          <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
            <span>© {currentYear} Mavj Quiz · {t("footer.country")}</span>
            <a href="#contact" onClick={navClick("#contact")} className="text-white/60 hover:text-white no-underline">
              {t("footer.feedback")}
            </a>
          </div>
        </footer>
      </section>

      {/* ── STICKY CTA (mobile) ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-white/90 backdrop-blur-xl border-t border-[var(--line)]">
        <PrimaryButton href={SUBSCRIBE_TEL} className="w-full">
          {t("sticky")}
        </PrimaryButton>
      </div>
    </div>
  );
}