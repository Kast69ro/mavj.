/* ─────────────────────────────────────────
   ОПЕРАТОРЫ — у каждого своя страница /<slug>/ и свои цвета.
   theme → CSS-переменные, которыми раскрашен весь сайт:
     accent        — кнопки, акценты
     accentHover   — кнопки при наведении
     accentText    — акцентный текст на белом (тёмнее accent, если accent светлый)
     onAccent      — текст на кнопке цвета accent
     accentSoft    — светлая подложка
     accentOnDark  — акцент на тёмных секциях
     deep          — фон тёмных секций
     screen        — экран телефона/часов на иллюстрациях
───────────────────────────────────────── */
/** Основной сайт (без оператора) — синий */
export const MAIN_THEME = {
  accent: "#1d4ed8",
  accentHover: "#1e3fae",
  accentText: "#1d4ed8",
  onAccent: "#ffffff",
  accentSoft: "#e6ecfd",
  accentOnDark: "#6b9bff",
  deep: "#0a1433",
  screen: "#1e3a8a",
};

export const OPERATORS = {
  babilon: {
    name: "Babilon-M",
    regulation: "bm",
    theme: {
      accent: "#eab308",
      accentHover: "#ca8a04",
      accentText: "#a16207",
      onAccent: "#1f1600",
      accentSoft: "#fdf4d3",
      accentOnDark: "#facc15",
      deep: "#241c05",
      screen: "#6b4f05",
    },
  },
  megafon: {
    name: "MegaFon",
    regulation: "mg",
    theme: {
      accent: "#009a49",
      accentHover: "#00843e",
      accentText: "#00843e",
      onAccent: "#ffffff",
      accentSoft: "#e2f6eb",
      accentOnDark: "#4be08f",
      deep: "#062a1a",
      screen: "#0b5a33",
    },
  },
  tcell: {
    name: "Tcell",
    regulation: "tc",
    theme: {
      accent: "#7b2d8e",
      accentHover: "#65247a",
      accentText: "#7b2d8e",
      onAccent: "#ffffff",
      accentSoft: "#f4e9f7",
      accentOnDark: "#d29be3",
      deep: "#1f0a29",
      screen: "#4a1a5a",
    },
  },
};

export const OPERATOR_SLUGS = Object.keys(OPERATORS);

/** Операторы, которые скоро подключатся: серая неактивная кнопка, страницы нет.
    Когда оператор подключится — перенесите его в OPERATORS с цветами */
export const COMING_SOON = [{ id: "zet", name: "ZET-Mobile" }];

/** theme → { "--accent": "#…", … } для style={…} */
export const themeVars = (theme) =>
  Object.fromEntries(
    Object.entries(theme).map(([key, value]) => [
      `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`,
      value,
    ]),
  );
