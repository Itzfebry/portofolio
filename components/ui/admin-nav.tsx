"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Ringkasan", cmd: "summary --overview" },
  { href: "/admin/projects", label: "Proyek", cmd: "projects --list" },
  { href: "/admin/content", label: "Konten", cmd: "content --edit" },
  { href: "/admin/settings", label: "Pengaturan", cmd: "config --profile" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="hack-nav" aria-label="Navigasi administrasi">
      {ITEMS.map((item, index) => {
        const active = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} className={`hack-nav__item ${active ? "is-active" : ""}`}>
            <span className="hack-nav__index">{String(index + 1).padStart(2, "0")}</span>
            <span className="hack-nav__body">
              <span className="hack-nav__label">{item.label}</span>
              <span className="hack-nav__cmd">./{item.cmd}</span>
            </span>
            <span className="hack-nav__caret" aria-hidden="true">
              {active ? "▸" : ""}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
