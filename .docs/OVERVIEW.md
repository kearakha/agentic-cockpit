# OVERVIEW

## Nama
Agentic Cockpit

## Tujuan
Web app lokal yang jadi control panel di atas Claude Code. Semua skill & automation yang biasa dijalankan lewat terminal jadi tombol satu-klik, dengan output streaming dan riwayat run tersimpan.

## Target user
- Sekarang: Rakha (personal, single user, jalan di laptop sendiri)
- Nanti (v2+): teammate non-teknis / dijual sebagai produk — arsitektur harus tidak menghalangi arah ini, tapi JANGAN bangun fitur multi-user sekarang.

## Platform
Web app lokal, Next.js, diakses via `localhost:3000`. Tidak dideploy.

## Fitur MVP
1. **Dashboard home** — greeting, daily report (agenda hari ini, run terakhir, task terbuka), stat ringkas (runs minggu ini, durasi, dsb).
2. **Skill grid** — tombol per skill, dikelompokkan per area (Riset, Coding, Trading, Akademik). Klik → jalan headless → output streaming di panel.
3. **Session log** — semua run tercatat (skill, waktu, durasi, status, output). Klik untuk expand.

## Non-goals (MVP)
- Auth / multi-user
- Deploy / hosting
- Scheduling otomatis (cron) — cukup manual trigger dulu
- Editing skill dari UI (cukup via config file)
