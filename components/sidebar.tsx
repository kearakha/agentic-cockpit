"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/skills", label: "Skills" },
  { href: "/log", label: "Log" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-48 shrink-0 flex-col border-r border-line px-4 py-8">
      <Link href="/" className="mb-10 px-3 font-serif text-lg">
        Cockpit
      </Link>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm text-ink-muted transition-colors duration-150 hover:bg-accent-soft hover:text-ink",
              pathname === item.href && "bg-accent-soft text-ink",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-3">
        {/* ponytail: status statis, cek claude CLI beneran di Fase 2 */}
        <p className="text-xs text-ink-muted">
          Claude Code
          <span className="mt-0.5 block font-mono">ready</span>
        </p>
      </div>
    </aside>
  );
}
