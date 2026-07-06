# PLAN

Kerjakan fase per fase. Selesai satu fase → stop, tunggu konfirmasi user.

## Fase 0 — Inventory & alignment
- [ ] Scan `~/.claude/` (commands, skills, agents) + tanya user skill mana yang dipakai
- [ ] Finalisasi `skills.config.ts` (update SKILLS.md sesuai hasil)

## Fase 1 — Scaffold & fondasi
- [ ] Next.js 15 + TS + Tailwind + shadcn/ui, theme sesuai DESIGN.md
- [ ] Prisma + SQLite, model `Run`, migrate
- [ ] Layout: sidebar + halaman kosong (Home, Skills, Log, Settings)
- [ ] Font setup (next/font)

## Fase 2 — Eksekusi headless
- [ ] `skills.config.ts` + tipe
- [ ] Route `/api/run/[skillId]`: spawn `claude -p` (stream-json), SSE ke client, tulis Run ke DB
- [ ] `RunPanel` streaming output + stop button (kill process)
- [ ] Confirm dialog untuk skill `dangerous`

## Fase 3 — Dashboard & log
- [ ] `DailyReport` + `StatCard` (agregasi dari tabel Run)
- [ ] Skill grid per group
- [ ] Halaman Log: list run + expand output
- [ ] Empty states yang rapi

## Fase 4 — Polish & handoff
- [ ] Uji tiap skill end-to-end, catat yang gagal
- [ ] README: cara jalanin, cara nambah skill (harus ≤ 5 menit)
- [ ] Walkthrough akhir: buka app → baca report → run 1 skill → lihat log
