# SKILLS

Daftar final tombol skill (hasil inventory `~/.claude/` + approval Rakha, 2026-07-06).

## Rutinitas
- `jadwal-hari-ini` — Ringkas agenda & prioritas hari ini. Eksekusi: `claude -p "/morning"`.
- `todo-list` — Tampilkan todo pending. Eksekusi: `claude -p "/todo"`.
- `nexus-note` — Baca/tulis note ke vault Nexus (Obsidian) di `~/Documents/Nexus`. `input: true` (instruksi bebas, misal "baca note Agentic-Cockpit" / "catat X ke daily note"). `dangerous: true` (bisa nulis file). `cwd: ~/Documents/Nexus`.

## Riset (ABSA / skripsi)
- `absa-progress` — Ringkas status project ABSA: fase aktif, hasil terakhir, next step. Tanpa `cwd` tetap — minta path saat itu kalau perlu.
- `absa-report` — Generate progress report singkat format markdown. Tanpa `cwd` tetap.

## Coding (Bengkel Koding)
- `commit-msg` — Generate conventional commit message dari git diff. `input: true` (path repo). Eksekusi: `claude -p "/caveman-commit"` dengan `cwd` dari input.
- `code-review` — Review perubahan terakhir di repo. `input: true` (path repo), `cwd` dari input.
- `project-setup` — Scaffold Laravel/Next.js sesuai template Bengkel Koding (skill `laravel-scaffold`). `input: true` (path target + jenis), `dangerous: true`.

## Trading
- `breakout-scan` — Ringkas watchlist & kondisi breakout mid-range. `input: true` — notes ada di Claude.ai Projects (bukan lokal), paste manual di dialog.
- `portfolio-summary` — Ringkasan posisi & catatan trading. `input: true` — paste notes manual.

## Akademik
- `materi-ajar` — Generate outline materi ajar dari topik. `input: true` (topik).

## Catatan implementasi
- Tiap skill = entry di `skills.config.ts` dengan prompt template.
- `input: true` → dialog 1 field sebelum run; nilai input di-inject ke prompt template (atau jadi `cwd` untuk commit-msg/code-review).
- `dangerous: true` (nulis/hapus file) → confirm dialog dulu sebelum run.
- `cwd` input user untuk commit-msg/code-review divalidasi sebagai path direktori yang ada; command yang di-spawn tetap hanya dari config.
