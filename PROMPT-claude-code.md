# Prompt untuk Claude Code

Copy-paste ini ke Claude Code:

---

Buat project baru di `/Users/rakha/Documents/Project/agentic-cockpit`.

Ini adalah **Agentic Cockpit**: web app lokal (personal) yang jadi "dashboard OS" di atas Claude Code. Semua spesifikasi ada di `.docs/` — tapi karena project belum ada, langkah pertamamu adalah scaffold + tulis docs yang aku lampirkan di bawah.

## Langkah kerja

1. Scaffold Next.js 15 (App Router, TypeScript, Tailwind) di path di atas. Install shadcn/ui, Prisma + SQLite.
2. Buat folder `.docs/` dan salin isi file-file docs persis seperti yang kuberikan (OVERVIEW.md, STACK.md, RULES.md, COMPONENTS.md, DESIGN.md, PLAN.md, SKILLS.md).
3. Buat `CLAUDE.md` di root persis seperti yang kuberikan.
4. Sebelum nulis kode fitur apapun: **inventory dulu** skill/command/automation yang ada di `~/.claude/` (slash commands, skills, agents). Tampilkan hasilnya ke aku dan propose mapping ke tombol-tombol cockpit. Tunggu approval-ku.
5. Setelah approve, kerjakan sesuai PLAN.md fase per fase. Setiap selesai satu fase, stop dan tunggu konfirmasi.

## Definition of done (MVP)

Aku bisa buka `localhost:3000`, lihat daily report, klik satu tombol skill, output-nya streaming ke layar, dan run-nya tercatat di session log.

## Rules penting

- Design ikuti `.docs/DESIGN.md` KETAT. Tidak ada warna hijau. Tidak ada gradient ungu-biru "AI look". Tidak ada emoji di UI.
- Eksekusi Claude Code headless via `claude -p` (child_process spawn) di server-side. JANGAN expose API key di client.
- Nambah skill button baru harus cukup edit 1 file config (`skills.config.ts`), bukan nulis komponen baru.
- Local first. Tidak ada auth, tidak ada deploy config, tidak ada telemetry.

---

(Lampirkan isi `.docs/` dan `CLAUDE.md` dari file-file berikut saat paste.)
