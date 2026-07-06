# STACK

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js 15 (App Router) | TypeScript strict |
| Styling | Tailwind CSS v4 + shadcn/ui | Token warna di DESIGN.md, override theme shadcn |
| DB | SQLite via Prisma | File `dev.db` di root, cukup untuk session log |
| Agent runtime | Claude Code CLI headless | `claude -p "<prompt>" --output-format stream-json` via `child_process.spawn` |
| Streaming ke UI | Server-Sent Events (SSE) dari route handler | Jangan pakai websocket, overkill |
| State client | React state + SWR (fetch log) | Tanpa Redux/Zustand kecuali terpaksa |
| Font | Lihat DESIGN.md | Load via `next/font` |

## Aturan versi
- Pin versi major di package.json.
- Jangan tambah library tanpa alasan tertulis di RULES.md changelog.

## Struktur eksekusi skill
- `skills.config.ts` (root) = single source of truth daftar skill: `{ id, label, group, description, prompt | command, cwd?, dangerous? }`
- API route `/api/run/[skillId]` spawn Claude Code headless, stream output (SSE), tulis record ke tabel `Run` (start, end, status, output).
- Menambah skill = menambah 1 entry di `skills.config.ts`. Tidak boleh perlu perubahan komponen.
