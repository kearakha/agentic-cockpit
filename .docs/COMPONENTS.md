# COMPONENTS

## Halaman (App Router)
```
app/
  page.tsx            → Home (dashboard)
  skills/page.tsx     → Skill grid penuh
  log/page.tsx        → Session log
  settings/page.tsx   → Stub (path claude, dsb)
  api/
    run/[skillId]/route.ts   → spawn + SSE stream
    runs/route.ts            → list runs (GET)
```

## Layout
- Sidebar kiri tipis: Home, Skills, Log, Settings + indikator "Claude Code: ready/error" di bawah.
- Konten utama max-width ~1100px, banyak whitespace.
- Panel output: drawer/panel kanan yang slide masuk saat skill jalan (bukan halaman terpisah), monospace, latar deep ink, teks off-white. Aksen oranye hanya untuk status.

## Komponen inti
| Komponen | Isi |
|---|---|
| `DailyReport` | Kartu: tanggal, agenda hari ini (manual/config), run terakhir, task terbuka |
| `StatCard` | Angka besar + label kecil + delta vs minggu lalu (dari tabel Run) |
| `SkillCard` | Nama, deskripsi 1 baris, tombol Run. Group header per area |
| `RunPanel` | Output streaming, status (running/done/failed), durasi, tombol stop |
| `RunRow` | Baris log: waktu, skill, status dot, durasi; expand → output penuh |

## Data model (Prisma)
```prisma
model Run {
  id        String   @id @default(cuid())
  skillId   String
  status    String   // running | success | failed | cancelled
  output    String   @default("")
  startedAt DateTime @default(now())
  endedAt   DateTime?
}
```
