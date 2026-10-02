import Link from "next/link";

export const metadata = { title: "404 — Mavj Quiz" };

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-6xl font-extrabold tracking-[-0.04em]">404</p>
      <p className="text-[var(--muted)]">Страница не найдена</p>
      <Link href="/" className="font-bold text-[var(--accent-text)]">
        На главную
      </Link>
    </main>
  );
}
