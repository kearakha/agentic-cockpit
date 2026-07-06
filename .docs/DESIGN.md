# DESIGN

Arah: **typographic minimalist**. Terlihat seperti tool internal yang dirancang orang design-sadar — bukan template dashboard SaaS, bukan "AI product look".

## Larangan keras
- TIDAK ADA warna hijau di mana pun (termasuk status success — pakai ink/oranye).
- TIDAK ADA gradient ungu-biru, glassmorphism, glow, sparkle icon.
- TIDAK ADA emoji di UI.
- TIDAK ADA ilustrasi 3D / blob dekoratif.

## Warna (design tokens)
| Token | Hex | Pakai untuk |
|---|---|---|
| `bg` | `#FAF8F5` | Latar utama (off-white hangat) |
| `surface` | `#FFFFFF` | Kartu |
| `ink` | `#1A1917` | Teks utama, panel terminal |
| `ink-muted` | `#6B6862` | Teks sekunder, label |
| `line` | `#E7E3DC` | Border tipis 1px |
| `accent` | `#E8541E` | Aksi utama, status running, angka penting. Hemat — maksimal satu aksen kuat per view |
| `accent-soft` | `#FBE9E1` | Hover/selected background |
| `danger` | `#B3261E` | Failed state |

Status run: running = oranye, success = ink (dot solid), failed = danger. Bukan hijau/merah traffic light.

## Tipografi
- Heading: serif atau grotesque berkarakter (rekomendasi: **Instrument Serif** untuk display, atau **Söhne-like → Inter Tight** kalau mau aman). Greeting "Selamat pagi" boleh besar (40–48px), berat normal, bukan bold hitam.
- Body/UI: **Inter** 14–15px.
- Mono (output panel, angka stat): **JetBrains Mono**.
- Hirarki dibangun dari ukuran + warna muted, BUKAN dari bold di mana-mana.

## Feel
- Border 1px `line`, radius kecil (6–8px), TANPA drop shadow besar. Shadow hanya untuk drawer/panel.
- Whitespace lega, grid rapi, align kiri.
- Angka stat pakai mono agar terasa "instrumen".
- Transisi cepat (150ms), tidak ada animasi dekoratif.
