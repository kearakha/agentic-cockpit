# RULES

## Coding conventions
- TypeScript strict, no `any` kecuali dengan komentar alasan.
- Server Components default; `"use client"` hanya kalau perlu interaktivitas.
- Komponen kecil dan flat: `components/` tanpa nesting lebih dari 2 level.
- Conventional commits (feat/fix/chore/docs/refactor).
- Nama file kebab-case, komponen PascalCase.

## Do
- Semua warna/spacing lewat token Tailwind (theme dari DESIGN.md).
- Setiap run skill WAJIB tercatat di DB, termasuk yang gagal.
- Error dari Claude Code ditampilkan apa adanya di panel output (jangan ditelan).
- Zero setup: `npm install && npx prisma migrate dev && npm run dev` harus cukup.

## Don't
- Jangan hardcode warna hex di komponen (kecuali di theme config).
- Jangan expose API key / spawn command dari client side.
- Jangan pakai emoji di UI.
- Jangan bikin abstraksi "engine"/"plugin system" berlebihan — config file sederhana cukup.
- Jangan tambah halaman di luar: Home, Skills, Log, Settings (settings boleh stub).

## Keamanan minimal (walau lokal)
- Skill dengan `dangerous: true` (misal yang nulis/hapus file) minta confirm dialog dulu sebelum run.
- Command yang di-spawn hanya boleh berasal dari `skills.config.ts`, tidak pernah dari input user bebas.
