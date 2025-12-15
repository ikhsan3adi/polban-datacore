# Polban DataCore - Frontend (Admin Dashboard)

Dokumentasi ini ditujukan untuk pengembang yang akan mengembangkan antarmuka administrator untuk DataCore. Aplikasi ini dibangun menggunakan Vue 3 dan berfungsi sebagai dashboard untuk memantau status sistem, log ETL, dan manajemen konfigurasi DataCore.

## Fitur Utama

Aplikasi Admin DataCore memiliki beberapa fitur utama untuk memantau dan mengelola backend:

### 1. Dashboard Monitoring
Halaman utama yang menyajikan ringkasan kesehatan sistem secara *real-time*.
- **Statistik Data**: Menampilkan total Mahasiswa, Dosen, Rekam Nilai, dan Rekam IP yang tersimpan di DataCore.
- **Status Antrian (Queue)**: Memantau kondisi background job (Active, Waiting, Failed) untuk mendeteksi kemacetan proses.
- **Status Sinkronisasi**: Informasi mengenai kapan terakhir kali proses sinkronisasi dan agregasi berjalan, beserta status keberhasilannya.

### 2. Job Runner & Scheduler
Pusat kendali untuk proses ETL (Extract, Transform, Load).
- **Manajemen Jadwal (Cron)**: Melihat, mengedit, mengaktifkan, atau menonaktifkan jadwal otomatis untuk job tertentu.
- **Eksekusi Manual**: Menjalankan job ETL (seperti `full-sync` atau `aggregate-only`) secara manual tanpa menunggu jadwal.
- **Log Riwayat**: Melihat riwayat eksekusi job sebelumnya, termasuk durasi dan pesan error jika ada kegagalan.

### 3. Data Inspector
Alat bantu untuk melihat isi database hasil olahan (Materialized Views) secara langsung.
- **Table Browser**: Memilih dan melihat tabel agregasi yang tersedia di database.
- **Search & Pagination**: Mencari data spesifik dan menavigasi ribuan baris data dengan mudah.
- **Read-Only**: Fitur ini hanya bersifat *read-only* untuk memastikan integritas data tetap terjaga.

### 4. Pengaturan (Settings)
Halaman konfigurasi untuk preferensi pengguna dan aplikasi.
- **Profil Pengguna**: Informasi akun administrator yang sedang login.
- **Tema Aplikasi**: Beralih antara Mode Terang (Light) dan Mode Gelap (Dark).
- **Akses Dokumentasi**: Tautan cepat ke dokumentasi API (Swagger/OpenAPI).

---

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn-vue](https://www.shadcn-vue.com/) (Radix Vue based)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 📂 Struktur Direktori

Berikut adalah penjelasan singkat mengenai struktur folder di dalam `src/`:

- **`api/`**: Berisi fungsi-fungsi wrapper untuk memanggil API Backend (DataCore).
- **`assets/`**: Aset statis seperti gambar, font, dan file CSS global.
- **`components/`**: Komponen Vue yang dapat digunakan kembali (reusable).
  - `ui/`: Komponen dasar UI.
- **`composables/`**: Logic yang dapat digunakan kembali (Vue Composables / Hooks).
- **`layouts/`**: Template tata letak halaman (misal: `DashboardLayout`).
- **`lib/`**: Utilitas dan helper functions.
- **`router/`**: Konfigurasi routing halaman.
- **`stores/`**: State management global menggunakan Pinia.
- **`types/`**: Definisi tipe TypeScript global.
- **`views/`**: Halaman utama aplikasi (Page components).

## 🚀 Memulai Pengembangan

### Prasyarat

Pastikan Anda telah menginstal:

- [Bun](https://bun.sh/) (disarankan karena digunakan di monorepo ini) atau,
- [Node.js](https://nodejs.org/) (Versi LTS disarankan)

### Instalasi

1. Masuk ke direktori frontend:

   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   bun install
   # atau
   npm install
   ```

### Menjalankan Development Server

Untuk menjalankan aplikasi dalam mode pengembangan dengan Hot Module Replacement (HMR):

```bash
bun run dev
# atau
npm run dev
```

Aplikasi biasanya akan berjalan di `http://localhost:5173`.

### Build untuk Produksi

Untuk membuild aplikasi menjadi file statis yang siap dideploy:

```bash
bun run build
# atau
npm run build
```

Hasil build akan berada di folder `dist/`.

## ⚙️ Konfigurasi Environment

Buat file `.env` di root folder `frontend/` (sejajar dengan `package.json`). Anda bisa menyalin dari `.env.example`.

Contoh konfigurasi dasar:

```env
# Base URL API Backend DataCore
VITE_API_BASE_URL=http://localhost:3000

# Judul Aplikasi
VITE_APP_TITLE=Polban DataCore Admin
```

## 🤝 Kontribusi

Jika Anda ingin menambahkan fitur baru atau memperbaiki bug:

1. Pastikan kode Anda mengikuti standar linter yang ada. Jalankan `bun run format` atau `npm run format` untuk memformat kode.
2. Gunakan komponen UI yang sudah tersedia di `components/ui` sebisa mungkin untuk menjaga konsistensi desain.
3. Pisahkan logic bisnis yang kompleks ke dalam `composables` atau `stores`.
