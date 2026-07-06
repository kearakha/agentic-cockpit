export type Skill = {
  id: string;
  label: string;
  group: string;
  description: string;
  /** Prompt untuk `claude -p`. Placeholder `{{input}}` diganti nilai dialog input. */
  prompt: string;
  /** Kalau ada, munculkan dialog 1 field sebelum run. `as: "cwd"` = nilai input jadi working directory. */
  input?: { label: string; placeholder?: string; as: "prompt" | "cwd" };
  /** Working directory tetap. Mendukung prefix `~`. */
  cwd?: string;
  /** Skill yang bisa nulis/hapus file — minta confirm dulu. */
  dangerous?: boolean;
};

export const skills: Skill[] = [
  // Rutinitas
  {
    id: "jadwal-hari-ini",
    label: "Jadwal hari ini",
    group: "Rutinitas",
    description: "Ringkas agenda & prioritas hari ini.",
    prompt: "/morning",
  },
  {
    id: "todo-list",
    label: "Todo list",
    group: "Rutinitas",
    description: "Tampilkan todo yang masih pending.",
    prompt: "/todo",
  },
  {
    id: "nexus-note",
    label: "Nexus note",
    group: "Rutinitas",
    description: "Baca/tulis note ke vault Nexus (Obsidian).",
    prompt:
      "Kamu bekerja di vault Obsidian Nexus. Kerjakan instruksi berikut, jaga format markdown + frontmatter yang sudah ada: {{input}}",
    input: {
      label: "Instruksi",
      placeholder:
        "misal: baca note Agentic-Cockpit, atau catat X ke daily note",
      as: "prompt",
    },
    cwd: "~/Documents/Nexus",
    dangerous: true,
  },

  // Riset (ABSA / skripsi)
  {
    id: "absa-progress",
    label: "ABSA progress",
    group: "Riset",
    description:
      "Ringkas status project ABSA: fase, hasil terakhir, next step.",
    prompt:
      "Ringkas status project riset ABSA (skripsi): fase aktif, hasil eksperimen terakhir, dan next step. Kalau kamu butuh path folder project-nya, tanyakan dulu.",
  },
  {
    id: "absa-report",
    label: "ABSA report",
    group: "Riset",
    description: "Generate progress report singkat format markdown.",
    prompt:
      "Buat progress report singkat project riset ABSA dalam format markdown: apa yang dikerjakan, hasil, blocker, rencana berikutnya. Kalau kamu butuh path folder project-nya, tanyakan dulu.",
  },

  // Coding (Bengkel Koding)
  {
    id: "commit-msg",
    label: "Commit message",
    group: "Coding",
    description: "Generate conventional commit message dari git diff.",
    prompt: "/caveman-commit",
    input: { label: "Path repo", placeholder: "/Users/rakha/...", as: "cwd" },
  },
  {
    id: "code-review",
    label: "Code review",
    group: "Coding",
    description: "Review perubahan terakhir di repo.",
    prompt:
      "Review perubahan terakhir di repo ini (working tree + commit terakhir). Fokus: bug, security, konvensi. Satu baris per temuan: lokasi, masalah, fix.",
    input: { label: "Path repo", placeholder: "/Users/rakha/...", as: "cwd" },
  },
  {
    id: "project-setup",
    label: "Project setup",
    group: "Coding",
    description: "Scaffold Laravel/Next.js sesuai template Bengkel Koding.",
    prompt:
      "Scaffold project baru sesuai template Bengkel Koding. Detail dari user: {{input}}. Pakai skill laravel-scaffold kalau Laravel.",
    input: {
      label: "Detail",
      placeholder: "jenis (laravel/nextjs) + path target",
      as: "prompt",
    },
    dangerous: true,
  },

  // Trading
  {
    id: "breakout-scan",
    label: "Breakout scan",
    group: "Trading",
    description: "Ringkas watchlist & kondisi breakout mid-range dari notes.",
    prompt:
      "Analisis notes trading berikut. Ringkas watchlist dan kondisi breakout mid-range: mana yang setup-nya valid, mana yang batal, apa trigger-nya. Notes:\n\n{{input}}",
    input: { label: "Paste notes trading", as: "prompt" },
  },
  {
    id: "portfolio-summary",
    label: "Portfolio summary",
    group: "Trading",
    description: "Ringkasan posisi & catatan trading dari notes.",
    prompt:
      "Buat ringkasan posisi portfolio dan catatan trading dari notes berikut: posisi terbuka, P/L, risiko, catatan penting. Notes:\n\n{{input}}",
    input: { label: "Paste notes trading", as: "prompt" },
  },

  // Akademik
  {
    id: "materi-ajar",
    label: "Materi ajar",
    group: "Akademik",
    description: "Generate outline materi ajar dari topik.",
    prompt:
      "Buat outline materi ajar web development untuk topik: {{input}}. Struktur: tujuan belajar, prasyarat, urutan sub-topik, latihan praktik, estimasi durasi.",
    input: {
      label: "Topik",
      placeholder: "misal: Laravel Eloquent relationships",
      as: "prompt",
    },
  },
];

export const skillGroups = [
  "Rutinitas",
  "Riset",
  "Coding",
  "Trading",
  "Akademik",
];
