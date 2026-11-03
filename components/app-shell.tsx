import type { ReactNode } from "react";

type NavItem = { label: string; href?: string; soon?: boolean };

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Latihan soal", soon: true },
  { label: "Riwayat", soon: true },
  { label: "Jurnal", soon: true },
  { label: "Tiket bantuan", soon: true },
  { label: "Pengaturan", soon: true },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid h-10 w-10 place-items-center rounded-control bg-sky font-display text-base font-extrabold text-white"
      >
        SU
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-extrabold tracking-tight">StudentSU</span>
        <span className="block text-caption text-ink-muted">Examprep</span>
      </span>
    </div>
  );
}

function NavList({ current = "/dashboard" }: { current?: string }) {
  return (
    <ul className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = item.href === current;
        return (
          <li key={item.label}>
            {item.href ? (
              <a
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 items-center justify-between gap-3 rounded-input px-3 text-small transition-colors duration-200 ${
                  isActive
                    ? "bg-sky-soft font-semibold text-sky-deep"
                    : "text-ink-muted hover:bg-surface-sunken hover:text-ink"
                }`}
              >
                {item.label}
              </a>
            ) : (
              <span className="flex min-h-11 items-center justify-between gap-3 rounded-input px-3 text-small text-ink-muted">
                {item.label}
                <span className="rounded-pill border border-outline bg-white px-2 py-0.5 text-caption font-medium uppercase tracking-wide text-ink-muted">
                  Segera
                </span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <aside className="fixed inset-y-0 left-0 hidden w-67 flex-col justify-between border-r border-outline bg-surface px-5 py-7 lg:flex">
        <div className="flex flex-col gap-8">
          <Logo />
          <nav aria-label="Navigasi utama">
            <NavList />
          </nav>
        </div>
        <div className="rounded-card border border-outline bg-white p-4">
          <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">Mode lokal</p>
          <p className="mt-1 text-small leading-relaxed text-ink-muted">
            Data dan API key hanya tersimpan di browser ini. Tidak ada yang dikirim ke server kami.
          </p>
        </div>
      </aside>

      <div className="lg:pl-67">
        <header className="lg:hidden">
          <div className="flex items-center justify-between border-b border-outline px-5 py-4">
            <Logo />
            <span className="rounded-pill bg-surface-sunken px-3 py-1 text-caption font-medium text-ink-muted">Mode lokal</span>
          </div>
          <nav aria-label="Navigasi utama" className="border-b border-outline px-3 py-2">
            <ul className="flex gap-1 overflow-x-auto">
              {navItems.map((item) => (
                <li key={item.label} className="shrink-0">
                  {item.href ? (
                    <a
                      href={item.href}
                      aria-current={item.href === "/dashboard" ? "page" : undefined}
                      className="flex min-h-11 items-center rounded-input bg-sky-soft px-3 text-small font-semibold text-sky-deep"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="flex min-h-11 items-center rounded-input px-3 text-small text-ink-muted">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-295 px-5 py-8 lg:px-10 lg:py-12">{children}</main>

        <footer className="mx-auto w-full max-w-295 px-5 pb-10 lg:px-10">
          <p className="border-t border-outline pt-5 text-caption text-ink-muted">
            StudentSU Examprep · proyek sumber terbuka, berjalan di perangkatmu sendiri
          </p>
        </footer>
      </div>
    </div>
  );
}