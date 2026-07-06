# CLAUDE.md — Agentic Cockpit

Project: personal agentic cockpit di atas Claude Code. Web app lokal Next.js.

## Wajib baca tiap sesi
1. `.docs/OVERVIEW.md` — tujuan & scope (perhatikan Non-goals)
2. `.docs/PLAN.md` — fase aktif; kerjakan HANYA fase yang sedang berjalan
3. `.docs/DESIGN.md` — sebelum menyentuh UI apa pun
4. `.docs/STACK.md`, `.docs/RULES.md`, `.docs/COMPONENTS.md`, `.docs/SKILLS.md`

## Aturan sesi
- Bahasa: Indonesia casual, singkat, tanpa basa-basi.
- Selesai satu fase PLAN.md → stop, ringkas apa yang berubah, tunggu konfirmasi.
- Ragu/ambigu → tanya, jangan asumsi.
- Perubahan design di luar DESIGN.md → tolak, minta update DESIGN.md dulu.
- Commit pakai conventional commits, kecil-kecil per fitur.

## Batasan keras
- No hijau, no AI-generic look (lihat larangan di DESIGN.md).
- No auth/deploy/multi-user di MVP.
- Nambah skill = edit `skills.config.ts` saja.
- Spawn process hanya dari config, tidak pernah dari input bebas user.

## Konteks Tambahan
Baca ~/Documents/Nexus/CLAUDE.md dan folder terkait di 01-Projects/ atau 02-Areas/ untuk konteks personal & riwayat kerja. Kalau note project ini belum ada di Nexus, buatkan.